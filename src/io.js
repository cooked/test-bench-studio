// import, export

// https://developer.chrome.com/articles/file-system-access/
async function saveFile(blob, suggestedName) {

  // Feature detection
  const supportsFileSystemAccess =
    'showSaveFilePicker' in window &&
    (() => {
      try {
        return window.self === window.top;
      } catch {
        return false;
      }
    })();

  // if File System Access API is supported
  if (supportsFileSystemAccess) {
    try {
      // Show the file save dialog.
      const handle = await showSaveFilePicker({ suggestedName });
      // Write the blob to the file.
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (err) {
      // Fail silently if the user has simply canceled the dialog.
      if (err.name !== 'AbortError') {
        console.error(err.name, err.message);
        return;
      }
    }
  }

  // if not supported... Create the blob URL.
  const blobURL = URL.createObjectURL(blob);
  // Create the `<a download>` element and append it invisibly.
  const a = document.createElement('a');
  a.href = blobURL;
  a.download = suggestedName;
  a.style.display = 'none';
  document.body.append(a);
  // Programmatically click the element.
  a.click();
  // Revoke the blob URL and remove the element.
  setTimeout(() => {
    URL.revokeObjectURL(blobURL);
    a.remove();
  }, 1000);

}

async function loadFile() {
  // Open file picker and destructure the result the first handle
  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  return file;
}

// parsers, converters

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

function ds_to_csv(ds) {
  // export datasets to a csv file (assuming time series) 

  let nds = ds.length;
  let npt = ds[0].data.length;

  const colDelimiter = ',';
  const rowDelimiter = '\n';

  let = result = '';

  for (let i = 0; i < npt; i++) {
    // add time
    result += ds[0].data[i].x;
    // add data
    for (let j = 0; j < nds; j++) {
      result += colDelimiter;
      result += ds[j].data[i].y;
    }
    result += rowDelimiter;
  }
  return result;

}