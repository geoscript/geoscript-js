:class:`proj.Projection`
========================

.. class:: proj.Projection(id)

    :arg id: ``String`` Coordinate reference system identifier or
        well-known text for the projection.

    Create a new projection object.

Example Use
-----------

Sample code to create a new projection object:

.. code-block:: javascript

    >> var Projection = require("geoscript/proj").Projection;
    >> var wgs84 = Projection("EPSG:4326")
    >> wgs84
    <Projection EPSG:4326>

    >> wgs84.wkt
    GEOGCS["WGS 84", 
      DATUM["World Geodetic System 1984", 
        SPHEROID["WGS 84", 6378137.0, 298.257223563, AUTHORITY["EPSG","7030"]], 
        AUTHORITY["EPSG","6326"]], 
      PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], 
      UNIT["degree", 0.017453292519943295], 
      AXIS["Geodetic longitude", EAST], 
      AXIS["Geodetic latitude", NORTH], 
      AUTHORITY["EPSG","4326"]]


Properties
----------

.. attribute:: Projection.id

    ``String``
    The coordinate reference system identifier.

.. attribute:: Projection.wkt

    ``String``
    The well-known text representation of the coordinate reference system.


Methods
-------

.. function:: Projection.equals

    :arg projection: :class:`proj.Projection`
    :returns: ``Boolean`` The two projections are equivalent.

    Determine if this projection is equivalent to the given projection.
