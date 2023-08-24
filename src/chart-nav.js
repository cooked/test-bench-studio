// nav chart
const line = {
    type: 'line',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 2,
    label: {
        display: false,
        content: 'Limit',
        rotation: 90
    },
    scaleID: 'x',
    // value/endValue are assigned later in tbs.js
};

const box = {
    type: 'box',
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 1,
};
const hl = {
    type: 'box',
    backgroundColor: 'rgba(54, 162, 235, 1)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 1,
    click(ctx,el) {
        //element = ctx.element;
        console.log("prot L")
    },
};
const hr = {
    type: 'box',
    backgroundColor: 'rgba(54, 162, 235, 1)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 1,
    click(ctx,el) {
        //element = ctx.element;
        console.log("prot R")
    },
};

var config_nav = {
    type: 'line',
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
                        second: 'mm:ss'
                    },
                },

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
                    box, hl, hr
                }
            }
        }
    }
}