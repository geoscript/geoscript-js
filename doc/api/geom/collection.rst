:class:`geom.GeometryCollection`
================================

.. class:: geom.GeometryCollection(coords)

    :arg Array coords: Coordinates array.

    Create a multipart geometry with mixed geometry types.  The items
    in the coords array may be geometry coordinates or :class:`geom.Geometry`
    objects.

Properties
----------

In addition to the properties common to all :class:`geom.Geometry` subclasses, 
GeometryCollection geometries have the properties documented below.

.. attribute:: GeometryCollection.components

    ``Array``
    The component :class:`geom.Geometry` objects that make up this collection.


Methods
-------

GeometryCollection geometries have the methods common to all :class:`geom.Geometry` 
subclasses. 
