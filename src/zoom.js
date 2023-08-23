// zoom box

function zoom_box(chart, nav, min, max) {
    
    // min,max are from main chart scales

    nav.update('none');

    // TODO: fix bug where scales.x.max is a NaN
    if(isNaN(max))
      max = chart.config.data.datasets[0].data[chart.config.data.datasets[0].data.length-1].x;

    // TODO: BUG, add options to scales
    const { ctx, canvas, chartArea: { top, height }, scales: { x } } = nav;

    const r = 5; 
    const r2 = 2;

    function zoom_box_item(min, max) {
        // rect
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = 'rgba(54, 162, 235, 0.2)';
        ctx.fillRect(x.getPixelForValue(min), top, x.getPixelForValue(max) - x.getPixelForValue(min), height);
        ctx.closePath();
        ctx.restore();
        // handles
        function zoom_box_handle(pos) {
            const angle = Math.PI /180;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(54, 162, 235, 1)';
            ctx.fillStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.arc(pos, height/2, r, 0, angle*360, false);
            ctx.moveTo(pos-r2,height/2+r2);
            ctx.lineTo(pos-r2,height/2-r2);
            ctx.moveTo(pos+r2,height/2+r2);
            ctx.lineTo(pos+r2,height/2-r2);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        zoom_box_handle(x.getPixelForValue(min));
        zoom_box_handle(x.getPixelForValue(max));
    }
    zoom_box_item(min, max);
    console.log("zoombox");

    // cursor
    canvas.addEventListener('mousemove', (mm) => {
        
        mmv = x.getValueForPixel(mm.offsetX);

        /*if(mmv >= min-r && mmv <= min+r ||
           mmv >= max-r && mmv <= max+r) {
            canvas.style.cursor = 'ew-resize';
        } else if(  mmv > min+r && 
                    mmv < max-r) {
            canvas.style.cursor = 'move';
        } else {
            canvas.style.cursor = 'default';
        }*/
        if(mm.offsetX >= x.getPixelForValue(min)-r && mm.offsetX <= x.getPixelForValue(min)+r ||
           mm.offsetX >= x.getPixelForValue(max)-r && mm.offsetX <= x.getPixelForValue(max)+r) {
            canvas.style.cursor = 'ew-resize';
        } else if(  mm.offsetX > x.getPixelForValue(min)+r && 
                    mm.offsetX < x.getPixelForValue(max)-r) {
            canvas.style.cursor = 'move';
        } else {
            canvas.style.cursor = 'default';
        }
    });

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
    });
    canvas.addEventListener('mouseup', (e) => {
        canvas.style.cursor = 'default';
        canvas.onmousemove = null;
    });*/
    
}

