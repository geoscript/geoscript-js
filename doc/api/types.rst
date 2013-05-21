.. _type_mapping:

Type Mapping
============

When creating some GeoScript objects (e.g. :class:`process.Process` and 
:class:`feature.Field` objects), it is necessary to provide type information for 
converting values between Java and JavaScript.  The list below describes the 
mapping between JavaScript types and the corresponding Java types.

.. list-table:: Type Mapping
    :header-rows: 1
    :widths: 20 40 40

    * - String Identifier
      - JavaScript Type
      - Java Type
    * - ``"Boolean"``
      - Boolean
      - java.lang.Boolean
    * - ``"String"``
      - String
      - java.lang.String
    * - ``"Number"``
      - Number
      - java.lang.Double
    * - ``"Double"``
      - Number
      - java.lang.Double
    * - ``"Integer"``
      - Number
      - java.lang.Integer
    * - ``"Short"``
      - Number
      - java.lang.Short
    * - ``"Float"``
      - Number
      - java.langFloat
    * - ``"Long"``
      - Number
      - java.lang.Long
    * - ``"BigDecimal"``
      - Number
      - java.math.BigDecimal
    * - ``"Date"``
      - Date
      - java.sql.Date
    * - ``"Geometry"``
      - :class:`geom.Geometry`
      - com.vividsolutions.jts.geom.Geometry
    * - ``"Point"``
      - :class:`geom.Point`
      - com.vividsolutions.jts.geom.Point
    * - ``"LineString"``
      - :class:`geom.LineString`
      - com.vividsolutions.jts.geom.LineString
    * - ``"Polygon"``
      - :class:`geom.Polygon`
      - com.vividsolutions.jts.geom.Polygon
    * - ``"MultiPoint"``
      - :class:`geom.MultiPoint`
      - com.vividsolutions.jts.geom.MultiPoint
    * - ``"MultiLineString"``
      - :class:`geom.MultiLineString`
      - com.vividsolutions.jts.geom.MultiLineString
    * - ``"MultiPolygon"``
      - :class:`geom.MultiPolygon`
      - com.vividsolutions.jts.geom.MultiPolygon
    * - ``"GeometryCollection"``
      - :class:`geom.GeometryCollection`
      - com.vividsolutions.jts.geom.GeometryCollection
    * - ``"Bounds"``
      - :class:`geom.Bounds`
      - org.geotools.geometry.jts.ReferencedEnvelope
    * - ``"FeatureCollection"``
      - :class:`feature.FeatureCollection`
      - org.geotools.feature.FeatureCollection
    * - ``"Filter"``
      - :class:`filter.Filter`
      - org.opengis.filter.Filter
    * - ``"Projection"``
      - :class:`proj.Projection`
      - org.opengis.referencing.crs.CoordinateReferenceSystem
    * - ``"Time"``
      - Date
      - java.sql.Time
    * - ``"Datetime"``
      - Date
      - java.util.Date
    * - ``"Timestamp"``
      - Date
      - java.sql.Timestamp
    * - ``"URI"``
      - String
      - java.net.URI
