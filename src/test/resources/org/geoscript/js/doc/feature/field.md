Field basics:

    js> var Field = require("geoscript/feature").Field;
    js> var field = new Field({
      >     description: "This is a polygon field.", 
      >     type: "Polygon", 
      >     name: "poly", 
      >     projection: "EPSG:4326"
      > });
    js> field.description
    This is a polygon field.
    js> field.type
    Polygon
    js> field.projection
    <Projection EPSG:4326>
