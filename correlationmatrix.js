// set the dimensions and margins of the graph
const margin = {top: 20, right: 25, bottom: 30, left: 100}, 
    width = 1250 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

// set initial components
const dep_init = {"SANTAFE DE BOGOTA D.C": "DC", "AMAZONAS": "AM", "ANTIOQUIA": "AN", "ARAUCA": "AR", "ATLANTICO": "AT", "BOLIVAR": "BL", "BOYACA": "BY", "CALDAS": "CL", "CAQUETA": "CQ", "CASANARE": "CS", "CAUCA": "CA", "CESAR": "CE", "CHOCO": "CH", "CORDOBA": "CO", "CUNDINAMARCA": "CU", "GUAINIA": "GN", "GUAVIARE": "GV",  "HUILA": "HU", "GUAJIRA": "LG", "MAGDALENA": "MA", "META": "ME", "NARINO": "NA", "NORTE DE SANTANDER": "NS", "PUTUMAYO": "PU", "QUINDIO": "QD", "RISARALDA": "RI", "SAN ANDRES": "SA", "SANTANDER": "ST", "SUCRE": "SU", "TOLIMA": "TO", "VALLE": "VC", "VAUPES": "VP", "VICHADA": "VD"}
var departements = {"SANTAFE DE BOGOTA D.C": "DC", "AMAZONAS": "AM", "ANTIOQUIA": "AN", "ARAUCA": "AR", "ATLANTICO": "AT", "BOLIVAR": "BL", "BOYACA": "BY", "CALDAS": "CL", "CAQUETA": "CQ", "CASANARE": "CS", "CAUCA": "CA", "CESAR": "CE", "CHOCO": "CH", "CORDOBA": "CO", "CUNDINAMARCA": "CU", "GUAINIA": "GN", "GUAVIARE": "GV",  "HUILA": "HU", "GUAJIRA": "LG", "MAGDALENA": "MA", "META": "ME", "NARINO": "NA", "NORTE DE SANTANDER": "NS", "PUTUMAYO": "PU", "QUINDIO": "QD", "RISARALDA": "RI", "SAN ANDRES": "SA", "SANTANDER": "ST", "SUCRE": "SU", "TOLIMA": "TO", "VALLE": "VC", "VAUPES": "VP", "VICHADA": "VD"}
var indicators = ["infmort","agedifmar","workwom","edchild","menedyr20","womedyr20","edyr20","qhousing","gini","iwipov35","iwipov50","iwipov70","iwi","urban"]
const ind_descriptions = {
    "urban" : "Percentage of population living in urban areas in region",
    "iwi" : "An asset-based wealth index that runs from 0 (no assets) to 100 (all assets) and is comparable across place",
    "iwipov70" : "Percentage of households with an IWI value under 70",
    "iwipov50" : "Percentage of households with an IWI value under 50",
    "iwipov35" : "Percentage of households with an IWI value under 35",
    "gini" : "Gini Index for wealth inequality The more nearly equal a country's income distribution, the lower its Gini index.",
    "qhousing" : "Index for Quality of Housing. Includes house size, internet/phone connection, electricity access and different items like tv, fridge, washing machine, etc.",
    "edyr20" : "Mean years education of adults aged 20+ in region",
    "womedyr20" : "Mean years education of women aged 20+ in region",
    "menedyr20" : "Mean years education of men aged 20+ in region",
    "edchild" : "Percentage of children aged 6-23 that currently attends, or in the current school year attended, school",
    "workwom" : "Percentage of women in paid employment",
    "agedifmar" : "Mean age difference partners (husband-wife)",
    "infmort" : "Number of deaths of children less than one year of age, per 1000 live births in a given year"
}

// update indicators
function get_Indicators(clicked_id){
    const options = ["infmort","agedifmar","workwom","edchild","menedyr20","womedyr20","edyr20","qhousing","gini","iwipov35","iwipov50","iwipov70","iwi","urban"];
    var checked_ind = [];
    
    if(clicked_id == "all_ind"){
        for(let option of options){
            document.getElementById(option).checked = document.getElementById(clicked_id).checked;
        }
    }

    let number = document.getElementById("check_ind").children.length - 2;
    for(let i = 0; i < number; i++){
        let id = options[i];
        if(document.getElementById(id).checked){
            checked_ind.push(id)
        }
    }
    indicators = checked_ind;
    return get_data(indicators, departements);
}

// update departements
function get_Departements(clicked_id){
    const options = {"SANTAFE DE BOGOTA D.C": "DC", "AMAZONAS": "AM", "ANTIOQUIA": "AN", "ARAUCA": "AR", "ATLANTICO": "AT", "BOLIVAR": "BL", "BOYACA": "BY", "CALDAS": "CL", "CAQUETA": "CQ", "CASANARE": "CS", "CAUCA": "CA", "CESAR": "CE", "CHOCO": "CH", "CORDOBA": "CO", "CUNDINAMARCA": "CU", "GUAINIA": "GN", "GUAVIARE": "GV",  "HUILA": "HU", "GUAJIRA": "LG", "MAGDALENA": "MA", "META": "ME", "NARINO": "NA", "NORTE DE SANTANDER": "NS", "PUTUMAYO": "PU", "QUINDIO": "QD", "RISARALDA": "RI", "SAN ANDRES": "SA", "SANTANDER": "ST", "SUCRE": "SU", "TOLIMA": "TO", "VALLE": "VC", "VAUPES": "VP", "VICHADA": "VD"};
    options_keys = Object.keys(options);
    var checked_dep = {};

    if(clicked_id == "all_dep"){
        for(let option of options_keys){
            document.getElementById(option).checked = document.getElementById(clicked_id).checked;
        }
    }

    let number = document.getElementById("check_dep").children.length - 2;
    for(let i = 0; i < number; i++){
        let id = options_keys[i];
        if(document.getElementById(id).checked){
            abb = options[id];
            checked_dep[id] = abb;
        }
    }
    departements = checked_dep;
    console.log(departements)
    return get_data(indicators, departements);
}

