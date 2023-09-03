// nav chart

var config_nav = {
    type: 'line',
    plugins: [resetNav, dragger],
    data: {
        datasets: [{
            label: 'Overview',
            backgroundColor: 'rgba(54,162,235,0.2)',
            borderColor: 'rgba(54,162,235,1)',
            lineTension: 0,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 0,

        }]
    },
    options: {
        events: ['mousedown', 'mouseup', 'mousemove', 'click', 'dblclick'],
        animation: false,
        elements: {
            line: {
                borderWidth: 2
            }
        },
        aspectRatio: 14,
        scales: {
            x: {
                type: 'time',
                time: config.options.scales.x.time,
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