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
            $scope.graph.data = [];
            $scope.rated = [];
            var week = $scope.graph.selected.split(' ')[1];
            _.forEach($scope.players,function(player) {
                var x = {name:player.name,ratings: _.take(player.rankings, week),selected: false};
                $scope.graph.data.push(x);
            });
            _.forEach($scope.graph.data, function(player) {
                if (player.ratings[player.ratings.length - 1]) {
                    if (player.ratings[player.ratings.length-1]["rating"] !== null) {
                        $scope.rated.push({
                            player: player.name,
                            rating: player.ratings[player.ratings.length - 1],
                            selected: false
                        });
                    }
                }
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

            var lines = svg.select_or_append("g.lines").selectAll('path').data($scope.graph.data.reverse(),function(d) {
                if (d) return d.name;
            });

            lines.enter().append('path')
                .attr("class",function(d) { return d.name + " lines"; })
                .attr("d", function(d) { return line(d.ratings)});

            lines.transition().attr("d", function(d) { return line(d.ratings)})

            lines.exit().remove();

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

            // CONTROLS
            var colorMap = {};
            _.forEach($scope.players,function(player) {
                colorMap[player.name] = JSON.parse(player.colors);
            });

            var controls = d3.select("#controlBox").selectAll("div").data($scope.graph.data, function(d) {
                if (d) return d.name;
            }).enter().append("div").attr("class","controller").style({
                border: "4px solid",
                "border-color": function(d) {
                    return colorMap[d.name].primary;
                }
            });

            controls.append("div").html(function(d){return d.name});

            controls.on("mouseover",function() {
                d3.select(this).style({
                    "border-color": function(d) {
                        return colorMap[d.name].secondary;
                    },
                    "background-color": function(d) {
                        return colorMap[d.name].primary;
                    }
                }).selectAll('div').style("color","whitesmoke");
            });

            controls.on("mouseout",function(control) {
                if (!control.selected) {
                    d3.select(this).style({
                        "border-color": function(d) {
                            return colorMap[d.name].primary;
                        },
                        "background-color": "white"
                    }).selectAll('div').style("color","black");
                }
            });

            controls.on("click",function() {
                var selectedP = d3.select(this).selectAll("div").html();
                var gdata = _.filter($scope.graph.data,function(d) {
                    return d.name === selectedP
                })
                _.forEach(gdata,function(player){
                    player.selected = !player.selected;
                })
                controls.each(function(d) {
                    if (d.name === selectedP || d.selected) {
                        d3.select(this).style({
                            "border-color": function(d) {
                                return colorMap[d.name].secondary;
                            },
                            "background-color": function(d) {
                                return colorMap[d.name].primary;
                            }
                        }).selectAll('div').style("color","whitesmoke");
                    } else {
                        d3.select(this).style({
                            "border-color": function(d) {
                                return colorMap[d.name].primary;
                            },
                            "background-color": "white"
                        }).selectAll('div').style("color","black");
                    }
                });
                lines.each(function(d) {
                    if (d.selected) {
                        d3.select(this).style({
                            "stroke-width": "3px",
                            "stroke": function(d) {
                                return colorMap[d.name].primary;
                            },
                            "z-index": "10"
                        })
                    } else {
                        d3.select(this).style({
                            "stroke-width":"1px",
                            "stroke": "lightgrey",
                            "z-index": "0"
                        })
                    }
                })
            })


        }
    });