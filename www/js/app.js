// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers' , 'starter.services', 'firebase'])

.run(function($ionicPlatform , $rootScope, $timeout) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

     $rootScope.authStatus = false;
	 //stateChange event
	  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
		  $rootScope.authStatus = toState.authStatus;
		  if($rootScope.authStatus){
			  
			
		  }
    });

	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		console.log("URL : "+toState.url);
		if(toState.url=='/dashboard'){
			console.log("match : "+toState.url);
			$timeout(function(){
				angular.element(document.querySelector('#leftMenu' )).removeClass("hide");
			},1000);
		}	
	});

})

.config(function($stateProvider, $urlRouterProvider) {
  var config = {
    apiKey: "AIzaSyAytY5kxQcVI_UdVAEdf7nerTU3N6lEpf8",
    authDomain: "run-app-74103.firebaseapp.com",
    databaseURL: "https://run-app-74103.firebaseio.com",
    storageBucket: "run-app-74103.appspot.com",
    messagingSenderId: "258486765576"
  };
  firebase.initializeApp(config);
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

//--------------------------------------

 .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-signin.html'
      }
    },
	authStatus: false
  })
 .state('app.signup', {
    url: '/signup',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-signup.html',
      }
   },
	authStatus: false
  })
//--------------------------------------


  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
		controller: 'DashCtrl'
      }
     },
	 authStatus: true
  })


    .state('app.profiles', {
      url: '/profiles',
      views: {
        'menuContent': {
          templateUrl: 'templates/profiles.html',
          controller: 'ExpenseCtrl'
        }
      }
    })

  .state('app.expense', {
    url: '/expense',
    views: {
      'menuContent': {
        templateUrl: 'templates/new-expense.html',
        controller: 'ExpenseCtrl'
      }
    }
  })

  .state('app.budgets', {
      url: '/budgets',
      views: {
        'menuContent': {
          templateUrl: 'templates/budgets.html',
          controller: 'BudgetCtrl'
        }
      }
    })

  .state('app.budget', {
    url: '/budget',
    views: {
      'menuContent': {
        templateUrl: 'templates/new-budget.html',
        controller: 'BudgetCtrl'
      }
    }
  })

  .state('app.incomes', {
      url: '/incomes',
      views: {
        'menuContent': {
          templateUrl: 'templates/incomes.html',
          controller: 'IncomeCtrl'
        }
      }
    })

  .state('app.income', {
    url: '/income',
    views: {
      'menuContent': {
        templateUrl: 'templates/new-income.html',
        controller: 'IncomeCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
