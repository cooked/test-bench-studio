// main chart
var config = {
  type: 'line',
  plugins: [crosshairPlugin, boxselectPlugin],
  data: {
    datasets: [{
      label: 'Speed',
      lineTension: 0,
      yAxisID: 'y',
      order: 1,
      borderColor: palette[0],     // line color
      backgroundColor: palette[0], // point color
    },
    {
      label: 'Torque',
      lineTension: 0,
      yAxisID: 'y1',
      order: 2,
      borderColor: palette[2],     // line color
      backgroundColor: palette[2], // point color
    }]
  },
  options: {
    responsive: true,
    stacked: false,
    animation: false,
    aspectRatio: 3,
    // hide points here, or do it in datasets 
    // https://stackoverflow.com/questions/35073734/hide-points-in-chartjs-linegraph
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: 0,
        hitRadius: 3,
        hoverRadius: 3,
        borderWidth: 0,
        borderColor: 'white',
        hoverBorderColor: 'white',
        pointHoverBorderWidth: 2
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          mode: 'x',
          onZoomComplete: function () {
            chart2.options.plugins.annotation.annotations.box.xMin =
              chart.options.scales.x.min;
            chart2.options.plugins.annotation.annotations.box.xMax =
              chart.options.scales.x.max;
            chart2.update('none');
          }
        },
        pan: {
          enabled: true,
          modifierKey: 'ctrl',
          mode: 'x',
        },
        limits: {
          x: {
            min: 'original',
            max: 'original'
          }
        },
      },
      /*dragData: {
        round: 1,
        dragX: true,
        showTooltip: false,
        onDragStart: function (e, datasetIndex, index, value) {

        },
        onDrag: function (e, datasetIndex, index, value) {
          e.target.style.cursor = 'grabbing'
          console.log("Drag Value: ", value.x)
        },
        onDragEnd: function (e, datasetIndex, index, value) {
          e.target.style.cursor = 'default'
        },
      },*/
      
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          displayFormats: {
            second: 'mm:ss:SSS',
            minute: 'mm:ss',
            hour: 'hh:mm',
            day:  'hh:mm'
          },
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        //beginAtZero: true,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false
        },
      },
    },

  }
};

