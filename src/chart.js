// main chart
var config = {
  type: 'line',
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
        pointStyle: 'circle',
        radius: 0,
        hitRadius: 10,
        hoverRadius: 2,
        hoverBorderWidth: 2,
        borderWidth: 2,
        borderColor: 'blue'

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
      /*crosshair: {
        line: {
          color: '#aaa',  // crosshair line color
          width: 1        // crosshair line width
        },
        sync: {
          enabled: false,            // enable trace line syncing with other charts
        },
        zoom: {
          enabled: false,                                      // enable zooming
          zoomboxBackgroundColor: 'rgba(66,133,244,0.2)',     // background color of zoom box 
          zoomboxBorderColor: '#48F',                         // border color of zoom box
          zoomButtonText: 'Reset Zoom',                       // reset zoom button text
          zoomButtonClass: 'reset-zoom',                      // reset zoom button class
        }
      },*/
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
      boxselect: {
        select: {
          enabled: true,
          direction: 'x'
        },
        callbacks: {
          beforeSelect: function (startX, endX, startY, endY) {
            // return false to cancel selection
            return true;
          },
          afterSelect: function (startX, endX, startY, endY, datasets) {
            updateDatasets_xline(startX, endX, startY, endY, datasets);
          }
        }
      },
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