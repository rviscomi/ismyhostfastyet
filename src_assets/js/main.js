import {html, render} from 'uhtml';
import {analytics} from './analytics';

analytics.send({ t: "pageview" });

const inlineJSONEl = document.querySelector('.data-json');
const appEl = document.querySelector('.app-container');

if (!inlineJSONEl || !appEl) {
  throw new Error('Could not find a required element');
}

const original = JSON.parse(inlineJSONEl.innerHTML);
let sorterer = 'fast';
let filtered = original.filter(x => x.client === 'mobile');

const filter = (event) =>{
  event.preventDefault();
  const {currentTarget} = event;
  const client = currentTarget.value;
  filterResults(client);
  sortResults(sorterer);
  redraw();

  //gtag('event', 'sort', {'event_category': 'engagement', 'event_label': field});
  analytics.send({ event: 'client', 'event_category': 'engagement', 'event_label': client });
}

const filterResults = (client) => {
  if (client === 'all') return filtered = original;
  filtered = original.filter(x => x.client === client);
}

const sort = (event) => {
  event.preventDefault();
  const {currentTarget} = event;
  const field = currentTarget.dataset.field;
  sorterer = field;
  sortResults(field);
  redraw();
  //gtag('event', 'sort', {'event_category': 'engagement', 'event_label': field});
  analytics.send({ event: 'sort', 'event_category': 'engagement', 'event_label': field });
}

const sortResults = (field) => {
  if (!(field in filtered[0])) return filtered;
  filtered = filtered.sort((a, b) => {
    const diff = b[field] - a[field];
    if (isNaN(diff)) {
      // Do string comparison instead.
      return a[field].localeCompare(b[field]);
    }
    return diff;
  });
}

const header = (sorterer) => html`<thead>
  <th>${sorterer !== 'platform' ? html`<a href="#" onClick=${sort} data-field="platform">Host</a>` : html`Host`}</th>
  <th><select style="min-width: 1ch;" onChange=${filter} value="mobile">
    <option value="mobile">📱</option>
    <option value="desktop">🖥</option>
    <option value="all">📱🖥</option>
  </select></th>
  <th>${sorterer !== 'n' ? html`<a href="#" onClick=${sort} data-field="n">Sites</a>` : html`Sites`}</th>
  <th>${sorterer !== 'fast' ? html`<a href="#" onClick=${sort} data-field="fast">Fast</a>` : html`Fast`}</th>
  <th style="text-align: center">${sorterer !== 'avg' ? html`<a href="#" onClick=${sort} data-field="avg">Average<br>(p75 > 500ms)</a>` : html`Average<br>(p75 > 500ms)`}</th>
  <th style="text-align: right">${sorterer !== 'slow' ? html`<a href="#" onClick=${sort} data-field="slow">Slow<br>(p75 >= 1500ms)</a>` : html`Slow<br>(p75 >= 1500ms)`}</th>
</thead>`;

const redraw = () => {
  render(appEl, html`<table>
  ${header(sorterer)}
  <tbody>
    ${filtered.map(row => html`<tr>
      <td>${row.platform}</td>
      <td><span aria-label=${row.client === 'desktop' ? 'desktop' : 'mobile'}>${row.client === 'desktop' ? '🖥' : '📱'}</span></td>
      <td>${row.n}</td>
      <td colspan="3" class="ttfb">
        <span class="fast" title=${`Fast: ${Math.round((row.fast * 100) * 100) / 100}% of websites`} style=${`width: ${row.fast * 100}%`}>${Math.round((row.fast * 100) * 100) / 100}%</span>
        <span class="avg" title=${`Average: ${Math.round((row.avg * 100) * 100) / 100}% of websites`} style=${`width: ${row.avg * 100}%`}>${Math.round((row.avg * 100) * 100) / 100}%</span>
        <span class="slow" title=${`Slow: ${Math.round((row.slow * 100) * 100) / 100}% of websites`} style=${`width: ${row.slow * 100}%`}>${Math.round((row.slow * 100) * 100) / 100}%</span>
      </td>
    </tr>`)}
  </tbody>
</table>`);
}

redraw();
