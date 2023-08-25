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

var idx;

cm_edit.addEventListener('click', (e) => {
    console.log("edit");
});

cm_rm.addEventListener('click', (e) => {
    del_point(chart, points[0]);
});

cm_ins.addEventListener('click', (e) => {

    m_add.style.display = 'block';

    // TODO:  if nearest is after
    idx = points_n[0].index;
    //if(px - data.datasets[index] > 0)
    //  index += 1;

    m_add_time.value = 1;//parseInt(px);
    m_add_spd.value = 1500; //parseInt(py);
    // TODO: torque, take the one of the nearest points
    m_add_trq.value = 3;
    m_add_rmp.value = parseInt(1);
    m_add_dur.value = parseInt(5);

});


m_add_cancel.addEventListener('click', (e) => {
    // TODO: clear fields and close
    m_add.style.display = 'none';
});

m_add_ok.addEventListener('click', (e) => {

    // prepare points
    var t1 = chart.data.datasets[0].data[idx].x + m_add_time.value*1000;
    var t2 = m_add_rmp.value * 1000;
    var t3 = m_add_dur.value * 1000;
    var v1 = chart.data.datasets[0].data[idx].y;
    var v2 = m_add_spd.value;
    var q1 = chart.data.datasets[1].data[idx].y;
    var q2 = m_add_trq.value;

    console.log( t1, t2, t3);
    //speed
    chart.data.datasets[0].data.splice(idx+1, 0, 
        {x: (t1),          y:v1   },
        {x: (t1+t2),       y:v2   },
        {x: (t1+t2+t3),    y:v2   }
    );
    // torque
    chart.data.datasets[1].data.splice(idx+1, 0, 
        {x: (t1),          y:q1   },
        {x: (t1+t2),       y:q2   },
        {x: (t1+t2+t3),    y:q2   }
    );
    // shift array elements
    for(var i=idx+3; i<chart.data.datasets[0].data.length; i++) {
        chart.data.datasets[0].data[i].x += (t1+t2+t3);
        chart.data.datasets[1].data[i].x += (t1+t2+t3);
    }
    chart.update();

    console.log(chart.data.datasets[0].data)

    m_add.style.display = 'none';

});
