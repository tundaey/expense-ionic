angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout,  $location, $ionicPopup, $ionicPlatform, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  
   $scope.fingerprint = function(){
      $ionicPlatform.ready(function(){
      console.log("finger auth", FingerprintAuth )
      FingerprintAuth.isAvailable(function(result) {
        console.log("available", result)
        FingerprintAuth.show({
          clientId: client_id,
          clientSecret: client_secret
        }, function (result) {
          console.log("auth result", result)
          if (result.withFingerprint) {
          	$state.go('app.dashboard')
            //$location.path('/app/dashboard');
           } 
        }, function(error) {
          console.log("error", error); // "Fingerprint authentication not available"
        });
        /*if (result.isHardwareDetected) {

         /!* if(result.hasEnrolledFingerprints){

          }else{
            alert("Fingerprint auth available, but no fingerprint registered on the device");
          }*!/
        }*/
      }, function(message) {
        alert("Cannot detect fingerprint device : "+ message);
      });
    })
    }

  //--------------------------------------------
   $scope.login = function(user) {
			
		if(typeof(user)=='undefined'){
			$scope.showAlert('Please fill username and password to proceed.');	
			return false;
		}

		if(user.username=='demo@gmail.com' && user.password=='demo'){
			$location.path('/app/dashboard');
		}else{
			$scope.showAlert('Invalid username or password.');	
		}
		
	};
  //--------------------------------------------
  $scope.logout = function() {   $location.path('/app/login');   };
  //--------------------------------------------
   // An alert dialog
	 $scope.showAlert = function(msg) {
	   var alertPopup = $ionicPopup.alert({
		 title: 'Warning Message',
		 template: msg
	   });
	 };

	var client_secret = "12345abcde";
  	var client_id = "123456789";
  //--------------------------------------------
})


.controller('ProfilesCtrl', function($scope , Profiles) {
    $scope.profiles = Profiles.all();
})

.controller('ProfileCtrl', function($scope, $stateParams , Profiles) {
	$scope.profile = Profiles.get($stateParams.profileId);
})

.controller('ExpenseCtrl', function($scope, $firebaseArray, $state) {
	$scope.expenseData = {}
	$scope.expenseData.date = new Date();
	var expenseRef = firebase.database().ref().child('expenses');
	$scope.expenses = $firebaseArray(expenseRef);
	$scope.addExpense = function() {
		console.log('expense data:', $scope.expenseData);
		$scope.expenseData.date = $scope.expenseData.date.getTime();
    	$scope.expenses.$add($scope.expenseData);
    	$state.go('app.profiles')
	}
})

.controller('IncomeCtrl', function($scope, $firebaseArray, $state) {
	$scope.incomeData ={}
	$scope.incomeData.date = new Date();
	var incomeRef = firebase.database().ref().child('income');
	$scope.incomes = $firebaseArray(incomeRef);
	$scope.addIncome = function() {
		console.log('income data:', $scope.incomeData);
		$scope.incomeData.date = $scope.incomeData.date.getTime();
    	$scope.incomes.$add($scope.incomeData);
    	$state.go('app.incomes')
	}
})

.controller('BudgetCtrl', function($scope, $firebaseArray, $state) {
	$scope.budgetData ={};
	$scope.show_budget = false;
	var budgetRef = firebase.database().ref().child('budget');
	$scope.budgets = $firebaseArray(budgetRef);
	$scope.budgets.$loaded()
	.then(function(){
		console.log('budget l', $scope.budgets.length)
		if($scope.budgets.length > 0){
			$scope.edit_budget = true;
		}
	})
	$scope.addBudget = function() {
		console.log('income data:', $scope.budgetData);
    	$scope.budgets.$add($scope.budgetData);
    	$scope.edit_budget = true;
    	$state.go('app.budgets')
	}

	$scope.editBudget = function(budget){
		console.log('edit budget');
		$scope.show_budget = true;
		$scope.budget = budget;
	}

	$scope.saveBudget = function(budget){
		$scope.budgets.$save(budget).then(function() {
		  // data has been saved to our database
		  console.log('edited')
		  $scope.show_budget = false;
		});
		
	}
})

.controller('DashCtrl', function($scope, $stateParams , $firebaseArray) {
	var incomeRef = firebase.database().ref().child('income');
	var expenseRef = firebase.database().ref().child('expenses');
	var budgetRef = firebase.database().ref().child('budget');
	$scope.totalIncome = 0;
	$scope.totalExpenses = 0;
	$scope.totalBudget = 0;
	$scope.incomes = $firebaseArray(incomeRef);
	$scope.expenses = $firebaseArray(expenseRef);

	$scope.budgets = $firebaseArray(budgetRef);
	$scope.budgets.$loaded()
	.then(function(){
		angular.forEach($scope.budgets, function(e) {
            console.log("e:", e.amount);
            $scope.totalBudget = $scope.totalBudget + e.amount
            $scope.totalBudgetBalance = $scope.totalBudget - $scope.totalExpenses
        })
	})

	$scope.expenses.$loaded()
    .then(function(){
        angular.forEach($scope.expenses, function(e) {
            console.log("e:", e.amount);
            $scope.totalExpenses = $scope.totalExpenses + e.amount
            $scope.totalBalance = $scope.totalIncome - $scope.totalExpenses
        })
    });

	$scope.incomes.$loaded()
    .then(function(){
        angular.forEach($scope.incomes, function(i) {
            console.log("i:", i.amount);
            $scope.totalIncome = $scope.totalIncome + i.amount
            $scope.totalBalance = $scope.totalIncome - $scope.totalExpenses
        })
    });

    

});

