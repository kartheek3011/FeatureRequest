
function aggregate_data(data, x_axis, y_axis, grouping){
    aggregated_data = {};
    console.log(grouping);
    if(grouping == 'none'){
        var unique_values = dimple.getUniqueValues(data, x_axis);
        for(i=0; i<unique_values.length; i++){
            aggregated_data[unique_values[i]] = {};
            aggregated_data[unique_values[i]][x_axis] = unique_values[i];
            aggregated_data[unique_values[i]][y_axis] = 0;
        }
        console.log(aggregated_data);
        for(i=0; i<data.length; i++){
            var x_value = data[i][x_axis];
            var y_value = data[i][y_axis];
            aggregated_data[x_value][y_axis] += parseInt(y_value);
        }
        aggregated_data = Object.keys(aggregated_data).map(function(key){ return aggregated_data[key] });
    }
    else
    {
        for(i=0; i<data.length; i++){
            var x_value = data[i][x_axis];
            var y_value = data[i][y_axis];
            var z_value = data[i][grouping];
            if(aggregated_data[x_value] === undefined){
                aggregated_data[x_value] = {};
                aggregated_data[x_value][z_value] = {};
                aggregated_data[x_value][z_value][x_axis] = x_value;
                aggregated_data[x_value][z_value][y_axis] = parseInt(y_value);
                aggregated_data[x_value][z_value][grouping] = z_value;
            }
            else if(aggregated_data[x_value][z_value] === undefined){
                aggregated_data[x_value][z_value] = {};
                aggregated_data[x_value][z_value][x_axis] = x_value;
                aggregated_data[x_value][z_value][y_axis] = parseInt(y_value);
                aggregated_data[x_value][z_value][grouping] = z_value;
            }
            else{
                aggregated_data[x_value][z_value][x_axis] = x_value;
                aggregated_data[x_value][z_value][y_axis] += parseInt(y_value);
                aggregated_data[x_value][z_value][grouping] = z_value;
            }
        }
        aggregated_data = Object.keys(aggregated_data).map(function(key){ return aggregated_data[key] });
        var new_aggregated_data = [];
        for(key_1 in aggregated_data){
            for(key_2 in aggregated_data[key_1]){
                new_aggregated_data.push(aggregated_data[key_1][key_2])
            }
        }
        aggregated_data = new_aggregated_data;

    }
    return aggregated_data;
}

var app = angular.module('machinamaApp', []);

