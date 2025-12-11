// File: src/dbmatic-client.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

// PoseiDAT types (install: npm i @poseidat/schemas)
import type {
  ICoreJournal,
  IEntryEquipmentInventory,
  IEntryDeviceMeasurement,
  IEquipmentDevice
} from '@poseidat/schemas';

// Bring in the full sensor-type support (type guards + normalizer)
import {
  normalizeMeasurement,
  type NormalizedMeasurement,
} from './measurement-normalizers';

export type DBMaticClientOptions = {
  /** Base URL, e.g. "https://{base-url}/api/v1" */
  baseUrl: string;
  /** API token. "Bearer " will be auto-prefixed if missing */
  token: string;
  /** Optional custom fetch implementation (defaults to global fetch) */
  fetchImpl?: typeof fetch;
  /** Request timeout in ms (per call). Default: 30_000 */
  timeoutMs?: number;
  /** Optional validation hooks (return array of error strings if any) */
  validate?: {
    journals?: (data: unknown) => string[];
    equipmentInventory?: (data: unknown) => string[];
    deviceMeasurements?: (data: unknown) => string[];
  };
};

export class DBMaticClient {
  private baseUrl: string;
  private bearer: string;
  private fetchFn: typeof fetch;
  private timeoutMs: number;
  private validate?: DBMaticClientOptions['validate'];

  constructor(opts: DBMaticClientOptions) {
    if (!opts?.baseUrl) throw new Error('DBMaticClient: baseUrl is required');
    if (!opts?.token) throw new Error('DBMaticClient: token is required');

    this.baseUrl = opts.baseUrl.replace(/\/+$/, ''); // strip trailing slash
    this.bearer = opts.token.startsWith('Bearer ') ? opts.token : `Bearer ${opts.token}`;
    this.fetchFn = opts.fetchImpl ?? fetch.bind(globalThis);
    this.timeoutMs = opts.timeoutMs ?? 30_000;
    this.validate = opts.validate;
  }

  /** GET /journals */
  async listJournals(): Promise<ICoreJournal[]> {
    const data = await this.request<ICoreJournal[]>('/journals');
    if (this.validate?.journals) this.#assertValid(this.validate.journals(data), 'journals');
    return data;
  }

  /** GET /journals/{journal_id}/equipment_inventory */
  async getEquipmentInventory(journalId: string): Promise<IEntryEquipmentInventory> {
    this.#requireId('journalId', journalId);
    const data = await this.request<IEntryEquipmentInventory>(`/journals/${journalId}/equipment_inventory`);
    if (this.validate?.equipmentInventory) this.#assertValid(this.validate.equipmentInventory(data), 'equipment inventory');
    return data;
  }

  /** Convenience: flatten all devices from the inventory. */
  async listDevices(journalId: string): Promise<IEquipmentDevice[]> {
    const inv = await this.getEquipmentInventory(journalId);
    return (inv.equipment ?? []).flatMap(e => e.devices ?? []);
  }

  /**
   * GET /journals/{journal_id}/measurements/{device_id}?start={unix}&stop={unix}
   * @param startUnix seconds since epoch
   * @param stopUnix seconds since epoch
   */
  async getDeviceMeasurements(
    journalId: string,
    deviceId: string,
    startUnix: number,
    stopUnix: number
  ): Promise<IEntryDeviceMeasurement[]> {
    this.#requireId('journalId', journalId);
    this.#requireId('deviceId', deviceId);
    if (!Number.isFinite(startUnix) || !Number.isFinite(stopUnix)) {
      throw new Error('getDeviceMeasurements: startUnix and stopUnix must be finite numbers (seconds since epoch)');
    }
    const qs = new URLSearchParams({ start: String(startUnix), stop: String(stopUnix) });
    const data = await this.request<IEntryDeviceMeasurement[]>(
      `/journals/${journalId}/measurements/${deviceId}?${qs}`
    );
    if (this.validate?.deviceMeasurements) {
      this.#assertValid(this.validate.deviceMeasurements(data), 'device measurements');
    }
    return data;
  }

  /** Same as getDeviceMeasurements, but returned as normalized, type-agnostic records. */
  async getDeviceMeasurementsNormalized(
    journalId: string,
    deviceId: string,
    startUnix: number,
    stopUnix: number
  ): Promise<NormalizedMeasurement[]> {
    const entries = await this.getDeviceMeasurements(journalId, deviceId, startUnix, stopUnix);
    return entries.map(normalizeMeasurement);
  }

  // ------------ Internals ------------

  #requireId(name: string, val: string) {
    if (!val || typeof val !== 'string') throw new Error(`Missing or invalid ${name}`);
  }

  #assertValid(errors: string[], label: string) {
    if (errors.length) throw new Error(`Validation failed for ${label}: ${JSON.stringify(errors)}`);
  }

  async request<T>(path: string, init?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const to = setTimeout(() => controller.abort('timeout'), this.timeoutMs);

    try {
      const res = await this.fetchFn(`${this.baseUrl}${path}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: this.bearer
        },
        signal: controller.signal,
        ...init
      });

      if (!res.ok) {
        let bodyText = '';
        try { bodyText = await res.text(); } catch { /* ignore */ }
        throw new Error(`HTTP ${res.status} ${res.statusText}${bodyText ? ` — ${bodyText}` : ''}`);
      }

      return (await res.json()) as T;
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        throw new Error(`Request timed out after ${this.timeoutMs} ms: ${path}`);
      }
      throw err;
    } finally {
      clearTimeout(to);
    }
  }
}

// Re-export normalized types for easy import from the client module
export type { NormalizedMeasurement } from './measurement-normalizers';
export { normalizeMeasurement } from './measurement-normalizers';
