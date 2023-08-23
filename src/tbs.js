
// charts
var chart, chart2;
// points
var points, points_n;

// data
//const t = [0, 1800, 1805, 86400] // seconds
//var t =         [0, 10, 15,   16,   25,   26,   31, 35];
//const speed =   [0, 0,  1500, 1500, 1500, 1500, 0,  0];
//const torque =  [0, 0,  0,    5,    5,    0,    0,  0]; // Nm
var t =         [0, 10]; // s
const speed =   [0, 0]; // rpm
const torque =  [0, 0]; // Nm

var date = new Date();

var speed_ts = [];
var torque_ts = [];

for(var i=0; i<t.length; i++) {
  var sec = toDateTime(t[i]);
  speed_ts.push({x: sec, y:speed[i]});
  torque_ts.push({x: sec, y:torque[i]});
}

// dyno params
const dynpar = {
  // ambient
  tamb: 25,
  rho: 1.225,
  // inertial [kg]
  mass: 1000,
  // aero [m2]
  area: 1,
  cd: 0.3,
  // rolling resistance
  // https://en.wikipedia.org/wiki/Rolling_resistance
  crr: 0.0125 
}

const data = {
  datasets: [{
    label: 'Speed',
    data: speed_ts,
    borderColor: 'red',
    backgroundColor: 'red',
    lineTension: 0,
    yAxisID: 'y',
  },
  {
    label: 'Torque',
    data: torque_ts,
    borderColor: 'grey',
    backgroundColor: 'grey',
    lineTension: 0,
    yAxisID: 'y1',
  }
  ]
};

const data2 = {
  datasets: [{
    label: 'Overview',
    data: data.datasets[0].data,
    backgroundColor: 'rgba(54,162,235,0.2)',
    borderColor: 'rgba(54,162,235,1)',
    lineTension: 0,
    fill: true,
    pointRadius: 0,
    pointHoverRadius: 0
  }
  ]
};



document.addEventListener("click", () => {
  cm.style.display = 'none';
  //console.log('click');
});



// load charts when DOM ready
//document.addEventListener("DOMContentLoaded", () => {

  // main chart
  const ctx = document.getElementById('chart');
  config.data = data;
  chart = new Chart(ctx, config);
  
  const z_min = data.datasets[0].data[0].x;
  const z_max = data.datasets[0].data[data.datasets[0].data.length-1].x;
  chart.options.scales.x.min = z_min;
  chart.options.scales.x.max = z_max;
  // zoom limits
  if(chart.options.plugins.zoom) {
    chart.options.plugins.zoom.limits.x.min = z_min;
    chart.options.plugins.zoom.limits.x.max = z_max;
  }

  chart.update();

  chart.canvas.addEventListener('mousemove', (e) => { 
    crosshair(chart, e);
  });
  chart.canvas.addEventListener("contextmenu", (e) => {

    e.preventDefault();
    cm.style.display = 'block';
    cm.style.left = `${e.pageX}px`;
    cm.style.top = `${e.pageY}px`;

    const {data, scales:{x, y}} = chart;
    
    px = x.getValueForPixel(e.offsetX);
    py = y.getValueForPixel(e.offsetY);

    // points clicked
    points = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
    if(points.length)
      cm_rm.style.display = 'block';
      
    // points nearby
    points_n = chart.getElementsAtEventForMode(e, 'nearest', {intersect: false }, true);
    

  });

  // toolbar
  document.getElementById("act-export").addEventListener("click", function () {
    action_export_csv({ filename: "chart-data.csv", chart: chart })
  });
  document.getElementById("act-cycle").addEventListener("click", function () {
    load_file('https://www.epa.gov/sites/default/files/2015-10/uddscol.txt')
    // TODO update plot
  })
  document.getElementById("load-file").addEventListener("change", event => {
    const files = event.target.files;
    const file = files[0];
    var fr = new FileReader();
    fr.onload = function(e) { 
      ret = parse_epa(e.target.result, '\t', '\r\n', 2);
      
      var speed_ts = [];
      var torque_ts = [];

      var t     = ret[0];
      var speed = ret[1];

      mph_to_kph = 1.60934;
      mph_to_mps = 0.44704;

      speed.forEach((value, i) => {
        speed[i] *= mph_to_mps;
        speed_ts.push({x:toDateTime(t[i]), y:value});
      });

      var accel = speed.map((x, i, a) => (x-(a[i-1]||0)));
      var torque = accel.map((x) => x*dynpar.mass);

      torque.forEach((value, i) => {
        torque_ts.push({x:toDateTime(t[i]), y:value});
      });

      chart.data.datasets[0].data = speed_ts;
      chart.data.datasets[1].data = torque_ts;
      // reset zoom
      chart.config.options.scales.x.min = speed_ts[0].x;
      chart.config.options.scales.x.max = speed_ts[t.length - 1].x;
      chart.update();

      chart2.data.datasets[0].data = speed_ts;
      chart2.update();
    };
    fr.readAsText(file);
  });
  document.getElementById("load-file").addEventListener('click', () => {
    document.getElementById("load-file").value = null;
  });


  chart2 = new Chart(
    document.getElementById('chart-nav'), 
    config_nav
  );
  chart2.config.data = data2;
  chart2.update();

  // show zoombox
  zoom_box(chart, chart2, z_min, z_max);

