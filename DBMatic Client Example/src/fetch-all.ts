// File: src/fetch-all.ts
import type { IEquipmentDevice } from '@poseidat/schemas';
import { DBMaticClient } from './dbmatic-client';
import { normalizeMeasurement, type NormalizedMeasurement } from './measurement-normalizers';

// Tiny concurrency limiter
function pLimit(max: number) {
  const queue: (() => void)[] = [];
  let active = 0;
  const next = () => {
    active--;
    if (queue.length) queue.shift()!();
  };
  return function <T>(fn: () => Promise<T>) {
    return new Promise<T>((resolve, reject) => {
      const run = () => {
        active++;
        fn().then(
          (v) => { resolve(v); next(); },
          (e) => { reject(e); next(); }
        );
      };
      if (active < max) run(); else queue.push(run);
    });
  };
}

export type DeviceMeasurementBundle = {
  device: IEquipmentDevice;
  normalized: NormalizedMeasurement[];
};

export async function fetchAllMeasurementsForVessel(
  client: DBMaticClient,
  journalId: string,
  startUnix: number,
  stopUnix: number,
  concurrency = 4
) {
  const devices = await client.listDevices(journalId);
  const limit = pLimit(concurrency);

  const results = await Promise.all(
    devices.map(device =>
      limit(async () => {
        const entries = await client.getDeviceMeasurements(journalId, device.device_id, startUnix, stopUnix);
        const normalized = entries.map(normalizeMeasurement);
        return { device, normalized } as DeviceMeasurementBundle;
      })
    )
  );

  return { journalId, devices, results };
}
