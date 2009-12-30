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

exports.shp = meta.shp;
