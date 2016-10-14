angular.module('app.services', [])


//.factory('Camera', function($q) {
//
//   return {
//      getPicture: function(options) {
//         var q = $q.defer();
//
//         navigator.camera.getPicture(function(result) {
//            q.resolve(result);
//         }, function(err) {
//            q.reject(err);
//         }, options);
//
//         return q.promise;
//      }
//   }
//
//})
//    
.service('speechService',function($window){
    this.speak = function(text) {
        if($window.speechSynthesis) {
            var u = new SpeechSynthesisUtterance();        
            u.text = text;
            u.lang = 'es-AR';
            u.onend = function () {};
            u.onerror = function (e) {};
            speechSynthesis.speak(u);
        }else{
            console.log('noooo')
        }
    
    }
    
})

.service('locationService',function(sharedProperties,$window,$rootScope,socket,$localStorage){
    var navigator = $window.navigator;
    socket.on("connect", function () {
        socket.emit('cli_con',{id:$localStorage.user_id,username:'geo'},function(data){}); 
    });
    options = {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 0
    };
    
    if (navigator.geolocation){
        var id = navigator.geolocation.watchPosition(function(position){
        sharedProperties.setLon(position.coords.longitude);
        sharedProperties.setLat(position.coords.latitude);
        var p = JSON.stringify(
            {'id':$localStorage.user_id,
            'lon':position.coords.longitude,
            'lat':position.coords.latitude,
            'acc':position.coords.accuracy,
            'heading':position.coords.heading,
            'speed':position.coords.speed,
            'timestamp':position.timestamp
           });
        socket.emit('point', p);
        
        
        
        $rootScope.$broadcast('geo',{
            longitude:position.coords.longitude,
            latitude:position.coords.latitude,
            accuracy:position.coords.accuracy,
            speed:position.coords.speed,
            heading:position.coords.heading,
            timestamp:position.timestamp
        });
            
        },function(error){
          console.log(error)  
        },options);
            
        
    } else {
            sharedProperties.setLat(-34.59573931303556)
            sharedProperties.setLon(-58.40564617777056)
    };
    
   
})

.service('sharedProperties', function () {
    var lat = 0;
    var lon = 0;
    var acc = 0;
    var speed = 0;
    var user_id = ''
    this.get_user_id = function () {
    //return -34.59573931303556
    return user_id;                
    }
    this.set_user_id = function(value) {                
       // alert(value)
    user_id = value;    
    }
    this.getLat = function () {
        //return -34.59573931303556
        return lat;                
    }
    this.setLat = function(value) {                
        lat = value;    
    }
    this.getLon = function () {
        //return -58.40564617777056
        return lon;
    }
    this.setLon = function(value) {
        lon = value;
    }
    this.getAcc = function () {
        //return -58.40564617777056
        return acc;
    }
    this.setAcc = function(value) {
        acc = value;
    }
    this.getSpeed = function () {
        //return -58.40564617777056
        return speed;
    }
    this.setSpeed = function(value) {
        speed = value;
    }
        
})



.factory('socket', [function($rootScope){
var socket = io.connect("http://52.24.92.181:3000/geo");
    
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;                
                callback.apply(socket, args);                    
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                    if (callback) {
                        callback.apply(socket, args);
                    }
            })
        }
    }  
    
}])