app.controller('chartCtrl', function($scope, $window) {
	function showSpinner(){
		$('#spinner').css({'display':'block'});
	}

	function hideSpinner(){
		$('#spinner').css({'display':'none'});
	}

	$scope.storeChart = function(x_axis, y_axis, grouping, chart_type){
		var datasetId = $('#chartContainer').data("datasetid");
		console.log("file_name", file_name);
		console.log("datasetId", datasetId);
		console.log("x_axis", x_axis);
		console.log("y_axis", y_axis);
		console.log("grouping", grouping);
		console.log("chart_type", chart_type);

		var post_data = new FormData();
        post_data.append("file_url", file_name);
        post_data.append("file_id", datasetId);
        post_data.append("x_axis", x_axis);
        post_data.append("y_axis", y_axis);
        post_data.append("grouping", grouping);
        post_data.append("chart_type", chart_type);

        $scope.submit_form(post_data, '/store_chart');
	}

	$scope.submit_form = function(post_data, url){
		$.ajax({
              url: url,
              type: 'POST',
              data: post_data,
              success: function (response) {
                            console.log("response", response)
                      	},
              cache: false,
              contentType: false,
              processData: false
          });
	};

	$scope.barChart = function(x_axis, y_axis, grouping){
    	if($scope.validateParams(x_axis, y_axis)){
    		$scope.storeChart(x_axis, y_axis, grouping, "barChart");
    		if (myChart){
				delete(myChart);
			}
			$('#chartContainer').empty();
			$scope.charted = true;
			showSpinner();

			setTimeout(function(){
				if (grouping == 'none') {
					var svg = dimple.newSvg("#chartContainer", 590, 400);
					myChart = new dimple.chart(svg, a_data);
					//myChart.setMargins("60px", "30px", "110px", "70px");
					myChart.setBounds(60, 30, 510, 330);
					myChart.addCategoryAxis("x", x_axis);
					myChart.addMeasureAxis("y", y_axis);
					myChart.addSeries( null , dimple.plot.bar);
					myChart.addLegend(65, 10, 510, 20, "right");
					hideSpinner();
					myChart.draw();
				} else{
					var svg = dimple.newSvg("#chartContainer", 590, 400);
					myChart = new dimple.chart(svg, a_data);
					myChart.setBounds(60, 30, 510, 330);
					//myChart.setMargins("60px", "30px", "110px", "70px");
					myChart.addCategoryAxis("x", [x_axis, grouping] );
					myChart.addMeasureAxis("y", y_axis);
					myChart.addSeries( grouping , dimple.plot.bar);
					myChart.addLegend(65, 10, 510, 20, "right");
					hideSpinner();
					myChart.draw();
				};

			}, 1);
    	}else{
    		return
    	}

    };

    $scope.areaChart = function(x_axis, y_axis, grouping){
    	if($scope.validateParams(x_axis, y_axis)){
			if (myChart){
				delete(myChart);
			}
			$scope.storeChart(x_axis, y_axis, grouping, "areaChart");

			$scope.charted = true;

			$('#chartContainer').empty();

			showSpinner();

			setTimeout(function(){

				if (grouping == 'none') {
					var svg = dimple.newSvg("#chartContainer", 590, 400);
					myChart = new dimple.chart(svg, a_data);
					myChart.setBounds(60, 30, 510, 330);
					myChart.addCategoryAxis("x", x_axis);
					myChart.addMeasureAxis("y", y_axis);
					myChart.addSeries( null , dimple.plot.area);
					myChart.addLegend(65, 10, 510, 20, "right");
					hideSpinner();
					myChart.draw();
				} else{
					var svg = dimple.newSvg("#chartContainer", 590, 400);
					myChart = new dimple.chart(svg, a_data);
					myChart.setBounds(60, 30, 510, 330);
					myChart.addCategoryAxis("x", [x_axis, grouping] );
					myChart.addMeasureAxis("y", y_axis);
					myChart.addSeries( grouping , dimple.plot.area);
					myChart.addLegend(65, 10, 510, 20, "right");
					hideSpinner();
					myChart.draw();
				};

			},1);
		}else{
    		return
    	}
    };

    $scope.lineChart = function(x_axis, y_axis, grouping){
    	if($scope.validateParams(x_axis, y_axis)){
    		$scope.storeChart(x_axis, y_axis, grouping, "lineChart");

			if (myChart){
				delete(myChart);
			}
			$('#chartContainer').empty();
			$scope.charted = true;
			showSpinner();
			setTimeout(function(){
				if (grouping == 'none') {
					var svg = dimple.newSvg("#chartContainer", 590, 400);
					myChart = new dimple.chart(svg, a_data);
					myChart.setBounds(60, 30, 510, 330);
					myChart.addCategoryAxis("x", x_axis);
					myChart.addMeasureAxis("y", y_axis);
					myChart.addSeries( null , dimple.plot.line);
					myChart.addLegend(65, 10, 510, 20, "right");
					hideSpinner();
					myChart.draw();
				} else{
					var svg = dimple.newSvg("#chartContainer", 590, 400);
					myChart = new dimple.chart(svg, a_data);
					myChart.setBounds(60, 30, 510, 330);
					myChart.addCategoryAxis("x", [x_axis, grouping] );
					myChart.addMeasureAxis("y", y_axis);
					myChart.addSeries( grouping , dimple.plot.line);
					myChart.addLegend(65, 10, 510, 20, "right");
					hideSpinner();
					myChart.draw();
				};
			},1);
		}else{
    		return
    	}
    };

    $scope.bubbleChart = function(x_axis, y_axis, grouping){
    	if($scope.validateParams(x_axis, y_axis)){
    		$scope.storeChart(x_axis, y_axis, grouping, "bubbleChart");

			if (myChart){
				delete(myChart);
			}
			$('#chartContainer').empty();
			$scope.charted = true;
			showSpinner();

			setTimeout(function(){
				if (grouping == 'none') {
					var svg = dimple.newSvg("#chartContainer", 590, 400);
					myChart = new dimple.chart(svg, a_data);
					myChart.setBounds(60, 30, 510, 330);
					myChart.addCategoryAxis("x", x_axis);
					myChart.addMeasureAxis("y", y_axis);
					myChart.addSeries( null , dimple.plot.bubble);
					myChart.addLegend(65, 10, 510, 20, "right");
					hideSpinner();
					myChart.draw();
				} else{
					var svg = dimple.newSvg("#chartContainer", 590, 400);
					myChart = new dimple.chart(svg, a_data);
					myChart.setBounds(60, 30, 510, 330);
					myChart.addCategoryAxis("x", [x_axis, grouping] );
					myChart.addMeasureAxis("y", y_axis);
					myChart.addSeries( grouping , dimple.plot.bubble);
					myChart.addLegend(65, 10, 510, 20, "right");
					hideSpinner();
					myChart.draw();
				};

			},1);
		}else{
    		return
    	}
    };

    $scope.pieChart = function(x_axis, y_axis, grouping){
    	if($scope.validateParams(x_axis, y_axis)){
    		$scope.storeChart(x_axis, y_axis, grouping, "pieChart");
			if (myChart){
				delete(myChart);
			}
			$('#chartContainer').empty();
			$scope.charted = true;
			showSpinner();

			setTimeout(function(){
				var svg = dimple.newSvg("#chartContainer", 590, 400);
				myChart = new dimple.chart(svg, a_data);
				myChart.setBounds(60, 30, 510, 330);
				myChart.addMeasureAxis("p", y_axis);
				myChart.addSeries( x_axis , dimple.plot.pie);
				myChart.addLegend(65, 10, 510, 20, "left");
				hideSpinner();
				myChart.draw();
			},1);
		}else{
    		return
    	}
    };

    $scope.ringChart = function(x_axis, y_axis, grouping){
    	if($scope.validateParams(x_axis, y_axis)){
    		$scope.storeChart(x_axis, y_axis, grouping, "ringChart");
			if (myChart){
				delete(myChart);
			}
			$('#chartContainer').empty();
			$scope.charted = true;
			showSpinner();

			setTimeout(function(){
				if (grouping == 'none') {
					var svg = dimple.newSvg("#chartContainer", 590, 400);
					myChart = new dimple.chart(svg, a_data);
					myChart.setBounds(60, 30, 510, 330);
					myChart.addMeasureAxis("p", y_axis);
					var ring = myChart.addSeries(x_axis, dimple.plot.pie);
					ring.innerRadius = "50%";
					myChart.addLegend(500, 20, 90, 300, "left");
					hideSpinner();
					myChart.draw();
				} else{
					var svg = dimple.newSvg("#chartContainer", 590, 400);
					var myChart = new dimple.chart(svg, a_data);
					myChart.setBounds(20, 20, 460, 360)
					myChart.addMeasureAxis("p", y_axis);
					var outerRing = myChart.addSeries(x_axis, dimple.plot.pie);
					var innerRing = myChart.addSeries(grouping, dimple.plot.pie);
					// Negatives are calculated from outside edge, positives from center
					outerRing.innerRadius = "-30px";
					innerRing.outerRadius = "-40px";
					innerRing.innerRadius = "-70px";
					myChart.addLegend(500, 20, 90, 300, "left");
					hideSpinner();
					myChart.draw();
				};
			},1);
		}else{
    		return
    	}
    };

    $scope.scatterChart = function(x_axis, y_axis, grouping){
		if($scope.validateParams(x_axis, y_axis)){
			$scope.storeChart(x_axis, y_axis, grouping, "scatterChart");
			if (myChart){
				delete(myChart);
			}
			$('#chartContainer').empty();
			$scope.charted = true;
			showSpinner();
			setTimeout(function(){
				var svg = dimple.newSvg("#chartContainer", 590, 400);
				myChart = new dimple.chart(svg, a_data);
				myChart.setBounds(60, 30, 510, 330);
				//myChart.addMeasureAxis("x", x_axis );
				myChart.addCategoryAxis("x", x_axis);
				myChart.addMeasureAxis("y", y_axis);
				myChart.addSeries( null , dimple.plot.bubble);
				myChart.addLegend(65, 10, 510, 20, "right");
				hideSpinner();
				myChart.draw();
			},1);
		}else{
    		return
    	}
    };

    $scope.stepChart = function(x_axis, y_axis, grouping){
    	if($scope.validateParams(x_axis, y_axis)){
    		$scope.storeChart(x_axis, y_axis, grouping, "stepChart");
			if (myChart){
				delete(myChart);
			}
			$('#chartContainer').empty();
			$scope.charted = true;
			showSpinner();

			setTimeout(function(){
				if (grouping == 'none') {
					var svg = dimple.newSvg("#chartContainer", 590, 400);
					myChart = new dimple.chart(svg, a_data);
					myChart.setBounds(60, 30, 510, 330);
					myChart.addCategoryAxis("x", x_axis);
					myChart.addMeasureAxis("y", y_axis);
					var s = myChart.addSeries( null , dimple.plot.line);
					s.interpolation = "step";
					myChart.addLegend(65, 10, 510, 20, "right");
					hideSpinner();
					myChart.draw();
				} else{
					var svg = dimple.newSvg("#chartContainer", 590, 400);
					myChart = new dimple.chart(svg, a_data);
					myChart.setBounds(60, 30, 510, 330);
					myChart.addCategoryAxis("x", [x_axis, grouping] );
					myChart.addMeasureAxis("y", y_axis);
					var s = myChart.addSeries( grouping , dimple.plot.line);
					s.interpolation = "step";
					myChart.addLegend(65, 10, 510, 20, "right");
					hideSpinner();
					myChart.draw();
				};
			},1);
		}else{
    		return
    	}
    };

    $scope.stepAreaChart = function(x_axis, y_axis, grouping){
    	if($scope.validateParams(x_axis, y_axis)){
    		$scope.storeChart(x_axis, y_axis, grouping, "stepAreaChart");
			if (myChart){
				delete(myChart);
			}
			$('#chartContainer').empty();
			$scope.charted = true;
			showSpinner();
			setTimeout(function(){
				if (grouping == 'none') {
					var svg = dimple.newSvg("#chartContainer", 590, 400);
					myChart = new dimple.chart(svg, a_data);
					myChart.setBounds(60, 30, 510, 330);
					myChart.addCategoryAxis("x", x_axis);
					myChart.addMeasureAxis("y", y_axis);
					var s = myChart.addSeries( null , dimple.plot.area);
					s.interpolation = "step";
					s.lineWeight = 1;
					myChart.addLegend(65, 10, 510, 20, "right");
					hideSpinner();
					myChart.draw();
				} else{
					var svg = dimple.newSvg("#chartContainer", 590, 400);
					myChart = new dimple.chart(svg, a_data);
					myChart.setBounds(60, 30, 510, 330);
					myChart.addCategoryAxis("x", [x_axis, grouping] );
					myChart.addMeasureAxis("y", y_axis);
					var s = myChart.addSeries( grouping , dimple.plot.area);
					s.interpolation = "step";
					s.lineWeight = 1;
					myChart.addLegend(65, 10, 510, 20, "right");
					hideSpinner();
					myChart.draw();
				};
			},1);
		}else{
    		return
    	}
	};

	$scope.x_choice = ""; $scope.y_choice = ""; $scope.g_choice = "none";

	$scope.set_x_Choice = function(choice){
		$scope.x_choice = choice;
		$scope.x_label = choice;
	}

	$scope.set_y_Choice = function(choice){
		$scope.y_choice = choice;
		$scope.y_label = choice;
	}

	$scope.set_grouping_Choice = function(choice){
		$scope.g_choice = choice;
		if(choice == 'none'){
			$scope.g_label = "Group by";
		}else{
			$scope.g_label = choice;
		}

	}

	$scope.validateParams = function(x_axis, y_axis){
		$('#error_div').css({'display':'block'});
		$scope.charted = true;
		var x_flag = false;
		var y_flag = false;

		if(x_axis){
			x_flag = true;
			$scope.x_error = false;
		}else{
			$scope.x_error_message = "Select values for X-axis";
			x_flag = false
			$scope.x_error = true;
		}

		if(y_axis){
			y_flag = true;
			$scope.y_error = false;
		}else{
			$scope.y_error_message = "Select values for Y-axis";
			y_flag = false;
			$scope.y_error = true;
		}

		if(x_flag && y_flag){
			return true
		}else{
			return false;
		}
	}

	$scope.drawChart = function(x_axis, y_axis, grouping){
		$('#error_div').css({'display':'block'});
		$scope.charted = true;
		var x_flag = false;
		var y_flag = false;
		var g_flag = false;

		if(x_axis){
			x_flag = true;
			$scope.x_error = false;
		}else{
			$scope.x_error_message = "Select values for X-axis";
			x_flag = false
			$scope.x_error = true;
		}

		if(y_axis){
			y_flag = true;
			$scope.y_error = false;
		}else{
			$scope.y_error_message = "Select values for Y-axis";
			y_flag = false;
			$scope.y_error = true;
		}

		if(x_flag && y_flag){
			var count = dimple.getUniqueValues(a_data, x_axis);


			if(count.length > 10){
				$scope.areaChart(x_axis, y_axis, grouping);
			}else{
				$scope.barChart(x_axis, y_axis, grouping);
			}
		}else{
			return;
		}
	}

	$scope.show_spinner = false;

	$scope.x_error = false; $scope.y_error = false; $scope.g_error = false;
	$scope.charted = false;

	$('[data-toggle="tooltip"]').tooltip();
	var myChart;
	var a_data;
	var file_name = $('#chartContainer').data("fileurl");
	var datasetId = $('#chartContainer').data("datasetid");

	var last_file_url = $('#lChartDts').data("lastfile");
	var lastx = $('#lChartDts').data("lastx");
	var lasty = $('#lChartDts').data("lasty");
	var lastchart = $('#lChartDts').data("lastchart");
	var lastgroup = $('#lChartDts').data("lastgroup");

	$scope.x_label = "Pick X Axis";
	$scope.y_label = "Pick Y Axis";
	$scope.g_label = "Group by";

	$scope.save_image = function(){

		var doctype = '<?xml version="1.0" standalone="no"?>'
          + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
        // serialize our SVG XML to a string.
        var source = (new XMLSerializer()).serializeToString(d3.select('svg').node());
        // create a file blob of our SVG.

        var blob = new Blob([ doctype + source], { type: 'image/svg+xml;charset=utf-8' });
        var url = window.URL.createObjectURL(blob);


        var img = d3.select('#download-img').attr('href', url).append('img')
         .attr('width', 590)
         .attr('height', 400)
         .node();
        // start loading the image.
        img.src = url;

	};

	var chartObject = {
				"barChart": $scope.barChart,
				"areaChart": $scope.areaChart,
				"lineChart": $scope.lineChart,
				"bubbleChart": $scope.bubbleChart,
				"pieChart": $scope.pieChart,
				"ringChart": $scope.ringChart,
				"scatterChart": $scope.scatterChart,
				"stepChart": $scope.stepChart,
				"stepAreaChart": $scope.stepAreaChart,
			};

	if (last_file_url == file_name){
		$scope.charted= true;
		console.log("show spinner");
		$scope.x_label = lastx;
		$scope.y_label = lasty;
		$scope.g_label = lastgroup;
		showSpinner();
	}

	$scope.drawLastChart = function(){
		if (last_file_url == file_name){
			$scope.set_x_Choice(lastx);
			$scope.set_y_Choice(lasty);
			$scope.set_grouping_Choice(lastgroup);
			var function_to_call = chartObject[lastchart];
			function_to_call(lastx, lasty, lastgroup);
		}

	}
	a = file_name.split(".");

	if (a[a.length - 1] == "json" || a[a.length - 1] == "js"){
		d3.json(file_name, function (data) {
			a_data = data;
			$scope.drawLastChart();
		});
	}else{
		d3.csv(file_name, function (data) {
			a_data = data;
			$scope.drawLastChart();
		});
	}
});
