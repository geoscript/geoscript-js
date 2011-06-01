var ASSERT = require("assert");
var UTIL = require("geoscript/util");

exports["test: extend"] = function() {

    var Person = UTIL.extend(Object, {
        normal: true,
        constructor: function(name) {
            this.name = name;
        }
    });
    
    var SpecialPerson = UTIL.extend(Person, {
        normal: false,
        constructor: function(first, last) {
            this.name = first + " " + last;
        }
    });
    
    var per = new Person("Foo");
    var sper = new SpecialPerson("Foo", "Bar");
    
    ASSERT.ok(per instanceof Person, "instanceof with parent");
    ASSERT.ok(sper instanceof SpecialPerson, "instanceof with child");
    ASSERT.ok(sper instanceof Person, "child instanceof parent");
    
    ASSERT.equal("Foo", per.name);
    ASSERT.equal(true, per.normal);
    
    ASSERT.equal("Foo Bar", sper.name);
    ASSERT.equal(false, sper.normal);
    
    Person.prototype.test = function() {return "this"};
    ASSERT.equal("this", per.test());
    ASSERT.equal("this", sper.test());

};

exports["test: apply"] = function() {
    
    var target = {foo: "bar"};
    var source = {foo: "baz", bar: "foo"};
    var o = UTIL.apply(target, source);
    
    ASSERT.strictEqual(o, target, "returns the target");
    ASSERT.strictEqual(o.foo, "baz", "existing property from source applied");
    ASSERT.strictEqual(o.bar, "foo", "new property from source applied");
    
    var o2 = UTIL.apply(o);
    ASSERT.deepEqual(o2, o, "clones object when called with one arg");
    ASSERT.isFalse(o2 === o, "returns new object when called with one arg");

    // allow more sources
    target = {};
    var s1 = {foo: "bar"};
    var s2 = {bar: "baz"};
    var s3 = {baz: "foo"};
    var s4 = {foo: "yup"};
    o = UTIL.apply(target, s1, s2, s3, s4);
    ASSERT.strictEqual(o, target, "[multiple] returns the target");
    ASSERT.strictEqual(s1.bar, undefined, "[multiple] sources untouched");
    ASSERT.strictEqual(target.baz, "foo", "[multiple] defaults from deep sources applied");
    ASSERT.strictEqual(target.foo, "yup", "[multiple] members from all sources applied");
    
};

exports["test: applyIf"] = function() {

    var target = {foo: "bar"};
    var source = {foo: "baz", bar: "foo"};
    var o = UTIL.applyIf(target, source);
    
    ASSERT.strictEqual(o, target, "returns the target");
    ASSERT.strictEqual(o.foo, "bar", "existing property from source not applied");
    ASSERT.strictEqual(o.bar, "foo", "new property from source applied");
    
    // allow more sources
    target = {};
    var s1 = {foo: "bar"};
    var s2 = {bar: "baz"};
    var s3 = {baz: "foo"};
    var s4 = {foo: "nope"};
    o = UTIL.applyIf(target, s1, s2, s3, s4);
    ASSERT.strictEqual(o, target, "[multiple] returns the target");
    ASSERT.strictEqual(s1.bar, undefined, "[multiple] sources untouched");
    ASSERT.strictEqual(target.baz, "foo", "[multiple] defaults from deep sources applied");
    ASSERT.strictEqual(target.foo, "bar", "[multiple] only applied if not present");
    
};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
