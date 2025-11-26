<h2>Using PoseiDAT Schemas in TypeScript</h2>
<h4 id="bkmrk-1.-install-typings-%26">1. Install typings &amp; (optional) runtime validators</h4>
<pre id="bkmrk-npm-i-%40poseidat%2Fsche"><code class="language-bash">npm i @poseidat/schemas</code></pre>
<p id="bkmrk-the-repo-provides-ty">The repo provides TypeScript interfaces and JSON Schemas; it&rsquo;s published as an npm package and includes helper classes with a <code data-start="799" data-end="812">.validate()</code> method (example in their README). <span class="" data-state="closed"><span class="ms-1 inline-flex max-w-full items-center relative top-[-0.094rem] animate-[show_150ms_ease-in]" data-testid="webpage-citation-pill"><a class="flex h-4.5 overflow-hidden rounded-xl px-2 text-[9px] font-medium transition-colors duration-150 ease-in-out text-token-text-secondary! bg-[#F4F4F4]! dark:bg-[#303030]!" href="https://github.com/PoseiDAT/schemas" target="_blank" rel="noopener"><span class="relative start-0 bottom-0 flex h-full w-full items-center"><span class="flex h-4 w-full items-center justify-between overflow-hidden"><span class="max-w-[15ch] grow truncate overflow-hidden text-center">GitHub</span></span></span></a></span></span></p>
<hr id="bkmrk-">
<h4 id="bkmrk-2.-import-the-types-">2. Import the types (and optional validators)</h4>
<pre id="bkmrk-%2F%2F-types-%28interfaces"><code class="language-typescript">// Types (interfaces)
import type {
  ICoreJournal,
  IEntryEquipmentInventory,
  IEntryDeviceMeasurement,
  IMeasurementMeasurementValue,
  IMeasurementPosition
} from '@poseidat/schemas';

// Optional runtime validators (see README usage)
import {
  Journal,                 // validator class for ICoreJournal
  EquipmentInventoryEntry, // validator class for IEntryEquipmentInventory
  DeviceMeasurementEntry   // validator class for IEntryDeviceMeasurement
} from '@poseidat/schemas';</code></pre>
<p id="bkmrk-the-package%E2%80%99s-readme">The package&rsquo;s README shows usage like:</p>
<pre id="bkmrk-import-%7B-arrivalentr"><code class="language-typescript">import { ArrivalEntry, IEntryArrival } from '@poseidat/schemas';
const entry = new ArrivalEntry(data as IEntryArrival);
const errors = entry.validate();</code></pre>
<p id="bkmrk-you-can-apply-the-sa">You can apply the same pattern to <code data-start="1695" data-end="1704">Journal</code>, <code data-start="1706" data-end="1731">EquipmentInventoryEntry</code>, and <code data-start="1737" data-end="1761">DeviceMeasurementEntry</code>. <span class="" data-state="closed"><span class="ms-1 inline-flex max-w-full items-center relative top-[-0.094rem] animate-[show_150ms_ease-in]" data-testid="webpage-citation-pill"><a class="flex h-4.5 overflow-hidden rounded-xl px-2 text-[9px] font-medium transition-colors duration-150 ease-in-out text-token-text-secondary! bg-[#F4F4F4]! dark:bg-[#303030]!" href="https://github.com/PoseiDAT/schemas" target="_blank" rel="noopener"><span class="relative start-0 bottom-0 flex h-full w-full items-center"><span class="flex h-4 w-full items-center justify-between overflow-hidden"><span class="max-w-[15ch] grow truncate overflow-hidden text-center">GitHub</span></span></span></a></span></span></p>
<hr id="bkmrk--1">
<h4 id="bkmrk-3.-minimal-typed-api">3. Minimal typed API client</h4>
<pre id="bkmrk-type-config-%3D-%7B-dbma"><code class="language-typescript">type Config = {
  dbMaticAPIUrl: string; // e.g. "https://api.dbmatic.eu/api/v1"
  dbMaticBearer: string; // e.g. "Bearer &lt;your token&gt;"
};

const makeHeaders = (cfg: Config) =&gt; ({
  Accept: 'application/json',
  Authorization: cfg.dbMaticBearer,
  'Content-Type': 'application/json'
});

