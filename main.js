var w = 900;
var h = 700;
var centered;

var margin = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
};

var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;


var scale = 190000,
    latitude = 37.8,
    longitude = 123.0;

var projection = d3.geoAlbers()
    .scale( scale )
    .rotate([longitude, 0])
    .center([0, latitude])
    .translate( [width/2 - 1600  ,height/2-250] );

//Define default path generator
var path = d3.geoPath()
    .projection(projection);



var svg = d3.select("#map")
    .append("svg")
    .attr("id", "map")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("tranform", "translate(0" + margin.left + "," + margin.top + ")");

var color;
var year;
var type;
var year_temp
var type_temp
var center_dis_value
var center_dis_name
var zoom_flag = false
var chartsvg
var chart_data_temp = [2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019]





d3.csv("data.csv", function(data){

    d3.json("SF_Neighborhoods.geojson", function(json){

        function ColorValue(year,type){

            if (type == 1){
                for(var i = 0; i < (data.length); i++){
                    var datadistrict = data[i].District;
                    var dataValue = parseFloat(data[i][year]);
                    // console.log(dataValue)
                    for(var n = 0; n < json.features.length; n++){
                        var jsondistrict = json.features[n].properties.Name;
                        if(datadistrict == jsondistrict){
                            json.features[n].properties.value = dataValue;
                            // console.log(json.features[n].properties.value)
                            break;
                        }
                    }
                }
            }

            if (type == 2){
                for(var i = (data.length/3); i < 2*(data.length/3); i++){
                    var datadistrict = data[i].District;
                    var dataValue = parseFloat(data[i][year]);
                    // console.log(dataValue)
                    for(var n = 0; n < json.features.length; n++){
                        var jsondistrict = json.features[n].properties.Name;
                        if(datadistrict == jsondistrict){
                            json.features[n].properties.value = dataValue;
                            // console.log(json.features[n].properties.value)
                            break;
                        }
                    }
                }

            }

            if (type == 3){
                for(var i = 2*(data.length/3); i < data.length; i++){
                    var datadistrict = data[i].District;
                    var dataValue = parseFloat(data[i][year]);
                    // console.log(dataValue)
                    for(var n = 0; n < json.features.length; n++){
                        var jsondistrict = json.features[n].properties.Name;
                        if(datadistrict == jsondistrict){
                            json.features[n].properties.value = dataValue;
                            //  console.log(json.features[n].properties.value)
                            break;
                        }
                    }
                }
            }
        }





        function Color(d){

            var type = type_temp
            if (type == 1){
                var color = d3.scaleSequential(d3.interpolateRdYlBu).domain([1400 , 100]);
            }

            if (type == 2){
                var color = d3.scaleThreshold()
                    .domain([100, 300, 500, 800, 1000, 1300 ])
                    .range([d3.interpolateGreens(0), d3.interpolateGreens(0.2), d3.interpolateGreens(0.4),d3.interpolateGreens(0.5)
                        , d3.interpolateGreens(0.6),d3.interpolateGreens(0.8),d3.interpolateGreens(1)])
            }

            if (type == 3){
                var color = d3.scaleThreshold()
                    .domain([100, 300, 500, 800, 1000, 1300 ])
                    .range([d3.interpolateReds(0), d3.interpolateReds(0.2), d3.interpolateReds(0.4),d3.interpolateReds(0.5)
                        , d3.interpolateReds(0.6),d3.interpolateReds(0.8),d3.interpolateReds(1)]);
            }

            var value = d.properties.value;

            if(value >= 0){
                //If value exists
                return color(value);
            } else {
                return "#ccc"
            }
        }


        function ColorLegend(type){


            //  legend for Price/SqFt
            var sequentialScale = d3.scaleSequential(d3.interpolateRdYlBu).domain([1400,100]);

            d3.select("svg").append("g")
                .attr("class", "legend1")
                .attr("transform", "translate(30,30)");
            var legend1 = d3.legendColor()
                .shapeWidth(3)
                .cells(100)
                .ascending(true)
                .orient("horizontal")
                .scale(sequentialScale)
                .shapePadding(0)
                .labels(function({
                                     i,
                                     genLength,
                                     generatedLabels,
                                     labelDelimiter
                                 }) {
                    if (i === 0) {
                        const values = generatedLabels[i].split(` ${labelDelimiter} `)
                        return "$1400"
                    }
                    else if (i === Math.round(genLength/4)) {
                        const values = generatedLabels[i].split(` ${labelDelimiter} `)
                        return "$1075"
                    }
                    else if (i === Math.round(genLength/2)) {
                        const values = generatedLabels[i].split(` ${labelDelimiter} `)
                        return "$750"
                    }
                    else if (i === Math.round(genLength*3/4)) {
                        const values = generatedLabels[i].split(` ${labelDelimiter} `)
                        return "$425"
                    }
                    else if (i === genLength - 1) {
                        const values = generatedLabels[i].split(` ${labelDelimiter} `)
                        return "$100"
                    }
                    return ""
                })

            //  legend for # of New Constructions

            var color2 = d3.scaleThreshold()
                .domain([10, 20, 30, 50, 100, 200])
                .range([d3.interpolateGreens(0), d3.interpolateGreens(0.2), d3.interpolateGreens(0.4),d3.interpolateGreens(0.5)
                    , d3.interpolateGreens(0.6),d3.interpolateGreens(0.8),d3.interpolateGreens(1)]);

            var thresholdScale2 = d3.scaleThreshold()
                .domain([10, 20, 30, 50, 100, 200])
                .range([d3.interpolateGreens(0), d3.interpolateGreens(0.2), d3.interpolateGreens(0.4),d3.interpolateGreens(0.5)
                    , d3.interpolateGreens(0.6),d3.interpolateGreens(0.8),d3.interpolateGreens(1)]);


            d3.select("svg").append("g")
                .attr("class", "legend2")
                .attr("transform", "translate(20,45)scale(1.5)");

            var legend2 = d3.legendColor()
                .labelFormat(d3.format("d"))
                .labels(d3.legendHelpers.thresholdLabels)
                .scale(thresholdScale2)
            // d3.select("svg").select(".legend2")
            // .call(legend2);

            //  legend for # of Residential/Commercial

            var color3 = d3.scaleThreshold()
                .domain([10, 20, 30, 40, 50, 60])
                .range([d3.interpolateReds(0), d3.interpolateReds(0.2), d3.interpolateReds(0.4),d3.interpolateReds(0.5)
                    , d3.interpolateReds(0.6),d3.interpolateReds(0.8),d3.interpolateReds(1)]);

            var thresholdScale3 = d3.scaleThreshold()
                .domain([10, 20, 30, 40, 50, 60])
                .range([d3.interpolateReds(0), d3.interpolateReds(0.2), d3.interpolateReds(0.4),d3.interpolateReds(0.5)
                    , d3.interpolateReds(0.6),d3.interpolateReds(0.8),d3.interpolateReds(1)]);


            d3.select("svg").append("g")
                .attr("class", "legend3")
                .attr("transform", "translate(20,45)scale(1.5)");

            var legend3 = d3.legendColor()
                .labelFormat(d3.format("d"))
                .labels(d3.legendHelpers.thresholdLabels)
                .scale(thresholdScale3)

            // d3.select("svg").select(".legend1")
            //   .call(legend1);

            type = type_temp;

            if (type == 1){
                d3.select("svg").select(".legend2").remove(legend2);
                d3.select("svg").select(".legend3").remove(legend3);
                d3.select("svg").select(".legend1").call(legend1);
            }
            if (type == 2){
                d3.select("svg").select(".legend1").remove(legend1);
                d3.select("svg").select(".legend3").remove(legend3);
                d3.select("svg").select(".legend2").call(legend2);
            }
            if (type == 3){
                d3.select("svg").select(".legend1").remove(legend1);
                d3.select("svg").select(".legend2").remove(legend2);
                d3.select("svg").select(".legend3").call(legend3);
            }
        }





        var main = svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "#ccc")
            .attr("stroke-width",2)

        var g = main.append("g")




        function update(year,type){

            slider.property("value", year);

            d3.select(".year").text("Year: "+year);
            ColorValue(year,type)
            year_temp = year
            type_temp = type

            main.style("fill", Color);
        }



        function update_center_value(d){
            year = year_temp
            type = type_temp

            ColorValue(year,type)
            for(var n = 0; n < d.length; n++){
                if (d[n].properties.Name == center_dis_name){
                    center_dis_value = d[n].properties.value
                }
            }
        }

        // slider

        var slider = d3.select(".slider")
            .append("input")
            .attr("type", "range")
            .attr("min", 2009)
            .attr("max", 2019)
            .attr("step", 1)
            .attr("class","slider")
            .on("input", function(){

                var year = this.value
                var year_temp = year

                var type = type_temp

                update(year,type)
                update_center_value(json.features)

                if (zoom_flag){
                    DonutChart()
                    Chart_hightlight(year,type,chart_data_temp)
                }

            })

        //
        // // Button
        //
        // var button = d3.select("#price")
        //     .on("click.chart", function() {
        //         var type = 1;
        //         var year = year_temp
        //
        //         d3.selectAll(".button")
        //             .classed("selected",false);
        //         d3.select(this)
        //             .classed("selected",true);
        //
        //         update(year,type)
        //         ColorLegend(type)
        //
        //         if (zoom_flag == 1){
        //             d3.select('#chart').selectAll('svg > *')
        //                 .transition()
        //                 .duration(10)
        //                 .remove()
        //         }
        //
        //     })

        // var button = d3.select("#newbuilt")
        //     .on("click.chart", function() {
        //         var type = 2;
        //         var year = year_temp
        //
        //         d3.selectAll(".button")
        //             .classed("selected",false);
        //         d3.select(this)
        //             .classed("selected",true);
        //         update(year,type)
        //         ColorLegend(type)
        //
        //         if (zoom_flag == 1){
        //             d3.select('#chart').selectAll('svg > *')
        //                 .transition()
        //                 .duration(10)
        //                 .remove()
        //         }
        //
        //     })
        //
        // var button = d3.select("#ratio")
        //     .on("click.chart", function() {
        //         var type = 3;
        //         var year = year_temp
        //
        //         d3.selectAll(".button")
        //             .classed("selected",false);
        //         d3.select(this)
        //             .classed("selected",true);
        //         update(year,type)
        //         ColorLegend(type)
        //
        //         if (zoom_flag == 1){
        //             d3.select('#chart').selectAll('svg > *')
        //                 .transition()
        //                 .duration(10)
        //                 .remove()
        //         }
        //
        //     })



        //   Transitions
        main
            .on("mouseover",mouseover)
            .on("mouseout",mouseout)
            .on('click', clicked);



        function mouseover(d){

            type = type_temp
            year = year_temp
            ColorValue(year,type)

            d3.select(this).style('fill', 'yellow');

            d3.select('svg').append("g")
                .append("text")
                .attr("class","hover_text")
                .attr('x', 470)
                .attr('y', 470)
                .attr('font-size',20)
                .attr('font-family', "Cambria")
                .attr('font-weight',"bold")
                .text(d.properties.Name)


            type = type_temp
            //console.log(d.properties.value)
            if (type == 1){smalltext("Price/SqFt: $"+ d.properties.value)};

        }

        function mouseout(d){

            // d3.select(this).style('fill', Color);
            d3.select(this).style('fill', function(d){
                if( centered == d){
                    return "#D5708B";
                } else {
                    return Color(d)
                }
            })

            d3.select('svg').selectAll(".hover_text").transition()
                .duration(1)
                .style("opacity", 0)
                .remove()
        }


        function clicked(d) {
            var x, y, k;

            // Compute centroid of the selected path
            if (d && centered !== d) {
                var centroid = path.centroid(d);
                x = centroid[0];
                y = centroid[1];
                k = 5;
                centered = d;

                center_dis_name = d.properties.Name;
                DonutChart(d)
                Chart(d)

                zoom_flag = true;
                // dx = w/4
                // dy = h/4

            } else {
                x = width / 2;
                y = height / 2;
                k = 1;
                dx = 0
                dy = 0
                centered = null;

                d3.select('#chart').selectAll("svg > *")
                    .transition()
                    .duration(100)
                    .style("opacity", 0)
                    .remove()

                function reset(){
                    return chart_data_temp = [2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019]
                };
                reset()

                d3.select('#donutchart').selectAll("svg > *")
                    .transition()
                    .duration(100)
                    .style("opacity", 0)
                    .remove()

                // console.log(chart_data_temp)

                zoom_flag = false;

            }

            type = type_temp
            year = year_temp
            ColorValue(year,type)

            // // Highlight the clicked province

            d3.select('svg').selectAll('path')
                .style('fill', function(d){return centered && d===centered ? '#D5708B' : Color});
            // .style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});

            d3.select('svg').selectAll('Path')
                .transition()
                .ease(d3.easeLinear)
                .duration(1500)
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')')

            d3.select('svg').selectAll('circle')
                .transition()
                .ease(d3.easeLinear)
                .duration(1500)
              //  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')')
             .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')translate(' + 0 + ',' + 0 + ')');

        }

        function smalltext(text){
            var stext = d3.select('svg')
                .append("g")
                .append('text')
                // .classed('big-text', true)
                .attr("class","hover_text")
                .attr('x', 470)
                .attr('y', 490)
                .attr('font-size',20)
                .attr('font-family', "Cambria")
                // .attr('font-weight',"bold")
                .text(text);
        }


        update(2009,1)
        ColorLegend(1)
        d3.select("#price")
            .classed("selected",true);








        //////////////////////
        //////////////////////
        /////   Chart /////////////


        var chartsvg = d3.select("#chart").append("svg")
            .attr("width", 1400)
            .attr("height", 350)

        function Chart(d){

            // console.log(d)

            var chartmargin = {top: 20, right: 20, bottom: 30, left: 50};
            var chartwidth = 400;
            var chartheight = 300;

            d3.select("#chart").selectAll("svg > *")
                .transition()
                .duration(10)
                .style("opacity",0)
                .remove

            type = type_temp
            current_year = year_temp
            data_temp = [1];


            if (type == 1){
                data_current_district = data.filter(function(row){return row["District"] == center_dis_name && row["type"] == "price"})
            }
            if (type == 2){
                data_current_district = data.filter(function(row){return row["District"] == center_dis_name && row["type"] == "newbuilt"})
            }
            if (type == 3){
                data_current_district = data.filter(function(row){return row["District"] == center_dis_name && row["type"] == "ratio"})
            }


            allvalue = []
            for (var i = 2009; i < 2020; i++){
                allvalue.push(+data_current_district[0][i])
            }
            domain_max = d3.max(allvalue)*1.3


            // console.log(allvalue)
            // console.log(d3.max(allvalue))

            for (var year = 2009; year < 2020; year++){

                ColorValue(year,type)


                var xscale = d3.scaleLinear().range([chartmargin.left, chartmargin.left+chartwidth]).domain([2008, 2019]);
                var yscale_range = d3.scaleLinear().range([chartmargin.top+chartheight, chartmargin.top]);
                var yscale = yscale_range.domain([0, domain_max]);

                var dx = xscale(year);
                var dy = yscale(d.properties.value);

                // console.log("##")


                var g = chartsvg
                    .selectAll("dots")
                    .data(data_temp).enter()
                    .append("rect")
                    // .filter(function(d){return d.type == datatype})
                    .attr("class","bar")
                    .attr("width", 30)
                    .attr("x", 900 + (dx-30/2))
                    .attr("y", dy)
                    .attr("height", chartmargin.top+chartheight-dy)
                    // .attr("height", chartmargin.top+chartheight-dy)
                    .attr("fill",function(d){
                        if (type == 1 && current_year != year){return "steelblue"}
                        if (type == 2 && current_year != year){return "lightseagreen"}
                        if (type == 3 && current_year != year){return "coral"}
                        // else {return "yellow"}
                        if (current_year == year){return "yellow"}
                    })

                if (current_year == year){
                    chartsvg
                        .append("text")
                        .attr("class","temp_text")
                        .attr('x', 900 + (dx-30/2))
                        .attr('y', dy-10)
                        .attr('font-size',20)
                        .attr('font-family', "Cambria")
                        .attr('font-weight',"bold")
                        .text(d.properties.value)
                }
            }


            var x_axis = d3.axisBottom().scale(xscale)
                .tickFormat(d3.format("d"))
                .tickSize(10)
                .ticks(9)
            var y_axis = d3.axisLeft().scale(yscale)
                .tickSize(10)
                .tickPadding(5)

            var xaxis = chartsvg.append("g")
            // .attr('class','chart_layer')
                .attr('transform', 'translate(' + 900 + ',' + (chartmargin.top + +chartheight) + ')')
                .call(x_axis);

            var yaxis = chartsvg.append("g")
            // .attr('class','chart_layer')
                .attr('transform', 'translate(' + 950  + ',' + 0 + ')')
                .call(y_axis);

            districtName = d.properties.Name


            d3.select("#chart").select('svg')
                .append('rect')
                .attr('x',960)
                .attr('y',20)
                .attr('height', 35)
                .attr('width',400)
                .attr('fill',"#464646")
                .attr('rx',10)
                .attr('ry',10)

            chartsvg
                .append("text")
                .attr('x', 970)
                .attr('y', 45)
                .attr('font-size',20)
                .attr('font-family', "Cambria")
                .attr('font-weight',"bold")
                .attr('fill','#fff')
                .text(function(d){
                    if (type == 1){return "Price Trend (Move 'Year' slider)"}

                })
            // d3.select("#chart").select("svg").selectAll("text")
            // .transition()
            // .duration(10000)
            // .style("opacity",0.1)


        }



        function Chart_hightlight(year, type){

            var chartmargin = {top: 20, right: 20, bottom: 30, left: 50};
            var chartwidth = 400;
            var chartheight = 300;


            year = year_temp;
            type = type_temp;

            if (type == 1){
                data_current_district = data.filter(function(row){return row["District"] == center_dis_name && row["type"] == "price"})
            }
            if (type == 2){
                data_current_district = data.filter(function(row){return row["District"] == center_dis_name && row["type"] == "newbuilt"})
            }
            if (type == 3){
                data_current_district = data.filter(function(row){return row["District"] == center_dis_name && row["type"] == "ratio"})
            }


            allvalue = []
            for (var i = 2009; i < 2020; i++){
                allvalue.push(+data_current_district[0][i])
            }
            domain_max = d3.max(allvalue)*1.3

            var xscale = d3.scaleLinear().range([chartmargin.left, chartmargin.left+chartwidth]).domain([2008, 2019]);
            var yscale_range = d3.scaleLinear().range([chartmargin.top+chartheight, chartmargin.top]);
            var yscale = yscale_range.domain([0, domain_max]);

            ColorValue(year,type)

            dx = xscale(year);
            dy = yscale(center_dis_value);

            // d3.selectAll("rect")

            // console.log(chart_data_temp)

            d3.select("#chart").select('svg')
                .selectAll('.bar')
                .data(chart_data_temp)
                .attr("fill", function(d){
                    if (type == 1 ){return "steelblue"}
                    if (type == 2 ){return "lightseagreen"}
                    if (type == 3 ){return "coral"}
                })
            d3.select("#chart").select('svg')
                .selectAll('.temp_text')
                .remove()


            d3.select("#chart").select('svg')
                .selectAll("de")
                .data([1])
                .enter().append("rect")
                .attr("class","bar")
                .attr("width", 30)
                .attr("x", 900+ dx-30/2)
                .attr("y", dy)
                .attr("height", chartmargin.top+chartheight-dy)
                .attr("fill","yellow")


            d3.select("#chart").select('svg')
                .append("text")
                .attr("class","temp_text")
                .attr('x', 900+ dx-30/2)
                .attr('y', dy-10)
                .attr('font-size',20)
                .attr('font-family', "Cambria")
                .attr('font-weight',"bold")
                .text(center_dis_value)

            chart_data_temp.push(1)


        }




        ///////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////
        ////////////      DonutChart //////////////////////
        var donut = d3.select("#donutchart")
            .append('svg')
            .attr('width',450)
            .attr('height', 380);


        function DonutChart(){

            // d3.select("#donutchart").selectAll("*")
            //   // .transition()
            //   //   .duration(10)
            //   //   .style("opacity", 0)
            //   .remove()

            year = year_temp
            Dname = center_dis_name

            var width = 450;
            var height = 500;
            var margin = {top:20,right:20,bottom:20,left:20};
            var thickness = 100;
            var duration = 500;
            var radius = Math.min(350, 250) / 2;
            // var color = d3.scaleOrdinal(d3.schemeCategory10);
            var colorcode = ["#ff7f00", "#4daf4a", "#e41a1c", "#984ea3", "#3771b8"];
            // var colorcode = ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3"];
            var color = d3.scaleOrdinal(colorcode);
            var donutdata = [];
            d3.json("type_count.json",function(donutjson){
                // console.log(donutjson[year][Dname])
                var donutdata = [
                    {name: "R1", value: +donutjson[year][Dname]["R1"]},
                    {name: "R2", value: +donutjson[year][Dname]["R2"]},
                    {name: "R3", value: +donutjson[year][Dname]["R3"]},
                    {name: "R4", value: +donutjson[year][Dname]["R4"]+donutjson[year][Dname]["A"]},
                    {name: "CD", value: +donutjson[year][Dname]["CD"]},
                ];
                // var donut = d3.select("#donutchart")
                // .append('svg')
                // .attr('width', width + margin.left+margin.right)
                // .attr('height', height+margin.top+margin.bottom);

                var g = donut.append('g').attr('transform', 'translate(150,190)');
                // .attr('transform', 'translate(' + (width/2-margin.left*1) + ',' + (height/2+margin.top*2 ) + ')');


                var arc = d3.arc()
                    .innerRadius(radius - thickness)
                    .outerRadius(radius)
                // .padAngle(0.015);

                var pie = d3.pie()
                    .value(function(d) { return d.value; })
                    .sort(null);

                var donutpath = g.selectAll('path')
                    .data(pie(donutdata))
                    .enter()
                    .append('path')
                    .attr('d', arc)
                    .attr('fill', (d,i) => color(i))

                d3.selectAll("path").attr('class', 'pie')

                d3.select("#donutchart").select('svg')
                    .append('rect')
                    .attr('x',50)
                    .attr('y',0)
                    .attr('height', 35)
                    .attr('width',1000)
                    .attr('fill',"#464646")
                    .attr('rx',10)
                    .attr('ry',10)

                d3.select("#donutchart").select('svg')
                    .append("text")
                    // .attr("class","temp_text")
                    .attr('x', 50)
                    .attr('y', margin.top+5)
                    .attr('font-size',20)
                    .attr('font-family', "Cambria")
                    .attr('font-weight',"bold")
                    .text("Type Distribution for " + Dname)
                    .attr('fill',"#fff")




                //legend

                var resicode = ["1-family", "2-family", "3-family", "4/more family", "Condo"];
                var legendpadding = 3
                var legendx = 0.8*width
                var legendheight = 15
                var legendwidth = 20
                for(var i = 0; i < 5; i++){
                    var colorhex = colorcode[i]
                    var legendy = (height)*0.4-i*(legendheight+legendpadding)-10
                    addlegend()
                }
                for(var i = 0; i < 5; i++){
                    var colorhex = colorcode[i]
                    var Text = resicode[i]
                    var legendx = 4/5*width + 1.3*legendwidth
                    var legendy = (height)*0.4+legendheight*2/3-i*(legendheight+legendpadding)-10
                    addtext()
                }
                function addlegend(){
                    d3.select("#donutchart").select('svg')
                        .append('rect')
                        .attr("fill",colorhex)
                        .attr("x",legendx)
                        .attr("y",legendy)
                        .attr("height",legendheight)
                        .attr("width",legendwidth)}
                function addtext(){
                    d3.select("#donutchart").select('svg')
                        .append('text')
                        .attr("x",legendx)
                        .attr("y",legendy)
                        .attr('font-size',10)
                        .attr('font-weight','bold')
                        .attr('font-family','Cambria')
                        .text(Text)
                }




            })
        }

        /////////////////////////////////////////////
        ////////////////////////////////////////////
        ///////////////////////////////////////////
        /////    Landmark Dot Map  /////////////////
        /////////////////////////////////////////
        /////////////////////////////////////

        function landmark(){
            d3.json("SF_Landmarks.geojson", function(landjson){

                // console.log(landjson.features[0])

                dataset = {
                    Name: [],
                    CenterX: [],
                    CenterY: []
                }
                for(var n = 0; n < landjson.features.length; n++){

                    var LandmarkName = landjson.features[n].properties.Name_of_Pr;
                    var centroid = path.centroid(landjson.features[n]);
                    landjson.features[n].properties.center = centroid;
                    x = centroid[0];
                    y = centroid[1];

                    dataset.Name.push(LandmarkName)
                    dataset.CenterX.push(x)
                    dataset.CenterY.push(y)
                };

                var div = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

                var aa =  svg.selectAll("a")
                    .data(landjson.features)
                    .enter()
                    .append("circle")
                    .attr("class","land_circle")

                    .attr("cx", function(d,i){return dataset["CenterX"][i]})
                    .attr("cy", function(d,i){return dataset["CenterY"][i]})
                    .attr("r",3)
                    .attr("fill","green")
                    .attr("opacity",0.7)
                    .attr("stroke","black")

                    .on("mouseover", function(d,i) {
                        div.transition()
                            .duration(200)
                            .style("color", "red")
                            .style("opacity", 0.8);
                        div.html(dataset["Name"][i])
                            .style("left", (d3.event.pageX-10 ) + "px" )
                            .style("top", (d3.event.pageY-10 )+ "px" );
                    })
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(100)
                            .style("opacity", 0);
                    });

                d3.selectAll('.land_circle')
                    .transition()
                    .duration(1000)
                    .style("r",5)
                    .transition()
                    .duration(1000)
                    .style("r",3)

            });
        }

        var land_flag = 0
        // landmark()
        var button = d3.select("#landmark")
            .on("click.chart", function() {

                if (land_flag == 0 && zoom_flag == false){
                    landmark()
                    land_flag = 1
                    d3.select(this)
                        .classed("selected",true);
                }
                else{
                    d3.selectAll(".land_circle")
                        .remove()
                    land_flag = 0
                    d3.select(this)
                        .classed("selected",false);
                }

            })


        ///////////////////////////////////////////
        //////////////////////////////////////////
        /////////////////////////////////////////
        ///    Public School Dot Map  /////////////////
        ///////////////////////////////////////
        ///////////////////////////////////

        function school(){
            d3.json("SF_schools.geojson", function(schooljson){

                dataset = {
                    Name: [],
                    CenterX: [],
                    CenterY: []
                }
                for(var n = 0; n < schooljson.features.length; n++){

                    var SchoolName = schooljson.features[n].properties.SCH_NAME;
                    var centroid = path.centroid(schooljson.features[n]);
                    schooljson.features[n].properties.center = centroid;

                    x = centroid[0];
                    y = centroid[1];

                    dataset.Name.push(SchoolName)
                    dataset.CenterX.push(x)
                    dataset.CenterY.push(y)
                };

                var div = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

                var aa =  svg.selectAll("a")
                    .data(schooljson.features)
                    .enter()
                    .append("circle")
                    .attr("class","school_circle")

                    .attr("cx", function(d,i){return dataset["CenterX"][i]})
                    .attr("cy", function(d,i){return dataset["CenterY"][i]})
                    .attr("r",3)
                    .attr("fill","#23F2FC")
                    .attr("opacity",0.8)
                    .attr("stroke","black")

                    .on("mouseover", function(d,i) {
                        div.transition()
                            .duration(200)
                            .style("opacity", 0.8);
                        div.html(dataset["Name"][i])
                            .style("left", (d3.event.pageX-10 ) + "px" )
                            .style("color", "red")
                            .style("top", (d3.event.pageY-10 )+ "px" );

                    })
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(100)
                            .style("opacity", 0);
                    });

                d3.selectAll('.school_circle')
                    .transition()
                    .duration(1000)
                    .style("r",5)
                    .transition()
                    .duration(1000)
                    .style("r",3)

            });
        }


        var school_flag = 0
        var button = d3.select("#school")
            .on("click.chart", function() {

                if (school_flag == 0 && zoom_flag == false){
                    school()
                    school_flag = 1
                    d3.select(this)
                        .classed("selected",true);
                }
                else{
                    d3.selectAll(".school_circle")
                        .remove()
                    school_flag = 0
                    d3.select(this)
                        .classed("selected",false);
                }

            })

    });

})