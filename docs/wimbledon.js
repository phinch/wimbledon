//round,aces,winners,errors,distance
$("document").ready(function(){
    d3.csv("./docs/round_differential_raw.csv", function(data){
        var svg = d3.select("#content").append("svg").attr("height", 500).attr("width", 1200),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

        var x = d3.scaleBand().rangeRound([0, width]).padding(0.1).paddingInner(0.4),
            y = d3.scaleLinear().rangeRound([height, 0]);

        var z = d3.scaleOrdinal()
            .range(["#077F18", "#764C82", "#F5C52C"]);

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(function(d) { return d.round; }));
        y.domain([0, 70]);

        var min_dist = d3.min(data, function(d){ return parseFloat(d.distance);});
        var max_dist = d3.max(data, function(d){ return parseFloat(d.distance);});
        var min_errors = d3.min(data, function(d){ return parseFloat(d.errors);});
        var max_errors = d3.max(data, function(d){ return parseFloat(d.errors);});
        var min_aces = d3.min(data, function(d){ return parseFloat(d.aces);});
        var max_aces = d3.max(data, function(d){ return parseFloat(d.aces);});

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(5))
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")

        // create filter with id #drop-shadow
        // height=130% so that the shadow is not clipped
        var filter = svg.append("filter")
            .attr("id", "drop-shadow")

        // SourceAlpha refers to opacity of graphic that this filter will be applied to
        // convolve that with a Gaussian with standard deviation 3 and store result
        // in blur
        filter.append("feGaussianBlur")
            .attr("in", "SourceGraphic")
            .attr("stdDeviation", 8)
            .attr("result", "blur")

        // translate output of Gaussian blur to the right and downwards with 2px
        // store result in offsetBlur
        filter.append("feOffset")
            .attr("in", "SourceGraphic");

        // overlay original SourceGraphic over translated blurred opacity by using
        // feMerge filter. Order of specifying inputs is important!
        var feMerge = filter.append("feMerge");

        feMerge.append("feMergeNode")
            .attr("in", "blur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        g.selectAll(".aces")
            .data(data)
            .enter().append("rect")
            .attr("class", "aces")
            .attr("x", function(d) { return x(d.round) + x.bandwidth()/16*11; })
            .attr("y", function(d) { 
                var aces = parseFloat(d.aces);

                if(aces == min_aces){

                    d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .text(Math.round(aces*10)/10)
                        .style("top", (y(aces)+$("svg").offset().top-10) + "px")
                        .style("left", (x(d.round) + x.bandwidth()/16*11 + $("svg").offset().left+37)+"px")
                }
                if(aces == max_aces){
                    d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .text(Math.round(aces*10)/10)
                        .style("top", (y(aces)+$("svg").offset().top-10) + "px")
                        .style("left", (x(d.round) + x.bandwidth()/16*11 + $("svg").offset().left+37)+"px")
                }

                return y(aces); 
            })
            .attr("width", x.bandwidth()/4)
            .attr("height", function(d) { return height - y(parseFloat(d.aces)); })
            .attr("fill-opacity", function(d){
                var aces = parseFloat(d.aces);
                if(aces == min_aces){
                    return 1;
                }else if(aces == max_aces){
                    return 0.35;
                }
                return 0.7;
            })
            .style("fill", "#F5C52C")
            .style("filter", function(d){ 
                var aces = parseFloat(d.aces);
                if(aces == min_aces || aces == max_aces){
                    return "url(#drop-shadow)";
                }
                return "";
            });


        g.selectAll(".distance")
            .data(data)
            .enter().append("rect")
            .attr("class", "distance")
            .attr("x", function(d) { return x(d.round) + x.bandwidth()/16; })
            .attr("y", function(d) { 
                var distance = parseFloat(d.distance);

                if(distance == max_dist){
                    d3.select("body").append("div")
                        .attr("class", "tooltip distance-tip")
                        .html(Math.round(distance*10)/10)
                        .style("top", (y(distance)+$("svg").offset().top-10) + "px")
                        .style("left", (x(d.round) + x.bandwidth()/16 + $("svg").offset().left+37)+"px")
                }
                if(distance == min_dist){
                    d3.select("body").append("div")
                        .attr("class", "tooltip distance-tip")
                        .html(Math.round(distance*10)/10)
                        .style("top", (y(distance)+$("svg").offset().top-10) + "px")
                        .style("left", (x(d.round) + x.bandwidth()/16 + $("svg").offset().left+37)+"px");
                }

                return y(distance); 
            })
            .attr("width", x.bandwidth()/4)
            .attr("height", function(d) { return height - y(parseFloat(d.distance)); })
            .attr("fill-opacity", function(d){
                var distance = parseFloat(d.distance);
                if(distance == max_dist){
                    return 1;
                }else if(distance == min_dist){
                    return 0.35;
                }
                return 0.7;
            })
            .style("fill", "#077F18")
            .style("filter", function(d){ 
                var distance = parseFloat(d.distance);
                if(distance == max_dist || distance == min_dist){
                    return "url(#drop-shadow)";
                }
                return "";
            });

        g.selectAll(".errors")
            .data(data)
            .enter().append("rect")
            .attr("class", "errors")
            .attr("x", function(d) { return x(d.round) + x.bandwidth()/16*6; })
            .attr("y", function(d) { 
                var errors = parseFloat(d.errors);
                
                if(errors == max_errors){
                    d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .text(Math.round(errors*10)/10)
                        .style("top", (y(errors)+$("svg").offset().top-10) + "px")
                        .style("left", (x(d.round) + x.bandwidth()/16*6 + $("svg").offset().left+37)+"px");
                }
                if(errors == min_errors){
                    d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .text(Math.round(errors*10)/10)
                        .style("top", (y(errors)+$("svg").offset().top-10) + "px")
                        .style("left", (x(d.round) + x.bandwidth()/16*6 + $("svg").offset().left+37)+"px");
                }
                
                return y(errors); 
            })
            .attr("width", x.bandwidth()/4)
            .attr("height", function(d) { return height - y(parseFloat(d.errors)); })
            .attr("fill-opacity", function(d){
                var errors = parseFloat(d.errors);
                if(errors == min_errors){
                    return 1;
                }else if(errors == max_errors){
                    return 0.35;
                }
                return 0.7;
            })
            .style("fill", "#764C82")
            .style("filter", function(d){ 
                var errors = parseFloat(d.errors);
                if(errors == min_errors || errors == max_errors){
                    return "url(#drop-shadow)";
                }
                return "";
            });

        d3.select(".axis").attr("font-size", 20).style("font-family", 'Raleway');
        d3.selectAll(".axis text").attr("dy", 15);

        var cols = ["aces", "errors", "distance (m)"]
        var legend = g.selectAll(".legend")
            .data(cols.reverse())
            .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
                .style("font", "15px 'Raleway', sans-serif");

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .text(function(d) { return d; });

    });
});
