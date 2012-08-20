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
    <Point [1, 2]>
    
    js> feature.geometry instanceof geom.Point
    true
    js> feature.geometry.equals(new geom.Point([1, 2]))
    true
    
    js> feature.set("place", "Work");
    <Feature place: "Work", geom: <Point>>
    js> feature.get("place");
    Work
    
    js> feature.set("geom", new geom.Point([2, 3]));
    <Feature place: "Work", geom: <Point>>
    js> feature.get("geom").equals(new geom.Point([2, 3]));
    true
    js> feature.geometry.equals(new geom.Point([2, 3]));
    true
    
    js> feature.properties = {
      >     geom: new geom.Point([3, 4]),
      >     place: "Vacation"
      > };
    [object Object]
    js> feature.get("place")
    Vacation
    js> feature.get("geom").equals(new geom.Point([3, 4]))
    true
    
    js> var f = Feature({
      >     properties: {place: "Home", geom: geom.Point([1, 2])}, 
      >     id: "foo"
      > });
    js> f instanceof Feature
    true
    js> f
    <Feature place: "Home", geom: <Point>>
    
