// import, export
function load_file(file) {

    fetch('./api/some.json').then(

        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }

            // Examine the text in the response
            response.text().then(function (data) {
                console.log(data);
            });
        }

    ).catch(function (err) {

        console.log('Fetch Error :-S', err);

    });
}

function data_to_csv(args) {
    let result, colDelimiter, rowDelimiter, labels, data;

    labels = args.labels;
    ds = args.datasets;

    colDelimiter = args.colDelimiter || ',';
    rowDelimiter = args.rowDelimiter || '\n';

    result = ''

    for (let i = 0; i < labels.length; i++) {
        result += labels[i];
        for (let j = 0; j < ds.length; j++) {
            result += colDelimiter;
            result += ds[j].data[i];
        }
        result += rowDelimiter;
    }

    return result;

}

function data_to_bnf(args) {

}

async function load_csv(delimiter = ',') {
    const labels = [];
    const value = [];

    let data;

    const file = new File('http://127.0.0.1:5500/data/epa/uddscol.txt');
    const url = 'https://www.epa.gov/sites/default/files/2015-10/uddscol.txt';

    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;
        console.log(contents);
    };
    reader.readAsText(file);

    /*let myObject = await fetch(url, { 
        mode: "cors", 
        method: 'GET',
        headers: {
            "Accept": 'application/text',
            "Access-Control-Allow-Origin" : "*"
        },
        //credentials: "omit"
    });
    let myText = await myObject.text();
    console.log(myObject);*/

    /*fetch(url, { mode: "no-cors"})
        .then( r => r.text() )
        .then( t => {
            const d = data.split('\n');
            table.forEach(row => {
                const col = row.split(delimiter);
                labels.push(col[0]);
                value.push(col[1]);
            });

            console.log(t)
        } )*/

}

function parse_epa(data, dlm_col = ',', dlm_row = '\r\n', skip = 1) {

    var time = [];
    var value = [];

    const d = data.split(dlm_row);
    d.forEach(row => {
        // process it, if not empty
        if (row) {
            const col = row.split(dlm_col);
            time.push(col[0]);
            value.push(col[1]);
        }
    });

    // header
    time.splice(0, skip);
    value.splice(0, skip);

    return [time, value];
}