get_data = function(indicators, departements){
    d3.csv("https://media.githubusercontent.com/media/slomu/Colombia_Vis/main/data/data.csv").then(function(data) {

        // update Datapoints
        const click_ind = function(event, d, dataset){
            filtered = dataset.filter(obj => {
                return obj.variable === d
            })
            ordered = filtered.sort(function(a, b){return b.value - a.value});
            console.log(ordered);
        }

        // create Data
        function format_dataset(d, indicators, departements){
            let dict = [];
            let count = 0;
            console.log(d)
            filtered = d.filter(obj => {
                return Object.keys(departements).includes(obj.dep)
            })
            console.log(filtered)
            for(let i = 0; i < filtered.length; i++){
                for(ind of indicators){
                    let row = {};
                    //let ind = indicators[k];
                    if(ind == "gini"){
                        row = {dep: filtered[i].dep, variable: ind, value: parseFloat((filtered[i][ind] * 100))};
                    }else{
                        row = {dep: filtered[i].dep, variable: ind, value: parseFloat(filtered[i][ind])};
                    }
                    dict[count] = row;
                    count += 1;
                }
            }
            return dict;
        };

        // tooltip for indicator axis
        // create tooltip
        const tooltip_ind = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover_ind = function(event) {
            tooltip_ind
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
        }

        const mousemove_ind = function(event,d) {
            tooltip_ind
                .html("Indicator: " + d
                    + "<br>Description: " + ind_descriptions[d]
                )
                .style("left", (event.x)+20 + "px")
                .style("top", (event.y) + "px")
        }
        const mouseleave_ind = function(event) {
            tooltip_ind
                .style("opacity", 0)
            d3.select(this)
            .style("stroke", "None")
        }

        // tooltip for datapoints
        // create tooltip
        const tooltip_data = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover_data = function(event,d) {
            console.log("Hello")
            tooltip_data
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("fill-opacity", .8)
        }

        const mousemove_data = function(event,d) {
            tooltip_data
                .html("Departement: " + d.dep 
                    + "<br>Indicator: " + d.variable 
                    + "<br>Value: " + Math.round((d.value + Number.EPSILON) * 100) / 100
                )
                .style("left", (event.x)+20 + "px")
                .style("top", (event.y) + "px")
        }
        const mouseleave_data = function(event,d) {
            tooltip_data
                .style("opacity", 0)
            d3.select(this)
            .style("stroke", function(d) { return color(d.variable)})
            .style("fill-opacity", 0.1)
        }

        // draw the graph
        function draw(data, indicators, departements){

            // append the svg object to the body of the page
            d3.select("#my_dataviz").select("svg").remove()

            const svg = d3.select("#my_dataviz")
                .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

            var dataset = format_dataset(data, indicators, departements);
            console.log(dataset);

            // Build Y scales and axis:
            const y = d3.scaleBand()
                .range([height, 0])
                .domain(indicators)
                .padding(0.05);
            svg.append("g")
                .style("font-size", 15)
                .call(d3.axisLeft(y).tickSize(0))
                .select(".domain").remove()
            svg.selectAll('g.tick')
                    .on("mouseover", mouseover_ind)
                    .on("mousemove", mousemove_ind)
                    .on("mouseleave", mouseleave_ind)   
                    .on("click", click_ind)
            
            // Build X scales and axis:
            const x = d3.scaleBand()
                .range([0, width])
                .domain(Object.values(departements))
                .padding(0.05);
            svg.append("g")
                .style("font-size", 15)
                .call(d3.axisTop(x).tickSize(0))
                .select(".domain").remove()

            // Scale for bubble sizes
            var radius = d3.scaleLinear()
                .range([5, Math.min(x.bandwidth()/2, y.bandwidth()/2)])
                .domain([0,100])
                .clamp(true);

            // Build color scale
            color = d3.scaleOrdinal(d3.schemeCategory10)

            // draw Bubbles
            svg.selectAll()
                .data(dataset)
                .join("circle")
                .attr("cx", function(d) {return x(dep_init[d.dep])+x.bandwidth()/2})
                .attr("cy", function(d) {return y(d.variable)+y.bandwidth()/2})
                .attr("r", function(d){return radius(d.value)})
                .style("fill", function(d) { return color(d.variable)} )
                .style("fill-opacity", 0.1)
                .style("stroke", function(d) { return color(d.variable)} )
                .style("stroke-width", 4)
                .on("mouseover", mouseover_data)
                .on("mousemove", mousemove_data)
                .on("mouseleave", mouseleave_data);
            return(svg.node());
        }

        draw(data, indicators, departements);
    })
}

get_data(indicators, departements)