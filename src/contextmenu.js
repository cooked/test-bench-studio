// context menu

// event position
var px, py;

const cm = document.getElementById('ctx-menu');
const cm_ins = document.getElementById("insert");
const cm_edit = document.getElementById("edit");
const cm_rm = document.getElementById("remove");

const m_add = document.getElementById("menu-add");
const m_add_time = document.getElementById("add-time");
const m_add_spd = document.getElementById("add-speed");
const m_add_trq = document.getElementById("add-torque");
const m_add_rmp = document.getElementById("add-ramp");
const m_add_dur = document.getElementById("add-duration");

const m_add_ok = document.getElementById("add-ok");
const m_add_cancel = document.getElementById("add-cancel");


cm_edit.addEventListener('click', (e) => {
    console.log("edit");
});

cm_rm.addEventListener('click', (e) => {
    del_point(chart, points[0]);
});

cm_ins.addEventListener('click', (e2) => {

    m_add.style.display = 'block';

    console.log(points_n)

    // if nearest is after
    var index = points_n[0].index;
    //if(px - data.datasets[index] > 0)
    //  index += 1;

    m_add_time.value = parseInt(px);
    m_add_spd.value = parseInt(py);
    // TODO: torque, take the one of the nearest points
    //m_add_trq.value = ...;
    m_add_rmp.value = parseInt(5);

    
    m_add_cancel.addEventListener('click', (e_nok) => {
    // TODO: clear fields and close
    m_add.style.display = 'none';
    });

});

// add point ok
m_add_ok.addEventListener('click', (e_ok) => {
    // TODO: prepare points
    
    // TODO: add points
    //chart.data.labels.splice(index, 0, px);
    //chart.data.datasets.forEach(el => { el.data.splice(index, 0, e.dataY); });
    //chart.update();
    
    m_add.style.display = 'none';
    // remove listeners
    //cm_ins.removeEventListener('click',)
});
