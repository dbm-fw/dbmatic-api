<h2>DBMatic API Documentation</h2>
<p id="bkmrk-the-dbmatic-api-prov">The DBMatic API provides access to vessel journals, equipment inventories, and measurement data.<br>This quick start guide explains how to authenticate and query the API.</p>
<p id="bkmrk-for-schema-definitio">For schema definitions and data types, please refer to:</p>
<ul id="bkmrk-poseidat-documentati">
<li class="null"><a href="https://www.poseidat.org/" target="_blank" rel="noopener">PoseiDAT Documentation</a><br></li>
<li class="null"><a href="https://github.com/PoseiDAT/schemas" target="_blank" rel="noopener">PoseiDAT GitHub Schemas</a></li>
</ul>
<hr id="bkmrk-">
<h4 id="bkmrk-base-url">Base URL</h4>
<pre id="bkmrk-base-url"><code class="language-">https://{base-url}/api/v1</code></pre>
<hr id="bkmrk--1">
<h4 id="bkmrk-authentication">Authentication</h4>
<p id="bkmrk-all-requests-require">All requests require a Bearer Token (API key), which will be provided by DBMatic.</p>
<p id="bkmrk-example-header%3A">Example header:</p>
<pre id="bkmrk-authorization%3A-beare"><code class="language-">Authorization: Bearer YOUR_API_TOKEN</code></pre>
<hr id="bkmrk--2">
<h3 id="bkmrk-endpoints">Endpoints</h3>
<h4 id="bkmrk-1.-list-available-jo">1. List Available Journals (Vessels)</h4>
<p id="bkmrk-retrieve-all-journal">Retrieve all journals (ships) available for your account.</p>
<p id="bkmrk-request"><strong>Request</strong></p>
<pre id="bkmrk-get-%2Fjournals"><code class="language-">GET /journals</code></pre>
<p id="bkmrk-example"><strong>Example</strong></p>
<pre id="bkmrk-base-url"><code class="language-">https://{base-url}/api/v1/journals</code></pre>
<p id="bkmrk-response"><strong>Response</strong></p>
<pre id="bkmrk-%5B-%7B-%22journal_id%22%3A-%224"><code class="language-json">[
  {
    "journal_id": "4fe9a3a7-85fd-5607-9074-ead38b07d24b",
    "vessel": {
      "name": "UK1",
      "flag_state": "Netherlands",
      "cfr": "",
      "hull_number": ""
    }
  }
]</code></pre>
<hr id="bkmrk--3">
<h4 id="bkmrk-2.-get-equipment-inv" data-start="1150" data-end="1194">2. Get Equipment Inventory for a Journal</h4>
<p id="bkmrk-use-the-journal_id-f" data-start="1196" data-end="1287">Use the <code data-start="1204" data-end="1216">journal_id</code> from the journals endpoint to get the available equipment of a vessel.</p>
<p id="bkmrk-request-1"><strong>Request</strong></p>
<pre id="bkmrk-get-%2Fjournals%2F%7Bjourn"><code class="language-">GET /journals/{journal_id}/equipment_inventory</code></pre>
<p id="bkmrk-example-1"><strong>Example</strong></p>
<pre id="bkmrk-base-url"><code class="language-">https://{base-url}/api/v1/journals/4fe9a3a7-85fd-5607-9074-ead38b07d24b/equipment_inventory</code></pre>
<p id="bkmrk-response-1"><strong>Response</strong></p>
<pre id="bkmrk-%7B-%22journal_id%22%3A-%224fe"><code class="language-json">{
  "journal_id": "4fe9a3a7-85fd-5607-9074-ead38b07d24b",
  "entry_id": "17f33009-ed7b-4d11-8fc9-4d42daee33ac",
  "revision": "2025-09-10T13:50:00.633Z",
  "immutable": false,
  "equipment": [
    {
      "equipment_id": "14647a67-3932-626f-4444-111200000062",
      "name": "NMEA DEVICES",
      "type": "SENSOR",
      "devices": [
        {
          "device_id": "14647a67-3932-626f-4444-000200000009",
          "name": "GPS Device",
          "type": "SENSOR",
          "brand": "",
          "product_no": "",
          "serial_no": "",
          "complete_up_to": "2025-09-10T14:04:58.000Z"
        }
      ]
    }
  ]
}
</code></pre>
<hr id="bkmrk--4">
<h4 id="bkmrk-3.-get-measurements-" data-start="2149" data-end="2186">3. Get Measurements for Equipment</h4>
<p id="bkmrk-use-the-equipment_id" data-start="2188" data-end="2344">Use the <code data-start="2196" data-end="2210">equipment_id</code> from the inventory to request measurement data.<br data-start="2258" data-end="2261">A timeframe must be specified with <code data-start="2296" data-end="2303">start</code> and <code data-start="2308" data-end="2314">stop</code> parameters (Unix timestamps).</p>
<p id="bkmrk-request-2"><strong>Request</strong></p>
<pre id="bkmrk-get-%2Fjournals%2F%7Bjourn-1"><code class="language-">GET /journals/{journal_id}/measurements/{equipment_id}?start={timestamp}&amp;stop={timestamp}</code></pre>
<p id="bkmrk-example-2"><strong>Example</strong></p>
<pre id="bkmrk-base-url"><code class="language-">https://{base-url}/api/v1/journals/4fe9a3a7-85fd-5607-9074-ead38b07d24b/measurements/14647a67-3932-626f-4444-000200000009?start=1757512200&amp;stop=1757512800</code></pre>
<p id="bkmrk-response-2"><strong>Response</strong></p>
<pre id="bkmrk-%5B-%7B-%22entry_type%22%3A-%22d"><code class="language-json">[
  {
    "entry_type": "device-measurement",
    "journal_id": "4fe9a3a7-85fd-5607-9074-ead38b07d24b",
    "device_id": "14647a67-3932-626f-4444-000200000009",
    "immutable": true,
    "entry_id": "b01b0000-68c1-4082-a010-000000080000",
    "revision": "2025-09-10T13:50:08.000Z",
    "value": {
      "type": "POSITION",
      "position": {
        "latitude": 53.51586380004883,
        "longitude": 5.112906684875488,
        "course_made_good": 294.1000061035156,
        "speed_over_ground": 7.599999904632568,
        "number_of_satellites": 8
      }
    }
  }
]</code></pre>
<hr id="bkmrk--5">
<h4 id="bkmrk-notes" data-start="3255" data-end="3263">Notes</h4>
<ul id="bkmrk-all-timestamps-are-i" data-start="3264" data-end="3501">
<li data-start="3264" data-end="3338">
<p data-start="3266" data-end="3338">All timestamps are in ISO 8601 or Unix format, depending on the field.</p>
</li>
<li data-start="3339" data-end="3437">
<p data-start="3341" data-end="3437">Data structures follow the <a class="decorated-link" href="https://github.com/PoseiDAT/schemas" target="_new" rel="noopener" data-start="3368" data-end="3434">PoseiDAT schema definitions</a><br></p>
</li>
<li data-start="3438" data-end="3501">
<p data-start="3440" data-end="3501">Only data for which your token has access will be returned.</p>
</li>
</ul>
<p id="bkmrk-%C2%A0"></p>
<p id="bkmrk-%C2%A0-1"></p>
<p id="bkmrk--6"></p>
