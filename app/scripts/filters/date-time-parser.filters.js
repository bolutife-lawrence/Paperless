export default angular.module('paperless.filters')
  .filter('momentFromNow', () => {
    var fromNow = (input) => moment(input).fromNow();
    fromNow.$stateful = true;
    return fromNow;
  });
