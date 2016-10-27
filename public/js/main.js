angular.module('alurapic', ['minhasDiretivas', 'ngAnimate', 'ngRoute', 'meusServicos'])
.config(function($routeProvider, $locationProvider) {

	$locationProvider.html5Mode(true);
	$routeProvider.when('/fotos',{
		templateUrl: 'partials/principal.html',
		controller: 'FotosController'
	});

	$routeProvider.otherwise({redirectTo: '/fotos'});
});