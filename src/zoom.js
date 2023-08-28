// zoom box

let element;
let lastEvent;
let dragMode; // 0:none, 1:left-handle, 2:right-handle, 3:scroll
let dbc = false;
let handleSize = 10;

let tmin, tmax; // full width

let box = {
    type: 'box',
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 1,
    enter(ctx) {
        element = ctx.element;
    },
};

const resetNav = {
    id: 'resetNav',
    beforeEvent: (ch, evt, opts) => {
        if(evt.event.type == 'dblclick') {
            chart.options.scales.x.min = tmin;
            chart.options.scales.x.max = tmax;
            chart.update('none');
            chart2.options.scales.x.min = tmin;
            chart2.options.scales.x.max = tmax;
            chart2.update('none');
        }
    }
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
