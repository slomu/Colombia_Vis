// set the dimensions and margins of the graph
const margin = {top: 80, right: 25, bottom: 30, left: 100},
  width = 1000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

function arrayMin(arr) {
    var len = arr.length, min = Infinity;
    while (len--) {
        if (arr[len] < min) {
            min = arr[len];
        }
    }
    return min;
};
  
function arrayMax(arr) {
    var len = arr.length, max = -Infinity;
    while (len--) {
        if (arr[len] > max) {
            max = arr[len];
        }
    }
    return max;
};

function format_dataset(d, indicators){
    let dict = [];
    let count = 0;
    //for(let i in d){
    for(let i = 0; i < d.length; i++){
        for(let k in indicators){
            let ind = indicators[k]
            let row = {dep: d[i].dep, variable: ind, value: d[i][ind]};
            //console.log(row)
            dict[count] = row;
            count += 1;
        }
    }
    //console.log(dict)
    return dict;
};

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("https://media.githubusercontent.com/media/slomu/Colombia_Vis/main/data/data.csv").then(function(data) {
    // Labels of row and columns N,Nhh,urban,iwi,iwipov70,iwipov50,iwipov35,gini,qhousing,edyr20,womedyr20,menedyr20,edchild,workwom,agedifmar,infmort
    //const myGroups = Array.from(new Set(data.map(d => d.dep))) //Array.from(new Set(data.map(d => d.group)))
    //const myVars = Array.from(new Set(data.map(d => d.cases))) //Array.from(new Set(data.map(d => d.variable)))
    const myValues = Array.from(new Set(data.map(d => d.population))) //Array.from(new Set(data.map(d => d.value)))

    const departements = {"SANTAFE DE BOGOTA D.C": "DC", "AMAZONAS": "AM", "ANTIOQUIA": "AN", "ARAUCA": "AR", "ATLANTICO": "AT", "BOLIVAR": "BL", "BOYACA": "BY", "CALDAS": "CL", "CAQUETA": "CQ", "CASANARE": "CS", "CAUCA": "CA", "CESAR": "CE", "CHOCO": "CH", "CORDOBA": "CO", "CUNDINAMARCA": "CU", "GUAINIA": "GN", "GUAVIARE": "GV",  "HUILA": "HU", "GUAJIRA": "LG", "MAGDALENA": "MA", "META": "ME", "NARINO": "NA", "NORTE DE SANTANDER": "NS", "PUTUMAYO": "PU", "QUINDIO": "QD", "RISARALDA": "RI", "SAN ANDRES": "SA", "SANTANDER": "ST", "SUCRE": "SU", "TOLIMA": "TO", "VALLE": "VC", "VAUPES": "VP", "VICHADA": "VD"}
    //var dep_abb = Object.values(deps)
    const indicators = ["urban","iwi","iwipov70","iwipov50","iwipov35","gini","qhousing","edyr20","womedyr20","menedyr20","edchild","workwom","agedifmar","infmort"]
    //const departements = Array.from(new Set(data.map(d => d.dep)))
    //const urban = Array.from(new Set(data.map(d => d.urban)))
    //const iwi = Array.from(new Set(data.map(d => d.iwi)))
    //const iwipov70 = Array.from(new Set(data.map(d => d.iwipov70)))
    //const iwipov50 = Array.from(new Set(data.map(d => d.iwipov50)))
    //const iwipov35 = Array.from(new Set(data.map(d => d.iwipov35)))
    //const gini = Array.from(new Set(data.map(d => d.gini)))
    //const qhousing = Array.from(new Set(data.map(d => d.qhousing)))
    //const edyr20 = Array.from(new Set(data.map(d => d.edyr20)))
    //const womedyr20 = Array.from(new Set(data.map(d => d.womedyr20)))
    //const menedyr20 = Array.from(new Set(data.map(d => d.menedyr20)))
    //const edchild = Array.from(new Set(data.map(d => d.edchild)))
    //const workwom = Array.from(new Set(data.map(d => d.workwom)))
    //const agedifmar = Array.from(new Set(data.map(d => d.agedifmar)))
    //const infmort = Array.from(new Set(data.map(d => d.infmort)))

    var dataset = format_dataset(data, indicators);

    //var value_range = function(dataset){
    //    let min = Infinity;
    //    let max = -Infinity;
    //    for(let i = 0; i < dataset.length; i++){
    //        console.log(dataset[i].value)
    //        let arrMin = dataset[i].value;
    //        let arrMax = dataset[i].value;
    //        if(arrMin < min){
    //            min = arrMin;
    //        }
    //        if(arrMax > max){
    //            max = arrMax;
    //        }
    //    }
    //    console.log([min, max])
    //    return [min, max]
    //}
    
    var radius = d3.scaleSqrt()
        .range([3, 20])
        //.domain([arrayMin(dataset.value), arrayMax(dataset.value)])
        .domain([0,100])
        .clamp(true);

    // Build X scales and axis:
    const x = d3.scaleBand()
        .range([ 0, width ])
        .domain(Object.values(departements))
        .padding(0.05);
    svg.append("g")
        .style("font-size", 15)
        //.attr("transform", `translate(0, ${height})`)
        .call(d3.axisTop(x).tickSize(0))
        .select(".domain").remove()

    // Build Y scales and axis:
    const y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(indicators)
        .padding(0.05);
    svg.append("g")
        .style("font-size", 15)
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove()

    // Build color scale
    color = d3.scaleOrdinal(d3.schemeCategory10)

    // create a tooltip
    const tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")
        //.style("top", "200px")

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(event,d) {
        tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    const mousemove = function(event,d) {
        tooltip
            .html("The exact value of<br>this cell is: " + d.population)//d.value)
            .style("left", (event.x)+20 + "px")
            .style("top", (event.y) + "px")
     }
    const mouseleave = function(event,d) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
        .style("stroke", "none")
        .style("opacity", 1)
    }
    //console.log(Object.keys(data))

    svg.selectAll()
        .data(dataset)
        //.data(data, function(d){return dataset(d)})
        //.data(data, function(d){return d.dep+":"+d.urban,d.iwi+":"+d.iwipov70+":"+d.iwipov50+":"+d.iwipov35+":"+d.gini+":"+d.qhousing+":"+d.edyr20+":"+d.womedyr20+":"+d.menedyr20+":"+d.edchild+":"+d.workwom+":"+d.agedifmar+":"+d.infmort})//d.group+':'+d.variable;})  
        .join("circle")
        .attr("cx", function(d) {return x(departements[d.dep])+radius(Infinity)})//.group)+radius(Infinity)})
        .attr("cy", function(d) {return y(d.variable)+radius(Infinity)})
        .attr("r", function(d){return radius(d.value)
        })
        //.attr("cy", function(d) { return y(indicators)+radius(Infinity)})//.variable)+radius(Infinity)})
        //.attr("r", function(d) {  return radius(d.population)} )//d.value)} )
        .style("fill", function(d) { return color(d.variable)} )//d.value)} ) 
        .style("stroke-width", 4)
        .style("stroke", "none")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    // Add title to graph
    svg.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("A d3.js heatmap");

    // Add subtitle to graph
    svg.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 400)
        .text("A short description of the take-away message of this chart.");

})