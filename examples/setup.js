var unzip;
try {
    // RingoJS
    var ZIP = require("ringo/zip");
    var FS = require("FS");
    unzip = function(source, dest) {
        var zip = new ZIP.ZipFile(source);
        for (var entry in zip.entries) {
            var path = FS.join(dest, entry);
            if (zip.isDirectory(entry)) {
                FS.makeDirectory(path);
            } else {
                var parent = FS.directory(path);
                if (!FS.isDirectory(parent)) {
                     FS.makeTree(parent);
                }
                var dest = FS.openRaw(path, {write: true});
                zip.open(entry).copy(dest).close();
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

unzip("../tests/data/states.shp.zip", "data/shapefiles");
