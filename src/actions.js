function action_export_csv(args) {
    var data, filename, link;
    var csv = "";
    //for (var i = 0; i < chart.data.datasets.length; i++) {
    csv += data_to_csv({
      datasets: chart.data.datasets,
      labels: chart.data.labels
    });
    //}
    if (csv == null) return;
    console.log(csv);
  
    filename = args.filename || 'chart-data.csv';
    if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
    }
  
    // not sure if anything below this comment works
    data = encodeURI(csv);
    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  }