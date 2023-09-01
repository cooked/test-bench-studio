// main chart
var config = {
  type: 'line',
  plugins: [crosshairPlugin, boxselectPlugin],
  options: {
    events: [
      'mousemove', 'mouseout', 'click', 
      'touchstart', 'touchmove','mousewheel',
      'keyup','keydown','keypress'
    ],
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
        //type: 'linear',
        type: 'time',
        time: {
          unit: 'second',
          displayFormats: {
            second: 'mm:ss:SSS'
          },
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        // grid line settings
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },

  }
};

