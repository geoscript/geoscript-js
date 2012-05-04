
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

    var Type = function() {
        // allow calling single argument contructors without 'new'
        if (!(this instanceof Type)) {
            var len = arguments.length;
            if (len === 0) {
                return new Type();
            } else if (len === 1) {
                return new Type(arguments[0]);
            } else {
                throw new Error("Multiple argument constructor called without 'new' keyword.");
            }
        }
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
};

// implementation of fs methods from Ringo
var File = java.io.File;
function resolveFile(path) {
    // Fix for http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4117557
    // relative files are not resolved against workingDirectory/user.dir in java,
    // making the file absolute makes sure it is resolved correctly.
    if (path == undefined) {
        throw new Error('undefined path argument');
    }
    var file = path instanceof File ? path : new File(String(path));
    return file.isAbsolute() ? file : file.getAbsoluteFile();
}
exports.isDirectory = function(path) {
    return Boolean(resolveFile(path).isDirectory());
};

exports.isArray = function(obj) {
    return (Object.prototype.toString.call(obj) === "[object Array]");
};

// lookup for image types
var imageTypes = exports.imageTypes = {};
javax.imageio.ImageIO.getWriterFormatNames().forEach(function(type) {
    imageTypes[String(type)] = true;
});
exports.getImageType = function(path) {
    var extension = path.split(".").pop().toLowerCase();
    return (extension in imageTypes) ? extension : null;
};



exports.extend = extend;
exports.apply = apply;
exports.applyIf = applyIf;
exports.toURL = toURL;
exports.toFile = toFile;
