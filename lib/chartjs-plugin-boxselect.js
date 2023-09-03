
function getOption(chart, category, name) {
	return Chart.helpers.valueOrDefault(chart.options.plugins.boxselect[category] ? chart.options.plugins.boxselect[category][name] : undefined, defaultOptions[category][name]);
}
function getXScale(chart) {
	return chart.data.datasets.length ? chart.scales[chart.getDatasetMeta(0).xAxisID] : null;
}
function getYScale(chart) {
	return chart.scales[chart.getDatasetMeta(0).yAxisID];
}

function doSelect(chart, startX, endX, startY, endY) {
	// swap start/end if user dragged from right to left
	if (startX > endX) {
		var tmp = startX;
		startX = endX;
		endX = tmp;
	}
	if (startY > endY) {
		var tmp = startY;
		startY = endY;
		endY = tmp;
	}

	var datasets = [];
	// filter dataset
	for (var datasetIndex = 0; datasetIndex < chart.data.datasets.length; datasetIndex++) {
		
		const sourceDataset = chart.data.datasets[datasetIndex];

		var selectedDataset = {
			dsi: datasetIndex,
			data: [],
			indexes: []
		};

		// iterate data points
		for (var dataIndex = 0; dataIndex < sourceDataset.data.length; dataIndex++) {

			var dataPoint = sourceDataset.data[dataIndex];
			let inX = true;
			if (startX == null); else {
				inX = (dataPoint.x >= startX && dataPoint.x <= endX);
			}
			let inY = true;
			if (startY == null); else {
				inY = (dataPoint.y >= startY && dataPoint.y <= endY);
			}

			if (inX && inY) {
				selectedDataset.data.push({ ...dataPoint });
				selectedDataset.indexes.push(dataIndex);
			}
		}
		datasets.push(selectedDataset);
	}

	// create highlight dataset
	datasets.forEach(dataset => {
		let xyData = [];
		for (let i = 0; i < dataset.data.length; i++) {
			const index = dataset.indexes[i];
			const xyPoint = chart.data.datasets[dataset.dsi].data[index];
			xyData.push({ ...xyPoint });
		}
		chart.data.datasets.push(
			{
				data: xyData,
				label: 'highlighted',
				borderColor: chart.data.datasets[dataset.dsi].borderColor,
				type: 'line',
				yAxisID: chart.data.datasets[dataset.dsi].yAxisID,
				borderWidth: 3,
				radius: 0,
			}
		)
	});

	chart.update();

	return datasets;
}

var boxselectPlugin = {

	id: 'boxselect',
	defaults: {},

	afterInit: function (chart) {

		if (chart.config.options.scales.x.length == 0) {
			return
		}

		chart.boxselect = {
			enabled: false,
			x: null,
			y: null,
			dragStarted: false,
			dragStartX: null,
			dragEndX: null,
			dragStartY: null,
			dragEndY: null,
			suppressTooltips: false,
			selection: null
		};

	},

	afterEvent: function (chart, e) {

		e = e.event

		var chartType = chart.config.type;
		if (chartType !== 'scatter' && chartType !== 'line') return;

		// fix for Safari
		var buttons = (e.native.buttons === undefined ? e.native.which : e.native.buttons);
		if (e.native.type === 'mouseup') {
			buttons = 0;
		}

		// handle mouse click to clear existing selection
		if (e.native.type === 'click' && chart.boxselect.selection) {
			chart.data.datasets.pop();
			chart.data.datasets.pop();
			chart.update();
			chart.boxselect.selection = null;
		}
			
		// handle drag to select (begin)
		if (buttons === 1 && !chart.boxselect.dragStarted) {
			chart.boxselect.dragStartX = e.x;
			chart.boxselect.dragStartY = e.y;
			chart.boxselect.dragStarted = true;
		}

		// handle drag to select (end)
		if (chart.boxselect.dragStarted && buttons === 0) {
			chart.boxselect.dragStarted = false;

			var xScale = getXScale(chart);
			var startX = xScale.getValueForPixel(chart.boxselect.dragStartX);
			var endX = xScale.getValueForPixel(chart.boxselect.x);
			var startY = null;
			var endY = null;
			
			if (Math.abs(chart.boxselect.dragStartX - chart.boxselect.x) > 1 && Math.abs(chart.boxselect.dragStartY - chart.boxselect.y) > 1) {
				chart.boxselect.selection = doSelect(chart, startX, endX, startY, endY);
			}
		}

		chart.boxselect.x = e.x;
		chart.boxselect.y = e.y;

		chart.draw();
	},

	afterDraw: function (chart) {

		// draw the box
		if (chart.boxselect.dragStarted) {

			chart.ctx.save();
			chart.ctx.beginPath();
			let xStart = chart.boxselect.dragStartX;
			let yStart = chart.boxselect.dragStartY;
			let xSize = chart.boxselect.x - chart.boxselect.dragStartX;
			let ySize = chart.boxselect.y - chart.boxselect.dragStartY;
			
			var yScale = getYScale(chart);
			yStart = yScale.getPixelForValue(yScale.max);
			ySize = yScale.getPixelForValue(yScale.min) - yScale.getPixelForValue(yScale.max);

			chart.ctx.rect(xStart, yStart, xSize, ySize);
			chart.ctx.setLineDash([]);
			chart.ctx.fillStyle = 'rgba(185,200,200, 0.2)';
			chart.ctx.fill();
			chart.ctx.closePath();
			chart.ctx.restore();
		}

		return true;
	},

};