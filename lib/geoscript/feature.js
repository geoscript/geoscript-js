var json = require("json");
var geom = require("geoscript/geom");
var geotools = Packages.org.geotools;
var GeometryDescriptor = Packages.org.opengis.feature.type.GeometryDescriptor;
var SimpleFeatureBuilder = geotools.feature.simple.SimpleFeatureBuilder;
var CRS = geotools.referencing.CRS;

var FeatureType = function(config) {
    config = config || {};
    if (config.ft) {
        this._ft = config.ft;
        this.name = config.ft.localName;
        this._ft.attributeDescriptors.forEach(function(descriptor) {
            var att = {
                name: descriptor.localName,
                type: descriptor.type.binding
            };
            if (descriptor instanceof GeometryDescriptor) {
                // geomtry attribute, look for crs
                var crs = descriptor.type.coordinateReferenceSystem;
                if (crs) {
                    att.srs = CRS.toSRS(crs);
                    att.epsg = CRS.lookupEpsgCode(crs, true);
                }
                if (!this.geom) {
                    // first geometry is the default geometry
                    this.geom = att;
                }
            }
            if (!this.geom || !(descriptor instanceof GeometryDescriptor)) {
                this.atts[att.name] = att;
            }
        }, this);
    } else {
        this.name = config.name;
        this.geom = config.geom;
        this.atts = {};
        // check for geometry in attributes
        if (config.atts) {
            config.atts.forEach(function(att) {
                if (!this.geom && (att.type === geom.Geometry || att.type.prototype instanceof geom.Geometry)) {
                    this.geom = att;
                } else {
                    this.atts[att.name] = att;
                }
            }, this);
        }
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
