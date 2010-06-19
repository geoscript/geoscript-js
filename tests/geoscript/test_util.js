var assert = require("assert"),
    util = require("geoscript/util");

exports["test: extend"] = function() {

    var Person = util.extend(Object, {
        normal: true,
        constructor: function(name) {
            this.name = name;
        }
    });
    
    var SpecialPerson = util.extend(Person, {
        normal: false,
        constructor: function(first, last) {
            this.name = first + " " + last;
        }
    });
    
    var per = new Person("Foo");
    var sper = new SpecialPerson("Foo", "Bar");
    
    assert.ok(per instanceof Person, "instanceof with parent");
    assert.ok(sper instanceof SpecialPerson, "instanceof with child");
    assert.ok(sper instanceof Person, "child instanceof parent");
    
    assert.equal("Foo", per.name);
    assert.equal(true, per.normal);
    
    assert.equal("Foo Bar", sper.name);
    assert.equal(false, sper.normal);
    
    Person.prototype.test = function() {return "this"};
    assert.equal("this", per.test());
    assert.equal("this", sper.test());

};

exports["test: apply"] = function() {
    
    var target = {foo: "bar"};
    var source = {foo: "baz", bar: "foo"};
    var o = util.apply(target, source);
    
    assert.strictEqual(o, target, "returns the target");
    assert.strictEqual(o.foo, "baz", "existing property from source applied");
    assert.strictEqual(o.bar, "foo", "new property from source applied");
    
    var o2 = util.apply(o);
    assert.deepEqual(o2, o, "clones object when called with one arg");
    assert.isFalse(o2 === o, "returns new object when called with one arg");

    // allow more sources
    target = {};
    var s1 = {foo: "bar"};
    var s2 = {bar: "baz"};
    var s3 = {baz: "foo"};
    var s4 = {foo: "yup"};
    o = util.apply(target, s1, s2, s3, s4);
    assert.strictEqual(o, target, "[multiple] returns the target");
    assert.strictEqual(s1.bar, undefined, "[multiple] sources untouched");
    assert.strictEqual(target.baz, "foo", "[multiple] defaults from deep sources applied");
    assert.strictEqual(target.foo, "yup", "[multiple] members from all sources applied");
    
};

exports["test: applyIf"] = function() {

    var target = {foo: "bar"};
    var source = {foo: "baz", bar: "foo"};
    var o = util.applyIf(target, source);
    
    assert.strictEqual(o, target, "returns the target");
    assert.strictEqual(o.foo, "bar", "existing property from source not applied");
    assert.strictEqual(o.bar, "foo", "new property from source applied");
    
    // allow more sources
    target = {};
    var s1 = {foo: "bar"};
    var s2 = {bar: "baz"};
    var s3 = {baz: "foo"};
    var s4 = {foo: "nope"};
    o = util.applyIf(target, s1, s2, s3, s4);
    assert.strictEqual(o, target, "[multiple] returns the target");
    assert.strictEqual(s1.bar, undefined, "[multiple] sources untouched");
    assert.strictEqual(target.baz, "foo", "[multiple] defaults from deep sources applied");
    assert.strictEqual(target.foo, "bar", "[multiple] only applied if not present");
    
};

if (require.main == module.id) {
    require("test").run(exports);
}
