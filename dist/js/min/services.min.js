angular.module('meusServicos', ['ngResource']).factory('recursoFoto', function($resource, settings) {
    return $resource(settings.url + ':search/:type/:top_rated',
    {
        search    : "@search",
        type      : "@type",
        top_rated : "@top_rated"
    },
    {
        GetMovie : {
            method : "GET",
            params : {
                type    : "movie",
                api_key : "b08a1ed11b961c59b78e3f1199392986",
                language: "pt-BR"
            }
        }
    });
});