.service('placeService', ['$http','$q','$localStorage',function($http,$q,$localStorage){
    this.get_places = function(options){
        return $q(function(resolve,reject){
            if ($localStorage.token){
                console.log('lon:'+options.lon)
                console.log('lat:'+options.lat)
                var url = 'http://52.24.92.181:7474/places/'+options.place_type+'/'+options.lon+'/'+options.lat+'/'+options.range;
                    var token = $localStorage.token.data;    
                    $http({
                        method: 'GET',
                        url: url,
                        unique: true,
                        headers: {
                        'authorization': token
                        }
                    })
                    .then(function successCallback(response) {
                        if(response.data.name){
                            console.log(response.data)
                            reject(response.data.name)
                        }else{
                            resolve(response.data)    
                        }
                    })
                    .catch(function(err){
                        //alert(err)
                    });
            }else{
            reject('TOKEN_NOT_FOUND');    
            };//if
        });
    }//func    
           
    this.get_detail = function(place_id){
        return $q(function(resolve,reject){
            if ($localStorage.token){
                var url = 'http://52.24.92.181:7474/place/detail/' + place_id;
                    var token = $localStorage.token.data;    
                    $http({
                        method: 'GET',
                        url: url,
                        headers: {
                        'authorization': token
                        }
                    })
                    .then(function (response) {
                        resolve(response.data)
                    })
                    .catch(function(err){
                        alert(err)
                    });
            }else{
            reject('TOKEN_NOT_FOUND');    
            };//if        
        });    
    };
    
    this.get_place_type = function(){
        return $q(function(resolve,reject){
        if ($localStorage.token){
            var token = $localStorage.token.data;
            var url = 'http://52.24.92.181:7474/place/type'
            $http({
                method: 'GET',
                url: url,
                unique: true,
                headers: {
                'authorization': token
                }
            })
            .then(function(response){
                resolve (response.data)
            })
        }/*else{
            return [];    
        }*/
        });
    }//func
	
}])
.service('mapService', ['$http','$q','sharedProperties','$localStorage',function($http,$q,sharedProperties,$localStorage){
    this.get_direction = function(options){
        return $q(function(resolve,reject){
            if ($localStorage.token){
                var url = 'http://52.24.92.181:7474/map/direction/'+options.origin_lat+'/'+options.origin_lon+'/'+options.destination_lat+'/'+options.destination_lon;
                var token = $localStorage.token.data;    
                $http({
                    method: 'GET',
                    url: url,
                    headers: {
                    'authorization': $localStorage.token.data
                    }
                })
                .then(function (response) {
                    console.log(response)
                    resolve(response)
                })
                .catch(function(err){
                    alert(err)
                });
            }else{
                reject('TOKEN_NOT_FOUND');    
            };//if
        });
    },
    this.get_distance = function(options){
        return $q(function(resolve,reject){
            if ($localStorage.token){
                var url = 'http://52.24.92.181:7474/map/distance/'+options.origin_lat+'/'+options.origin_lon+'/'+options.destination_lat+'/'+options.destination_lon;
                var token = $localStorage.token.data;    
                $http({
                    method: 'GET',
                    url: url,
                    headers: {
                    'authorization': $localStorage.token.data
                    }
                })
                .then(function (response) {
                    console.log(response)
                    resolve(response)
                })
                .catch(function(err){
                    alert(err)
                });
            }else{
                reject('TOKEN_NOT_FOUND');    
            };//if
        });
    };//func
    
    
    this.get_address = function(options){
        return $q(function(resolve,reject){
            if ($localStorage.token){
                var url = 'http://52.24.92.181:7474/map/geocode/'+options.origin_lat+'/'+options.origin_lon;
                var token = $localStorage.token.data;    
                $http({
                    method: 'GET',
                    url: url,
                    headers: {
                    'authorization': $localStorage.token.data
                    }
                })
                .then(function (response) {
                    console.log(response)
                    resolve(response)
                })
                .catch(function(err){
                    alert(err)
                });
            }else{
                reject('TOKEN_NOT_FOUND');    
            };//if
        });
    };
    
    
    
    
    
    
    
}])

.factory('auth', ['$http', '$localStorage','$q', function ($http, $localStorage,$q) {
    return {
       //bug
       signin: function (credentials) {
            return $q(function(resolve,reject){            
            $http({
                url: 'http://52.24.92.181:7474/login',
                method:'POST',
                data:credentials})
            .then(function(token){
                if (token.data == 'USER_INVALID'){
                    return reject('Usuario inexistente');    
                    //return;
                }
                if (token.data == 'PASSWORD_INVALID'){
                    return reject('Password invalido');    
                    //return;
                }
                var claim = atob(token.data.split('.')[1]);
                var user = JSON.parse(claim)
                $localStorage.token = token;
                $localStorage.user_id = user.id
                
                console.log($localStorage.user_id);
                resolve(token)
                
            })
            .catch(function(error){
                console.log('e')
                reject(error)
                //alert(error)
            })

       })},
       logout: function (success) {
           console.log('Delete TOKEN y USER ID')
           //tokenClaims = {};
           delete $localStorage.token;
           delete $localStorage.user_id;
           success();
       },
//       getTokenClaims: function () {
//           return tokenClaims;
//       }
    };
    }
])

