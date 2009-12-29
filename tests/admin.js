var zip = require("zip");
var file = require("file");

var path = function(rel) {
    return file.absolute(file.resolve(module.path, rel));
}

var meta = {
    shp: {
        source: path("data/states.shp.zip"),
        dest: path("tmp/shp"),
        setup: function() {
            meta.shp.teardown();
            zip.unzip(meta.shp.source, meta.shp.dest);
        },
        teardown: function() {
            if (file.exists(meta.shp.dest)) {
                file.rmtree(meta.shp.dest);                
            }
        }
    }
};

exports.shp = meta.shp;
