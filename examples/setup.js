var FS;
try {
    // CommonJS
    FS = require("fs");
} catch (err) {
    // Narwhal
    FS = require("file");
}

var unzip;
try {
    // RingoJS
    var ZIP = require("ringo/zip");
    unzip = function(source, dest) {
        var zip = new ZIP.ZipFile(source);
        for (var i=0, ii=zip.entries.length; i<ii; ++i) {
            var entry = zip.entries[i];
            var path = FS.join(dest, entry);
            if (zip.isDirectory(entry)) {
                FS.makeDirectory(path);
            } else {
                var parent = FS.directory(path);
                if (!FS.isDirectory(parent)) {
                     FS.makeTree(parent);
                }
                var handle = FS.openRaw(path, {write: true});
                zip.open(entry).copy(handle).close();
            }
            if (entry.time > -1) {
                FS.touch(path, entry.time);
            }
        }        
    }
} catch (err) {
    // Narwhal
    var ZIP = require("zip");
    unzip = ZIP.unzip;
}

var source = FS.resolve(module.path, "../tests/data/states.shp.zip");
var dest = FS.resolve(module.path, "data/shapefiles");

unzip(source, dest);
