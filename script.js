const m = {top: 50, bottom: 50, left: 60, right: 50};
const h = 500 - m.top - m.bottom;
const w = 1400 - m.left - m.right;
const months = {
    2: "January",
    3: "February",
    4: "March",
    5: "April",
    6: "May",
    7: "June",
    8: "July",
    9: "August",
    10: "September",
    11: "October",
    12: "November",
    1: "December"
}

const svg = d3.select("body")
    .append("svg")
    .attr("width", w + m.left + m.right)
    .attr("height", h + m.top + m.bottom)
    .append("g")
    .attr("transform", `translate(${m.left}, ${m.top})`);

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
.then(response => response.json())
.then(data => {
    const years = d3.max(data.monthlyVariance, d => d.year) - d3.min(data.monthlyVariance, d => d.year);
    const baseTemp = data.baseTemperature;

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
        .attr("x", d => xScale(new Date(d.year, "0")))
        .attr("y", d => yScale(new Date(2020, d.month)) - 52)
        .attr("width", w / years)
        .attr("height", h / 12)
        .attr("fill", d => (baseTemp + d.variance) <= 3.9 ? "#4372af" : 
            (baseTemp + d.variance) <= 5.0 ? "#71a8cb" : 
            (baseTemp + d.variance) <= 6.1 ? "#a7d4e4" : 
            (baseTemp + d.variance) <= 7.2 ? "#d9ecf1" :
            (baseTemp + d.variance) <= 8.3 ? "#f6f6b8" : 
            (baseTemp + d.variance) <= 9.5 ? "#f5d88b" :
            (baseTemp + d.variance) <= 10.6 ? "#f5aa5f" :
            (baseTemp + d.variance) <= 11.7 ? "#ec6b41" : "#d13126")
        .on("mouseover", function(event, d) {
            const xPos = xScale(new Date(d.year, d.month));
            const yPos = yScale(new Date(2020, d.month)) - 122;

            svg.append("text")
                .attr("class", "tooltip")
                .attr("x", xPos)
                .attr("y", yPos)
                .text(`${d.year} - ${months[d.month]}`)
                .attr("fill", "white")
                .append("tspan")
                .text(`${(baseTemp + d.variance).toFixed(1)}`)
                .attr("x", xPos)
                .attr("y", yPos + 20)
                .attr("fill", "white")
                .append("tspan")
                .text(`${(d.variance).toFixed(1)}`)
                .attr("x", xPos)
                .attr("y", yPos + 40)
                .attr("fill", "white");
            
            const text = svg.select(".tooltip");
            const bbox = text.node().getBBox();
            const padding = 8;

            svg.insert("rect", ".tooltip")
                .attr("class", "tooltip")
                .attr("x", bbox.x - padding)
                .attr("y", bbox.y - padding)
                .attr("width", bbox.width + padding * 2)
                .attr("height", bbox.height + padding * 2)
                .attr("fill", "black")
                .attr("rx", 10)
                .attr("ry", 10);

            d3.select(this)
                .attr("stroke", "black")
                .attr("stroke-width", 2);
        })
        .on("mouseout", function(event, d) {
            d3.select(this)
                .attr("stroke", "none");
            svg.selectAll(".tooltip").remove();
        })
})