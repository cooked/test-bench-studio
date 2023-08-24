// nav chart

var config_nav = {
    type: 'line',
    plugins: [dragger],
    options: {
        events: ['mousedown', 'mouseup', 'mousemove', 'mouseout','click'],
        animation: false,
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
                }
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
                annotations: {
                    box, 
                    hl, hr
                }
            }
        }
    }
}