angular.module('movietime', ['minhasDiretivas', 'ngAnimate', 'ngRoute', 'meusServicos'])
.config(function($routeProvider, $locationProvider) {

	$locationProvider.html5Mode(true);
	$routeProvider.when('/',{
		templateUrl: 'partials/principal.html',
		controller: 'FilmesLista'
	});	

	$routeProvider.otherwise({redirectTo: '/'});

}).service('settings', function(){
	
	/* CONFIGURAÇÕES GERAIS */ 
	var CONFIG = {
		url : "https://api.themoviedb.org/3/"
	}
	return CONFIG;
});