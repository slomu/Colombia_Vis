// Author : Tim Karwasz
// This script uses plotly to draw grpahs. Ploty is based on D3

// These consts are used to dynamically create the dropdown metric list
// the key from the object is displayed on the page and the value is used to get the data from the csv
const dropdownMetric = document.getElementById("dropdownMetric");
// change the values here, to add new Metrics (The value must be the name of a column in data.csv)
const dropdownSelections = {
    "Number of Cases Aggregation Mean International Wealth Index score of region": "niwi",
    "Mean International Wealth Index (IWI) score of region": "iwi"
}

// same goes for the bubble size dropdown list
const dropdownBubble = document.getElementById("dropdownMetric2");
// change the values here, to add new bubble size metrics (The value must be the name of a column in data.csv)
const dropdownBubbleSelections = {
    "Mean years education of women aged 20+": "womedyr20",
    "Mean years education of men aged 20+": "menedyr20",
}


// placeholder for the data that are read in from the csv
var csvData;


// placeholder for the graph data
var graphData = {
    x: [],
    y: [],
    customdata: [],
    hovertemplate: '<i>X Value</i>: %{x:.2f}<extra></extra>' +
                   '<br><i>Y Value</i>: %{y:.2f}' +
                   '<br><i>Z Value</i>: %{customdata:.2f}' +
                   '<br><i>Department</i>: %{text}',
    text: [],
    mode: 'markers',
    marker: {
        // needs default size in the default function
        size: [],
        color: []
    }
};


// placeholder for the layout, so that we dont need to create a new one all the time
var template_layout = {
    showlegend: false,
    height: 600,
    width: 600,
    title: {
        text: 'Cases of domestic violence vs Gini Index',
        font: {
            family: 'Courier New, monospace',
            size: 20
        },
    },
    xaxis: {
        title: {
            text: 'Domestic Violene Cases per 1000 population',
            font: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
            }
        },
    },
    yaxis: {
        title: {
            text: 'y Axis',
            font: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
            }
        }
    }
};


// the plot object, this is needed for the events
var myPlot = document.getElementById('graph'),
    data = graphData,
    layout = template_layout;


// read data.csv
dfd.readCSV("../data/data.csv")
    .then(df => {
        callback(df)
    }).catch(err => {
        console.log(err);
    })


// get the data in the global vars
function callback(res) {
    csvData = res;
}


// give  the callback time to get the data to the global vars
setTimeout(function() {
    defaultLayout();
}, 100);


// this function draws the default graph the page starts out with
function defaultLayout() {

    // this creates the dropdown values in the html
    for (let key in dropdownSelections) {
        let option = document.createElement("option");
        option.setAttribute('value', dropdownSelections[key]);

        let optionText = document.createTextNode(key);
        option.appendChild(optionText);

        dropdownMetric.appendChild(option);
    }

    for (let key in dropdownBubbleSelections) {
        let option = document.createElement("option");
        option.setAttribute('value', dropdownBubbleSelections[key]);

        let optionText = document.createTextNode(key);
        option.appendChild(optionText);

        dropdownBubble.appendChild(option);
    }

    // add data to the x axis
    graphData["x"] = csvData["norm"]["$data"];

    // add data to the y axis
    graphData["y"] = csvData["gini"]["$data"];

    // add y axis label
    template_layout["yaxis"]["title"]["text"] = "gini"

    // add data to the hover box
    graphData["text"] = csvData["dep"]["$data"];

    // set default bubble size
    graphData["marker"]["size"] = scaleDataValuesAndReturn(csvData["electr"]["$data"]);

    // save the original value in the customdata array
    graphData["customdata"] = csvData["electr"]["$data"];

    // set the color of the bubbles based on their size
    graphData["marker"]["color"] = returnColorArray(graphData["marker"]["size"]);

    // draw the default plot
    Plotly.newPlot('graph', [graphData], template_layout);

    myPlot.on('plotly_hover', function(data) {

        // find the data which can be accessed
        console.log(data["points"][0]);

        //alert(`You hovered over point number ${data["points"][0]["pointNumber"]} with an x value of ${data["points"][0]["x"]} and a y value of ${data["points"][0]["y"]}, the text reads ${data["points"][0]["text"]} `);
    });

}


// function to switch out data, it gets the current value from the dropdown menu on change and then creates the new graph
function changeData(value) {

    // add new data for y to the graphData
    graphData.y = csvData[value]["$data"];

    // add new y axis label 
    template_layout["yaxis"]["title"]["text"] = value;

    // and a new title
    template_layout["title"]["text"] = `Cases of domestic violence vs ${value} Index`;

    // update the graph
    Plotly.react('graph', [graphData], template_layout);
}


// function to control bubble size
function changeBubbleSize(value) {

    // change marker size to the metric chosen by the user
    graphData["marker"]["size"] = scaleDataValuesAndReturn(csvData[value]["$data"]);

    // save the original value in the customdata array
    graphData["customdata"] = csvData[value]["$data"];

    // update marker color as it depends on the size of the bubbles
    graphData["marker"]["color"] = returnColorArray(graphData["marker"]["size"]);

    // update the graph
    Plotly.react('graph', [graphData], template_layout);
}


// this function takes an array as input and returns the same array scaled to a pre-defined range (10-60)
function scaleDataValuesAndReturn(dataArray) {

    // input array
    var input = dataArray;

    // output array
    var output = [];

    input.forEach(function(number) {
        output.push(convertRange(number, [Math.min.apply(null, input), Math.max.apply(null, input)], [10, 70]))
    });

    return output;

}


// this small helper function takes a value and the range that value is in, 
// as well as the range the value shall be in after the function call and converts the value 
function convertRange(value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}


// this function takes a data array containg bubble sizes and returns a array containing color values
function returnColorArray(dataArray) {

    var input = dataArray;

    var output = [];

    input.forEach(function(number) {
        output.push(setColorBasedOnValue(number))
    });

    return output;
}


// returns a color value, the color is based on the size of the bubble
function setColorBasedOnValue(value) {
    return value > 58 ? '#bd0026' :
        value > 46 ? '#f03b20' :
        value > 34 ? '#fd8d3c' :
        value > 22 ? '#feb24c' :
        value >= 10 ? '#fed976' :
        'blue';
}

