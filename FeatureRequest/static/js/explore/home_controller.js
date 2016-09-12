var app = angular.module('machinamaApp', []);

app.controller('HomeController', function($scope, $window, $http) {

    $scope.deleteDataset = function(dataset_id){
        console.log("dataset_id", dataset_id);
        var post_data = new FormData();
        post_data.append("file_id", dataset_id);
        $scope.submit_form(post_data, '/delete_dataset');
    };

    $scope.submit_form = function(post_data, url, dataset_id){
		$('#spinner').css({'display':'inline-block'});
		$.ajax({
              url: url,
              type: 'POST',
              data: post_data,
              success: function (response) {
                            debugger;
                            console.log(response);
                            $('a[data-dataset_id=' + dataset_id + ']').remove();
                      },

              cache: false,
              contentType: false,
              processData: false
          });
	};

});