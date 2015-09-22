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
        $scope.dl = function() {
            var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

            window.URL = (window.URL || window.webkitURL);

            var body = document.body,
                emptySvg;

            var prefix = {
                xmlns: "http://www.w3.org/2000/xmlns/",
                xlink: "http://www.w3.org/1999/xlink",
                svg: "http://www.w3.org/2000/svg"
            };

            initialize();

            function initialize() {
                var documents = [window.document],
                    SVGSources = [];
                iframes = document.querySelectorAll("iframe"),
                    objects = document.querySelectorAll("object");

                // add empty svg element
                var emptySvg = window.document.createElementNS(prefix.svg, 'svg');
                window.document.body.appendChild(emptySvg);
                var emptySvgDeclarationComputed = getComputedStyle(emptySvg);

                [].forEach.call(iframes, function(el) {
                    try {
                        if (el.contentDocument) {
                            documents.push(el.contentDocument);
                        }
                    } catch(err) {
                        console.log(err);
                    }
                });

                [].forEach.call(objects, function(el) {
                    try {
                        if (el.contentDocument) {
                            documents.push(el.contentDocument);
                        }
                    } catch(err) {
                        console.log(err)
                    }
                });

                documents.forEach(function(doc) {
                    var newSources = getSources(doc, emptySvgDeclarationComputed);
                    // because of prototype on NYT pages
                    for (var i = 0; i < newSources.length; i++) {
                        SVGSources.push(newSources[i]);
                    }
                });
                if (SVGSources.length > 1) {
                    createPopover(SVGSources);
                } else if (SVGSources.length > 0) {
                    download(SVGSources[0]);
                } else {
                    alert("The Crowbar couldn’t find any SVG nodes.");
                }

            }

            function createPopover(sources) {
                cleanup();

                sources.forEach(function(s1) {
                    sources.forEach(function(s2) {
                        if (s1 !== s2) {
                            if ((Math.abs(s1.top - s2.top) < 38) && (Math.abs(s1.left - s2.left) < 38)) {
                                s2.top += 38;
                                s2.left += 38;
                            }
                        }
                    });
                });

                var buttonsContainer = document.createElement("div");
                body.appendChild(buttonsContainer);

                buttonsContainer.setAttribute("class", "svg-crowbar");
                buttonsContainer.style["z-index"] = 1e7;
                buttonsContainer.style["position"] = "absolute";
                buttonsContainer.style["top"] = 0;
                buttonsContainer.style["left"] = 0;



                var background = document.createElement("div");
                body.appendChild(background);

                background.setAttribute("class", "svg-crowbar");
                background.style["background"] = "rgba(255, 255, 255, 0.7)";
                background.style["position"] = "fixed";
                background.style["left"] = 0;
                background.style["top"] = 0;
                background.style["width"] = "100%";
                background.style["height"] = "100%";

                sources.forEach(function(d, i) {
                    var buttonWrapper = document.createElement("div");
                    buttonsContainer.appendChild(buttonWrapper);
                    buttonWrapper.setAttribute("class", "svg-crowbar");
                    buttonWrapper.style["position"] = "absolute";
                    buttonWrapper.style["top"] = (d.top + document.body.scrollTop) + "px";
                    buttonWrapper.style["left"] = (document.body.scrollLeft + d.left) + "px";
                    buttonWrapper.style["padding"] = "4px";
                    buttonWrapper.style["border-radius"] = "3px";
                    buttonWrapper.style["color"] = "white";
                    buttonWrapper.style["text-align"] = "center";
                    buttonWrapper.style["font-family"] = "'Helvetica Neue'";
                    buttonWrapper.style["background"] = "rgba(0, 0, 0, 0.8)";
                    buttonWrapper.style["box-shadow"] = "0px 4px 18px rgba(0, 0, 0, 0.4)";
                    buttonWrapper.style["cursor"] = "move";
                    buttonWrapper.textContent =  "SVG #" + i + ": " + (d.id ? "#" + d.id : "") + (d.class ? "." + d.class : "");

                    var button = document.createElement("button");
                    buttonWrapper.appendChild(button);
                    button.setAttribute("data-source-id", i);
                    button.style["width"] = "150px";
                    button.style["font-size"] = "12px";
                    button.style["line-height"] = "1.4em";
                    button.style["margin"] = "5px 0 0 0";
                    button.textContent = "Download";

                    button.onclick = function(el) {
                        // console.log(el, d, i, sources)
                        download(d);
                    };

                });

            }

            function cleanup() {
                var crowbarElements = document.querySelectorAll(".svg-crowbar");

                [].forEach.call(crowbarElements, function(el) {
                    el.parentNode.removeChild(el);
                });
            }


            function getSources(doc, emptySvgDeclarationComputed) {
                var svgInfo = [],
                    svgs = doc.querySelectorAll("svg");

                [].forEach.call(svgs, function (svg) {

                    svg.setAttribute("version", "1.1");

                    // removing attributes so they aren't doubled up
                    svg.removeAttribute("xmlns");
                    svg.removeAttribute("xlink");

                    // These are needed for the svg
                    if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) {
                        svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
                    }

                    if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
                        svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
                    }

                    setInlineStyles(svg, emptySvgDeclarationComputed);

                    var source = (new XMLSerializer()).serializeToString(svg);
                    var rect = svg.getBoundingClientRect();
                    svgInfo.push({
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                        class: svg.getAttribute("class"),
                        id: svg.getAttribute("id"),
                        childElementCount: svg.childElementCount,
                        source: [doctype + source]
                    });
                });
                return svgInfo;
            }

            function download(source) {
                var filename = "untitled";

                if (source.id) {
                    filename = source.id;
                } else if (source.class) {
                    filename = source.class;
                } else if (window.document.title) {
                    filename = window.document.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
                }

                var url = window.URL.createObjectURL(new Blob(source.source, { "type" : "text\/xml" }));

                var a = document.createElement("a");
                body.appendChild(a);
                a.setAttribute("class", "svg-crowbar");
                a.setAttribute("download", filename + ".svg");
                a.setAttribute("href", url);
                a.style["display"] = "none";
                a.click();

                setTimeout(function() {
                    window.URL.revokeObjectURL(url);
                }, 10);
            }


            function setInlineStyles(svg, emptySvgDeclarationComputed) {

                function explicitlySetStyle (element) {
                    var cSSStyleDeclarationComputed = getComputedStyle(element);
                    var i, len, key, value;
                    var computedStyleStr = "";
                    for (i=0, len=cSSStyleDeclarationComputed.length; i<len; i++) {
                        key=cSSStyleDeclarationComputed[i];
                        value=cSSStyleDeclarationComputed.getPropertyValue(key);
                        if (value!==emptySvgDeclarationComputed.getPropertyValue(key)) {
                            computedStyleStr+=key+":"+value+";";
                        }
                    }
                    element.setAttribute('style', computedStyleStr);
                }
                function traverse(obj){
                    var tree = [];
                    tree.push(obj);
                    visit(obj);
                    function visit(node) {
                        if (node && node.hasChildNodes()) {
                            var child = node.firstChild;
                            while (child) {
                                if (child.nodeType === 1 && child.nodeName != 'SCRIPT'){
                                    tree.push(child);
                                    visit(child);
                                }
                                child = child.nextSibling;
                            }
                        }
                    }
                    return tree;
                }
                // hardcode computed css styles inside svg
                var allElements = traverse(svg);
                var i = allElements.length;
                while (i--){
                    explicitlySetStyle(allElements[i]);
                }
            }


        };
    });