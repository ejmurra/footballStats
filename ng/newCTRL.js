angular.module('winston')
    .controller('newCTRL',function($scope,apiSVC,preloadObj) {
        $scope.winston = preloadObj.data.data[0];
        $scope.winston.addStats = false;
        $scope.players = preloadObj.data.data;
        $scope.mariota = preloadObj.data.data[1];
        $scope.mariota.addStats = false;
        $scope.graph = {
            weeks: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
        };

        $scope.toggleWinston = function() {
            $scope.winston.addStats = !$scope.winston.addStats;
        };

        $scope.addWinstonStats = function() {
            var string = "player=1&season=2015&";
            var params = [];
            _.forEach($scope.winston.new, function(val,key) {
                params.push(key+"="+val)
            });
            string += params.join("&");
            apiSVC.add(string).success(function(res) {
                if (res.status === "success") apiSVC.load().success(
                    function(res){
                        $scope.winston = res.data[0];
                        $scope.players = res.data;
                    })
            })
        };

        $scope.deleteWinston = function() {
            apiSVC.remove("player=1&week="+$scope.winston.delete.split(' ')[1]).success(
                function(res) {
                    if (res.status === "success") apiSVC.load().success(
                        function(res) {
                            $scope.winston = res.data[0];
                            $scope.players = res.data;
                        }
                    )
                }
            )
        };

        $scope.toggleMariota = function() {
            $scope.mariota.addStats = !$scope.mariota.addStats;
        };

        $scope.addMariotaStats = function() {
            var string = "player=2&season=2015&";
            var params = [];
            _.forEach($scope.mariota.new, function(val,key) {
                params.push(key+"="+val)
            });
            string += params.join("&");
            apiSVC.add(string).success(function(res) {
                if (res.status === "success") apiSVC.load().success(
                    function(res){
                        $scope.mariota = res.data[1];
                        $scope.players = res.data;
                    })
            })
        };

        $scope.deleteMariota = function() {
            apiSVC.remove("player=2&week="+$scope.mariota.delete.split(' ')[1]).success(
                function(res) {
                    if (res.status === "success") apiSVC.load().success(
                        function(res) {
                            $scope.mariota = res.data[1];
                            $scope.players = res.data;
                        }
                    )
                }
            )
        };

        $scope.drawGraph = function() {
            d3.select('#controlBox').selectAll('tr').remove();
            $scope.graph.data = $scope.graph.data || [];
            var week = $scope.graph.selectedWeek.split(' ')[1];
            if (_.isEmpty($scope.graph.data)) {
                (function preparePlayers(week) {
                    _.forEach($scope.players,function(player) {
                        var x = {name:player.name,ratings: _.take(player.rankings, week),selected: false, colors: player.colors};
                        $scope.graph.data.push(x);
                    });
                    var ratedPlayers = [];
                    _.forEach($scope.graph.data, function(player) {
                        if (player.ratings[player.ratings.length - 1] && player.ratings[player.ratings.length - 1]["rating"] !== null) {
                            ratedPlayers.push({
                                player: player.name,
                                currentRating: player.ratings[player.ratings.length - 1].rating,
                                selected: false,
                                ratings: player.ratings,
                                colors: player.colors
                            });
                        }
                    });

                    $scope.graph.data = _.forEach(_.sortByOrder(ratedPlayers,'currentRating','desc'),function(player,index) {
                        player.rank = index + 1;
                        player.primary = JSON.parse(player.colors).primary;
                        player.secondary = JSON.parse(player.colors).secondary;
                        delete player.colors
                    });
                })(week);
            } else {
                var tempGraphData = [];
                console.log($scope.graph);
                (function preparePlayers(week) {
                    var selectedPlayers = _.pluck(_.filter($scope.graph.data,'selected'),'player');
                    _.forEach($scope.players, function(player) {
                        var x = {
                            name: player.name,
                            ratings: _.take(player.rankings, week),
                            selected: _.includes(selectedPlayers,player.player),
                            colors: player.colors
                        };
                        tempGraphData.push(x)
                    });
                    var ratedPlayers = [];
                    _.forEach(tempGraphData, function(player) {
                        if (player.ratings[player.ratings.length - 1] && player.ratings[player.ratings.length - 1]["rating"] !== null) {
                            ratedPlayers.push({
                                player: player.name,
                                currentRating: player.ratings[player.ratings.length - 1].rating,
                                selected: _.includes(selectedPlayers, player.name),
                                ratings: player.ratings,
                                colors: player.colors
                            });
                        }
                    });
                    $scope.graph.data = _.forEach(_.sortByOrder(ratedPlayers,'currentRating','desc'),function(player,index) {
                        player.rank = index + 1;
                        player.primary = JSON.parse(player.colors).primary;
                        player.secondary = JSON.parse(player.colors).secondary;
                        delete player.colors
                    });
                console.log($scope.graph);
                })(week)
            }

            // CONTROLS
            //var controls = d3.select("#controlBox").selectAll("tr").data($scope.graph.data,function(d){ return d.player});
            //var player = controls.enter().append("tr").attr("class",function(d){return d.player});
            //
            //player.select_or_append("td.rank").html(function(d){
            //    return d.rank
            //});
            //player.select_or_append("td.name").html(function(d) {
            //    return d.player
            //});
            //player.select_or_append("td.rate").html(function(d) {
            //    return d.currentRating
            //});
            //player.exit().remove();
            var controls = d3.select('#controlBox').selectAll('tr').data($scope.graph.data,function(d){ return d.player});
            controls.enter()
                .append('tr')
                .style({
                    "background-color":function(d) {
                        if (d.selected) return d.primary;
                    }
                })
                //.attr('position', function(d) {return d.rank})

            controls.select_or_append("td.rank").html(function(d){
                return d.rank
            }).style({
                "color": function(d) {
                    if (d.selected) return "whitesmoke";
                }
            });
            controls.select_or_append("td.name").html(function(d) {
                return d.player
            }).style({
                "color": function(d) {
                    if (d.selected) return "whitesmoke";
                }
            });
            controls.select_or_append("td.rate").html(function(d) {
                return d.currentRating
            }).style({
                "color": function(d) {
                    if (d.selected) return "whitesmoke";
                }
            });

            controls.on("mouseover",function() {
                d3.select(this).style({
                    "background-color": function(d) {
                        return d.primary;
                    }
                }).selectAll('td').style("color","whitesmoke");
            });

            controls.on("mouseout",function(d) {
                if (!d.selected) {
                    d3.select(this).style({
                        "background-color": "white"
                    }).selectAll('td').style("color","black");
                }
            });

            controls.on("click",function(d) {
                d.selected = !d.selected;
                updateGraph();
            });



            // LINE CHART
            var margin = {top: 20, right: 20, bottom: 30, left: 50};
            var width = 960 - margin.left - margin.right;
            var height = 500 - margin.top - margin.bottom;

            var x = d3.scale.linear().range([0,width]).domain([1,week]);
            var y = d3.scale.linear().domain([0,160]).range([height,0]);
            var xAxis = d3.svg.axis().scale(x).orient("bottom").tickValues(d3.range(1,week + 1)).tickFormat(d3.format("d"));
            var yAxis = d3.svg.axis().scale(y).orient("left");
            var line = d3.svg.line().x(function(d){ return x(d.week)}).y(function(d){ return y(d.rating)})
                .interpolate('basis');

            var svg = d3.select("#graph").select_or_append("svg").attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom).select_or_append("g.container")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            updateGraph();

            function updateGraph() {
                var deselectedLines = svg.select_or_append("g.lines.deselected").selectAll('path')
                    .data(_.filter($scope.graph.data,function(player){
                        return !player.selected
                    }), function(d) {
                        return d.player
                    });

                deselectedLines.enter().append('path')
                    .attr("class","unselected")
                    .style({
                        "stroke":"lightgrey"
                    })
                    .attr("d", function(d) { return line(d.ratings)});

                deselectedLines.transition().attr("d", function(d) { return line(d.ratings)});
                //controls.on("mouseover",function() {
                //    d3.select(this).style({
                //        "background-color": function(d) {
                //            return d.primary;
                //        }
                //    }).selectAll('td').style("color","whitesmoke");
                //});
                //
                //controls.on("mouseout",function(d) {
                //    if (!d.selected) {
                //        d3.select(this).style({
                //            "background-color": "white"
                //        }).selectAll('td').style("color","black");
                //    }
                //});
                //
                //controls.on("click",function(d) {
                //    d.selected = !d.selected;
                //    updateGraph();
                //});
                var offset = {
                    x: 5,
                    y: 10
                }
                function addToolTip(data) {
                    var container = d3.select('body').append('div').datum(data)
                        .attr('class','tooltip-container')
                        .call(initTT)

                    container.style('left', d3.event.pageX + offset.x + 'px')
                        .style('top',d3.event.pageY + offset.y + 'px')
                }

                function initTT(selection) {
                    selection.each(function(data) {
                        d3.select(this).attr('class','tooltip-container')
                            .style('width','150px');

                        d3.select(this).append('p').attr('class','tooltip-title').text(data.player);

                        d3.select(this).append('p').attr('class','tooltip-content').text("Rating: " + data.currentRating);
                        d3.select(this).append('p').attr('class','tooltip-content').text("Rank: " + data.rank)
                    })
                }

                deselectedLines.on("mouseover", function(d) {
                    d3.select(this).style({
                        "stroke":function(d) {
                            return d.primary
                        },
                        "stroke-width":"3px"
                    })
                    addToolTip(d)
                })

                function moveToolTip() {
                    d3.select('body').select('div.tooltip-container')
                        .style('left', (d3.event.pageX + offset.x) + 'px')
                        .style('top', (d3.event.pageY + offset.y) + 'px')
                }

                function removeToolTip() {
                    d3.select('div.tooltip-container').remove()
                }

                deselectedLines.on("mouseout", function(d) {
                    d3.select(this).style({
                        "stroke":"lightgrey",
                        "stroke-width":"2px"
                    })
                    removeToolTip(d)
                })

                deselectedLines.on("mousemove", moveToolTip)

                deselectedLines.exit().remove();

                var selectedLines = svg.select_or_append("g.lines.selected").selectAll('path')
                    .data(_.filter($scope.graph.data,function(player){
                        return player.selected
                    }), function(d) {
                        return d.player
                    });

                selectedLines.enter().append('path')
                    .attr("class","selected")
                    .style({
                        "stroke": function(d){
                            console.log(d.player + " : " + d.primary);
                            return d.primary;
                        }
                    })
                    .attr("d",function(d) { return line(d.ratings)});

                selectedLines.transition().attr("d", function(d) { return line(d.ratings)});

                selectedLines.exit().remove();
            }

            svg.select_or_append("g.x")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .select_or_append("text.xaxis")
                .attr("y",25)
                .attr("x",450)
                .style("text-anchor","end")
                .style("dy",".71em")
                .text("Week");

            svg.select_or_append("g.y")
                .attr("class", "y axis")
                .call(yAxis)
                .select_or_append("text.yaxis")
                .attr("transform","rotate(-90)")
                .attr("y",-50)
                .attr("x", -150)
                .attr("dy", ".71em")
                .style("text-anchor","end")
                .text("QB Rating (cumulative)");


        }
    });