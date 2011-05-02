var UTIL = require("./util");

var Registry = UTIL.extend(Object, {

    constructor: function Registry() {
        
        var factories = [];

        this.register = function(factory) {
            factories.push(factory);
        };
        
        this.create = function(config) {
            if (!config) {
                config = {};
            }
            var candidate, factory;
            for (var i=0, ii=factories.length; i<ii; ++i) {
                candidate = factories[i];
                if (candidate.type === config.type) {
                    factory = candidate;
                    break;
                }
                if (!factory && candidate.handles(config)) {
                    factory = candidate;
                }
            }
            if (!factory) {
                throw "Can't create object from config";
            }
            return factory.create(config);
        };
    }

});

exports.Registry = Registry;
