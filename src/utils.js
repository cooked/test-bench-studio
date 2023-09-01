// utilities

function toDateTime(secs) {
  var t = new Date(1970, 0, 1); // Epoch
  //var t = new Date().getDate(); // Today
  t.setSeconds(secs);
  return t;
}

function dsMinMax(datasets) {
  var xmin = new Date(2099, 0, 1);
  var xmax = new Date(1970, 0, 1);

  datasets.forEach(ds => {
    if( ds.data[0].x < xmin) 
      xmin = ds.data[0].x
    if( ds.data[ds.data.length-1].x > xmax)
      xmax = ds.data[ds.data.length-1].x
  });

  return [xmin, xmax];
}

function hoursEarlier(hours) {
    return new Date(new Date().getTime() - (hours * 60 * 60 * 1000));
}

function fillArray(start, stop, step) {
    var arr = [];
    //var step = (stop - start) / (cardinality - 1);
    for (var i = 0; i < stop; i++) {
        arr.push(start + (step * i));
    }
    return arr;
}


// add point, given chart and event
function add_point(chart, e) {

}

function add_ramp(chart, ramp) {

}

// https://www.chartjs.org/docs/latest/developers/api.html#setactiveelements-activeelements
function select_ramp(chart, key) {
  //chart.setActiveElements([
  //  {datasetIndex: 0, index: 1},
  //]);
}

function redraw() {
  zoom_box(chart, chart2, z_min, z_max);
}