async function getJournals(cfg: Config): Promise&lt;ICoreJournal[]&gt; {
  const res = await fetch(`${cfg.dbMaticAPIUrl}/journals`, {
    method: 'GET',
    headers: makeHeaders(cfg)
  });
  if (!res.ok) throw new Error(`journals failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as ICoreJournal[];
  // Optional runtime validation
  for (const j of data) {
    const v = new Journal(j);
    const errors = v.validate();
    if (errors.length) throw new Error(`Journal validation error: ${JSON.stringify(errors)}`);
  }
  return data;
}

async function getEquipmentInventory(
  cfg: Config,
  journalId: string
): Promise&lt;IEntryEquipmentInventory&gt; {
  const res = await fetch(`${cfg.dbMaticAPIUrl}/journals/${journalId}/equipment_inventory`, {
    method: 'GET',
    headers: makeHeaders(cfg)
  });
  if (!res.ok) throw new Error(`equipment_inventory failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as IEntryEquipmentInventory;

  // Optional runtime validation
  const v = new EquipmentInventoryEntry(data);
  const errors = v.validate();
  if (errors.length) throw new Error(`EquipmentInventory validation error: ${JSON.stringify(errors)}`);

  return data;
}

async function getDeviceMeasurements(
  cfg: Config,
  journalId: string,
  deviceId: string,
  startUnix: number,
  stopUnix: number
): Promise&lt;IEntryDeviceMeasurement[]&gt; {
  const url = `${cfg.dbMaticAPIUrl}/journals/${journalId}/measurements/${deviceId}?start=${startUnix}&amp;stop=${stopUnix}`;
  const res = await fetch(url, { method: 'GET', headers: makeHeaders(cfg) });
  if (!res.ok) throw new Error(`measurements failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as IEntryDeviceMeasurement[];

  // Optional runtime validation
  for (const m of data) {
    const v = new DeviceMeasurementEntry(m);
    const errors = v.validate();
    if (errors.length) throw new Error(`DeviceMeasurement validation error: ${JSON.stringify(errors)}`);
  }

  return data;
}</code></pre>
<hr id="bkmrk--2">
<h4 id="bkmrk-4.-helpful-type-guar">4. Helpful type guards (narrowing&nbsp;<code data-start="4189" data-end="4196">value</code>)</h4>
<pre id="bkmrk-function-ispositionv"><code class="language-typescript">function isPositionValue(v: IMeasurementMeasurementValue): v is IMeasurementMeasurementValue &amp; { type: 'POSITION'; position: IMeasurementPosition } {
  return v?.type === 'POSITION' &amp;&amp; !!v.position;
}</code></pre>
<hr id="bkmrk--3">
<h4 id="bkmrk-5.-end-to-end-exampl">5. End-to-end example</h4>
<pre id="bkmrk-async-function-main%28"><code class="language-typescript">async function main(config: Config) {
  // 1) Fetch all journals (vessels)
  const journals = await getJournals(config);

  // Pick the one you want (example: the first one, or by name)
  const vessel = journals[0];
  // Or find by hull number, name, etc.
  // const vessel = journals.find(j =&gt; j.vessel.name === 'UK1');

  if (!vessel) throw new Error('No journals available');

  // Store the journal id somewhere if you need it later
  const journalId = vessel.journal_id;

  // 2) Fetch equipment inventory for the journal
  const inventory = await getEquipmentInventory(config, journalId);

  // Flatten all devices and pick sensors (or types you care about)
  const allDevices =
    inventory.equipment?.flatMap(eq =&gt; eq.devices ?? []) ?? [];

  const sensors = allDevices.filter(d =&gt; d.type === 'SENSOR' || d.type === 'GNSS');

  // 3) Fetch measurements for a sensor in a time window
  const end = Math.floor(Date.now() / 1000);      // now
  const start = end - 60 * 10;                    // last 10 minutes

  for (const sensor of sensors) {
    const measurements = await getDeviceMeasurements(
      config,
      journalId,
      sensor.device_id,
      start,
      end // NOTE: server expects "stop" in the query &mdash; handled in getDeviceMeasurements
    );

    // Example: extract POSITION points
    const positions = measurements
      .map(m =&gt; m.value)
      .filter(isPositionValue)
      .map(v =&gt; ({
        lat: v.position.latitude,
        lon: v.position.longitude,
        sog: v.position.speed_over_ground,
        cmg: v.position.course_made_good
      }));

    console.log(`Sensor ${sensor.name} positions:`, positions);
  }
}</code></pre>
<hr id="bkmrk--4">
<h4 id="bkmrk-6.-using-the-example">6. Using the example with your config helper</h4>
<p id="bkmrk-this-mirrors-your-sn">This mirrors your snippet but plugs in types + validation and fixes <code data-start="6232" data-end="6238">stop</code>:</p>
<pre id="bkmrk-const-configobj%3A-con"><code class="language-typescript">const configObj: Config = {
  dbMaticAPIUrl: process.env.DBMATIC_API_URL ?? 'https://api.dbmatic.eu/api/v1',
  dbMaticBearer: `Bearer ${process.env.DBMATIC_TOKEN}`
};

main(configObj).catch(err =&gt; {
  console.error(err);
  process.exit(1);
});</code></pre>
<hr id="bkmrk--5">
<h4 id="bkmrk-7.-why-validate-at-r" data-start="6501" data-end="6531">7. Why validate at runtime?</h4>
<ul id="bkmrk-typescript-catches-c" data-start="6533" data-end="6879">
<li data-start="6533" data-end="6618">
<p data-start="6535" data-end="6618">TypeScript catches <strong data-start="6554" data-end="6570">compile-time</strong> issues, but real API responses can still drift.</p>
</li>
<li data-start="6619" data-end="6879">
<p data-start="6621" data-end="6879"><code data-start="6621" data-end="6640">@poseidat/schemas</code> ships JSON Schemas + validator classes so you can <code data-start="6691" data-end="6704">.validate()</code> responses against the canonical source (and the package is the official place to pull these) &mdash; see the README&rsquo;s usage and install notes. <span class="" data-state="delayed-open" aria-describedby="radix-&laquo;r1ug&raquo;"><span class="ms-1 inline-flex max-w-full items-center relative top-[-0.094rem] animate-[show_150ms_ease-in]" data-testid="webpage-citation-pill" aria-describedby="radix-&laquo;r1ug&raquo;"><a class="flex h-4.5 overflow-hidden rounded-xl px-2 text-[9px] font-medium transition-colors duration-150 ease-in-out bg-token-text-primary! text-token-main-surface-primary!" href="https://github.com/PoseiDAT/schemas" target="_blank" rel="noopener"><span class="relative start-0 bottom-0 flex h-full w-full items-center"><span class="flex h-4 w-full items-center justify-between overflow-hidden"><span class="max-w-[15ch] grow truncate overflow-hidden text-center">GitHub</span></span></span></a></span></span></p>
</li>
</ul>
<hr id="bkmrk--6">
<h4 id="bkmrk-8.-bonus%3A-direct-sch" data-start="6886" data-end="6936">8. Bonus: direct schema access (if you need it)</h4>
<p id="bkmrk-the-package-also-pub" data-start="6938" data-end="7193">The package also publishes the JSON Schemas (e.g., <code data-start="6989" data-end="7011">entry/departure.json</code>, <code data-start="7013" data-end="7033">core/measurement/*</code>) &mdash; useful if you prefer validating with AJV yourself. You can inspect them on a CDN like unpkg to see structure and refs. <span class="" data-state="closed"><span class="ms-1 inline-flex max-w-full items-center relative top-[-0.094rem] animate-[show_150ms_ease-in]" data-testid="webpage-citation-pill"><a class="flex h-4.5 overflow-hidden rounded-xl px-2 text-[9px] font-medium transition-colors duration-150 ease-in-out text-token-text-secondary! bg-[#F4F4F4]! dark:bg-[#303030]!" href="https://app.unpkg.com/%40poseidat/schemas%400.0.14/files/lib/schema/entry/departure.json?utm_source=chatgpt.com" target="_blank" rel="noopener"><span class="relative start-0 bottom-0 flex h-full w-full items-center"><span class="flex h-4 w-full items-center justify-between"><span class="max-w-[15ch] grow truncate overflow-hidden text-center">app.unpkg.com</span><span class="-me-1 flex h-full items-center rounded-full px-1 text-[#8F8F8F]">+1</span></span></span></a></span></span></p>
<p id="bkmrk-%C2%A0"></p>
