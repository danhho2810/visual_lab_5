// CHART INIT ------------------------------
let type = d3.select('#group-by').node().value
let coffee_shop;

// MARGIN CONVENTION
const margin = ({top: 50, right: 50, bottom: 50, left: 50})
const width = 700 - margin.left - margin.right
 	height = 650 - margin.top - margin.bottom

// create svg with margin convention
const svg = d3
	.select(".chart")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// create scales without domains
let xScale = d3
	.scaleBand()
  	.rangeRound([0, width])
  	.paddingInner(0.1)
let yScale = d3
	.scaleLinear()
  	.range([height, 0])

// create axis 
let xAxis = d3
	.axisBottom()
  	.scale(xScale)
let yAxis = d3
	.axisLeft()
  	.scale(yScale)

// create axis container
let xAxisConst = svg
	.append("g")
	.attr("class", "axis x-axis")
let yAxisConst = svg
	.append("g")
	.attr("class", "axis y-axis")

let group = d3.select('#group-by').node()
group.addEventListener('change', function(event) {
	type = group.value
	coffee_shop.sort((a,b)=> b[type]-a[type])
	update(coffee_shop, type)
})

let sort_button = document.querySelector("#sort");
sort_button.addEventListener("click", function (event) {
	if (coffee_shop[0][type] > coffee_shop[1][type]) {
		coffee_shop.sort((a, b) => parseFloat(a[type] - b[type]));
	} else {
		coffee_shop.sort((a, b) => parseFloat(b[type] - a[type]));
	}
	update(coffee_shop, type);
});

svg
	.append("text")
	.attr("class", "y-axis-title")
	.attr("x", 15)
	.attr("y", -10)
	.attr("dy", ".1em")
	.style("text-anchor", "end")

// CHART UPDATE FUNCTION -------------------
function update(data, type) {
	let key = (d) => d.company;
	// Update domains
	xScale.domain(coffee_shop.map(d=>d.company))
	yScale.domain([0, d3.max(data, d=>d[type])])
	
	xAxisConst.call(xAxis)
	yAxisConst.call(yAxis)
	
	// update bars
	svg.select("g").attr("transform", `translate(0, ${height})`)
	let bars = svg.selectAll('.bar').data(data, key)
	bars.exit().remove();
	bars.enter()
		.append('rect')
		.attr('class', 'bar')
		.attr('x', d=>xScale(d.company))
		.attr('y', d=>yScale(d[type]))
		.attr('title', d=>d.company)
		.attr('width', d=>xScale.bandwidth(d.company))
		.attr('height',d=>height-yScale(d[type]))
		.merge(bars)
		.transition()
		.duration(1000)
		.attr('x', d=>xScale(d.company))
		.attr('y', d=>yScale(d[type]))
		.attr('width', d=>xScale.bandwidth(d.company))
		.attr('height',d=>height-yScale(d[type]))
		

	// Update axes and axis title
	if (type == 'revenue') {
		svg
		.select('.y-axis-title')
		.attr("x", margin.left-10)
		.attr("y", margin.top-65)
		.text("Billion USD");
	} else {
		svg
		.select('.y-axis-title')
		.attr("x", margin.left-25)
		.attr("y", margin.top-65)
		.text("Stores");
	}
	}

// CHART UPDATES ---------------------------
// Loading data
d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{
	coffee_shop = data.sort((a,b) => b[type] - a[type])
	console.log(coffee_shop)
	update(coffee_shop, type)
  })