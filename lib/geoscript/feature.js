var json = require("json");
var geom = require("geoscript/geom");
var proj = require("geoscript/proj");
var geotools = Packages.org.geotools;
var jts = Packages.org.vividsolutions.jts;
var GeometryDescriptor = Packages.org.opengis.feature.type.GeometryDescriptor;
var SimpleFeatureBuilder = geotools.feature.simple.SimpleFeatureBuilder;
var SimpleFeatureTypeBuilder = geotools.feature.simple.SimpleFeatureTypeBuilder;
var crs = geotools.referencing.CRS;
var NameImpl = geotools.feature.NameImpl;
var CoordinateReferenceSystem = Packages.org.opengis.referencing.crs.CoordinateReferenceSystem;

var types = {};
var typeNames = {};

// map type names to java types and
var javaTypeNames = ["String", "Integer", "Short", "Float", "Long", "Double"];
javaTypeNames.forEach(function(str) {
    var type = java.lang[str];
    types[str] = type;
    types[type] = type;
    typeNames[type] = str;
});
// map type names to jts geometry types
var jtsTypeNames = ["Geometry", "Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon"];
jtsTypeNames.forEach(function(str) {
    var type = jts.geom[str];
    types[str] = type;
    types[type] = type;
    typeNames[type] = str;
});

var FeatureType = function(name, config) {
    config = config || {};
    this.ft = config.ft;
    if (name && config.atts) {
        // generate gt feature type from attributes
        var tb = new SimpleFeatureTypeBuilder();
        tb.setName(new NameImpl(config.name));
        config.atts.forEach(function(att) {
            var name = att[0],
                type = att[1];
            if (geom[type]) {
                if (att.length > 2) {
                    var xrs = att[2];
                    if (xrs instanceof CoordinateReferenceSystem) {
                        tb.crs(xrs);
                    } else {
                        tb.srs(xrs);
                    }
                }
            }
            tb.add(name, types[type]);
        });
        this.ft = tb.buildFeatureType();
    }
    this.name = this.ft.name.localPart;

    // geom property
    var gd = this.ft.geometryDescriptor;
    if (gd) {
        this.geom = [
            gd.localName,
            typeNames[gd.type.binding]
        ];
        if (gd.coordinateReferenceSystem) {
            this.geom[2] = gd.coordinateReferenceSystem;
        }
    }
    
    // atts property
    this.atts = this.ft.attributeDescriptors;
    
    // attnames property
    this.attnames = this.ft.attributeDescriptors;

};

FeatureType.prototype = {
    feature: function(atts, id) {
        return new Feture({
            ftype: this,
            atts: atts,
            id: id
        });
    }
};


var Feature = function(config) {
    config = config || {};
    
    this.id = config.id;
    if (!config.id) {
        // TODO: generate a unique id
    }
    
    if (config.ftype) {
        this.ftype = config.ftype;
    } else {
        // TODO: generate feature type from attributes
    }
    
    if (config.feature) {
        this._feature = config.feature;
        if (this.ftype) {
            for (var name in this.ftype.atts) {
                if (ftype.geom && name === ftype.geom.name) {
                    this.geom = this._feature.getAttribute(name);
                } else {
                    this.atts[name] = this._feature.getAttribute(name);
                }
            }
        }
    }

    this.atts = {};
    for (var name in config.atts) {
        this.atts[name] = config.atts[name];
    }

    this.geom = config.geom;

};

Feature.prototype = {
    
    toString: function() {
        return json.encode(this.atts) + "; " + this.geom;
    },
    
    set: function(name, value) {
        this.atts[name] = value;
    },
    
    get: function(name) {
        return this.atts[name];
    },
    
    _sync: function() {
        if (!this._feature) {
            var builder = new SimpleFeatureBuilder(this.ftype._ft);
            this._feature = builder.buildFeature(null, []);
        }
        for (var name in this.atts) {
            this._feature.setAttribute(name, this.atts[name]);
        }
        if (this.geom) {
            this._feature.setDefaultGeometry(this.geom);
        }
    }
    
};

exports.FeatureType = FeatureType;
exports.Feature = Feature;
