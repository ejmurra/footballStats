angular.module("winston",["ui.router"]),angular.module("winston").service("apiSVC",["$http",function(a){this.addNew=function(s){return a.post("/api/stats/add",s)},this.remove=function(){return a.get("/api/stats/remove")},this.load=function(){return a.get("/api/stats")}}]),angular.module("winston").controller("mainCTRL",["$scope","apiSVC","preloadObj",function(a,s,t){a._showInput=!1;var n=function(){return[{key:"week",val:null},{key:"date",val:null},{key:"g",val:null},{key:"gs",val:null},{key:"pass_comp",val:null},{key:"pass_att",val:null},{key:"pass_pct",val:null},{key:"pass_yds",val:null},{key:"pass_avg",val:null},{key:"pass_td",val:null},{key:"pass_int",val:null},{key:"pass_sck",val:null},{key:"pass_scky",val:null},{key:"pass_rate",val:null},{key:"rush_att",val:null},{key:"rush_yds",val:null},{key:"rush_avg",val:null},{key:"rush_td",val:null},{key:"fum",val:null},{key:"fum_lost",val:null}]},l=function(){return[{key:"date",val:null},{key:"g",val:null},{key:"gs",val:null},{key:"pass_comp",val:null},{key:"pass_att",val:null},{key:"pass_pct",val:null},{key:"pass_yds",val:null},{key:"pass_avg",val:null},{key:"pass_td",val:null},{key:"pass_int",val:null},{key:"pass_sck",val:null},{key:"pass_scky",val:null},{key:"pass_rate",val:null},{key:"rush_att",val:null},{key:"rush_yds",val:null},{key:"rush_avg",val:null},{key:"rush_td",val:null},{key:"fum",val:null},{key:"fum_lost",val:null}]};"err"==t.data.status&&console.log(t.data.message),a.gameStats=t.data.data.winston,a.stats=new n,a.Ustats=new l,a.newStats=function(){s.addNew(a.Ustats).success(function(t){"success"==t.status?(a.Ustats=new l,a.toggleInput(),s.load().success(function(s){a.gameStats=s.data.winston})):"game_pk"==t.message.constraint?alert("Error: That game already exists in the database. Delete it first if you want to update it"):alert("Error: "+JSON.stringify(t.message.detail))})},a.toggleInput=function(){a._showInput=!a._showInput},a.deleteRow=function(){0!=a.gameStats&&s.remove().success(function(t){"success"==t.status&&s.load().success(function(s){a.gameStats=s.data.winston})})},a.maxGames=function(){var s=0;_.forEach(a.players,function(a){a.games.length>s&&(s=a.games.length)});for(var t=[],n=1;s+1>n;n++)t.push(n);return t},a.players=t.data.data.players,a.games=t.data.data.games,_.forEach(a.players,function(s){s.games=[],_.forEach(a.games,function(a){a.player===s.id&&s.games.push(a)})});var e=function(a,s){function t(a){if(null!=a.passing_att&&0!=a.passing_att){var s=5*(l.passing_comp/l.passing_att-.3),t=.25*(l.passing_yds/l.passing_att-3),n=l.passing_td/l.passing_att*20,e=2.375-l.passing_int/l.passing_att*25;return s>2.375&&(s=2.375),0>s&&(s=0),t>2.375&&(t=2.375),0>t&&(t=0),n>2.375&&(n=2.375),0>n&&(n=0),e>2.375&&(e=2.375),0>e&&(e=0),(s+t+n+e)/6*100}}var n=_.take(a.games,s),l={passing_comp:0,passing_yds:0,passing_td:0,passing_att:0,passing_int:0};return _.forEach(n,function(a){null!=a.passing_comp&&(l.passing_comp+=a.passing_comp),null!=a.passing_yds&&(l.passing_yds+=a.passing_yds),null!=a.passing_td&&(l.passing_td+=a.passing_td),null!=a.passing_att&&(l.passing_att+=a.passing_att),null!=a.passing_int&&(l.passing_int+=a.passing_int)}),a.rating=t(l),a};a.ratePlayers=function(){var t=$("#week2rate").val().split(" ")[1];a.rated=[],s.load().success(function(s){console.log(s),a.players=s.data.players,a.games=s.data.games,a.gameStates=s.data.winston,_.forEach(a.players,function(s){s.games=[],_.forEach(a.games,function(a){a.player===s.id&&s.games.push(a)})}),_.forEach(a.players,function(s){e(s,t),a.rated.push({player:s.name,rating:s.rating,id:"p"+s.id})})})}}]),angular.module("winston").config(["$stateProvider",function(a,s){a.state("home",{url:"/",templateUrl:"updateStats.html",controller:"mainCTRL",resolve:{preloadObj:["$http",function(a){return a({method:"GET",url:"/api/stats"})}]}})}]).run(["$state",function(a){a.go("home")}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImFwaVNWQy5qcyIsIm1haW5DVExSTC5qcyIsInJvdXRlcy5qcyJdLCJuYW1lcyI6WyJhbmd1bGFyIiwibW9kdWxlIiwic2VydmljZSIsIiRodHRwIiwidGhpcyIsImFkZE5ldyIsIml0ZW0iLCJwb3N0IiwicmVtb3ZlIiwiZ2V0IiwibG9hZCIsImNvbnRyb2xsZXIiLCIkc2NvcGUiLCJhcGlTVkMiLCJwcmVsb2FkT2JqIiwiX3Nob3dJbnB1dCIsInN0YXRzIiwia2V5IiwidmFsIiwiVXN0YXRzIiwiZGF0YSIsInN0YXR1cyIsImNvbnNvbGUiLCJsb2ciLCJtZXNzYWdlIiwiZ2FtZVN0YXRzIiwid2luc3RvbiIsIm5ld1N0YXRzIiwic3VjY2VzcyIsInJlc3VsdCIsInRvZ2dsZUlucHV0IiwiY29uc3RyYWludCIsImFsZXJ0IiwiSlNPTiIsInN0cmluZ2lmeSIsImRldGFpbCIsImRlbGV0ZVJvdyIsInJlc3BvbnNlIiwibWF4R2FtZXMiLCJtYXgiLCJfIiwiZm9yRWFjaCIsInBsYXllcnMiLCJwbGF5ZXIiLCJnYW1lcyIsImxlbmd0aCIsIndlZWtzIiwiaSIsInB1c2giLCJnYW1lIiwiaWQiLCJhY2N1bXVsYXRlU3RhdHMiLCJ3ZWVrIiwicmF0ZSIsInBhc3NpbmdfYXR0IiwiYSIsInN0YXRzQ3VtIiwicGFzc2luZ19jb21wIiwiYiIsInBhc3NpbmdfeWRzIiwiYyIsInBhc3NpbmdfdGQiLCJkIiwicGFzc2luZ19pbnQiLCJ0YWtlIiwicmF0aW5nIiwicmF0ZVBsYXllcnMiLCIkIiwic3BsaXQiLCJyYXRlZCIsInBsYXllcnNPYmoiLCJnYW1lU3RhdGVzIiwibmFtZSIsImNvbmZpZyIsIiRzdGF0ZVByb3ZpZGVyIiwic2VhcmNoU3ZjIiwic3RhdGUiLCJ1cmwiLCJ0ZW1wbGF0ZVVybCIsInJlc29sdmUiLCJtZXRob2QiLCJydW4iLCIkc3RhdGUiLCJnbyJdLCJtYXBwaW5ncyI6IkFBQ0FBLFFBQUFDLE9BQUEsV0FBQSxjQ0RBRCxRQUFBQyxPQUFBLFdBQ0FDLFFBQUEsVUFBQSxRQUFBLFNBQUFDLEdBQ0FDLEtBQUFDLE9BQUEsU0FBQUMsR0FDQSxNQUFBSCxHQUFBSSxLQUFBLGlCQUFBRCxJQUVBRixLQUFBSSxPQUFBLFdBQ0EsTUFBQUwsR0FBQU0sSUFBQSxzQkFFQUwsS0FBQU0sS0FBQSxXQUNBLE1BQUFQLEdBQUFNLElBQUEsa0JDVEFULFFBQUFDLE9BQUEsV0FDQVUsV0FBQSxZQUFBLFNBQUEsU0FBQSxhQUFBLFNBQUFDLEVBQUFDLEVBQUFDLEdBQ0FGLEVBQUFHLFlBQUEsQ0FDQSxJQUFBQyxHQUFBLFdBQ0EsUUFFQUMsSUFBQSxPQUNBQyxJQUFBLE9BR0FELElBQUEsT0FDQUMsSUFBQSxPQUdBRCxJQUFBLElBQ0FDLElBQUEsT0FHQUQsSUFBQSxLQUNBQyxJQUFBLE9BR0FELElBQUEsWUFDQUMsSUFBQSxPQUdBRCxJQUFBLFdBQ0FDLElBQUEsT0FHQUQsSUFBQSxXQUNBQyxJQUFBLE9BR0FELElBQUEsV0FDQUMsSUFBQSxPQUdBRCxJQUFBLFdBQ0FDLElBQUEsT0FHQUQsSUFBQSxVQUNBQyxJQUFBLE9BR0FELElBQUEsV0FDQUMsSUFBQSxPQUdBRCxJQUFBLFdBQ0FDLElBQUEsT0FHQUQsSUFBQSxZQUNBQyxJQUFBLE9BR0FELElBQUEsWUFDQUMsSUFBQSxPQUdBRCxJQUFBLFdBQ0FDLElBQUEsT0FHQUQsSUFBQSxXQUNBQyxJQUFBLE9BR0FELElBQUEsV0FDQUMsSUFBQSxPQUdBRCxJQUFBLFVBQ0FDLElBQUEsT0FHQUQsSUFBQSxNQUNBQyxJQUFBLE9BR0FELElBQUEsV0FDQUMsSUFBQSxRQUlBQyxFQUFBLFdBQ0EsUUFFQUYsSUFBQSxPQUNBQyxJQUFBLE9BR0FELElBQUEsSUFDQUMsSUFBQSxPQUdBRCxJQUFBLEtBQ0FDLElBQUEsT0FHQUQsSUFBQSxZQUNBQyxJQUFBLE9BR0FELElBQUEsV0FDQUMsSUFBQSxPQUdBRCxJQUFBLFdBQ0FDLElBQUEsT0FHQUQsSUFBQSxXQUNBQyxJQUFBLE9BR0FELElBQUEsV0FDQUMsSUFB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QUEsUUFBQSxTQUFBWCxHQUNBLE1BQUFBLElBQUE2RSxPQUFBLE1BQUFILElBQUEsdUJBc0JBSSxLQUFBLFNBQUEsU0FBQUMsR0FFQUEsRUFBQUMsR0FBQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIG5lZWRzIHRvIGJlIGxvYWRlZCBmaXJzdCBiZWNhdXNlIGl0IGRlZmluZXMgdGhlIGRlcGVuZGVuY2llcy4gVGhlIGd1bHAgdGFzayB3aWxsIGFsd2F5cyBjb25jYXQgdGhpcyB0byB0aGUgdG9wIG9mIGZpbGVcbmFuZ3VsYXIubW9kdWxlKCd3aW5zdG9uJywgWyd1aS5yb3V0ZXInXSk7IiwiYW5ndWxhci5tb2R1bGUoJ3dpbnN0b24nKVxuLnNlcnZpY2UoJ2FwaVNWQycsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgIHRoaXMuYWRkTmV3ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3N0YXRzL2FkZCcsaXRlbSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3N0YXRzL3JlbW92ZScpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9zdGF0cycpXG4gICAgICAgIH1cbiAgICB9KTsiLCJhbmd1bGFyLm1vZHVsZSgnd2luc3RvbicpXG4gICAgLmNvbnRyb2xsZXIoJ21haW5DVFJMJyxmdW5jdGlvbigkc2NvcGUsYXBpU1ZDLHByZWxvYWRPYmope1xuICAgICAgICAkc2NvcGUuX3Nob3dJbnB1dCA9IGZhbHNlO1xuICAgICAgICB2YXIgc3RhdHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICd3ZWVrJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2RhdGUnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnZycsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdncycsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX2NvbXAnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc19hdHQnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc19wY3QnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc195ZHMnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc19hdmcnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc190ZCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX2ludCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX3NjaycsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX3Nja3knLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc19yYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3J1c2hfYXR0JyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3J1c2hfeWRzJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3J1c2hfYXZnJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3J1c2hfdGQnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnZnVtJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2Z1bV9sb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIFVzdGF0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2RhdGUnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnZycsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdncycsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX2NvbXAnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc19hdHQnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc19wY3QnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc195ZHMnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc19hdmcnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc190ZCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX2ludCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX3NjaycsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX3Nja3knLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc19yYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3J1c2hfYXR0JyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3J1c2hfeWRzJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3J1c2hfYXZnJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3J1c2hfdGQnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnZnVtJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2Z1bV9sb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHByZWxvYWRPYmouZGF0YS5zdGF0dXMgPT0gJ2VycicpIGNvbnNvbGUubG9nKHByZWxvYWRPYmouZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgJHNjb3BlLmdhbWVTdGF0cyA9IHByZWxvYWRPYmouZGF0YS5kYXRhLndpbnN0b247XG4gICAgICAgICRzY29wZS5zdGF0cyA9IG5ldyBzdGF0cygpO1xuICAgICAgICAkc2NvcGUuVXN0YXRzID0gbmV3IFVzdGF0cygpO1xuICAgICAgICAkc2NvcGUubmV3U3RhdHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGFwaVNWQy5hZGROZXcoJHNjb3BlLlVzdGF0cykuc3VjY2VzcyhmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdHVzID09IFwic3VjY2Vzc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5Vc3RhdHMgPSBuZXcgVXN0YXRzKCk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS50b2dnbGVJbnB1dCgpO1xuICAgICAgICAgICAgICAgICAgICBhcGlTVkMubG9hZCgpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmdhbWVTdGF0cyA9IGRhdGEuZGF0YS53aW5zdG9uO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0Lm1lc3NhZ2UuY29uc3RyYWludCA9PSAnZ2FtZV9waycpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvcjogVGhhdCBnYW1lIGFscmVhZHkgZXhpc3RzIGluIHRoZSBkYXRhYmFzZS4gRGVsZXRlIGl0IGZpcnN0IGlmIHlvdSB3YW50IHRvIHVwZGF0ZSBpdFwiKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvcjogXCIgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQubWVzc2FnZS5kZXRhaWwpKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS50b2dnbGVJbnB1dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLl9zaG93SW5wdXQgPSAhJHNjb3BlLl9zaG93SW5wdXQ7XG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS5kZWxldGVSb3cgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICgkc2NvcGUuZ2FtZVN0YXRzICE9IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgYXBpU1ZDLnJlbW92ZSgpLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09ICdzdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBpU1ZDLmxvYWQoKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2FtZVN0YXRzID0gZGF0YS5kYXRhLndpbnN0b247XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLm1heEdhbWVzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbWF4ID0gMDtcbiAgICAgICAgICAgIF8uZm9yRWFjaCgkc2NvcGUucGxheWVycywgZnVuY3Rpb24ocGxheWVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBsYXllci5nYW1lcy5sZW5ndGggPiBtYXgpIG1heCA9IHBsYXllci5nYW1lcy5sZW5ndGg7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciB3ZWVrcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBtYXggKyAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICB3ZWVrcy5wdXNoKGkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gd2Vla3M7XG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS5wbGF5ZXJzID0gcHJlbG9hZE9iai5kYXRhLmRhdGEucGxheWVycztcbiAgICAgICAgJHNjb3BlLmdhbWVzID0gcHJlbG9hZE9iai5kYXRhLmRhdGEuZ2FtZXM7XG4gICAgICAgIF8uZm9yRWFjaCgkc2NvcGUucGxheWVycywgZnVuY3Rpb24ocGxheWVyKSB7XG4gICAgICAgICAgICBwbGF5ZXIuZ2FtZXMgPSBbXTtcbiAgICAgICAgICAgIF8uZm9yRWFjaCgkc2NvcGUuZ2FtZXMsIGZ1bmN0aW9uKGdhbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZ2FtZS5wbGF5ZXIgPT09IHBsYXllci5pZCkgcGxheWVyLmdhbWVzLnB1c2goZ2FtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBhY2N1bXVsYXRlU3RhdHMgPSBmdW5jdGlvbihwbGF5ZXIsIHdlZWspIHtcbiAgICAgICAgICAgIHZhciBnYW1lcyA9IF8udGFrZShwbGF5ZXIuZ2FtZXMsIHdlZWspO1xuICAgICAgICAgICAgdmFyIHN0YXRzQ3VtID0ge1xuICAgICAgICAgICAgICAgIHBhc3NpbmdfY29tcDowLFxuICAgICAgICAgICAgICAgIHBhc3NpbmdfeWRzOiAwLFxuICAgICAgICAgICAgICAgIHBhc3NpbmdfdGQ6IDAsXG4gICAgICAgICAgICAgICAgcGFzc2luZ19hdHQ6IDAsXG4gICAgICAgICAgICAgICAgcGFzc2luZ19pbnQ6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBfLmZvckVhY2goZ2FtZXMsZnVuY3Rpb24oZ2FtZSkge1xuICAgICAgICAgICAgICAgIGlmIChnYW1lLnBhc3NpbmdfY29tcCAhPSBudWxsKSBzdGF0c0N1bS5wYXNzaW5nX2NvbXAgKz0gZ2FtZS5wYXNzaW5nX2NvbXA7XG4gICAgICAgICAgICAgICAgaWYgKGdhbWUucGFzc2luZ195ZHMgIT0gbnVsbCkgc3RhdHNDdW0ucGFzc2luZ195ZHMgKz0gZ2FtZS5wYXNzaW5nX3lkcztcbiAgICAgICAgICAgICAgICBpZiAoZ2FtZS5wYXNzaW5nX3RkICE9IG51bGwpIHN0YXRzQ3VtLnBhc3NpbmdfdGQgKz0gZ2FtZS5wYXNzaW5nX3RkO1xuICAgICAgICAgICAgICAgIGlmIChnYW1lLnBhc3NpbmdfYXR0ICE9IG51bGwpIHN0YXRzQ3VtLnBhc3NpbmdfYXR0ICs9IGdhbWUucGFzc2luZ19hdHQ7XG4gICAgICAgICAgICAgICAgaWYgKGdhbWUucGFzc2luZ19pbnQgIT0gbnVsbCkgc3RhdHNDdW0ucGFzc2luZ19pbnQgKz0gZ2FtZS5wYXNzaW5nX2ludDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZnVuY3Rpb24gcmF0ZShzdGF0cykge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0cy5wYXNzaW5nX2F0dCAhPSBudWxsICYmIHN0YXRzLnBhc3NpbmdfYXR0ICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZm9ybXVsYSBmcm9tIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1Bhc3Nlcl9yYXRpbmdcbiAgICAgICAgICAgICAgICAgICAgdmFyIGEgPSAoc3RhdHNDdW0ucGFzc2luZ19jb21wIC8gc3RhdHNDdW0ucGFzc2luZ19hdHQgLSAuMykgKiA1O1xuICAgICAgICAgICAgICAgICAgICB2YXIgYiA9IChzdGF0c0N1bS5wYXNzaW5nX3lkcyAvIHN0YXRzQ3VtLnBhc3NpbmdfYXR0IC0gMykgKiAuMjU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjID0gKHN0YXRzQ3VtLnBhc3NpbmdfdGQgLyBzdGF0c0N1bS5wYXNzaW5nX2F0dCkgKiAyMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGQgPSAyLjM3NSAtIChzdGF0c0N1bS5wYXNzaW5nX2ludCAvIHN0YXRzQ3VtLnBhc3NpbmdfYXR0ICogMjUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYSA+IDIuMzc1KSBhID0gMi4zNzU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhIDwgMCkgYSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiID4gMi4zNzUpIGIgPSAyLjM3NTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGIgPCAwKSBiID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGMgPiAyLjM3NSkgYyA9IDIuMzc1O1xuICAgICAgICAgICAgICAgICAgICBpZiAoYyA8IDApIGMgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZCA+IDIuMzc1KSBkID0gMi4zNzU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkIDwgMCkgZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoYSArIGIgKyBjICsgZCkgLyA2ICogMTAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGxheWVyLnJhdGluZyA9IHJhdGUoc3RhdHNDdW0pO1xuICAgICAgICAgICAgcmV0dXJuIHBsYXllcjtcbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLnJhdGVQbGF5ZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgd2VlayA9ICQoJyN3ZWVrMnJhdGUnKS52YWwoKS5zcGxpdCgnICcpWzFdO1xuICAgICAgICAgICAgJHNjb3BlLnJhdGVkID0gW107XG4gICAgICAgICAgICBhcGlTVkMubG9hZCgpLnN1Y2Nlc3MoZnVuY3Rpb24ocGxheWVyc09iaikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHBsYXllcnNPYmopO1xuICAgICAgICAgICAgICAgICRzY29wZS5wbGF5ZXJzID0gcGxheWVyc09iai5kYXRhLnBsYXllcnM7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmdhbWVzID0gcGxheWVyc09iai5kYXRhLmdhbWVzO1xuICAgICAgICAgICAgICAgICRzY29wZS5nYW1lU3RhdGVzID0gcGxheWVyc09iai5kYXRhLndpbnN0b247XG4gICAgICAgICAgICAgICAgXy5mb3JFYWNoKCRzY29wZS5wbGF5ZXJzLCBmdW5jdGlvbihwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdhbWVzID0gW107XG4gICAgICAgICAgICAgICAgICAgIF8uZm9yRWFjaCgkc2NvcGUuZ2FtZXMsIGZ1bmN0aW9uKGdhbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnYW1lLnBsYXllciA9PT0gcGxheWVyLmlkKSBwbGF5ZXIuZ2FtZXMucHVzaChnYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXy5mb3JFYWNoKCRzY29wZS5wbGF5ZXJzLCBmdW5jdGlvbihwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjdW11bGF0ZVN0YXRzKHBsYXllcix3ZWVrKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJhdGVkLnB1c2goe1wicGxheWVyXCI6cGxheWVyLm5hbWUsXCJyYXRpbmdcIjpwbGF5ZXIucmF0aW5nLFwiaWRcIjpcInBcIitwbGF5ZXIuaWR9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCJhbmd1bGFyLm1vZHVsZSgnd2luc3RvbicpXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJyxmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgc2VhcmNoU3ZjKXtcbiAgICAgICAgLy8gVGhlc2Ugc3RhdGVzIGNvcnJlc3BvbmQgdG8gdGhlIHBhZ2VzIG9uIHRoZSBhcHAuIEhvb2tzIHVwIHRlbXBsYXRlcyBhbmQgdmlld3NcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLHtcbiAgICAgICAgICAgIHVybDogJy8nLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd1cGRhdGVTdGF0cy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdtYWluQ1RSTCcsXG4gICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgcHJlbG9hZE9iajogZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHttZXRob2Q6J0dFVCcsdXJsOicvYXBpL3N0YXRzJ30pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vLnN0YXRlKCdzZWFyY2gnLHtcbiAgICAgICAgICAgIC8vICAgIHVybDogJy9zZWFyY2gnLFxuICAgICAgICAgICAgLy8gICAgdGVtcGxhdGVVcmw6ICdzZWFyY2guaHRtbCcsXG4gICAgICAgICAgICAvLyAgICBjb250cm9sbGVyOiAnc2VhcmNoQ1RSTCcsXG4gICAgICAgICAgICAvLyAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAvLyAgICAgICAgLy8gVGhpcyBxdWVyaWVzIHRoZSBzZXJ2ZXIgZm9yIGRpc3RpbmN0IGRlcGFydG1lbnRzIGFuZCBwcmVsb2FkcyB0aGUgZGVwYXJ0bWVudHMgZHJvcCBkb3duXG4gICAgICAgICAgICAvLyAgICAgICAgcHJlbG9hZE9CSjogZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgcmV0dXJuICRodHRwKHttZXRob2Q6J0dFVCcsdXJsOicvYXBpL2RlcGFydG1lbnRzJ30pO1xuICAgICAgICAgICAgLy8gICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgIH1cbiAgICAgICAgICAgIC8vfSlcbiAgICAgICAgICAgIC8vLnN0YXRlKCdkZXRhaWxzJyx7XG4gICAgICAgICAgICAvLyAgICAvLyBUaGUgOmlkIGlzIHRoZSBzdHJpbmcgcGFzc2VkIGluIGZyb20gdGhlIFVSTCBjb3JyZXNwb25kcyB0byB0aGUgcGVyc29uSUQgaW4gdGhlIHRoZSBkYXRhYmFzZVxuICAgICAgICAgICAgLy8gICAgdXJsOiAnL2RldGFpbHMvOmlkJyxcbiAgICAgICAgICAgIC8vICAgIHRlbXBsYXRlVXJsOiAnZGV0YWlscy5odG1sJyxcbiAgICAgICAgICAgIC8vICAgIGNvbnRyb2xsZXI6ICdkZXRhaWxDVFJMJ1xuICAgICAgICAgICAgLy99KVxuICAgIH1dKVxuICAgIC5ydW4oWyckc3RhdGUnLGZ1bmN0aW9uKCRzdGF0ZSl7XG4gICAgICAgIC8vIEV2ZXJ5dGhpbmcgaW5zaWRlIGhlcmUgd2lsbCBiZSBydW4gb25lIHRpbWUgb25jZSB0aGUgYXBwIGhhcyBsb2FkZWQuIEdvb2QgcGxhY2UgdG8gaW5pdGlhbGl6ZSBhbnl0aGluZyB5b3Ugd2lsbCBiZSB1c2luZ1xuICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICB9XSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=