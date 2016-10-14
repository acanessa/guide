//angular.module('app.config', [])
//.config(['$httpProvider', function ($httpProvider) {
//    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {       
//       return {
//           'request': function (config) {
//               
//               config.headers = config.headers || {};
//               if ($localStorage.token) {
//                   console.log('inter -> request -> Auth')
//                   config.headers['Authorization'] = 'Bearer ' + $localStorage.token;
//                   console.log('Interceptor ['+ JSON.stringify(config) +']')
//               }
//               return config;
//           },
//           'responseError': function (response) {
//               console.log('inter -> error')
//               if (response.status === 401 || response.status === 403) {
//                   $location.path('/#/login');
//               }
//               return $q.reject(response);
//           }
//       };
//    }]);
//    
//}])
