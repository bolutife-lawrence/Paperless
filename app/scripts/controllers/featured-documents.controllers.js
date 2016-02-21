export default angular.module('paperless.controllers')
  .controller('featuredDocsCtrl', [
    '$scope',
    'Documents',
    'featuredDocs', (
      $scope,
      Documents,
      featuredDocs) => {

      $scope.init = () => {
        $scope.noDocsMsg = 'You currently have no featured documents.';
        $scope.nextPage = 2;
        $scope.isLoading = false;
        $scope.maxPage = featuredDocs.data.docs.pages;
        $scope.featuredDocs = featuredDocs.data.docs.docs;
      };
    }
  ]);
