var margin = { top: 20, right: 50, bottom: 30, left: 50 };
var width = 960;
var height = 450;
//var width = 960;
//var height = 927

var csvArray = [];  // Stores CSV
var titles = [];    // Stores CSV Column Headers
var allHids = [];   // Stores Unique Hospital IDs
var chartOptions = [];

function drawChart(opts) {
    var chartType = opts.options.chartType;
    
    if (chartType == 1) {           // Draw Run Chart
        drawRunChart(customizeCSVData(opts.options, opts.Y_COL, opts.X_COL, opts.HID_COL, opts.START_DATE, opts.END_DATE),
                 opts.titles, opts.width, opts.height, opts.selector);
    } else if (chartType == 2) {    // Draw Box Plot
    } else if (chartType == 3) {    // Draw Funnel Plot
        drawFunnelPlot(customizeCSVData(opts.options, opts.Y_COL, opts.X_COL, opts.HID_COL, opts.START_DATE, opts.END_DATE),
                   opts.titles, opts.width, opts.height, opts.selector);
    } else if (chartType == 4) {    // Draw Bar Chart
    }
    
}

var global_hid = 0;
var global_hid_col = 105;
var global_date_col = 1;