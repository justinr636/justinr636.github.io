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

var global_hid = "AVG";

//var global_hid_col = 105;
//var global_date_col = 1;
var global_date_col = -1;
var global_los_start_col = -1;
var global_milk_col = -1;
var global_pharm_col = -1;
var global_discharge_meds_col = -1;
var global_los_end_col = -1;
var global_hid_col = -1;

function validateCSVFile() {
// ensures hard-coded columns for Local and State Reports
// are in the proper location
    for (var i = 0; i < titles.length; i++) {
        var item = titles[i];
        
        if (item == "Date of Audit")
            global_date_col = i;
        else if (item == "If outborn, what day of life was admission to your hospital?     Date of birth is day of life ONE.  ")
            global_los_start_col = i;
        else if (item == "Did infant receive any of his/her mother's own milk at any time during hospitalization?  ")
            global_milk_col = i;
        else if (item == "Did infant receive pharmacologic agents for NAS?")
            global_pharm_col = i;
        else if (item == "What day of life was infant discharged from your hospital?    Day of birth is considered day of life ONE.  ")
            global_los_end_col = i;
        else if (item == "At time of discharge or transfer from  your hospital, was infant receiving medications for NAS?")
            global_discharge_meds_col = i;
        else if (item == "Hospital.ID")
            global_hid_col = i;
        
    }
    
    console.log(global_date_col);
    console.log(global_los_start_col);
    console.log(global_milk_col);
    console.log(global_pharm_col);
    console.log(global_discharge_meds_col);
    console.log(global_los_end_col);
    console.log(global_hid_col);
    
    if (global_date_col  == -1) {
        //console.log("Date of Audit");
        $("#global-date-error").show();
    }
        
    if (global_los_start_col  == -1) {
        //console.log("If outborn, what day of life was admission to your hospital?     Date of birth is day of life ONE.  ");
        $("#global-los-start-error").show();
    }
        
    if (global_milk_col  == -1) {
        //console.log("Did infant receive any of his/her mother's own milk at any time during hospitalization?  ");
        $("#global-milk-error").show();
    }
        
    if (global_pharm_col  == -1) {
        //console.log("Did infant receive pharmacologic agents for NAS?");
        $("#global-pharm-error").show();
    }
        
    if (global_los_end_col  == -1) {
        //console.log("What day of life was infant discharged from your hospital?    Day of birth is considered day of life ONE.  ");
        $("#global-los-end-error").show();
    }
        
    if (global_discharge_meds_col  == -1) {
        //console.log("At time of discharge or transfer from  your hospital, was infant receiving medications for NAS?");
        $("#global-discharge-error").show();
    }
        
    if (global_hid_col  == -1) {
        //console.log("Hospital.ID");
        $("#global-hid-error").show();
    }
        
}