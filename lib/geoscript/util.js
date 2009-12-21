

var extend = function(Parent, props) {
    var Shell = function() {};
    Shell.prototype = Parent.prototype;
    var prototype = new Shell();
    var getter, setter, straight;
    for (var name in props) {
        if (props.hasOwnProperty(name)) {
            getter = props.__lookupGetter__(name);
            setter = props.__lookupSetter__(name);
            straight = true;
            if (typeof getter === "function") {
                prototype.__defineGetter__(name, getter);
                straight = false;
            }
            if (typeof setter === "function") {
                prototype.__defineSetter__(name, setter);
                straight = false;
            }
            if (straight) {
                prototype[name] = props[name];                
            }
        }
    }
    if (prototype.hasOwnProperty("toFullString") && !prototype.hasOwnProperty("toString")) {
        prototype.toString = function() {
            var str = this.toFullString();
            if (str.length > 60) {
                str = str.substring(0, 60) + "...";
            }
            return "<" + this.constructor.name + " " + str + ">";
        }
    }

    var Type = function() {
        this.constructor.apply(this, arguments);
    };
    Type.prototype = prototype;
    return Type;
};

var apply = function(target, source) {
    target = target || {};
    if (!source) {
        source = target;
        target = {};
    }
    for (var name in source) {
        if (source.hasOwnProperty(name)) {
            target[name] = source[name];
        }
    }    
    return target;
};

var applyIf = function(target, source) {
    target = target || {};    
    for (var name in source) {
        if (source.hasOwnProperty(name) && !target.hasOwnProperty(name)) {
            target[name] = source[name];
        }
    }
    return target;    
};

var createRegistry = function(mod) {
    var registry = [];
    mod.register = function(factory) {
        registry.push(factory);
    };
    mod.create = function(config) {
        if (!config) {
            config = {};
        }
        var candidate, factory;
        for (var i=0, ii=registry.length; i<ii; ++i) {
            candidate = registry[i];
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
};


var toURL = function(o) {
    var url;
    if (o instanceof java.net.URL) {
        url = obj;
    } else if (o instanceof java.net.URI || o instanceof java.io.File) {
        url = o.toURL();
    } else if (typeof o === "string") {
        url = (new java.io.File(o)).toURL();
    }
    return url;
};

var toFile = function(o) {
    var file;
    if (o instanceof java.io.File) {
        file = o;
    } else if (o instanceof java.net.URI) {
        file = toFile(o.toURL());
    } else if (o instanceof java.net.URL) {
        file = toFile(o.getFile());
    } else if (typeof o === "string") {
        file = new java.io.File(o);
    }
    return file;
}

exports.extend = extend;
exports.apply = apply;
exports.applyIf = applyIf;
exports.createRegistry = createRegistry;
exports.toURL = toURL;
exports.toFile = toFile;
