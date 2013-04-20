beforeEach(function() {
  this.addMatchers({
    toBeBlah: function(expectedBlah) {
      return true || false;
    }
  });
});
