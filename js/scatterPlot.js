// Author : Tim Karwasz
// This script uses plotly to draw grpahs. Ploty is based on D3

// These consts are used to dynamically create the dropdown metric list
// the key from the object is displayed on the page and the value is used to get the data from the csv
const dropdownMetric = document.getElementById("dropdownMetric");
// change the values here, to add new Metrics (The value must be the name of a column in data.csv)
const dropdownSelections = {
    "Niwi": "niwi",
    "Iwi": "iwi"
}

// same goes for the bubble size dropdown list
const dropdownBubble = document.getElementById("dropdownMetric2");
// change the values here, to add new bubble size metric (The value must be the name of a column in data.csv)
const dropdownBubbleSelections = {
    "Test2": "test2",
}


// placeholder for the data that are read in from the csv
var csvData;


// placeholder for the graph data
var graphData = {
    x: [],
    y: [],
    text: [],
    mode: 'markers',
    marker: {
        // needs default size in the default function
        size: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
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

    // draw the default plot
    Plotly.newPlot('graph', [graphData], template_layout);

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

    // override marker size TODO put a variable from the dataset into here
    // graphData["marker"]["size"] = csvData[value]["$data"]  !!needs to be scaled down/up to a reasonable level!!
    graphData.marker = eval(value);

    // update the graph
    Plotly.react('graph', [graphData], template_layout);
}


// different bubble sizes TODO make these flexible too in function 
var test1 = {
    size: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
};
var test2 = {
    size: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40]
};