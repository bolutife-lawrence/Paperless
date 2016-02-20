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
        $scope.page = 2;
        $scope.maxPage = ownDocs.data.docs.pages;
        $scope.ownDocs = ownDocs.data.docs.docs;
        $scope.noDocsMsg = 'Looks like there\'s nothing here. ' +
          'Kindly create a document to begin.';
        $scope.noFeaturedDocsMsg = 'You currently have no featured documents.';

        if ($rootScope.currentUser.role.length > 0) {
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
            var userId = $rootScope.currentUser._id;
            if ($scope.page <= $scope.maxPage) {
              $scope.isLoading = true;
              Documents.userDocs(userId, $scope.page, null, (err, res) => {
                $scope.isLoading = false;
                if (err) return console.log(err);
                $scope.page++;
                $scope.ownDocs.push(...res.data.docs.docs);
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
