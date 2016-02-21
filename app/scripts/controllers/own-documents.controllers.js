export default angular.module('paperless.controllers')
  .controller('ownDocsCtrl', [
    '$scope',
    'Documents',
    'ownDocs', (
      $scope,
      Documents,
      ownDocs) => {

      $scope.init = () => {
        $scope.noDocsMsg = 'Looks like there\'s nothing here. ' +
          'Kindly create a document to begin.';
        $scope.nextPage = 2;
        $scope.isLoading = false;
        $scope.maxPage = ownDocs.data.docs.pages;
        $scope.ownDocs = ownDocs.data.docs.docs;
      };
    }
  ]);
