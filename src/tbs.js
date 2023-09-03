
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

// chart and navigator
chart = new Chart(document.getElementById('chart'), config);
chart2 = new Chart(document.getElementById('chart-nav'), config_nav);

resetDatasets();
resetScaleX(chart);
resetScaleX(chart2);

// import/export file
document.getElementById("act-import").addEventListener('click', () => {
  // select, then parse it
  loadFile().then( (file) => {
    var fr = new FileReader();
    fr.readAsText(file);
    fr.onload = function(e) {

      let ret = parse_epa(e.target.result, '\t', '\r\n', 2);

      var speed_ts = [];
      var torque_ts = [];

      var t     = ret[0];
      var speed = ret[1];

      speed.forEach((value, i) => {
        speed[i] *= mph_to_mps;
        speed_ts.push({x:toDateTime(t[i]), y:value});
      });

      var accel = speed.map((x, i, a) => (x-(a[i-1]||0)));
      var torque = accel.map((x) => x*dynpar.mass);

      torque.forEach((value, i) => {
        torque_ts.push({x:toDateTime(t[i]), y:value});
      });

      // chart
      chart.data.datasets[0].data = speed_ts;
      chart.data.datasets[1].data = torque_ts;
      [tmin, tmax] = resetScaleX(chart);

      // nav
      chart2.data.datasets[0].data = speed_ts;
      chart2.options.plugins.annotation.annotations.box.xMin = tmin;
      chart2.options.plugins.annotation.annotations.box.xMax = tmax;
      resetScaleX(chart2);
    }

  });
});
document.getElementById("act-export").addEventListener("click", () => {
  // prepare blob
  let blob = ds_to_csv(chart.data.datasets);
  // write to disk
  saveFile(blob,'export.csv');
});

// delete the points that have been previously selected
document.addEventListener('keydown', (e) => {

	if((e.key == 'Backspace' || e.key == 'Delete') && chart.boxselect.selection) {
    
    chart.boxselect.selection.forEach(hds => {
  
      var dt = hds.data[ hds.data.length-1 ].x - hds.data[0].x;
    
      // first, last and count
			var start = hds.indexes[0];
      var count = hds.indexes.length;
			var end = start + count - 1;
      var tot = chart.data.datasets[hds.dsi].data.length;
      
      // remove elements
      chart.data.datasets[hds.dsi].data.splice(start, count);

      // shift elements back in time
      for(var i=start; i<(tot-1)-end; i++)
        chart.data.datasets[hds.dsi].data[i].x -= dt;

      // remove highlights
      chart.data.datasets.pop();
    });

    // sync nav
    chart2.config.data.datasets[0].data = chart.config.data.datasets[0].data;
    
    // update
    resetScaleX(chart);
    resetScaleX(chart2)

    // clear selection
    chart.boxselect.selection = null;

	}
  
});


//
// context menu
//

$('#ctx-menu').hide();

chart.canvas.addEventListener("contextmenu", (e) => {

  e.preventDefault();

  $('#ctx-menu').show()
    .css('left', `${e.pageX}px`)
    .css('top', `${e.pageY}px`);

  //const {scales:{x, y}} = ;
  px = chart.scales.x.getValueForPixel(e.offsetX);
  py = chart.scales.x.getValueForPixel(e.offsetY);
  
  // points hit and nearby
  points = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
  points_n = chart.getElementsAtEventForMode(e, 'nearest', {intersect: false }, true);
  
  if(points.length) {
    $('#edit').show();
    $('#remove').show();
  } else {
    $('#edit').hide();
    $('#remove').hide();
  }
  
});

// hide context menu on leave (incl. when focus goes away)
$('#ctx-menu').on('mouseleave', function() {
    $('#ctx-menu').hide();
});

// submit fires on the form
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
$('#trap').on('submit', function (e) {

    // TODO: add validation

    solve_trap(
        chart,
        document.getElementById("trap-dly").value * 1000,
        document.getElementById("trap-acc").value * 1000,
        document.getElementById("trap-cru").value * 1000,
        document.getElementById("trap-dec").value * 1000,
        document.getElementById("trap-spd").value,
        document.getElementById("trap-trq").value
    );

    // update
    chart2.data.datasets[0].data = chart.data.datasets[0].data;
    resetScaleX(chart);
    resetScaleX(chart2);

});

$('#ramp').on('submit', function (e) {

    solve_ramp(
        chart,
        parseInt(document.getElementById("ramp-dly").value * 1000),
        parseInt(document.getElementById("ramp-v1").value),
        parseInt(document.getElementById("ramp-v2").value),
        parseInt(document.getElementById("ramp-q1").value),
        parseInt(document.getElementById("ramp-q2").value),
        parseInt(document.getElementById("ramp-nstep").value),
        parseInt(document.getElementById("ramp-ttrans").value * 1000),
        parseInt(document.getElementById("ramp-tstep").value * 1000),
        document.getElementById("ramp-mirror").checked,
    );

    // update
    chart2.data.datasets[0].data = chart.data.datasets[0].data;
    resetScaleX(chart);
    resetScaleX(chart2);

});

$('#edit').on('click', (e) => {
    // TODO:
});

$("#remove").on('click', function() {

    delete_point(chart, points);
    // update
    chart2.data.datasets[0].data = chart.data.datasets[0].data;
    resetScaleX(chart);
    resetScaleX(chart2);

});