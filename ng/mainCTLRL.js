angular.module('winston')
    .controller('mainCTRL',function($scope,apiSVC,preloadObj){
        $scope._showInput = false;
        var stats = function() {
            return [
                {
                    key: 'week',
                    val: null
                },
                {
                    key: 'date',
                    val: null
                },
                {
                    key: 'g',
                    val: null
                },
                {
                    key: 'gs',
                    val: null
                },
                {
                    key: 'pass_comp',
                    val: null
                },
                {
                    key: 'pass_att',
                    val: null
                },
                {
                    key: 'pass_pct',
                    val: null
                },
                {
                    key: 'pass_yds',
                    val: null
                },
                {
                    key: 'pass_avg',
                    val: null
                },
                {
                    key: 'pass_td',
                    val: null
                },
                {
                    key: 'pass_int',
                    val: null
                },
                {
                    key: 'pass_sck',
                    val: null
                },
                {
                    key: 'pass_scky',
                    val: null
                },
                {
                    key: 'pass_rate',
                    val: null
                },
                {
                    key: 'rush_att',
                    val: null
                },
                {
                    key: 'rush_yds',
                    val: null
                },
                {
                    key: 'rush_avg',
                    val: null
                },
                {
                    key: 'rush_td',
                    val: null
                },
                {
                    key: 'fum',
                    val: null
                },
                {
                    key: 'fum_lost',
                    val: null
                }
            ];
        };
        var Ustats = function() {
            return [
                {
                    key: 'date',
                    val: null
                },
                {
                    key: 'g',
                    val: null
                },
                {
                    key: 'gs',
                    val: null
                },
                {
                    key: 'pass_comp',
                    val: null
                },
                {
                    key: 'pass_att',
                    val: null
                },
                {
                    key: 'pass_pct',
                    val: null
                },
                {
                    key: 'pass_yds',
                    val: null
                },
                {
                    key: 'pass_avg',
                    val: null
                },
                {
                    key: 'pass_td',
                    val: null
                },
                {
                    key: 'pass_int',
                    val: null
                },
                {
                    key: 'pass_sck',
                    val: null
                },
                {
                    key: 'pass_scky',
                    val: null
                },
                {
                    key: 'pass_rate',
                    val: null
                },
                {
                    key: 'rush_att',
                    val: null
                },
                {
                    key: 'rush_yds',
                    val: null
                },
                {
                    key: 'rush_avg',
                    val: null
                },
                {
                    key: 'rush_td',
                    val: null
                },
                {
                    key: 'fum',
                    val: null
                },
                {
                    key: 'fum_lost',
                    val: null
                }
            ];
        };
        if (preloadObj.data.status == 'err') console.log(preloadObj.data.message);
        $scope.gameStats = preloadObj.data.data.winston;
        $scope.stats = new stats();
        $scope.Ustats = new Ustats();
        $scope.newStats = function() {
            apiSVC.addNew($scope.Ustats).success(function(result){
                if (result.status == "success") {
                    $scope.Ustats = new Ustats();
                    $scope.toggleInput();
                    apiSVC.load().success(function(data) {
                        $scope.gameStats = data.data.winston;
                    })
                } else if (result.message.constraint == 'game_pk') {
                    alert("Error: That game already exists in the database. Delete it first if you want to update it")
                }
                else {
                    alert("Error: " + JSON.stringify(result.message.detail))
                }

            });
        };
        $scope.toggleInput = function() {
            $scope._showInput = !$scope._showInput;
        };
        $scope.deleteRow = function() {
            if ($scope.gameStats != false) {
                apiSVC.remove().success(function(response){
                    if (response.status == 'success') {
                        apiSVC.load().success(function(data) {
                            $scope.gameStats = data.data.winston;
                        })
                    }
                })
            }
        };
        $scope.maxGames = function() {
            var max = 0;
            _.forEach($scope.players, function(player) {
                if (player.games.length > max) max = player.games.length;
            });
            var weeks = [];
            for (var i = 1; i < max + 1; i++) {
                weeks.push(i)
            }
            return weeks;
        };
        $scope.players = preloadObj.data.data.players;
        $scope.games = preloadObj.data.data.games;
        _.forEach($scope.players, function(player) {
            player.games = [];
            _.forEach($scope.games, function(game) {
                if (game.player === player.id) player.games.push(game);
            });
        });
        var accumulateStats = function(player, week) {
            var games = _.take(player.games, week);
            var statsCum = {
                passing_comp:0,
                passing_yds: 0,
                passing_td: 0,
                passing_att: 0,
                passing_int: 0
            };
            _.forEach(games,function(game) {
                if (game.passing_comp != null) statsCum.passing_comp += game.passing_comp;
                if (game.passing_yds != null) statsCum.passing_yds += game.passing_yds;
                if (game.passing_td != null) statsCum.passing_td += game.passing_td;
                if (game.passing_att != null) statsCum.passing_att += game.passing_att;
                if (game.passing_int != null) statsCum.passing_int += game.passing_int;
            });
            function rate(stats) {
                if (stats.passing_att != null && stats.passing_att != 0) {
                    // formula from https://en.wikipedia.org/wiki/Passer_rating
                    var a = (statsCum.passing_comp / statsCum.passing_att - .3) * 5;
                    var b = (statsCum.passing_yds / statsCum.passing_att - 3) * .25;
                    var c = (statsCum.passing_td / statsCum.passing_att) * 20;
                    var d = 2.375 - (statsCum.passing_int / statsCum.passing_att * 25);
                    if (a > 2.375) a = 2.375;
                    if (a < 0) a = 0;
                    if (b > 2.375) b = 2.375;
                    if (b < 0) b = 0;
                    if (c > 2.375) c = 2.375;
                    if (c < 0) c = 0;
                    if (d > 2.375) d = 2.375;
                    if (d < 0) d = 0;
                    return (a + b + c + d) / 6 * 100;
                }

            }
            player.rating = rate(statsCum);
            return player;
        };
        $scope.ratePlayers = function() {
            $scope.chartActive = true;
            var week = $('#week2rate').val().split(' ')[1];
            var rated = [];
            $scope.rated = [];
            apiSVC.load().success(function(playersObj) {
                $scope.players = playersObj.data.players;
                $scope.games = playersObj.data.games;
                $scope.gameStates = playersObj.data.winston;
                _.forEach($scope.players, function(player) {
                    player.games = [];
                    _.forEach($scope.games, function(game) {
                        if (game.player === player.id) player.games.push(game);
                    });
                    _.sortBy(player.games, function(game) {
                        return game.week;
                    });
                });
                _.forEach($scope.players, function(player) {
                    accumulateStats(player,week);
                    rated.push({
                        "player":player.name,
                        "rating":Math.round((player.rating + 0.00001) * 100) / 100,
                        "id":"p"+player.id
                    })
                });
                var ranked = _.sortBy(rated, function(player) {
                    return player.rating;
                });
                ranked = _.filter(ranked, function(p){
                    return p.rating;
                });
                _.forEach(ranked.reverse(),function(player, index) {
                    player.rank = index + 1;
                    $scope.rated.push(player);
                });
                drawGraphics(week);
            });
        };
        function drawGraphics(week) {
            _.forEach($scope.players, function(player) {
                player.games = [];
                _.forEach($scope.games, function(game) {
                    if (game.player == player.id) player.games.push(game);
                });
                _.sortBy(player.games, function(game) {
                    return game.week;
                });
                function getRatings(player) {
                    var ratings = [];
                    var statsCum;
                    _.forEach(player.games,function(game,index) {
                        if (player.id == 3) console.log(index,game);
                        if (!statsCum && game.g == 1) {
                            statsCum = {
                                passing_comp:0,
                                passing_yds: 0,
                                passing_td: 0,
                                passing_att: 0,
                                passing_int: 0
                            };
                            if (game.passing_comp != null) statsCum.passing_comp += game.passing_comp;
                            if (game.passing_yds != null) statsCum.passing_yds += game.passing_yds;
                            if (game.passing_td != null) statsCum.passing_td += game.passing_td;
                            if (game.passing_att != null) statsCum.passing_att += game.passing_att;
                            if (game.passing_int != null) statsCum.passing_int += game.passing_int;
                            if (statsCum.passing_att != null && statsCum.passing_att != 0) {
                                // formula from https://en.wikipedia.org/wiki/Passer_rating
                                var a = (statsCum.passing_comp / statsCum.passing_att - .3) * 5;
                                var b = (statsCum.passing_yds / statsCum.passing_att - 3) * .25;
                                var c = (statsCum.passing_td / statsCum.passing_att) * 20;
                                var d = 2.375 - (statsCum.passing_int / statsCum.passing_att * 25);
                                if (a > 2.375) a = 2.375;
                                if (a < 0) a = 0;
                                if (b > 2.375) b = 2.375;
                                if (b < 0) b = 0;
                                if (c > 2.375) c = 2.375;
                                if (c < 0) c = 0;
                                if (d > 2.375) d = 2.375;
                                if (d < 0) d = 0;
                                var rating = (a+b+c+d)/6*100;
                                ratings.push({"week":index + 1, "rating":Math.round((rating + 0.00001) * 100) / 100,"pid":player.id})
                            }
                        } else if (!statsCum && !game.g) {
                            ratings.push({"week":index + 1,"rating":null,"pid":player.id})
                        }
                        else {
                            if (game.passing_comp != null) statsCum.passing_comp += game.passing_comp;
                            if (game.passing_yds != null) statsCum.passing_yds += game.passing_yds;
                            if (game.passing_td != null) statsCum.passing_td += game.passing_td;
                            if (game.passing_att != null) statsCum.passing_att += game.passing_att;
                            if (game.passing_int != null) statsCum.passing_int += game.passing_int;
                            if (statsCum.passing_att != null && statsCum.passing_att != 0) {
                                // formula from https://en.wikipedia.org/wiki/Passer_rating
                                var a = (statsCum.passing_comp / statsCum.passing_att - .3) * 5;
                                var b = (statsCum.passing_yds / statsCum.passing_att - 3) * .25;
                                var c = (statsCum.passing_td / statsCum.passing_att) * 20;
                                var d = 2.375 - (statsCum.passing_int / statsCum.passing_att * 25);
                                if (a > 2.375) a = 2.375;
                                if (a < 0) a = 0;
                                if (b > 2.375) b = 2.375;
                                if (b < 0) b = 0;
                                if (c > 2.375) c = 2.375;
                                if (c < 0) c = 0;
                                if (d > 2.375) d = 2.375;
                                if (d < 0) d = 0;
                                var rating = (a+b+c+d)/6*100;
                                ratings.push({"week":index + 1, "rating":Math.round((rating + 0.00001) * 100) / 100,"pid":player.id})
                            }
                        }
                    });
                    var ratingObj = {};
                    _.forEach(ratings, function(rating) {
                        ratingObj[rating.week] = rating;
                    });
                    if (player.id == 3 ) {console.log(ratingObj);console.log(ratings)};
                    _.forEach(ratingObj, function(rating,i) {
                        if (player.id == 3) console.log(rating,i);
                        if (!rating) {
                            if (i != 0) {
                                rating = ratingObj[i-1];
                                rating.week++
                            } else {
                                rating.week = 1;
                                rating.rating = null;
                                rating.pid = player.id;
                            }
                        }
                    })
                    //for (var i = 1; i < 19; i++) {
                    //    if (!ratingObj[i]) {
                    //        if (i != 1 && ratingObj[i-1]) {
                    //            ratingObj[i] = ratingObj[i-1];
                    //            ratingObj[i].week = i;
                    //        } else {
                    //            ratingObj[i] = null;
                    //        }
                    //    }
                    //}
                    return ratingObj;
                }
                var ratings = _.values(getRatings(player));
                //if (!player.id == 1) week += 3;
                player.ratings = _.take(ratings, week);
                if (player.id == 3) {
                    console.log(ratings);
                    console.log(player.ratings)
                }
            });
            _.forEach($scope.players,function(player) {
                player.className = 'jameis';
                if (player.id != 1) player.className = 'other';
                player.ratings.forEach(function(d,i) {
                    if (d) {
                        d.week = +d.week;
                        d.rating = d.rating;
                        d.pid = player.id;
                    } else {
                        if (i != 0 && player.ratings[i] != null) {
                            player.ratings[i] = {
                                "week":player.ratings[i].week + 1,
                                "rating":player.ratings[i].rating,
                                "pid":player.id
                            }
                        } else {
                            player.ratings[i] = {
                                "week": i + 1,
                                "rating": null,
                                "pid": player.id
                            }
                        }
                    }
                });
            });
            //_.forEach($scope.players,function(player) {
            //    console.log(player.name,player.ratings.length);
            //});

            var margin = {top: 20, right: 20, bottom: 30, left: 50};
            var width = 960 - margin.right - margin.left;
            var height = 500 - margin.top - margin.bottom;
            var x = d3.scale.linear().range([0,width]);
            var y = d3.scale.linear().range([height,0]);
            var xAxis = d3.svg.axis().scale(x).orient("bottom").tickValues(d3.range(1,week + 1)).tickFormat(d3.format("d"));
            var yAxis = d3.svg.axis().scale(y).orient("left");
            var line = d3.svg.line()
                .x(function(d) { return x(d.week)})
                .y(function(d) { return y(d.rating)})
                .interpolate('step-after');
            var svg = d3.select("#graph").select_or_append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .select_or_append("g.container")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")");
            x.domain([1, Number(week)]);
            y.domain([0,158.3]);


            var lines = svg.select_or_append('g.lines').selectAll('path')
                .data($scope.players.reverse(),function(d){if(d){/*console.log(d);*/return d.id;}});

            lines.enter().append('path')
            .attr("class",function(d) { return d.className})
            .attr("name",function(d){return d.name})
            .attr("d", function(d) {return line(d.ratings)});

            lines.attr("class",function(d) { return d.className})
            .attr("name",function(d){return d.name})
            .transition().attr("d", function(d) {return line(d.ratings)});

            lines.exit().remove();

            svg.select_or_append("g.x")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.select_or_append("g.y")
                .attr("class", "y axis")
                .call(yAxis)
                .select_or_append("text.yaxis")
                .attr("transform","rotate(-90)")
                .attr("y",6)
                .attr("dy", ".71em")
                .style("text-anchor","end")
                .text("QB Rating (cumulative)");
        }
        $scope.chartActive = false;
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









