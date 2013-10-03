var assert = require("assert");
var Path = require("../lib/path").Path;

describe("Path", function() {
  it("should have correct children", function() {
    var path = new Path({
      a: "asdf",
      b: {
        foo: 42,
        list: [1, 2, 3, 4, 5]
      },
    });

    var aPath = path.get("a");
    var fooPath = path.get("b", "foo");

    assert.strictEqual(aPath.value, "asdf");
    assert.strictEqual(fooPath.value, 42);
    assert.strictEqual(path.get("b"), fooPath.parentPath);

    var odds = path.get("b", "list").filter(function(childPath) {
      return childPath.value % 2 === 1;
    });

    assert.strictEqual(odds.length, 3);
    assert.deepEqual(odds.map(function(childPath) {
      return childPath.value;
    }), [1, 3, 5]);
  });
});
