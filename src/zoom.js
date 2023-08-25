// zoom box

let element;
let lastEvent;
let dragMode; // 0:none, 1:left-handle, 2:right-handle, 3:scroll
let dbc = false;
let handleSize = 10;

let tmin, tmax; // full width

const resetNav = {
    id: 'resetNav',
    beforeEvent: (ch, evt, opts) => {
        if(evt.event.type == 'dblclick') {
            chart.options.scales.x.min = tmin;
            chart.options.scales.x.max = tmax;
            chart.update('none')
            ch.options.scales.x.min = tmin;
            ch.options.scales.x.max = tmax;
            ch.update('none')
        }
    }
};

let box = {
    type: 'box',
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 1,
    click(ctx) {
        //console.log(dbc)
    },
    enter(ctx) {
        element = ctx.element;
    },
};

const dragger = {
    id: 'dragger',
    beforeEvent(chart, args, options) {
        if (handleDrag(args.event, chart)) {
            args.changed = true;
            return;
        }
    }
};

const handleDrag = function (event, nav) {

    if (element) {

        const { canvas, scales:{x} } = nav;

        // left-handle
        if (event.x < element.x + handleSize) {
            canvas.style.cursor = 'col-resize';
            dragMode = 1;
            // right-handle
        } else if (event.x > element.x2 -handleSize) {
            canvas.style.cursor = 'col-resize';
            dragMode = 2;
            // scroll
        } else {
            canvas.style.cursor = 'all-scroll';
        }

        switch (event.type) {
            case 'mousemove':
                return drag(event, x);
            case 'mouseout':
            case 'mouseup':
                lastEvent = undefined;
                element = undefined;
                dragMode = 0;
                canvas.style.cursor = 'default';
                break;
            case 'mousedown':
                dragMode = 0;
                lastEvent = event;
                break;
            default:
        }
    }
};

const drag = function (event, xscale) {

    if (!lastEvent || !element) {
        return;
    }

    const dx = event.x - lastEvent.x;

    // drag handles and resize box
    switch (dragMode) {
        case 1:
            element.x += dx;
            element.width -= dx;
            chart.options.scales.x.min = xscale.getValueForPixel(element.x);
            chart.update('none');
            break;
        case 2:
            element.x2 += dx;
            element.width += dx;
            chart.options.scales.x.max = xscale.getValueForPixel(element.x2);
            chart.update('none');
            break;
        default:
            element.x += dx;
            element.x2 += dx;
            chart.options.scales.x.min = xscale.getValueForPixel(element.x + dx);
            chart.options.scales.x.max = xscale.getValueForPixel(element.x + element.width);
            chart.update('none');
            break;
    }

    // limits
    //console.log(element.x, chart.options.scales.x.min)
    //if(xscale.getValueForPixel(element.x) == 0)
    //    element.x = chart.options.scales.x.min
    //if(element.x2 >= chart.options.scales.x.max)
    //    element.x2 = chart.options.scales.x.max

    lastEvent = event;
    return true;
};




function zoom_box(chart, nav, min, max) {

    //console.log(chart, nav, min, max);
    // min,max are from main chart scales

    //nav.update('none');

    // TODO: fix bug where scales.x.max is a NaN
    //if(isNaN(max))
    //  max = chart.config.data.datasets[0].data[chart.config.data.datasets[0].data.length-1].x;

    // TODO: BUG, add options to scales
    const { ctx, canvas, chartArea: { top, height }, scales: { x } } = nav;

    const r = 5;
    const r2 = 2;

    // resize
    /*canvas.addEventListener('mousedown', (md) => {

        mdv = x.getValueForPixel(md.offsetX);

        const lh = md.offsetX >= x.getPixelForValue(min)-r && md.offsetX <= x.getPixelForValue(min)+r;
        const rh = md.offsetX >= x.getPixelForValue(max)-r && md.offsetX <= x.getPixelForValue(max)+r;
        if(lh || rh) {
            canvas.onmousemove = (e) => {
                // here we need chart 1?
                const timestamp = x.getValueForPixel(e.offsetX);          
                if(lh)
                    chart.options.scales.x.min = new Date(timestamp);  
                else
                    chart.options.scales.x.max = new Date(timestamp); 
                chart.update('none');
                nav.update('none');
                zoom_box_item(
                    chart.options.scales.x.min, 
                    chart.options.scales.x.max
                );
            }
        }
    });*/

}

