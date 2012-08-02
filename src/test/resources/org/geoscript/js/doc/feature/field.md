Field basics:

    js> var Field = require("geoscript/feature").Field;
    js> var field = new Field({
      >     title: "My Polygon", 
      >     description: "This is a polygon field.", 
      >     type: "Polygon", 
      >     name: "poly", 
      >     projection: "EPSG:4326"
      > });
    js> field.title
    My Polygon
    js> field.description
    This is a polygon field.
    js> field.type
    Polygon
    js> field.projection
    [object org.geoscript.js.proj.Projection]
