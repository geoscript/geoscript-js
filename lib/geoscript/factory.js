var UTIL = require("./util");

var Factory = UTIL.extend(Object, {

    constructor: function Factory(Type, config) {
        UTIL.apply(this, config);
        this.Type = Type;
        this.type = Type.prototype.constructor.name;
    },
    
    handles: function(config) {
        return false;
    },
    
    create: function(config) {
        return new this.Type(config);
    },

    wraps: function(_obj) {
        return false;
    },
    
    from_: function(_obj) {
        return this.Type.from_(_obj);
    }

});

exports.Factory = Factory;
