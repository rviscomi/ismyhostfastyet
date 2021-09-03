import { Chart } from 'frappe-charts/dist/frappe-charts.esm.js';

const chartDom = document.getElementById('main');
const data = JSON.parse(document.querySelector('.data-json').innerHTML);
let chart;

const capitalize = s => s && s[0].toUpperCase() + s.slice(1)

const getPrviders = () => {
  const providers = [];
    Object.keys(data).forEach(year => {
    [1,2,3,4,5,6,7,8,9,10,11,12].forEach(month => {
      if (data[year][month]) {
        data[year][month].forEach(item => {
          if (item.platform && !providers.includes(item.platform.toLowerCase())) {
            providers.push(item.platform.toLowerCase());
          }
        });
      }
    });
  });

  return providers;
};

const filter = (platform, client) => {
  const tmpData = {Fast: [], Average: [], Slow: []};
  const out = [];

  Object.keys(data).forEach(year => {
    [1,2,3,4,5,6,7,8,9,10,11,12].forEach(month => {
      if (data[year][month]) {
        data[year][month].forEach(item => {
          if (item && item.client && item.client === client && item.platform && item.platform.toLowerCase() === platform.toLowerCase()) {
            tmpData.Slow.push(item.slow);
            tmpData.Average.push(item.avg);
            tmpData.Fast.push(item.fast);
          }
        });
      }
    });
  });

  ['Slow', 'Average', 'Fast'].forEach(item => {
      out.push({
      name: item,
      chartType: 'bar',
      values: tmpData[item],
    });
  });

  return out;
};

const xAxis = () => {
  const xAxis = [];
  Object.keys(data).forEach(year => {
    [1,2,3,4,5,6,7,8,9,10,11,12].forEach(month => {
      if (data[year][month]) {
        xAxis.push(`${month}/'${year.substr(2, 2)}`);
      }
    });
  });

  return xAxis;
};


const options ={
  yRegions: [{ label: "%", start: 0, end: 100 }],
  data: {
    labels: xAxis(),
  },
  // type: 'axis-mixed',
  barOptions: {
    spaceRatio: 0.001,
    stacked: true,
  },
  height: 400,
  colors: ['red', 'yellow', 'green', 'black'],
  axisOptions: {
    xAxisMode: 'tick',
    yAxisMode: 'span'
  },
};

const update = (platform, client) => {
  if (!chart) {
    options.data.datasets = filter(platform, client);
    chart = new Chart(chartDom, options);
  } else {
    chart.update({
      labels: xAxis(),
      datasets: filter(platform, client),
    });
  }
};

const platforms = getPrviders();
const selectPlatformEl = document.createElement('select');
const selectClientEl = document.createElement('select');

selectClientEl.innerHTML = `<option value='mobile'>Mobile</option><option value='desktop'>Desktop</option>`
platforms.sort().forEach(item => {
  const optionEl = document.createElement('option');
  optionEl.text = capitalize(item);
  optionEl.value = item;
  selectPlatformEl.appendChild(optionEl);
});

selectPlatformEl.addEventListener('change', (ev) => {
  update(ev.target.value, selectClientEl.value);
});

selectClientEl.addEventListener('change', (ev) => {
  update(selectPlatformEl.value, ev.target.value);
});

chartDom.insertAdjacentElement('beforebegin', selectPlatformEl);
chartDom.insertAdjacentElement('beforebegin', selectClientEl);

update(platforms[0], 'mobile');
