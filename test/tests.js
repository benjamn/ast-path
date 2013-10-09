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

describe("replace method", function() {
  it("should work with single replacements", function() {
    var path = new Path({
      foo: 42
    });

    var foo = path.get("foo");
    assert.strictEqual(foo.value, 42);

    foo.replace("asdf");
    var newFoo = path.get("foo");
    assert.notStrictEqual(path.get("foo"), foo);
    assert.strictEqual(newFoo.value, "asdf");
    assert.strictEqual(newFoo.name, "foo");
  });

  it("should fail at the root", function() {
    assert.throws(function() {
      new Path(1).replace();
    }, assert.AssertionError);
  });

  it("should work with arrays", function() {
    var array = [1, 2, 3];
    var path = new Path(array);
    var second = path.get(1);
    var third = path.get(2);

    second.replace("a", "b", "c");

    assert.strictEqual(third.name, 4);
    assert.strictEqual(third.value, 3);
    assert.strictEqual(third, path.get(4));
    assert.strictEqual(array.length, 5);
    assert.deepEqual(array, [1, "a", "b", "c", 3]);
    assert.strictEqual(path.get(1).value, "a");
    assert.strictEqual(path.get(2).value, "b");
    assert.strictEqual(path.get(3).value, "c");

    path.get(2).replace();
    assert.deepEqual(array, [1, "a", "c", 3]);

    path = new Path([1, 2, 3, 4, 5]);

    path.get(0).replace();
    assert.deepEqual(path.value, [2, 3, 4, 5]);

    path.get(2).replace();
    assert.deepEqual(path.value, [2, 3, 5]);

    path.get(1).replace();
    assert.deepEqual(path.value, [2, 5]);

    path.get(1).replace();
    assert.deepEqual(path.value, [2]);

    path.get(0).replace();
    assert.deepEqual(path.value, []);

    path.get(0).replace(1, 2, 3);
    assert.deepEqual(path.value, [1, 2, 3]);

    path.get(10).replace(4, 5);
    assert.deepEqual(path.value, [1, 2, 3, 4, 5]);
  });

  var desc = "should support multiple replacements only for array elements";
  it(desc, function() {
    assert.throws(function() {
      new Path({ foo: 42 }).get("foo").replace(2, 3);
    });

    var path = new Path({ foo: 42 });
    assert.strictEqual("foo" in path.value, true);
    path.get("foo").replace();
    assert.strictEqual("foo" in path.value, false);
  });
});
