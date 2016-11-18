$('document').ready(function() {
    $('#close-modal').on('click', function() {
        $('#intro-modal').fadeOut(1000);
    });
    var height = window.innerHeight * .60,
    width = window.innerWidth * .79,
    padding = 50;
    
    Number.prototype.formatMoney = function(c, d, t){
    var n = this, 
        c = isNaN(c = Math.abs(c)) ? 2 : c, 
        d = d == undefined ? "." : d, 
        t = t == undefined ? "," : t, 
        s = n < 0 ? "-" : "", 
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
        j = (j = i.length) > 3 ? j % 3 : 0;
       return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
     };
    
    function dropdownToggleTeam() {
        document.getElementById("teamDropdown").classList.toggle("show");
    };
    function dropdownTogglePos() {
        document.getElementById("posDropdown").classList.toggle("show");
    };
    
    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function(event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
      if (!event.target.matches('.fa-question-circle-o')) {
        var aboutDropdown = document.getElementById("aboutModal");
        if (aboutDropdown.classList.contains('show')) {
            aboutDropdown.classList.remove('show');
        }
      }
    }
    
    
    
    
        
        
        
        $.getJSON('/api/moneypermin', function(players) {
            var moneyPerMinute = function() {
                
                var showModal = function() {
                    $('#aboutModal').html('<div><p>Money per minute shows the amount of money each player is making per minute they are on the court</p> <p>I assumed all players are going to play 82 games this year to find their salary per games played, then I took their avg minutes per game to find the salary per minute of play time.</p></div>');
                    document.getElementById("aboutModal").classList.toggle("show");
                };
                var xDomain = d3.extent(players, function(d) {
                    return parseInt(d['Dollar/Minute'],10);
                });
                
                var viz = d3.select('#main-chart')
                            .append('svg')
                            .attr('id', 'main-svg')
                            .attr('height', height +  padding)
                            .attr('width', width)
                            .attr('fill', '#006032')
                            .style('padding', '0 20px')
                            .style('background-color', '#FAFFF9');
                            
                
                
                
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
                    .style('fill', '#006032')
                    .attr('dx', '-.8em')
                    .attr('dy', '.855em')
                    .attr('transform', 'rotate(-45)');
                    
                viz.append("text")             
                  .attr("transform", "translate(" + (width/2) + " ," + (height + 30) + ")")
                  .style("text-anchor", "middle")
                  .text("Dollars Per Minute");
                  
                viz.append("text")
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate("+ (padding/5) +","+(height/2)+")rotate(-90)") 
                    .text("Avg Min Played Per Game");
                    
                
                var placeDots = function() {
                    var dots = viz.selectAll('.dots')
                            .data(players)
                            .enter()
                            .append('circle')
                            .attr('class', 'dots')
                            .attr('r', 5)
                            .attr('transform', function(dot) {
                                var y = yScale(parseFloat(dot.avgMin));
                                var x = xScale(parseFloat(dot['Dollar/Minute']));
                                return 'translate(' + x +',' + y + ')';
                            })
                            .style('stroke', '#000')
                            .style('fill', '#FAFFF9')
                            .style('stroke-width', 1.5);
                    dots.on('mouseover', function(d) {
                    d3.select(this)
                        .style('fill', '#96ADC8')
                        // .style('stroke', 'black')
                        .attr('r', 6);
                        
                        
                    tool.transition()
                        .duration(2000);
                    tool.html('<p class="tool-text">' + d.PlayerName + '</p>' +
                                '<p class="tool-text">' + d.Pos + '</p>' + 
                                '<p class="tool-text">' + d.Tm + '</p>' + 
                                '<p class="tool-text"> $' + parseFloat(d['Dollar/Minute']).formatMoney(2) +' per minute</p>')
                        .style('opacity', '0.99')
                        .style('left', (d3.event.pageX + 20) + 'px')
                        .style('top', (d3.event.pageY - 50) + 'px');
                });
                
                dots.on('mouseout', function(d) {
                    d3.select(this)
                        .style('fill', '#FAFFF9')
                        .style('stroke', 'black')
                        .attr('r', 5);
                    tool.transition()
                        .duration(500);
                    tool.html('')
                        .style('opacity', '0');
                });
                }
                placeDots();
                var tool = d3.select('body')
                                .append('div')
                                .attr('class', 'tooltip')
                                .style('opacity', '0')
                                .style('background-color', 'gray');
                
                
                
                var selectTeam = function(team) {
                    d3.selectAll(".dots").remove();
                    $('.dropbtn-tm').html(team + '<span class="caret"></span>');
                    var Tmdots = viz.selectAll('.Tmdots')
                                .data(players)
                                .enter()
                                .append('circle')
                                .attr('class', 'Tmdots')
                                .attr('r', 6)
                                .attr('transform', function(dot) {
                                    if(dot.Tm === team) {
                                        var y = yScale(parseFloat(dot.avgMin));
                                        var x = xScale(parseFloat(dot['Dollar/Minute']));
                                        return 'translate(' + x +',' + y + ')';
                                    } else {
                                        return 'translate(-10, -10)';
                                    }
                                })
                                .style('stroke', '#FFA987')
                                .style('fill', '#C20114')
                                .style('stroke-width', 1.5);
                                
                    Tmdots.on('mouseover', function(d) {
                        d3.select(this)
                            .style('fill', '#A3F7B5')
                            .attr('r', 6);
                            
                            
                        tool.transition()
                            .duration(200);
                        tool.html('<p class="tool-text">' + d.PlayerName + '</p>' +
                                    '<p class="tool-text">' + d.Pos + '</p>' + 
                                    '<p class="tool-text">' + d.Tm + '</p>' + 
                                    '<p class="tool-text"> $' + parseFloat(d['Dollar/Minute']).toFixed(2) +' per minute</p>')
                            .style('opacity', '0.99')
                            .style('left', (d3.event.pageX + 20) + 'px')
                            .style('top', (d3.event.pageY - 50) + 'px');
                    });
                    
                    Tmdots.on('mouseout', function(d) {
                        d3.select(this)
                            .style('fill', '#C20114');
                        tool.transition()
                            .duration(500);
                        tool.html('')
                            .style('opacity', '0');
                    });
                };
                
                var selectPos = function(pos) {
                    d3.selectAll(".dots").remove();
                    $('.dropbtn-pos').html(pos + '<span class="caret"></span>');
                    var Posdots = viz.selectAll('.Posdots')
                                .data(players)
                                .enter()
                                .append('circle')
                                .attr('class', 'Posdots')
                                .attr('r', 6)
                                .attr('transform', function(dot) {
                                    if(dot.Pos === pos) {
                                        var y = yScale(parseFloat(dot.avgMin));
                                        var x = xScale(parseFloat(dot['Dollar/Minute']));
                                        return 'translate(' + x +',' + y + ')';
                                    } else {
                                        return 'translate(-10, -10)';
                                    }
                                })
                                .style('stroke', '#086788')
                                .style('fill', '#A3F7B5')
                                .style('stroke-width', 1.5);
                                
                    Posdots.on('mouseover', function(d) {
                        d3.select(this)
                            .style('fill', '#96ADC8')
                            .attr('r', 6);
                            
                            
                        tool.transition()
                            .duration(200);
                        tool.html('<p class="tool-text">' + d.PlayerName + '</p>' +
                                    '<p class="tool-text">' + d.Pos + '</p>' + 
                                    '<p class="tool-text">' + d.Tm + '</p>' + 
                                    '<p class="tool-text"> $' + parseFloat(d['Dollar/Minute']).toFixed(2) +' per minute</p>')
                            .style('opacity', '0.99')
                            .style('left', (d3.event.pageX + 20) + 'px')
                            .style('top', (d3.event.pageY - 50) + 'px');
                    });
                    
                    Posdots.on('mouseout', function(d) {
                        d3.select(this)
                            .style('fill', '#A3F7B5');
                        tool.transition()
                            .duration(500);
                        tool.html('')
                            .style('opacity', '0');
                    });
                };
                
                $('#teamDropdown').on('click', function(e) {
                    d3.selectAll(".Tmdots").remove();
                    var team = e.target.text;
                    selectTeam(team);
                });
                $('#posDropdown').on('click', function(e) {
                    d3.selectAll(".Posdots").transition().remove();
                    var pos = e.target.text;
                    selectPos(pos);
                });
                $('.nba-reset').on('click', function(e) {
                    $('.dropbtn-tm').html('Select Team <span class="caret"></span>');
                    $('.dropbtn-pos').html('Select Position <span class="caret"></span>');
                    d3.selectAll(".Tmdots").transition().remove();
                    d3.selectAll(".Posdots").transition().remove();
                    d3.selectAll(".dots").transition().style('opacity', 1);
                    placeDots();
                });
                $('.fa-question-circle-o').on('click', function() {
                    showModal();
                });
            };
            moneyPerMinute(); 
        });
    
        
        $('.dropbtn-tm').on('click', function() {
            dropdownToggleTeam();
        });
        $('.dropbtn-pos').on('click', function() {
            dropdownTogglePos();
        });
        
});


    
