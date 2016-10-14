var application = angular.module('myApp',[]);


application.controller('timer',['$http','$scope','$interval',function($http,$scope,$interval){
$scope.lat = 0;
$scope.lon = 0;
$interval(updateGeo, 5000);
function updateGeo() {
    //if (navigator.geolocation) {
        //navigator.geolocation.getCurrentPosition(function(position){
            //$scope.$apply(function(){
                //$scope.lat = position.coords.latitude;
                //$scope.lon = position.coords.longitude;
                
                //var response = $http({
                //    method: 'POST',
                //    url: '/log',
                //    data:{lat: $scope.lat, lon:$scope.lon}
                //    })
                    //.success(function(data, status, headers, config){
                    //    $scope.crontab = angular.fromJson(data);
                    //})    
            //});
        //});
    //};
};
  
}]);


application.controller('realtime',['$http','$scope','$interval',function($http,$scope,$interval){

$interval(updateGeo, 5000);
function updateGeo() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            $scope.$apply(function(){
                //$scope.lat = position.coords.latitude;
                //$scope.lon = position.coords.longitude;
                var response = $http({
                        method: 'POST',
                        url: '/realtime',
                        data:{}
                    })
                .success(function(data, status, headers, config){
                    $scope.location = angular.fromJson(JSON.stringify(data));
                    //$scope.setMarker($scope.location);
                })    
            });//APPLY
        });
    };
};
  
}]);

application.controller('places',['$http','$scope','$interval',function($http,$scope,$interval){
var response = $http({
                        method: 'POST',
                        url: '/list/places',
                        data:{}
                    })
                .success(function(data, status, headers, config){
                    var x = angular.fromJson(JSON.stringify(data));
                    //var t = JSON.parse(data)
                    alert(x)
                })

}]);