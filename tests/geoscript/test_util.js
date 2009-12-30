var assert = require("test/assert"),
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
    
    assert.isTrue(per instanceof Person, "instanceof with parent");
    assert.isTrue(sper instanceof SpecialPerson, "instanceof with child");
    assert.isTrue(sper instanceof Person, "child instanceof parent");
    
    assert.isEqual("Foo", per.name);
    assert.isEqual(true, per.normal);
    
    assert.isEqual("Foo Bar", sper.name);
    assert.isEqual(false, sper.normal);
    
    Person.prototype.test = function() {return "this"};
    assert.isEqual("this", per.test());
    assert.isEqual("this", sper.test());

};

exports["test: apply"] = function() {
    
    var target = {foo: "bar"};
    var source = {foo: "baz", bar: "foo"};
    var o = util.apply(target, source);
    
    assert.is(target, o, "returns the target");
    assert.is("baz", o.foo, "existing property from source applied");
    assert.is("foo", o.bar, "new property from source applied");
    
    var o2 = util.apply(o);
    assert.isSame(o, o2, "clones object when called with one arg");
    assert.isFalse(o2 === o, "returns new object when called with one arg");

    // allow more sources
    target = {};
    var s1 = {foo: "bar"};
    var s2 = {bar: "baz"};
    var s3 = {baz: "foo"};
    var s4 = {foo: "yup"};
    o = util.apply(target, s1, s2, s3, s4);
    assert.is(target, o, "[multiple] returns the target");
    assert.is(undefined, s1.bar, "[multiple] sources untouched");
    assert.is("foo", target.baz, "[multiple] defaults from deep sources applied");
    assert.is("yup", target.foo, "[multiple] members from all sources applied");
    
};

exports["test: applyIf"] = function() {

    var target = {foo: "bar"};
    var source = {foo: "baz", bar: "foo"};
    var o = util.applyIf(target, source);
    
    assert.is(target, o, "returns the target");
    assert.is("bar", o.foo, "existing property from source not applied");
    assert.is("foo", o.bar, "new property from source applied");
    
    // allow more sources
    target = {};
    var s1 = {foo: "bar"};
    var s2 = {bar: "baz"};
    var s3 = {baz: "foo"};
    var s4 = {foo: "nope"};
    o = util.applyIf(target, s1, s2, s3, s4);
    assert.is(target, o, "[multiple] returns the target");
    assert.is(undefined, s1.bar, "[multiple] sources untouched");
    assert.is("foo", target.baz, "[multiple] defaults from deep sources applied");
    assert.is("bar", target.foo, "[multiple] only applied if not present");
    
};

if (require.main === module.id) {
    require("test/runner").run(exports);
}
