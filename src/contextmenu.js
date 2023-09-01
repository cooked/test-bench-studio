// context menu

// event position
var px, py;

const cm = document.getElementById('ctx-menu');
const cm_ins = document.getElementById("insert");
const cm_edit = document.getElementById("edit");
const cm_rm = document.getElementById("remove");

// add ramp
const m_add = document.getElementById("menu-add");
let m_add_dly = document.getElementById("add-dly");
let m_add_acc = document.getElementById("add-acc");
let m_add_cru = document.getElementById("add-cru");
let m_add_dec = document.getElementById("add-dec");
let m_add_spd = document.getElementById("add-spd");
let m_add_trq = document.getElementById("add-trq");

const m_add_ok = document.getElementById("add-ok");
const m_add_cancel = document.getElementById("add-cancel");

var idx;
var el;

var t1,t2,t3,t4;
var v1,v2,v3,v4;
var q1,q2,q3,q4;
var va,qa;

// document
document.addEventListener("click", () => {
    cm.style.display = 'none';
});

cm_edit.addEventListener('click', (e) => {
    console.log("edit");
});

cm_rm.addEventListener('click', (e) => {
    del_point(chart, points[0]);
});

cm_ins.addEventListener('click', (e) => {

    m_add.style.display = 'block';

    el = points_n[0];
    idx = el.index;

    if(data.datasets[0].data[idx].x - px > 0) {
        idx -= 1;
    }

    // use time of prev point
    m_add_dly.value = 0; //chart.data.datasets[el.datasetIndex].data[idx].x;
    m_add_acc.value = parseInt(1);
    m_add_cru.value = parseInt(2);
    m_add_dec.value = parseInt(1);

    m_add_spd.value = 1500; ////parseInt(px);, parseInt(py);
    m_add_trq.value = 3;
    
    // TODO: torque, take the one of the nearest points
    
});


m_add_cancel.addEventListener('click', (e) => {
    // TODO: clear fields and close
    m_add.style.display = 'none';
});

m_add_ok.addEventListener('click', (e) => {

    var toff = m_add_dly.value * 1000;
    // prepare points
    t1 = chart.data.datasets[0].data[idx].x + toff 
    t2 = t1 + m_add_acc.value * 1000;
    t3 = t2 + m_add_cru.value * 1000;
    t4 = t3 + m_add_dec.value * 1000;

    var v1 = chart.data.datasets[0].data[idx].y;    // speed of prev point
    var v2 = m_add_spd.value;                       //  
    var v3 = chart.data.datasets[0].data[idx+1].y;  // speed of next point

    var q1 = chart.data.datasets[1].data[idx].y;
    var q2 = m_add_trq.value;
    var q3 = chart.data.datasets[1].data[idx+1].y;

    // speed and torque
    va = [
        {x: t2, y: v2},
        {x: t3, y: v2},
        {x: t4, y: v3}
    ];
    qa = [
        {x: t2, y: q2},
        {x: t3, y: q2},
        {x: t4, y: q3}
    ];
    if(m_add_dly.value != 0) {
        va.unshift({x: t1, y: v1});
        qa.unshift({x: t1, y: q1});
    }

    var l1 = va.length;                                 // ramp points
    var l2 = l1 + chart.data.datasets[0].data.length;   // total points
    while(va.length) {
        chart.data.datasets[0].data.splice(idx+1, 0, va.pop())
        chart.data.datasets[1].data.splice(idx+1, 0, qa.pop())
    }

    // shift array elements that come after
    for(var i=idx+l1+1; i<l2; i++) {
        chart.data.datasets[0].data[i].x += (t4-t1+toff);
        chart.data.datasets[1].data[i].x += (t4-t1+toff);
    }

    // adjust scale
    tmax = chart.data.datasets[0].data[ chart.data.datasets[0].data.length-1 ].x;
    chart.options.scales.x.max = tmax;
    chart.update();

    // update nav
    chart2.data.datasets[0].data = chart.data.datasets[0].data;
    chart2.options.scales.x.max = tmax;
    chart2.options.plugins.annotation.annotations.box.xMax = tmax;
    chart2.update();


    //console.log(chart.data.datasets[0].data);

    m_add.style.display = 'none';

});
