$('document').ready(function() {
    var height = 550,
    width = 1000,
    padding = 50;
    
    d3.csv('capstone.csv', function(players) {
        // var data = players.map(function(d) {
        //     console.log('d', d);
        // })
        console.log(players)
        var xDomain = d3.extent(players, function(d) {
            return parseInt(d['$/game'],10);
        });
        
        var viz = d3.select('#main-chart')
                    .append('svg')
                    .attr('id', 'main-svg')
                    .attr('height', height + padding)
                    .attr('width', width);
        
        
        var yDomain = d3.extent(players, function(d) {
            return parseInt(d['avgMin'],10);
        });
        console.log(xDomain, yDomain);
        
        var xScale = d3.scale.linear()
                        .domain(xDomain)
                        .range([padding, width - padding]);
        var yScale = d3.scale.linear()
                        .domain(yDomain)
                        .range([height - padding, padding]);
        
        var xAxis = d3.svg.axis()
                            .scale(xScale)
                            .ticks(15)
                            .orient('bottom');
        var yAxis = d3.svg.axis()
                            .scale(yScale)
                            .orient('left');
                            
        viz.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + padding + ', 0)')
            .call(yAxis);
            
        viz.append('g')
            .attr('class', 'xaxis axis')
            .attr('transform', 'translate(0,' + (height - padding) + ')')
            .call(xAxis)
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.855em')
            .attr('transform', 'rotate(-45)');
    });
});


    
