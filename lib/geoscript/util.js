
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
            if (str && str.length > 60) {
                str = str.substring(0, 60) + "...";
            }
            return "<" + this.constructor.name + (str ? " " + str : "") + ">";
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
    // allow for multiple sources
    if (arguments.length > 2) {
        var args = Array.prototype.slice.call(arguments, 2);
        args.unshift(target);
        apply.apply(this, args);
    }
    return target;
};

var applyIf = function(target, source) {
    target = target || {};    
    for (var name in source) {
        if (target[name] === undefined || (source.hasOwnProperty(name) && !(name in target))) {
            target[name] = source[name];
        }
    }
    // allow for multiple sources
    if (arguments.length > 2) {
        var args = Array.prototype.slice.call(arguments, 2);
        args.unshift(target);
        applyIf.apply(this, args);
    }
    return target;    
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
exports.toURL = toURL;
exports.toFile = toFile;
