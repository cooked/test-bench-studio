
// crosshair

function crosshair(chart, mousemove){
    const {canvas, ctx, chartArea: {left, right, top, bottom}} = chart;
    const cx = mousemove.offsetX;
    const cy = mousemove.offsetY; 
    
    if(cx>=left && cx<=right  && cy>=top && cy<=bottom) {
        chart.update('none');
        ctx.restore();
        //canvas.style.cursor = 'crosshair';
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#aaa";
      ctx.setLineDash([2,2]);
      // horizontal
      ctx.beginPath();
      ctx.moveTo(left, cy);
      ctx.lineTo(right, cy);
      ctx.stroke();
      ctx.closePath();
      // vertical
      ctx.beginPath();
      ctx.moveTo(cx, top);
      ctx.lineTo(cx, bottom);
      ctx.stroke();
      ctx.closePath();
      // labels
      crosshair_labels(chart, mousemove);
      // point
      //crosshair_point(chart, mousemove);
    
    } else {
      canvas.style.cursor = 'default';
    }
  }
  
  function crosshair_labels(chart, mousemove) {
    const {ctx, data, chartArea: {left, right, top, bottom}, scales:{x, y}} = chart;
    const cx = mousemove.offsetX;
    const cy = mousemove.offsetY; 
    const tw = ctx.measureText(data.labels[x.getValueForPixel(cx)]);
  
    ctx.beginPath();
    ctx.fillStyle = "#aaa";
    ctx.fillRect(0,cy-10,left,20);
    ctx.closePath();
  
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "white";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(y.getValueForPixel(cy).toFixed(2),left/2, cy);
  
    ctx.beginPath();
    ctx.fillStyle = "#aaa";
    ctx.fillRect(cx-tw/2, bottom, tw, 20);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText(data.labels[x.getValueForPixel(cx)],cx,bottom+10);
    ctx.closePath();
  
  }
  
  function crosshair_point(chart, mousemove) {
    const {ctx, data, chartArea: {left, right, top, bottom, width, height}, scales:{x, y}} = chart;
    const cx = mousemove.offsetX;
    const cy = mousemove.offsetY; 
    
    ctx.beginPath();
    ctx.fillStyle = "#aaa";
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 3;

    const angle = Math.PI / 180;
    
    const ns = x._gridLineItems.length-1;

    console.log(ns)
    
    for(let i=0; i < ns; i++){
        if(cx >= x._gridLineItems[i].tx1 && cx <= x._gridLineItems[i+1].tx1 ) {
            let ys = y.getPixelForValue(data.datasets[0].data[i]);
            let ye = y.getPixelForValue(data.datasets[0].data[i+1]);

            ctx.arc(cx, ys+(ye-ys)/(width/ns)*(cx-x._gridLineItems[i].tx1), 5, angle*0, angle*360,false);

        }
    }
    
    ctx.fill();
    ctx.stroke();
  
  }