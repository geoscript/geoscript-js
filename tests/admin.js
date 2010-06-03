var unzip;
try {
    // RingoJS
    var ZIP = require("ringo/zip");
    var FS = require("FS");
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

var zip = require("zip");


var FS;
try {
    // CommonJS
    FS = require("fs");
} catch (err) {
    // Narwhal
    FS = require("file");
    FS.removeTree = FS.rmtree;
}

var path = function(rel) {
    return FS.absolute(FS.resolve(module.path, rel));
}

var meta = {
    shp: {
        source: path("data/states.shp.zip"),
        dest: path("tmp/shp"),
        setup: function() {
            meta.shp.teardown();
            unzip(meta.shp.source, meta.shp.dest);
        },
        teardown: function() {
            if (FS.exists(meta.shp.dest)) {
                FS.removeTree(meta.shp.dest);                
            }
        }
    },
    h2: {
        source: path("data/h2.zip"),
        dest: path("tmp/h2"),
        setup: function() {
            meta.h2.teardown();
            unzip(meta.h2.source, meta.h2.dest);
        },
        teardown: function() {
            if (FS.exists(meta.h2.dest)) {
                Packages.org.h2.tools.DeleteDbFiles.execute(meta.h2.dest, "geoscript", true);
                FS.removeTree(meta.h2.dest);
            }
        }
    },
    pg: {
        driver: new Packages.org.postgresql.Driver,
        setup: function() {
            var uri = "jdbc:postgresql:geoscript";
            var params = new java.util.Properties();
            params.setProperty("user", "postgres");
            params.setProperty("password", "postgres");
            var connection = meta.pg.driver.getConnection(uri, params);
        }
    }
};

for (var key in meta) {
    exports[key] = meta[key];
}
