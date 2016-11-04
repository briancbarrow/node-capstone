$('document').ready(function() {
    var height = screen.height * .75,
    width = screen.width * .85,
    padding = 50;
    
    var moneyPerMinute = function(team) {
    
        d3.csv('stats.csv', function(players) {
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
                        .attr('height', height +  padding)
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
                
            var dots = viz.selectAll('.dots')
                            .data(players)
                            .enter()
                            .append('circle')
                            .attr('class', 'dots')
                            .attr('r', 5)
                            .attr('transform', function(dot) {
                                if(team === undefined) {
                                    var y = yScale(parseFloat(dot.avgMin));
                                    var x = xScale(parseFloat(dot['$/Minute']));
                                    return 'translate(' + x +',' + y + ')';
                                } else if(dot.Tm === team) {
                                    var y = yScale(parseFloat(dot.avgMin));
                                    var x = xScale(parseFloat(dot['$/Minute']));
                                    return 'translate(' + x +',' + y + ')';
                                } else {
                                    return 'translate(-10, -10)';
                                }
                            })
                            .style('stroke', '#000')
                            .style('fill', '#fff')
                            .style('stroke-width', 1.5);
                            
            var tool = d3.select('body')
                            .append('div')
                            .attr('class', 'tooltip')
                            .style('opacity', '0')
                            .style('background-color', '#000');
            
            dots.on('mouseover', function(d) {
                d3.select(this)
                    .style('fill', 'green');
                    
                    
                tool.transition()
                    .duration(200);
                tool.html('<p class="tool-text">' + d.Player + '</p>' +
                            '<p class="tool-text">' + d.Pos + '</p>' + 
                            '<p class="tool-text">' + d.Tm + '</p>' + 
                            '<p class="tool-text"> $' + parseFloat(d['$/Minute']).toFixed(2) +' per minute</p>')
                    .style('opacity', '0.9')
                    .style('left', (d3.event.pageX + 20) + 'px')
                    .style('top', (d3.event.pageY - 50) + 'px');
            });
            
            dots.on('mouseout', function(d) {
                d3.select(this)
                    .style('fill', '#fff');
                tool.transition()
                    .duration(500)
                tool.html('')
                    .style('opacity', '0');
            });
        });
    };
    
    moneyPerMinute();
});


    