.service('cameraService',function($window,$q,$http,$localStorage,socket,$rootScope){
    var navigator = $window.navigator;
    //var canvas = $window.document.getElementById("canvas");
    
    socket.on('pic_response',function(data){
            //console.log(data.info)
            $rootScope.$broadcast('feedback', {
                //console.log('broadcast')
                data: data.info
            });
            //var feedback = document.getElementById("feedback");
            //feedback.innerHTML = "New Text"
            
            
    })
    
    
    errBack = function(error) {
	   console.log("Video capture error: ", error.code); 
    };    
    
    this.init = function(){
        return $q(function(resolve,reject){
            if(navigator.mozGetUserMedia) { // Firefox-prefixed
                navigator.mozGetUserMedia({
                    "video": true,
                    "image_format": "png",
                    //"jpeg_quality":100
                    },
                    function(stream){                    
                        var url =  window.URL.createObjectURL(stream);
                        resolve(url)
                    },
                    function(err){
                        console.log(err)
                    });
            }//IF    
        });
    }//INIT
    this.snap = function(data){
        socket.emit('cli_con',{id:$localStorage.user_id,username:'geo'},function(data){
            
        }); 
        socket.emit('pic',{id:$localStorage.user_id,pic:data},function(data){
                    console.log('ENVIANDO FOTO')
        });    
    
    }
})

.service('qrService',function($window,$q,$http,$localStorage,socket,$rootScope){
    var navigator = $window.navigator;
    //var canvas = $window.document.getElementById("canvas");
    
    socket.on('qr_response',function(data){
            console.log(data[0])
            $rootScope.$broadcast('qr_decoded', {
                
                data: data[0]
            });
            //var feedback = document.getElementById("feedback");
            //feedback.innerHTML = "New Text"
            
            
    })
    
    
    errBack = function(error) {
	   console.log("Video capture error: ", error.code); 
    };    
    
    this.init = function(){
        return $q(function(resolve,reject){
            if(navigator.mozGetUserMedia) { // Firefox-prefixed
                navigator.mozGetUserMedia({
                    "video": true,
                    "image_format": "png",
                    //"jpeg_quality":100
                    },
                    function(stream){                    
                        var url =  window.URL.createObjectURL(stream);
                        resolve(url)
                    },
                    function(err){
                        console.log(err)
                    });
            }//IF    
        });
    }//INIT
    this.snap = function(image,callback){
        image = image.replace(/^data:image\/png;base64,/,'');
        
        //console.log('DATA:',image)
        $http({
            method: 'POST',
            url: 'http://52.24.92.181:7474/qrcode',
            data: {image:image},
            headers: {
            'authorization': $localStorage.token.data
            }
        })
        .then(function(response){
        console.log('DECODED:',response.data.decoded);
        callback(response.data.decoded)    
        })
        
        
        
        
        
//        socket.emit('cli_con',{id:$localStorage.user_id,username:'geo'},function(data1){
//            
//        }); 
//        socket.emit('qrcode',{id:$localStorage.user_id,pic:data},function(data1){
//                    console.log('ENVIANDO QR')
//        });    
    
    }
    
   
    
    
    
})





//
//if(navigator.getUserMedia) { // Standard
//		navigator.getUserMedia(videoObj, function(stream) {
//			video.src = stream;
//			video.play();
//		}, errBack);
//	} 
//    if(navigator.webkitGetUserMedia) { // WebKit-prefixed
//		navigator.webkitGetUserMedia(videoObj, function(stream){
//			video.src = window.webkitURL.createObjectURL(stream);
//			video.play();
//		}, errBack);
//	}