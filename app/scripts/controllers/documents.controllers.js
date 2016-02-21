export default angular.module('paperless.controllers')
  .controller('userDocsCtrl', [
    '$scope',
    '$sce',
    'Utils', (
      $scope,
      $sce,
      Utils
    ) => {

      $scope.highlight = (text, search) => {
        if (!search) return $sce.trustAsHtml(text);
        var replace = text
          .replace(new RegExp(search, 'gi'),
            '<span class="highlighted-text">$&</span>');
        return $sce.trustAsHtml(replace);
      };

      $scope.loadCreateDocModal = $event => {
        Utils.showBottomSheet($event, 'views/create-document.html');
      };
    }
  ]);
