
var machinamaApp = angular.module('machinamaApp',['ngCookies', 'ngSanitize']);

machinamaApp.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
}]);