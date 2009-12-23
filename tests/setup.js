var file = require("file");

var source = file.resolve(module.path, "data");
var dest = file.resolve(module.path, "tmp");

var copyDir = function(source, target) {
    sourceDir = file.path(source);
    targetDir = file.path(target);
    file.mkdirs(targetDir);
    file.list(sourceDir).forEach(function(entry) {
        source = sourceDir.join(entry);
        target = targetDir.join(entry);
        if (file.isFile(source)) {
            file.copy(source, target);
        } else if (file.isDirectory(source)) {
            copyDir(source, target);
        }
    });    
};

var run = function() {
    require("./teardown").run();
    copyDir(source, dest);
    return dest.toString();
};

exports.run = run;

