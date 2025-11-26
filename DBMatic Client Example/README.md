<h2>DBMatic Client Example (Typscript)</h2>
<p id="bkmrk-the-dbmatic-typescri" data-start="163" data-end="568">The <strong data-start="167" data-end="196">DBMatic TypeScript Client</strong> is a lightweight wrapper around the <a class="decorated-link" href="https://api.dbmatic.eu/api/v1" target="_new" rel="noopener" data-start="233" data-end="277">DBMatic API</a><br data-start="278" data-end="281">It handles authentication, request timeouts, and parsing of API responses. On top of that, it includes <strong data-start="384" data-end="399">type guards</strong> and a <strong data-start="406" data-end="420">normalizer</strong> that converts raw measurements into a consistent structure for <em data-start="484" data-end="489">all</em> sensor/device types (GNSS, RPM, Temperature, Fuel Consumption, Weather, etc.).</p>
<h4 id="bkmrk-features" data-start="570" data-end="581">Features</h4>
<ul id="bkmrk-%F0%9F%94%91-authentication-via" data-start="582" data-end="882">
<li data-start="582" data-end="624">
<p data-start="584" data-end="624"><strong data-start="587" data-end="605">Authentication</strong> via Bearer token</p>
</li>
<li data-start="625" data-end="667">
<p data-start="627" data-end="667"><strong data-start="630" data-end="642">Timeouts</strong> &amp; basic error handling</p>
</li>
<li data-start="668" data-end="748">
<p data-start="670" data-end="748"><strong data-start="673" data-end="692">Typed responses</strong> using official PoseiDAT schemas (<code data-start="726" data-end="745">@poseidat/schemas</code>)</p>
</li>
<li data-start="749" data-end="814">
<p data-start="751" data-end="814"><strong data-start="754" data-end="780">Normalize measurements</strong> into unified, type-safe records</p>
</li>
<li data-start="815" data-end="882">
<p data-start="817" data-end="882"><strong data-start="819" data-end="855">Fetch all devices + measurements</strong> with concurrency control</p>
</li>
</ul>
<h5 id="bkmrk-the-files-in-this-ex" data-start="163" data-end="568">The files in this example: (See attachment)</h5>
<ul id="bkmrk-src%2Fdbmatic-client.t">
<li class="null" data-start="163" data-end="568"><code>src/dbmatic-client.ts</code></li>
<li class="null" data-start="163" data-end="568"><code>src/measurement-normalizers.ts</code></li>
<li class="null" data-start="163" data-end="568"><code>src/fetch-all.ts</code></li>
<li class="null" data-start="163" data-end="568"><code>src/example.ts</code></li>
</ul>
<hr id="bkmrk-">
<h5 id="bkmrk-installation">Installation</h5>
<pre id="bkmrk-npm-install-%40poseida"><code class="language-bash">npm install @poseidat/schemas
# and copy dbmatic-client.ts + measurement-normalizers.ts into your project</code></pre>
<hr id="bkmrk--1">
<h5 id="bkmrk-example-usage">Example Usage</h5>
<pre id="bkmrk-import-%7B-dbmaticclie"><code class="language-typescript">import { DBMaticClient, normalizeMeasurement } from './dbmatic-client';

async function main() {
  const client = new DBMaticClient({
    baseUrl: 'https://api.dbmatic.eu/api/v1',
    token: 'YOUR_API_TOKEN'
  });

  // 1) Fetch all vessels (journals)
  const journals = await client.listJournals();
  const vessel = journals[0];
  if (!vessel) throw new Error('No vessels available');
  const journalId = vessel.journal_id;

  // 2) Get equipment and devices
  const devices = await client.listDevices(journalId);

  // 3) Get measurements for first device (last 5 minutes)
  const stop = Math.floor(Date.now() / 1000);
  const start = stop - 5 * 60;
  const raw = await client.getDeviceMeasurements(journalId, devices[0].device_id, start, stop);

  // 4) Normalize measurements (works for ALL device types)
  const normalized = raw.map(normalizeMeasurement);

  console.log('Normalized sample:', normalized[0]);
}

