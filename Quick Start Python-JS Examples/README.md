<h2>Quick Start Python-JS Examples</h2>
<p id="bkmrk-the-dbmatic-api-prov">The DBMatic API provides access to vessel journals, equipment inventories, and measurement data.<br>This quick start guide explains how to authenticate and query the API.</p>
<p id="bkmrk-for-schema-definitio">For schema definitions and data types, please refer to:</p>
<ul id="bkmrk-poseidat-documentati">
<li class="null"><a href="https://www.poseidat.org/" target="_blank" rel="noopener">PoseiDAT Documentation</a><br></li>
<li class="null"><a href="https://github.com/PoseiDAT/schemas" target="_blank" rel="noopener">PoseiDAT GitHub Schemas</a></li>
</ul>
<hr id="bkmrk-">
<h4 id="bkmrk-base-url">Base URL</h4>
<pre id="bkmrk-https%3A%2F%2Fapi.dbmatic."><code class="language-">https://api.dbmatic.eu/api/v1</code></pre>
<hr id="bkmrk--1">
<h4 id="bkmrk-authentication">Authentication</h4>
<p id="bkmrk-all-requests-require">All requests require a Bearer Token (API key), which will be provided by DBMatic.</p>
<p id="bkmrk-example-header%3A">Example header:</p>
<pre id="bkmrk-authorization%3A-beare"><code class="language-">Authorization: Bearer YOUR_API_TOKEN</code></pre>
<hr id="bkmrk--2">
<h4 id="bkmrk-endpoints">Quick Start Examples</h4>
<p id="bkmrk-replace-your_api_tok">Replace <code data-start="879" data-end="895">YOUR_API_TOKEN</code> with the token provided by DBMatic.<br data-start="931" data-end="934">Examples are provided in <strong data-start="959" data-end="967">cURL</strong>, <strong data-start="969" data-end="990">Python (requests)</strong>, and <strong data-start="996" data-end="1018">JavaScript (fetch)</strong>.</p>
<h4 id="bkmrk-1.-list-available-jo" data-start="1026" data-end="1056">1. List Available Journals</h4>
<p id="bkmrk-curl" data-start="1058" data-end="1066"><strong data-start="1058" data-end="1066">cURL</strong></p>
<pre id="bkmrk-curl--x-get-%22https%3A%2F"><code class="language-bash">curl -X GET "https://api.dbmatic.eu/api/v1/journals" \
  -H "Authorization: Bearer YOUR_API_TOKEN"</code></pre>
<p id="bkmrk-python"><strong>Python</strong></p>
<pre id="bkmrk-import-requests-url-"><code class="language-python">import requests

url = "https://api.dbmatic.eu/api/v1/journals"
headers = {"Authorization": "Bearer YOUR_API_TOKEN"}

response = requests.get(url, headers=headers)
print(response.json())</code></pre>
<p id="bkmrk-%C2%A0"></p>
<p id="bkmrk-javascript"><strong>JavaScript</strong></p>
<pre id="bkmrk-const-url-%3D-%22https%3A%2F"><code class="language-javascript">const url = "https://api.dbmatic.eu/api/v1/journals";

fetch(url, {
  headers: {
    "Authorization": "Bearer YOUR_API_TOKEN"
  }
})
  .then(res =&gt; res.json())
  .then(data =&gt; console.log(data))
  .catch(err =&gt; console.error(err));</code></pre>
<hr id="bkmrk--3">
<h4 id="bkmrk-2.-get-equipment-inv">2. Get Equipment Inventory for a Journal</h4>
<p id="bkmrk-curl-1" data-start="1058" data-end="1066"><strong data-start="1058" data-end="1066">cURL</strong></p>
<pre id="bkmrk-curl--x-get-%22https%3A%2F-1"><code class="language-bash">curl -X GET "https://api.dbmatic.eu/api/v1/journals/{journal_id}/equipment_inventory" \
  -H "Authorization: Bearer YOUR_API_TOKEN"</code></pre>
<p id="bkmrk-python-1"><strong>Python</strong></p>
<pre id="bkmrk-import-requests-jour"><code class="language-python">import requests

