const m = {top: 50, bottom: 50, left: 60, right: 50};
const h = 400 - m.top - m.bottom;
const w = 1500 - m.left - m.right;

const svg = d3.select("body")
    .append("svg")
    .attr("width", w + m.left + m.right)
    .attr("height", h + m.top + m.bottom)
    .append("g")
    .attr("transform", `translate(${m.left}, ${m.top})`);

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
.then(response => response.json())
.then(data => {
    const xScale = d3.scaleTime()
        .domain([d3.min(data.monthlyVariance, d => new Date(d.year, d.month)), d3.max(data.monthlyVariance, d => new Date(d.year, d.month))])
        .range([0, w]);
    
    const yScale = d3.scaleTime()
        .domain([new Date(2019, 11, 15), new Date(2020, 11, 15)])
        .range([0, h]);

    svg.append("g")
        .attr("transform", `translate(0, ${h})`)
        .call(d3.axisBottom(xScale).ticks(20));

    svg.append("g")
        .attr("transform", `translate(0, 0)`)
        .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B")));

    svg.selectAll("rect")
        .data(data.monthlyVariance)
        .enter()
        .append("rect")
        .attr("x",  w / data.monthlyVariance.length)
        .attr("y", h / 12)
        .attr("width", w / data.monthlyVariance.length)
        .attr("height", h / 12)
        .attr("fill", d => d.variance > 0 ? "red" : "blue");
})