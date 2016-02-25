describe('Date filter', () => {

  var $filter;

  beforeEach(module('paperless'));

  beforeEach(inject(function(_$filter_) {
    $filter = _$filter_;
  }));

  it('should return a string', () => {
    var dateFilter = $filter('momentFromNow')('2016-02-24T13:37:22+00:00');
    expect(typeof dateFilter).toBe('string');
  });
});
