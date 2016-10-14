angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('tabsController', {
    url: '/tab_main',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })
  .state('tabsController.miUbicacion', {
    url: '/location',
    views: {
      'tab_location': {
        templateUrl: 'templates/miUbicacion.html',
        controller: 'miUbicacionCtrl'
      }
    }
  })
  
  .state('tabsController.camera', {
    url: '/tab_camera',
    views: {
      'tab_camera': {
        templateUrl: 'templates/tab_camera.html',
        controller: 'camaraCtrl'
      }
    }
  })
  //SEARCH//
  .state('tabsController.tipo', {
    url: '/type',
    views: {
      'tab_search': {
        templateUrl: 'templates/tipo.html',
        controller: 'tipoCtrl'
      }
    }
  })
  .state('tabsController.lugares', {
    url: '/place/:place_type?',
    views: {
      'tab_search': {
        templateUrl: 'templates/lugares.html',
        controller: 'lugaresCtrl'
      }
    }
  })

  .state('tabsController.detalles', {
    url: '/details/:place_id?',
    views: {
      'tab_search': {
        templateUrl: 'templates/detalles.html',
        controller: 'detallesCtrl'
      }
    }
  })

  
//QR CODE//  
  .state('tabsController.qrcode', {
    url: '/tab_qrcode',
    views: {
      'tab_qrcode': {
        templateUrl: 'templates/tab_qrcode.html',
        controller: 'qrcodeCtrl'
      }
    }
  }) 

//  .state('tabsController.camera', {
//    url: '/camera',
//    views: {
//      'tab2': {
//        templateUrl: 'templates/camara.html',
//        //controller: 'camaraCtrl'
//      }
//    }
//  })
  
  
   
  
//  .state('tabsController.camera', {
//    url: '/camera',
//    views: {
//      'tab2': {
//        templateUrl: 'templates/camara.html',
//        //controller: 'camaraCtrl'
//      }
//    }
//  })
  

  

  
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  

  .state('ajustes', {
    url: '/settings',
    templateUrl: 'templates/ajustes.html',
    controller: 'ajustesCtrl'
  })

  .state('perfil', {
    url: '/profile',
    templateUrl: 'templates/perfil.html',
    controller: 'perfilCtrl'
  })

  .state('salir', {
    url: '/logout',
    templateUrl: 'templates/salir.html',
    controller: 'salirCtrl'
  })

$urlRouterProvider.otherwise('/login')

  

});