main().catch(console.error);
</code></pre>
<hr id="bkmrk--2">
<h4 id="bkmrk-normalized-output-ex" data-start="2010" data-end="2038">Normalized Output Example</h4>
<p id="bkmrk-each-record-is-retur" data-start="2040" data-end="2156">Each record is returned as a <strong data-start="2069" data-end="2092">discriminated union</strong> with a <code data-start="2100" data-end="2106">kind</code> property so you can safely switch/filter by type:</p>
<pre id="bkmrk-%7B-%22kind%22%3A-%22position%22"><code class="language-json">{
  "kind": "POSITION",
  "entry": {
    "entry_id": "b01b0000-68c1-4082-a010-000000080000",
    "journal_id": "4fe9a3a7-85fd-5607-9074-ead38b07d24b",
    "device_id": "14647a67-3932-626f-4444-000200000009",
    "revision": "2025-09-10T13:50:08.000Z",
    "immutable": true
  },
  "payload": {
    "latitude": 53.51586380004883,
    "longitude": 5.112906684875488,
    "speed_over_ground": 7.6,
    "course_made_good": 294.1,
    "number_of_satellites": 8
  }
}</code></pre>
<p id="bkmrk-other-kind-values-ca" data-start="2040" data-end="2156">Other <code data-start="2639" data-end="2645">kind</code> values can be <code data-start="2660" data-end="2669">NUMERIC</code>, <code data-start="2671" data-end="2689">FUEL_CONSUMPTION</code>, <code data-start="2691" data-end="2700">WEATHER</code>, <code data-start="2702" data-end="2712">SPEEDLOG</code>, etc.</p>
<hr id="bkmrk--3">
<h3 id="bkmrk-advanced-usage%3A-fetc" data-start="90" data-end="145">Advanced Usage: Fetching <em data-start="117" data-end="122">All</em> Devices &amp; Measurements</h3>
<p id="bkmrk-this-section-shows-h" data-start="147" data-end="337">This section shows how to fetch <strong data-start="179" data-end="195">every device</strong> on a vessel and collect <strong data-start="220" data-end="240">all measurements</strong> in a time window, with <strong data-start="264" data-end="287">concurrency control</strong> and <strong data-start="292" data-end="313">normalized output</strong> for <em data-start="318" data-end="323">all</em> sensor types.</p>
<blockquote id="bkmrk-tip%3A-the-measurement" data-start="339" data-end="500">
<p data-start="341" data-end="500"><strong data-start="341" data-end="349">Tip:</strong> The measurements endpoint expects <code data-start="384" data-end="391">start</code> and <code data-start="396" data-end="402">stop</code> (Unix seconds).<br data-start="418" data-end="421">Example: <code data-start="432" data-end="500">/journals/{journal_id}/measurements/{device_id}?start=...&amp;stop=...</code></p>
</blockquote>
<h4 id="bkmrk-helper-included" data-start="502" data-end="520">Helper Included</h4>
<p id="bkmrk-if-you-copied-the-pr" data-start="522" data-end="573">If you copied the provided files, you already have:</p>
<ul id="bkmrk-dbmaticclient-%28auth%2C" data-start="575" data-end="820">
<li data-start="575" data-end="625">
<p data-start="577" data-end="625"><code data-start="577" data-end="592">DBMaticClient</code> (auth, timeouts, typed requests)</p>
</li>
<li data-start="626" data-end="703">
<p data-start="628" data-end="703"><code data-start="628" data-end="652">normalizeMeasurement()</code> (maps any sensor value into a discriminated union)</p>
</li>
<li data-start="704" data-end="820">
<p data-start="706" data-end="820"><code data-start="706" data-end="739">fetchAllMeasurementsForVessel()</code> (does devices &rarr; measurements for a time window, with a tiny concurrency limiter)</p>
</li>
</ul>
<hr id="bkmrk--4">
<h4 id="bkmrk-example%3A-get-everyth">Example: Get Everything in One Call</h4>
<pre id="bkmrk-import-%7B-dbmaticclie-1"><code class="language-typescript">import { DBMaticClient } from "./dbmatic-client";
import { fetchAllMeasurementsForVessel } from "./fetch-all";

