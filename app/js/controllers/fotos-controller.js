angular.module('movietime').controller('FilmesLista', ['$scope', 'recursoFoto', function($scope, recursoFoto) {
    $scope.movies = [];
    $scope.filtro = '';
    $scope.mensagem = '';
    
    var itemsToAdd = [];

    recursoFoto.GetMovie({
        search : "search",
        query  : "agora"
    }).$promise.then(function(user) {
        console.log(user);
        $scope.movies = user.results;
    });
    
    $scope.add = function(itemToAdd) {
        if(itemsToAdd.indexOf(itemToAdd) !== -1) {
          $scope.mensagem = 'Este filme já esta em sua lista';
        }else{
          itemsToAdd.push(itemToAdd);
          console.log(itemsToAdd);            
        }
    }
}]);