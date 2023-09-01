// nav chart

var config_nav = {
    type: 'line',
    plugins: [resetNav, dragger],
    options: {
        events: ['mousedown', 'mouseup', 'mousemove','click','dblclick'],
        animation: false,
        elements: {
            line: {
              borderWidth: 2
            }
          },
        layout: {
            padding: {
                //left: chart.chartArea.left - 10,
                //right: chart.width - chart.chartArea.right,
            }
        },
        aspectRatio: 14,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second',
                    displayFormats: {
                        second: 'mm:ss:SSS'
                    },
                },
                parsing: false,
                grid: {
                    display: false
                },
                beginAtZero: true,
            },
            y: {
                beginsAtZero: true,
                ticks: {
                    display: false
                },
                grid: {
                    display: false
                }
            },
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            },
            annotation: {
                clip: false,
                common: {
                    drawTime: 'afterDraw'
                },
                annotations: {
                    box
                }
            }
        }
    }
}