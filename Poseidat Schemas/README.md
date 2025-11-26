<h2>Poseidat Schemes</h2>
<p id="bkmrk-the-poseidat-initiat">The PoseiDAT initiative was created to create an open data format to exchange maritime sourced&nbsp;<strong>scientific</strong>,&nbsp;<strong>technical</strong>&nbsp;and&nbsp;<strong>economic</strong> activity data for fishing vessels. This repository contains the core schemas for the PoseiDAT data interchange formats and exposes itself as an NPM package that can be used to create and validate PoseiDAT journals, entries and events.</p>
<hr id="bkmrk-">
<h4 id="bkmrk-purpose-and-origins" class="heading-element" dir="auto" tabindex="-1">Purpose and origins</h4>
<p id="bkmrk-there-is-a-growing-d" dir="auto">There is a growing demand for data collection and analysis in the world of commercial fishery. Government and scientific parties have interest for both preservation, inspection and law enforcement. Commercial entities have an interest for operational efficiency and fulfilling their legal requirements.</p>
<p id="bkmrk-there-are-various-ex" dir="auto">There are various existing studies all working on parts of available data sets which all have different formats and data ranges. The Electronic recording and reporting system (ERS) is used to record, report, process, store and send fisheries data (catch, landing, sales and transhipment) and is often used as a source for these studies. The ERS is focused on government use and will lack lower level operational details. There are also new data sets emerging like sensory data which has no place in an ERS. On the other end of the spectrum organizations such as&nbsp;<a href="http://www.ices.dk/" rel="nofollow">ICES</a>&nbsp;collect surveys for scientific and data analysis purposes. These surveys are more focussed on a certain subject and may not have enough relational markers for commercial business analysis.</p>
<p id="bkmrk-the-poseidat-initiat-1" dir="auto">The PoseiDAT initiative was created to create something we call the&nbsp;<code>vessel journal</code>. This is the super set of data that brings together all the data collected during a vessels lifetime (or specific ownership period). A journal is comprised of&nbsp;<code>entries</code>&nbsp;that can be sent and collected piecemeal. An entry is time based log which can contain one or more&nbsp;<code>events</code>. The addition of entries can occur both on board a vessel and at a central land based location by the commercial entity running the vessel. This journal could then be used as a source for data sharing to scientific studies and systems like an ERS. Having a standard schema for each entry type will hopefully allow more system to exchange their data. By distinguishing between entry types an export can be filtered on the types of data the owner wants to share with other systems.</p>
<hr id="bkmrk--1">
<h4 id="bkmrk-core-entities" class="heading-element" dir="auto" tabindex="-1">Core entities</h4>
<p id="bkmrk-a-journal-contains-t" dir="auto">A journal contains the following information:</p>
<ul id="bkmrk-journal-identifier-v" dir="auto">
<li>journal identifier</li>
<li>vessel information</li>
<li>equipment installed on the vessel</li>
<li>vessel service history (1...n)</li>
<li>events (1...n)</li>
</ul>
<p id="bkmrk-you-can-think-of-the" dir="auto">You can think of the journal much like its paper equivalent. On the cover the name identifying the vessel is shown. The first couple of pages are reserved for a description of the vessel and contains a listing of the equipment on board. There are also some pages dedicated to logging services performed on the vessel much like the maintenance booklet of your car. Next the entries begin with a header detailing the exact date and time the entry was made. The entry itself is a collection of events that occurred at that specific moment in time.</p>
<h4 id="bkmrk-entries" dir="auto">Entries</h4>
<p id="bkmrk-an-entry-should-at-l" dir="auto">An entry should at least contains the following:</p>
<ul id="bkmrk-a-unique-identifier-" dir="auto">
<li>a unique identifier</li>
<li>revision identifier</li>
<li>a date and time in UTC</li>
<li>some entry type specific data</li>
</ul>
<p id="bkmrk-we-currently-support" dir="auto">We currently support the following entry types:</p>
<ul id="bkmrk-equipmentinventory-%28" dir="auto">
<li>EquipmentInventory (1)</li>
<li>VesselRegistration (1)</li>
<li>ServiceHistory (1...n)</li>
<li>PersonalRoster (1)</li>
<li>Events (1...n)</li>
</ul>
<h4 id="bkmrk-equipmentinventory" class="heading-element" dir="auto" tabindex="-1">EquipmentInventory</h4>
<p id="bkmrk-there-should-only-be">There should only be 1&nbsp;<code>EquipmentInventory</code>&nbsp;which will be updated with new revisions when equipment is installed, replaced or decommissioned. Since&nbsp;<code>equipment</code> can be referenced by event entries (for sensory data) they should never be removed but marked with a status (installed, replaced, etc).</p>
<h4 id="bkmrk-vesselregistration" class="heading-element" dir="auto" tabindex="-1">VesselRegistration</h4>
<p id="bkmrk-there-should-only-be-1">There should only be 1&nbsp;<code>VesselRegistration</code> which will be updated with new revisions when vessel registration details are updated.</p>
<h4 id="bkmrk-events">Events</h4>
<p id="bkmrk-the-flexibility-of-t" dir="auto">The flexibility of the PoseiDAT schema lies in the event types we collect and support. By having structured and well defined event schemas they can be consumed and interpreted by other systems. The events we support will be extended as the project progresses. An example of the type of events a journal entry can contain are:</p>
<ul id="bkmrk-devicemeasurement-de" dir="auto">
<li>DeviceMeasurement</li>
<li>DeviceNotification (warning, error, failure)</li>
<li>Navigational</li>
<li>Departure</li>
<li>Arrival</li>
<li>Landing</li>
<li>ZoneCrossing</li>
<li>TowStart</li>
<li>TowEnd</li>
<li>FishingHaul</li>
<li>ProductionBatch</li>
</ul>
<hr id="bkmrk--2">
<h4 id="bkmrk-design-principles">Design principles</h4>
<p id="bkmrk-these-will-evolve-as" dir="auto">These will evolve as the project continues.</p>
<ul id="bkmrk-schemas-must-be-a-v7" dir="auto">
<li>Schemas must be a v7&nbsp;<a href="https://json-schema.org/" rel="nofollow">json-schema</a></li>
<li>All date times must be in UTC</li>
<li>All date time must be RFC3339 formatted strings</li>
<li>All schema properties must have descriptions</li>
<li>Property descriptions should note their unit of measurement (if applicable)</li>
<li>Unit tests must cover every schema</li>
<li>Unit tests should cover validation errors</li>
<li>Identifiers should be UUID v4</li>
<li>Entities should never be copied but referenced by identifier (ex. source device details for a measurement event)</li>
<li>Any referenced identifier may never be removed/archived from the journal (referential integrity)</li>
<li>A journal is unique to a vessel (vessel ownership changes may warrant a new journal for the same vessel)</li>
</ul>
<hr id="bkmrk--3">
<h4 id="bkmrk-development">Development</h4>
<p id="bkmrk-this-repository-is-s" dir="auto">This repository is setup to help develop and validate new and existing schemas for PoseiDAT.</p>
<p id="bkmrk-if-you-want-to-get-i" dir="auto">If you want to get involved with developing the PoseiDAT schemas you can clone this repository. You will need to have NodeJS v12 installed</p>
<pre id="bkmrk-git-clone-git%40github">git clone git@github.com:PoseiDAT/schemas.git
npm install</pre>
<div class="highlight highlight-source-shell notranslate position-relative overflow-auto" dir="auto" id="bkmrk--4">
<div class="zeroclipboard-container"><svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon"></svg></div>
</div>
<p id="bkmrk-the-schemas-themselv" dir="auto">The schemas themselves are found in&nbsp;<code>src/core-schema</code>. The&nbsp;<code>src/core-schema/index.ts</code>&nbsp;needs to be updated to export new schemas when they are added. The&nbsp;<code>src/core-schema/types.ts</code>&nbsp;is generated form the json schemas when doing an&nbsp;<code>npm run test</code>&nbsp;or an&nbsp;<code>npm run build</code>. Should the need arise to only update the typings run&nbsp;<code>npm run build:typings</code></p>
<p id="bkmrk-please-be-liberal-in" dir="auto">Please be liberal in adding unit tests in the&nbsp;<code>test</code>&nbsp;folder for your schemas and data validation. All the code and unit tests are written in TypeScript targeted for NodeJS. You can check the line based coverage after running&nbsp;<code>npm run test</code>&nbsp;by opening&nbsp;<code>coverage/lcov-report/index.html</code>&nbsp;in a web browser.</p>
<p id="bkmrk-documentation-is-gen" dir="auto">Documentation is generated on each build and hosted on&nbsp;<a href="https://poseidat.github.io/schemas/" rel="nofollow">github pages</a>. You can locally test them with&nbsp;<code>npm run docs</code>.</p>
<hr id="bkmrk--5">
<h4 id="bkmrk-installation" dir="auto">Installation</h4>
<p id="bkmrk-install-the-npm-pack" dir="auto">Install the npm package by running the npm install command:</p>
<pre id="bkmrk-npm-install-%40poseida"><code class="language-">npm install @poseidat/schemas</code></pre>
<h4 id="bkmrk-usage" dir="auto">Usage</h4>
<p id="bkmrk-here-is-an-example-o" dir="auto">Here is an example on how to use this package to create and validate an Arrival Entry by taking the following steps:</p>
<ul id="bkmrk-we-import-the-necess" dir="auto">
<li>We import the necessary class and interface</li>
<li>We setup an empty object, this is where your data for the actual Arrival Entry would be</li>
<li>We create the PoseiDAT Arrival Entry</li>
<li>We validate the PoseiDAT Arrival Entry</li>
<li>We check if we have errors within the Arrival Entry</li>
</ul>
<pre id="bkmrk-import-%7B-arrivalentr"><code class="language-c#">import {
  ArrivalEntry,
  IEntryArrival
} from '@poseidat/schemas';

const arrivalEntryData = {};

const poseidatArrivalEntry = new ArrivalEntry(arrivalEntryData as IEntryArrival);

const errors = poseidatArrivalEntry.validate();

if (errors.length) {
  // Handle errors
}</code></pre>
<p id="bkmrk-and-here-is-how-you-">And here is how you would create and validate a Journal, we use the&nbsp;<a href="https://www.npmjs.com/package/uuid" rel="nofollow">uuid package</a> to generate the uuid that is required:</p>
<pre id="bkmrk-import-%7B-journal%2C-ic"><code class="language-c#">import {
  Journal,
  ICoreJournal
} from '@poseidat/schemas';
import { v4 as uuidv4 } from 'uuid';

const journalData: ICoreJournal = {
  journal_id: uuidv4(),
  vessel: {
      name: 'Amsterdam',
      flag_state: 'NL',
      cfr: 'NL00000001',
      call_sign:'VOC001',
      hull_number: 'VOC-1',
      registration_date: '01-01-1748',
      full_length: '48',
    }
};

const poseidatJournal = new Journal(journalData);

const errors = poseidatJournal.validate();

if (errors.length) {
  // Handle errors
}</code></pre>
<p id="bkmrk-%C2%A0"></p>
