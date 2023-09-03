// crosshair

function crosshair_lines(chart) {
  const {
    ctx,
    chartArea: { left, right, top, bottom },
  } = chart;
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#aaa";
  ctx.setLineDash([2, 2]);
  // horizontal
  ctx.beginPath();
  ctx.moveTo(left, chart.crosshair.py);
  ctx.lineTo(right, chart.crosshair.py);
  ctx.stroke();
  ctx.closePath();
  // vertical
  ctx.beginPath();
  ctx.moveTo(chart.crosshair.px, top);
  ctx.lineTo(chart.crosshair.px, bottom);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

function crosshair_labels(chart) {
  const {
    ctx,
    data,
    chartArea: { left, right, top, bottom },
    scales: { x, y },
  } = chart;
  const cx = chart.crosshair.px;
  const cy = chart.crosshair.py;
  const tw = ctx.measureText(data.labels[x.getValueForPixel(cx)]);

  ctx.beginPath();

  ctx.fillStyle = "#aaa";
  ctx.fillRect(0, cy - 10, left, 20);
  ctx.closePath();
  ctx.font = "10px sans-serif";
  ctx.fillStyle = "white";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(y.getValueForPixel(cy).toFixed(2), left / 2, cy);

  ctx.beginPath();
  ctx.fillStyle = "#aaa";
  ctx.fillRect(cx - tw / 2, bottom, tw, 20);
  ctx.font = "10px sans-serif";
  ctx.fillStyle = "white";
  ctx.fillText(data.labels[x.getValueForPixel(cx)], cx, bottom + 10);
  
  ctx.closePath();
}

function crosshair_point(chart) {
  const {
    ctx,
    data,
    chartArea: { left, right, top, bottom, width, height },
    scales: { x, y },
  } = chart;
  const cx = chart.crosshair.px;
  const cy = chart.crosshair.py;

  ctx.beginPath();
  ctx.fillStyle = "#aaa";
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 3;

  const angle = Math.PI / 180;
  const ns = x._gridLineItems.length - 1;

  for (let i = 0; i < ns; i++) {
    if (cx >= x._gridLineItems[i].tx1 && cx <= x._gridLineItems[i + 1].tx1) {
      let ys = y.getPixelForValue(data.datasets[0].data[i]);
      let ye = y.getPixelForValue(data.datasets[0].data[i + 1]);
      ctx.arc(
        cx,
        ys + ((ye - ys) / (width / ns)) * (cx - x._gridLineItems[i].tx1),
        5,
        angle * 0,
        angle * 360,
        false
      );
    }
  }

  ctx.fill();
  ctx.stroke();
}

var crosshairPlugin = {
  id: "crosshair",

  defaults: {
    events: ["mousemove", 'mouseout'],
  },

  afterInit: function (chart) {
    chart.crosshair = {
      enabled: true,
      px: null,
      py: null,
    };
  },

  beforeEvent: function (chart, e) {
    //console.log(e);
  },
  afterEvent: function (chart, e) {
    //if(e.event.type=='keyup')
    //console.log(e);

    if (e.inChartArea && e.event.type == "mousemove") {
      chart.crosshair.px = e.event.x;
      chart.crosshair.py = e.event.y;
    } else {
      chart.crosshair.px = null;
      chart.crosshair.py = null;
    }

    chart.draw();
  },

  afterDraw: function (chart, e) {
    if(chart.crosshair.px && chart.crosshair.py) {
      chart.ctx.save();
      crosshair_lines(chart);
      crosshair_labels(chart);
      //crosshair_point(chart);
      chart.ctx.restore();
    }
  },
};
