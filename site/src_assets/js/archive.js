
import * as echarts from 'echarts/core';
import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { SVGRenderer } from 'echarts/renderers';
import {analytics} from './analytics';

analytics.send({ t: "pageview" });

const chartDom = document.getElementById('main');
const data = JSON.parse(document.querySelector('.data-json').innerHTML);

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
      type: 'line',
      areaStyle: {},
      stack: 'one',
      emphasis: {
        focus: 'series'
      },
      data: tmpData[item],
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

echarts.use(
  [
    ToolboxComponent,
    LegendComponent,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    GridComponent,
    LineChart,
    SVGRenderer
  ]
);

let myChart = echarts.init(chartDom, 'dark');
myChart.setOption({
  backgroundColor: 'transparent',
  color: ['#dd493f', '#fbca42', '#0aa55f'],
});

let option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: 'transparent'
      }
    }
  },
  legend: {
    data: ['Slow', 'Average', 'Fast']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: xAxis()
    }
  ],
  yAxis: {}
};

const update = (platform, client) => {
  option.series = filter(platform, client);
  option.title= { text: platform };
  myChart.setOption(option);

  //gtag('event', 'sort', {'event_category': 'engagement', 'event_label': field});
  analytics.send({ event: 'Chart.timeline', 'event_category': 'engagement', 'event_label': `${platform}-${client}` });
};

const platforms = getPrviders();
const selectPlatformEl = document.createElement('select');
selectPlatformEl.id = 'select-platform';
const selectClientEl = document.createElement('select');
selectClientEl.id = 'select-client';

selectClientEl.innerHTML = `<option value="mobile">Mobile</option><option value="desktop">Desktop</option>`
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
  update(selectPlatformEl.value, ev.target.value,);
});

const selectPlatformLabelEl = document.createElement('label');
selectPlatformLabelEl.innerHTML = 'Host:';
selectPlatformLabelEl.setAttribute('for', 'select-platform');
chartDom.insertAdjacentElement('beforebegin', selectPlatformLabelEl);
chartDom.insertAdjacentElement('beforebegin', selectPlatformEl);

const selectClientLabelEl = document.createElement('label');
selectClientLabelEl.innerHTML = 'Client:';
selectClientLabelEl.setAttribute('for', 'select-client');
chartDom.insertAdjacentElement('beforebegin', selectClientLabelEl);
chartDom.insertAdjacentElement('beforebegin', selectClientEl);

update(platforms[0], 'mobile');

window.onresize = () => {
  myChart.resize();
};
