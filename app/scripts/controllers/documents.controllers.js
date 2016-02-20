export default angular.module('paperless.controllers')
  .controller('userDocsCtrl', [
    '$scope',
    '$rootScope',
    '$sce',
    'Utils',
    'Documents',
    'ownDocs',
    'featuredDocs', (
      $scope,
      $rootScope,
      $sce,
      Utils,
      Documents,
      ownDocs,
      featuredDocs) => {

      $scope.init = () => {
        $scope.nextPageOwn = 2;
        $scope.maxPageOwn = ownDocs.data.docs.pages;
        $scope.ownDocs = ownDocs.data.docs.docs;
        $scope.noDocsMsg = 'Looks like there\'s nothing here. ' +
          'Kindly create a document to begin.';
        $scope.noFeaturedDocsMsg = 'You currently have no featured documents.';

        if ($rootScope.currentUser.role.length > 0) {
          $scope.nextPageFeatured = 2;
          $scope.maxPageFeatured = featuredDocs.data.docs.pages;
          $scope.featuredDocs = featuredDocs.data.docs.docs;
        }
      };

      angular
        .element(document.querySelector('#scroll-container'))
        .bind('scroll', () => {
          var container = document.querySelector('#scroll-container'),
            currentScrollHeight = container.scrollTop,
            fixedScrollheight = container.scrollHeight,
            body = document.body,
            html = document.documentElement,
            args = [
              body.scrollHeight,
              body.offsetHeight,
              html.clientHeight,
              html.scrollHeight,
              html.offsetHeight
            ],
            docHeight = Math.max(...args);

          if (currentScrollHeight + docHeight == fixedScrollheight) {
            var userId = $rootScope.currentUser._id,
              loadfeaturedDocsCondition =
              $scope.maxPageFeatured &&
              $scope.nextPageFeatured <=
              $scope.maxPageFeatured,
              roleId;

            if ($rootScope.currentUser.role.length > 0) {
              roleId = $rootScope.currentUser.role[0]._id;
            }

            if ($scope.nextPageOwn <= $scope.maxPageOwn) {
              $scope.isLoadingOwn = true;
              Documents
                .userDocs(userId, $scope.nextPageOwn, null,
                  (err, res) => {
                    $scope.isLoadingOwn = false;
                    if (err) return console.log(err);
                    $scope.nextPageOwn++;
                    $scope.ownDocs.push(...res.data.docs.docs);
                  });
            }

            if (loadfeaturedDocsCondition) {
              $scope.isLoadingFeatured = true;
              Documents
                .featuredDocs(roleId, $scope.nextPageFeatured, null,
                  (err, res) => {
                    $scope.isLoadingFeatured = false;
                    if (err) return console.log(err);
                    $scope.nextPageFeatured++;
                    $scope.featuredDocs.push(...res.data.docs.docs);
                  });
            }
          }
        });

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