async function run() {
  const client = new DBMaticClient({
    baseUrl: "https://api.dbmatic.eu/api/v1",
    token: "YOUR_API_TOKEN"
  });

  // 1) Pick a vessel (journal)
  const journals = await client.listJournals();
  if (!journals.length) throw new Error("No vessels available");
  const journalId = journals[0].journal_id;

  // 2) Define time window (last 15 minutes)
  const stop = Math.floor(Date.now() / 1000);
  const start = stop - 15 * 60;

  // 3) Pull all devices + all measurements (normalized), with concurrency=6
  const { devices, results } = await fetchAllMeasurementsForVessel(
    client,
    journalId,
    start,
    stop,
    6 // concurrency
  );

  // 4) Aggregate by normalized kind (POSITION, NUMERIC, WEATHER, ...)
  const all = results.flatMap(r =&gt; r.normalized);
  const byKind = all.reduce&lt;Record&lt;string, number&gt;&gt;((acc, m) =&gt; {
    acc[m.kind] = (acc[m.kind] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`Devices: ${devices.length}`);
  console.log("Counts by kind:", byKind);

  // 5) Example: Keep only RPM readings (which are NUMERIC with rawType 'RPM')
  const rpm = all.filter(
    m =&gt; m.kind === "NUMERIC" &amp;&amp; (m as any).payload?.rawType === "RPM"
  );
  console.log("RPM samples:", rpm.slice(0, 3));
}

run().catch(console.error);
</code></pre>
<hr id="bkmrk--5">
<h4 id="bkmrk-normalized-shapes-%28q" data-start="2274" data-end="2312">Normalized Shapes (Quick Reference)</h4>
<p id="bkmrk-the-normalizemeasure" data-start="2314" data-end="2380">The <code data-start="2318" data-end="2342">normalizeMeasurement()</code> helper returns a discriminated union:</p>
<ul id="bkmrk-position-%E2%86%92-payload%3A-" data-start="2382" data-end="3019">
<li data-start="2382" data-end="2435">
<p data-start="2384" data-end="2435"><code data-start="2384" data-end="2435">POSITION  &rarr; payload: { latitude, longitude, ... }</code></p>
</li>
<li data-start="2436" data-end="2545">
<p data-start="2438" data-end="2545"><code data-start="2438" data-end="2487">NUMERIC   &rarr; payload: { value, unit?, rawType? }</code> (covers RPM, TEMPERATURE, PRESSURE, VOLTAGE, SPEED, etc.)</p>
</li>
<li data-start="2546" data-end="2606">
<p data-start="2548" data-end="2606"><code data-start="2548" data-end="2606">FUEL_CONSUMPTION &rarr; payload: { current_consumption, ... }</code></p>
</li>
<li data-start="2607" data-end="2667">
<p data-start="2609" data-end="2667"><code data-start="2609" data-end="2667">WEATHER   &rarr; payload: { air_pressure?, wind_speed?, ... }</code></p>
</li>
<li data-start="2668" data-end="2726">
<p data-start="2670" data-end="2726"><code data-start="2670" data-end="2726">SPEEDLOG  &rarr; payload: { longitudinal_water_speed, ... }</code></p>
</li>
<li data-start="2727" data-end="2778">
<p data-start="2729" data-end="2778"><code data-start="2729" data-end="2778">TRAWL_TENSION &rarr; payload: { traction_port, ... }</code></p>
</li>
<li data-start="2779" data-end="2819">
<p data-start="2781" data-end="2819"><code data-start="2781" data-end="2819">SPATIAL_AXES  &rarr; payload: { x, y, z }</code></p>
</li>
<li data-start="2820" data-end="2867">
<p data-start="2822" data-end="2867"><code data-start="2822" data-end="2867">SUBSURFACE    &rarr; payload: { samples: [...] }</code></p>
</li>
<li data-start="2868" data-end="2922">
<p data-start="2870" data-end="2922"><code data-start="2870" data-end="2922">SCALE         &rarr; payload: { weight, category, ... }</code></p>
</li>
<li data-start="2923" data-end="2982">
<p data-start="2925" data-end="2982"><code data-start="2925" data-end="2959">ROUTE         &rarr; payload: unknown</code> (route data structure)</p>
</li>
<li data-start="2983" data-end="3019">
<p data-start="2985" data-end="3019"><code data-start="2985" data-end="3019">UNKNOWN       &rarr; payload: unknown</code></p>
</li>
</ul>
<p id="bkmrk-every-record-also-in" data-start="3021" data-end="3132">Every record also includes the original <code data-start="3061" data-end="3068">entry</code> (with <code data-start="3075" data-end="3085">entry_id</code>, <code data-start="3087" data-end="3099">journal_id</code>, <code data-start="3101" data-end="3112">device_id</code>, <code data-start="3114" data-end="3124">revision</code>, etc.).</p>
<hr id="bkmrk--6">
<h4 id="bkmrk-storing-the-data" data-start="3139" data-end="3158">Storing the Data</h4>
<p id="bkmrk-because-each-normali" data-start="3160" data-end="3254">Because each normalized record has a <code data-start="3197" data-end="3203">kind</code>, you can store everything in one table/collection:</p>
<pre id="bkmrk-type-row-%3D-%7B-journal"><code class="language-typescript">type Row = {
  journal_id: string;
  device_id: string;
  entry_id: string;
  revision: string;
  kind: string;          // e.g. "NUMERIC", "POSITION"
  body: unknown;         // payload from normalization
  ts: string;            // you can use entry.entry_datetime or revision
};</code></pre>
<h4 id="bkmrk-example-bulk-mapping" data-start="3160" data-end="3254">Example bulk mapping:</h4>
<pre id="bkmrk-const-rows-%3D-results"><code class="language-typescript">const rows = results.flatMap(({ device, normalized }) =&gt;
  normalized.map(n =&gt; ({
    journal_id: n.entry.journal_id,
    device_id: device.device_id,
    entry_id: n.entry.entry_id,
    revision: n.entry.revision,
    kind: n.kind,
    body: n.payload,
    ts: n.entry.entry_datetime ?? n.entry.revision
  }))
);</code></pre>
<hr id="bkmrk--7">
<h4 id="bkmrk-performance-tips" data-start="3902" data-end="3921">Performance Tips</h4>
<ul id="bkmrk-concurrency%3A-tune-th" data-start="3923" data-end="4504">
<li data-start="3923" data-end="4021">
<p data-start="3925" data-end="4021"><strong data-start="3925" data-end="3940">Concurrency</strong>: Tune the <code data-start="3951" data-end="3964">concurrency</code> parameter (e.g., 4&ndash;10) to balance speed and server load.</p>
</li>
<li data-start="4022" data-end="4132">
<p data-start="4024" data-end="4132"><strong data-start="4024" data-end="4035">Windows</strong>: Prefer <strong data-start="4044" data-end="4068">smaller time windows</strong> (e.g., 5&ndash;15 minutes) on frequent polls to reduce payload sizes.</p>
</li>
<li data-start="4133" data-end="4254">
<p data-start="4135" data-end="4254"><strong data-start="4135" data-end="4155">Device selection</strong>: If you only need certain metrics (e.g., RPM or Weather), pre-filter the device list by type/name.</p>
</li>
<li data-start="4255" data-end="4349">
<p data-start="4257" data-end="4349"><strong data-start="4257" data-end="4268">Retries</strong>: For flaky network segments at sea, wrap calls in a retry (exponential backoff).</p>
</li>
<li data-start="4350" data-end="4504">
<p data-start="4352" data-end="4504"><strong data-start="4352" data-end="4361">Units</strong>: <code data-start="4363" data-end="4372">NUMERIC</code> records include <code data-start="4389" data-end="4396">unit?</code> guessed from the schema&rsquo;s <code data-start="4423" data-end="4429">type</code>. Adjust in <code data-start="4441" data-end="4462">guessUnitFromType()</code> to your conventions (e.g., knots vs m/s).</p>
</li>
</ul>
<hr id="bkmrk--8">
<h4 id="bkmrk-validation-%28optional">Validation (Optional)</h4>
<p id="bkmrk-if-you-use-runtime-v">If you use runtime validation (AJV or the validator classes from <code data-start="4602" data-end="4621">@poseidat/schemas</code>), pass hooks into the client:</p>
<pre id="bkmrk-const-client-%3D-new-d"><code class="language-typescript">const client = new DBMaticClient({
  baseUrl: "https://api.dbmatic.eu/api/v1",
  token: "YOUR_API_TOKEN",
  validate: {
    journals: (data) =&gt; [],            // return [] if valid, otherwise array of error strings
    equipmentInventory: (data) =&gt; [],
    deviceMeasurements: (data) =&gt; []
  }
});</code></pre>
<p id="bkmrk-this-helps-catch-sch">This helps catch schema drift early in development and in CI.</p>
<hr id="bkmrk--9">
<h4 id="bkmrk-common-gotchas" data-start="5030" data-end="5047">Common Gotchas</h4>
<ul id="bkmrk-auth-header%3A-use-aut" data-start="5049" data-end="5346">
<li data-start="5049" data-end="5165">
<p data-start="5051" data-end="5165"><strong data-start="5051" data-end="5066">Auth header</strong>: Use <code data-start="5072" data-end="5103">Authorization: Bearer &lt;token&gt;</code> (the client auto-prefixes if you pass just the token string).</p>
</li>
<li data-start="5166" data-end="5221">
<p data-start="5168" data-end="5221"><strong data-start="5168" data-end="5184">Query params</strong>: Use <code data-start="5190" data-end="5197">start</code> and <code data-start="5202" data-end="5208">stop</code> (not <code data-start="5214" data-end="5219">end</code>).</p>
</li>
<li data-start="5222" data-end="5346">
<p data-start="5224" data-end="5346"><strong data-start="5224" data-end="5232">Time</strong>: Timestamps are Unix seconds for query params; payloads use RFC 3339/ISO strings for <code data-start="5318" data-end="5328">revision</code>/<code data-start="5329" data-end="5345">entry_datetime</code>.</p>
</li>
</ul>
