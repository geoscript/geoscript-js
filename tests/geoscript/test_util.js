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

if (require.main === module.id) {
    require("test/runner").run(exports);
}