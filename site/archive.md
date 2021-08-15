---
layout: base.njk
---

<h2>Timeline</h2>

<script type="module" src="/assets/js/archive.js?{{metadata.version}}"></script>
<div id="main" style="width:100%; height:600px;"></div>
<script class="data-json" type="application/json">{{ archive | dump | safe }}</script>
