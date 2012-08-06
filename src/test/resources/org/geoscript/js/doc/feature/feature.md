Fetaure basics:

    js> var geom = require("geoscript/geom");
    js> var Feature = require("geoscript/feature").Feature;

    js> var feature = new Feature({
      >     properties: {place: "Home", geom: new geom.Point([1, 2])}, 
      >     id: "foo"
      > });
    js> feature.id
    foo
    
    js> feature.get("place");
    Home
    js> feature.get("geom");
    [object org.geoscript.js.geom.Point]
    
    js> feature.geometry instanceof geom.Point
    true
    js> feature.geometry.equals(new geom.Point([1, 2]))
    true
    
    js> feature.set("place", "Work");
    [object org.geoscript.js.feature.Feature]
    js> feature.get("place");
    Work
    
    js> feature.set("geom", new geom.Point([2, 3]));
    [object org.geoscript.js.feature.Feature]
    js> feature.get("geom").equals(new geom.Point([2, 3]));
    true
    js> feature.geometry.equals(new geom.Point([2, 3]));
    true
    