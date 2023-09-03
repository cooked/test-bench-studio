// utilities

function alignNav() {
  chart2.options.layout.padding.left = chart.chartArea.left - 8;
  chart2.options.layout.padding.right = chart.width - chart.chartArea.right;
}

function optimizeLabelsX() {
  const range_s = (chart.options.scales.x.max-chart.options.scales.x.min)/1000;
  if(range_s < 60)
    chart.options.scales.x.time.unit = 'second';
  else if(range_s <3600)
    chart.options.scales.x.time.unit = 'minute';
  else if(range_s <86400)
    chart.options.scales.x.time.unit = 'hour';
  else if(range_s <604800)
    chart.options.scales.x.time.unit = 'day';

  chart2.options.scales.x.time.unit = chart.options.scales.x.time.unit
}

function resetScaleX(chart) {
  var xmin, xmax;

  for (var i = 0; i < chart.data.datasets.length; i++) {
    xmin = Math.min(xmin, chart.data.datasets[i].data[0].x);
    xmax = Math.min(xmax, chart.data.datasets[i].data[chart.data.datasets[i].data.length - 1].x);
  }
  /*chart.data.datasets.forEach(ds => {
    if (ds.data[0].x < xmin)
      xmin = ds.data[0].x
    if (ds.data[ds.data.length - 1].x > xmax)
      xmax = ds.data[ds.data.length - 1].x
  });*/

  chart.options.scales.x.min = xmin;
  chart.options.scales.x.max = xmax;
  chart.update();

  optimizeLabelsX();
  alignNav();

  return [xmin, xmax]
}

function toDateTime(secs) {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t;
}

function resetDatasets() {

  var t =         [0, 1]; // s
  const speed =   [0, 0]; // rpm
  const torque =  [0, 0]; // Nm

  var speed_ts = [];
  var torque_ts = [];

  for(var i=0; i<t.length; i++) {
    var sec = t[i] * 1000;
    speed_ts.push({x: sec, y: speed[i]});
    torque_ts.push({x: sec, y: torque[i]});
  }

  chart.data.datasets[0].data = speed_ts;
  chart.data.datasets[1].data = torque_ts;

  chart2.data.datasets[0].data = speed_ts;

  chart.update();
  chart2.update();

}

// add point, given chart and event
function solve_point(chart, e) {

}

// trap is a typical ramp-up, cruise, ramp-down pattern
function solve_trap(chart, toff, tacc, tcru, tdec, v2, q2) {
   
  var idx = points_n[0].index;

  if(chart.data.datasets[0].data[idx].x - px > 0) {
      idx -= 1;
  }

  // TODO: torque, take the one of the nearest points

  // prepare points
   let t1 = chart.data.datasets[0].data[idx].x + toff
   let t2 = t1 + tacc;
   let t3 = t2 + tcru;
   let t4 = t3 + tdec;

   var v1 = chart.data.datasets[0].data[idx].y;        // speed of prev point                    //  
   var v3 = chart.data.datasets[0].data[idx + 1].y;      // speed of next point
   var q1 = chart.data.datasets[1].data[idx].y;
   var q3 = chart.data.datasets[1].data[idx + 1].y;
 
   // speed and torque
   let va = [
     { x: t2, y: v2 },
     { x: t3, y: v2 },
     { x: t4, y: v3 }
   ];
   let qa = [
     { x: t2, y: q2 },
     { x: t3, y: q2 },
     { x: t4, y: q3 }
   ];
   if (toff) {
     va.unshift({ x: t1, y: v1 });
     qa.unshift({ x: t1, y: q1 });
   }
 
   var l1 = va.length;                                 // ramp points
   var l2 = l1 + chart.data.datasets[0].data.length;   // total points
   while (va.length) {
     chart.data.datasets[0].data.splice(idx + 1, 0, va.pop())
     chart.data.datasets[1].data.splice(idx + 1, 0, qa.pop())
   }
 
   // shift array elements that come after
   for (var i = idx + l1 + 1; i < l2; i++) {
     chart.data.datasets[0].data[i].x += (t4 - t1 + toff);
     chart.data.datasets[1].data[i].x += (t4 - t1 + toff);
   }
}

// ramp is a sequence of steps
function solve_ramp(chart, toff, v1, v2, q1, q2, ns, t_trans, t_step, mirror) {

  var idx = points_n[0].index;

  if(chart.data.datasets[0].data[idx].x - px > 0) {
      idx -= 1;
  }

  const dv = (v2-v1)/ns;
  const dq = (q2-q1)/ns;
  
  let t = chart.data.datasets[0].data[idx].x + toff;
  let v = v1;
  let q = q1;

  let va = [{ x: t, y: v} ];
  let qa = [{ x: t, y: q} ];

  for(var i=0; i<ns; i++) {
    t += t_trans;
    v += dv;
    q += dq;
    va.push( { x: t, y: v } );
    qa.push( { x: t, y: q } );
    t += t_step;
    va.push( { x: t, y: v } );
    qa.push( { x: t, y: q } );
  }

  if(mirror) {
    for(var i=0; i<ns; i++) {
      t += t_trans;
      v -= dv;
      q -= dq;
      va.push( { x: t, y: v } );
      qa.push( { x: t, y: q } );
      t += t_step;
      va.push( { x: t, y: v } );
      qa.push( { x: t, y: q } );
    }
  }


  var l1 = va.length;                                 // ramp points
  var l2 = l1 + chart.data.datasets[0].data.length;   // total points
  while (va.length) {
    chart.data.datasets[0].data.splice(idx + 1, 0, va.pop())
    chart.data.datasets[1].data.splice(idx + 1, 0, qa.pop())
  }

  // shift array elements that come after
  for (var i = idx + l1 + 1; i < l2; i++) {
    chart.data.datasets[0].data[i].x += t;
    chart.data.datasets[1].data[i].x += t;
  }
}

// https://www.chartjs.org/docs/latest/developers/api.html#setactiveelements-activeelements
function select_ramp(chart, key) {
  //chart.setActiveElements([
  //  {datasetIndex: 0, index: 1},
  //]);
}

function delete_point(chart, points) {
  
  // TODO: implement mode

  points.forEach(p => {
    chart.data.datasets[0].data.splice(p.index, 1);
    chart.data.datasets[1].data.splice(p.index, 2);
  });
  
}

function redraw() {
  zoom_box(chart, chart2, z_min, z_max);
}
