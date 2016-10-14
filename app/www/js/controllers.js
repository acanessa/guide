angular.module('app.controllers', [])
//bug
//logout hay que desconectar el soket tambien



















.controller('camaraCtrl', function($scope,cameraService,$sce,$rootScope) {

  
    
    console.log('Controller loaded!')
    var canvas;
    var video;
    var context;
    
    cameraService.init()
    .then(function(stream){
        console.log('Init')
        $scope.src = $sce.trustAsResourceUrl(stream);
        video = document.getElementById("video");    
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d")
        
    })
    
    $scope.snap = function(){
        console.log('snap')
        context.drawImage(video, 0, 0, 640,480); 
        var data = canvas.toDataURL({
            format: 'png',
            left: 0,
            top: 0,
            width: 640,
            height: 480,
        })        
        cameraService.snap(data)
        console.log(data)
    }
    $scope.teta = function(){
        alert()
    }
    $scope.$on('feedback', function(event, data) {
        $rootScope.$apply(function(){
            $scope.texto = data.data;
        })
    })
})



.controller('qrcodeCtrl', function($scope,qrService,$sce,$rootScope,$timeout) {
    var canvas;
    var video;
    var context;
    
    $scope.decoding = false;
    var clear_feedback = function (){
        $timeout(function(){
                $scope.feedback = '';
                console.log('ssss')
        },5000);
    };
    
    qrService.init()
    .then(function(stream){
        console.log('Init')
        $scope.src = $sce.trustAsResourceUrl(stream);
        video = document.getElementById("video");    
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d")
    })
    $scope.snap = function(){
        console.log('snap')
        $scope.decoding = 'true';
        context.drawImage(video, 0, 0, 640,480); 
        var data = canvas.toDataURL({
            format: 'png',
            left: 0,
            top: 0,
            width: 640,
            height: 480,
        })
        qrService.snap(data,function(decoded){
            $scope.feedback = decoded;
            $scope.decoding = false;
            clear_feedback();
        })
    }
    
//    $scope.$on('qr_decoded', function(event, data) {
//        $rootScope.$apply(function(){
//            $scope.texto = data.data;
//        })
//    })
})   

.controller('tipoCtrl', function($scope,placeService,$state) {
    //$scope.place_types = []
    placeService.get_place_type()
    .then(function(place_types){
        console.log(place_types)
        $scope.place_types = place_types    
    })
    
    
    
    $scope.get_places = function(type_id){
         $state.go('tabsController.lugares',{place_type: type_id})
    }
    
  
})





















.controller('lugaresCtrl', function($scope,$stateParams,$state,placeService,sharedProperties,locationService) {
    var place_type = $stateParams.place_type;
    //$scope.places = [];
    //$scope.no_result = false;
    options = {
        place_type:place_type,
        lat:sharedProperties.getLat(),
        lon:sharedProperties.getLon(),
        range:1000
    }; 
    
    placeService.get_places(options)
    .then(function(data){
        $scope.places = data;
        console.log(data.length)
        console.log('Data:',data)
    })   
    
    $scope.get_detail = function(place_id) {        
        $state.transitionTo('tabsController.detalles', {
           place_id: place_id
        });
    }
})
   
.controller('detallesCtrl', function($scope,$stateParams,placeService,mapService,sharedProperties) {    
    var place_id = $stateParams.place_id;
    
    $scope.get_location = function(){
        placeService.get_detail(place_id)
        .then(function(place){
            //$scope.place = place;
            return place;
        })
        .then(function(place){
            var options = {
                origin_lat: sharedProperties.getLat(),
                origin_lon: sharedProperties.getLon(),
                destination_lat: place.lat,
                destination_lon: place.lon,
                mode: 'walking',
                language: 'es'
            };

            mapService.get_direction(options)
            .then(function(directions){
                $scope.directions = directions.data;
                return directions
            })
            .then(function(directions){
                mapService.get_distance(options)
                .then(function(distance){
                    $scope.place = place;
                    $scope.distance = distance.data.distance + ' en ';
                    $scope.duration = distance.data.duration;
                    $scope.directions = directions.data;
                });
        })

        });//place     
    };
    
    
    placeService.get_detail(place_id)
    .then(function(place){
        //$scope.place = place;
        return place;
    })
    .then(function(place){
        var options = {
            origin_lat: sharedProperties.getLat(),
            origin_lon: sharedProperties.getLon(),
            destination_lat: place.lat,
            destination_lon: place.lon,
            mode: 'walking',
            language: 'es'
        };

        mapService.get_direction(options)
        .then(function(directions){
            $scope.directions = directions.data;
            return directions
        })
        .then(function(directions){
            mapService.get_distance(options)
            .then(function(distance){
                $scope.place = place;
                $scope.distance = distance.data.distance + ' en ';
                $scope.duration = distance.data.duration;
                $scope.directions = directions.data;
            });
    })
        
    });//place
    
    
    
})

//bug - state se necesita?
.controller('loginCtrl', function($scope,auth,$localStorage,$timeout) {
    $scope.form={};    
    $scope.form.username = 'acanessa';
    $scope.form.password = 'acanessa'
    var clear_error = function (){
        $timeout(function(){
                $scope.feedback = '';
        },1500);
    };
    
    $scope.login = function(){
        var credentials = {
            username: $scope.form.username,
            password: $scope.form.password
        };
        auth.signin(credentials)
        .then(function(token){
            console.log(token)
            window.location = "/#/tab_main/location";
        })
        .catch(function(error){
            if (error.status != 0){
                $scope.feedback = error;
                clear_error()   
            }
        });
    };
})//login
   
.controller('miUbicacionCtrl', function($rootScope,$scope,socket,locationService,mapService) {
    $rootScope.$on('geo',function(event,data){
        console.log(data.timestamp)
            $rootScope.$apply(function(){
            $scope.longitude = data.longitude;
            $scope.latitude = data.latitude;
            $scope.accuracy = data.accuracy;
            $scope.speed = data.speed;
            $scope.heading = data.heading;
            $scope.timestamp = data.timestamp;                
            $scope.raw = JSON.stringify(data);
        });
    });
    
    $scope.get_location = function(){
        var options = {
                origin_lat: $scope.latitude,
                origin_lon: $scope.longitude,
        };    
        mapService.get_address(options)
        .then(function(result){
            var address = result.data;
            $scope.address = address;  
        })
    };
    
    
    
    
})


.controller('salirCtrl', ['$scope','auth',function($scope,auth) {
$scope.logout = function(){
        auth.logout(function () {            
            window.location = "#/login"
        });     
    };
}])

.controller('authCtrl', function($scope) {

})
 
.controller('locationCtrl', function($scope,socket,locationService) {
$scope.sos = function(){
    alert('An alert has been sent to Emergency Services with your location. Please remain clam and call 911.')
    socket.emit('sos',{'lon':'lon','lat':'lat'});
    
};
    

    
})
//
//


.controller('ajustesCtrl', function($scope) {

});
   