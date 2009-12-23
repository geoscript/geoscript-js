var file = require("file");

var source = file.resolve(module.path, "data");
var dest = file.resolve(module.path, "tmp");

var run = function() {
    
    if (file.exists(dest)) {
        file.rmtree(dest);
    }

};

exports.run = run;