journal_id = "YOUR_JOURNAL_ID"
url = f"https://api.dbmatic.eu/api/v1/journals/{journal_id}/equipment_inventory"
headers = {"Authorization": "Bearer YOUR_API_TOKEN"}

response = requests.get(url, headers=headers)
print(response.json())</code></pre>
<p id="bkmrk-javascript-1"><strong>JavaScript</strong></p>
<pre id="bkmrk-const-journalid-%3D-%22y"><code class="language-javascript">const journalId = "YOUR_JOURNAL_ID";
const url = `https://api.dbmatic.eu/api/v1/journals/${journalId}/equipment_inventory`;

fetch(url, {
  headers: {
    "Authorization": "Bearer YOUR_API_TOKEN"
  }
})
  .then(res =&gt; res.json())
  .then(data =&gt; console.log(data))
  .catch(err =&gt; console.error(err));</code></pre>
<hr id="bkmrk--4">
<h4 id="bkmrk-3.-get-measurements-">3. Get Measurements for Equipment</h4>
<p id="bkmrk-curl-2" data-start="1058" data-end="1066"><strong data-start="1058" data-end="1066">cURL</strong></p>
<pre id="bkmrk-curl--x-get-%22https%3A%2F-2"><code class="language-bash">curl -X GET "https://api.dbmatic.eu/api/v1/journals/{journal_id}/measurements/{equipment_id}?start=1757512200&amp;stop=1757512800" \
  -H "Authorization: Bearer YOUR_API_TOKEN"</code></pre>
<p id="bkmrk-python-2"><strong>Python</strong></p>
<pre id="bkmrk-import-requests-jour-1"><code class="language-python">import requests

journal_id = "YOUR_JOURNAL_ID"
equipment_id = "YOUR_EQUIPMENT_ID"
start = 1757512200
stop = 1757512800

url = f"https://api.dbmatic.eu/api/v1/journals/{journal_id}/measurements/{equipment_id}?start={start}&amp;stop={stop}"
headers = {"Authorization": "Bearer YOUR_API_TOKEN"}

response = requests.get(url, headers=headers)
print(response.json())</code></pre>
<p id="bkmrk-javascript-2"><strong>JavaScript</strong></p>
<pre id="bkmrk-const-journalid-%3D-%22y-1"><code class="language-javascript">const journalId = "YOUR_JOURNAL_ID";
const equipmentId = "YOUR_EQUIPMENT_ID";
const start = 1757512200;
const stop = 1757512800;

const url = `https://api.dbmatic.eu/api/v1/journals/${journalId}/measurements/${equipmentId}?start=${start}&amp;stop=${stop}`;

fetch(url, {
  headers: {
    "Authorization": "Bearer YOUR_API_TOKEN"
  }
})
  .then(res =&gt; res.json())
  .then(data =&gt; console.log(data))
  .catch(err =&gt; console.error(err));</code></pre>
<hr id="bkmrk--5">
<h4 id="bkmrk-endpoints-1" data-start="3571" data-end="3583">Endpoints</h4>
<p id="bkmrk-%28already-explained-a" data-start="3585" data-end="3674">(Already explained above with request/response examples, kept in place for reference.)</p>
<hr id="bkmrk--6" data-start="3676" data-end="3679">
<h4 id="bkmrk-notes" data-start="3681" data-end="3689">Notes</h4>
<ul id="bkmrk-all-timestamps-are-i" data-start="3690" data-end="3927">
<li data-start="3690" data-end="3764">
<p data-start="3692" data-end="3764">All timestamps are in ISO 8601 or Unix format, depending on the field.</p>
</li>
<li data-start="3765" data-end="3863">
<p data-start="3767" data-end="3863">Data structures follow the <a href="https://github.com/PoseiDAT/schemas" target="_blank" rel="noopener">PoseiDAT schema definitions</a></p>
</li>
<li data-start="3765" data-end="3863">
<p data-start="3767" data-end="3863">Only data for which your token has access will be returned.</p>
</li>
</ul>
<p id="bkmrk-%C2%A0-1"></p>
<p id="bkmrk-%C2%A0-2" data-start="1058" data-end="1066"></p>
