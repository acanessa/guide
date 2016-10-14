(function(){
    'use strict';

    angular
    .module('ngGeolocation', [])
    .factory('$geolocation', ['$rootScope', '$window', '$q', 'socket', function($rootScope, $window, $q, socket) {

        function supported() {
            return 'geolocation' in $window.navigator;
        }

        var retVal = {
            getCurrentPosition: function(options) {
                var deferred = $q.defer();
                if(supported()) {
                    $window.navigator.geolocation.getCurrentPosition(
                        function(position) {
                            $rootScope.$apply(function() {
                                retVal.position.coords = position.coords;
                                
                                retVal.position.timestamp = position.timestamp;
                                deferred.resolve(position);
                            });
                        },
                        function(error) {
                            $rootScope.$apply(function() {
                                deferred.reject({error: error});
                            });
                        }, options);
                } else {
                    deferred.reject({error: {
                        code: 2,
                        message: 'This web browser does not support HTML5 Geolocation'
                    }});
                }
                return deferred.promise;
            },

            watchPosition: function(options) {
                //if(supported()) {
                if(1==1) {
                    if(!this.watchId) {
                        this.watchId = $window.navigator.geolocation.watchPosition(
                            function(position) {
                                $rootScope.$apply(function() {
                                    retVal.position.coords = position.coords;
                                    //alert( position.coords.latitude)
                                    //augusto
                                    //var p = JSON.stringify({'id':1,'lat':-34.59573931303556,'lon':-58.40564617777056,'acc':10,'speed':0});
                                    //socket.emit('point', p); 
                                    
                                    retVal.position.timestamp = position.timestamp;
                                    delete retVal.position.error;
                                    $rootScope.$broadcast('$geolocation.position.changed', position);
                                });
                            },
                            function(error) {
                                $rootScope.$apply(function() {
                                    retVal.position.error = error;
                                    delete retVal.position.coords;
                                    delete retVal.position.timestamp;
                                    $rootScope.$broadcast('$geolocation.position.error', error);
                                });
                            }, options);
                    }
                } else {
                    retVal.position = {
                        error: {
                            code: 2,
                            message: 'This web browser does not support HTML5 Geolocation'
                        }
                    };
                }
            },

            clearWatch: function() {
                if(this.watchId) {
                    $window.navigator.geolocation.clearWatch(this.watchId);
                    delete this.watchId;
                }
            },

            position: {}
        };

        return retVal;
    }]);
}());
