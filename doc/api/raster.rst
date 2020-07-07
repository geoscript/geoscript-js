The raster module
~~~~~~~~~~~~~~~~

The :doc:`raster <Format>` module can read and write Rasters.

.. code-block:: javascript

    >> var Format = require("geoscript/raster").Format;

:class:`raster.Format`
====================

.. class:: raster.Format(config)

    Create a new Format.  The config must contain a source representing the file or URL.

Properties
----------

.. attribute:: Format.name

    ``String``
    The type of Format (GeoTIFF, WorldImage).

.. attribute:: Format.names

    ``Array``
    Array of Raster names.  Most Formats will only contain one Raster.

Methods
-------

.. function:: Format.read(config)

    :arg config: ``Object`` An object literal with parameters

    name: The name of the Raster (optional).  Required if there are more than one Raster in the Format.

    proj: The Projection of the Raster (optional).

    bounds: The Bounds to read a subset of the entire Raster.  Optional, but if included size must also be included.

    size: An array of width and height of the Raster.  Optional, buf if included bound must also be included.

.. function:: Format.write(raster, config)

    :arg raster: :class:`raster.Raster` The Raster to write to this Format.

    :arg config: ``Object`` An object literal of write parameters.

:class:`raster.Raster`
====================

.. class:: raster.Raster

    A Raster is a spatial data set represented by a grid of cells organized in one or more bands.

    Usually, Rasters are read from a Format, but you can create a new Raster from an array or array of numeric values
    and a geom.Bounds.

Properties
----------

.. attribute:: Raster.name

    ``String``
    Get the name of the Raster.

.. attribute:: Raster.proj

    :class:`proj.Projection`
    Get the Projection.


.. attribute:: Raster.bounds

    :class:`geom.Bounds`
    Get the Bounds.

.. attribute:: Raster.size

    `Array`
    Get the size of the Raster as an Array of two numbers: width and height

.. attribute:: Raster.cols

    `Number`
    Get the number of columns or the width or the Raster

.. attribute:: Raster.rows

    `Number`
    Get the number of row or the height or the Raster

.. attribute:: Raster.bands

    `Array` of :class:`raster.Bands`
    Get an array of Bands

.. attribute:: Raster.extrema

    `Object` with min and max arrays with min and max values for each band
    Get the minimum and maximum values for each band.

.. attribute:: Raster.blockSize

    `Array` with width and height of a pixel
    Get the block size

.. attribute:: Raster.pixelSize

    `Array` with width and height of a pixel
    Get the pixel size

Methods
-------

.. function:: Raster.getPixel(point)

    :arg point: :class:`geom.Point` The geographic Point

    Get a pixel ``Object`` with x and y properies.

.. function:: Raster.getPoint(x,y)

    :arg x: ``Number`` The pixel's x position

    :arg y: ``Number`` The pixel's y position

    Get a :class:`geom.Point` for the pixel.

.. function:: Raster.getValue(pointOrPixel)

    :arg pointOrPixel: ``Object`` The pixel or :class:`geom.Point`

    :arg type: ``String`` The type of value to return (double, int, float, byte, boolean)

    Get a value for each band from the Raster.

.. function:: Raster.getMinimumValue(band)

    :arg namd: `Number` The band

    Get the minimum value for the given  band

.. function:: Raster.getMaximumValue(band)

    :arg namd: `Number` The band

    Get the maximum value for the given  band

.. function:: Raster.crop(bounds)

    :arg bounds: :class:`geom.Bound` The Bounds of the new Raster

    Crop the current Raster to only include data in the given Bounds.

.. function:: Raster.crop(geometry)

    :arg geometry: :class:`geom.Geometry` The Geometry to use when cropping the Raster

    Crop the current Raster to only include data in the given Geometry.

.. function:: Raster.reproject(projection)

    :arg projection: :class:`proj.Projection` The target Projection

    Reproject a Raster from one Projection to another Projection.

.. function:: Raster.reclassify(ranges, options)

    :arg ranges: `Array` An array of object literals with required min, max, and value properties. minIncluded and maxIncluded are optional.

    :arg options: `Object` An object literal with optional band and noData values.

    Reclassify the values of the Raster.

:class:`raster.Band`
====================

.. class:: raster.Band

     An individual layer from a Raster.

Properties
----------

.. attribute:: Band.min

    ``Number``
    Get the minimum value from this Band.

.. attribute:: Band.max

    ``Number``
    Get the maximum value from this Band.

.. attribute:: Band.noData

    ``Array``
    Get the array of no data values.



.. attribute:: Band.scale

    ``Number``
    Get the scale.

.. attribute:: Band.scale

    ``Number``
    Get the scale.

.. attribute:: Band.type

    ``Number``
    Get the Raster type.

.. attribute:: Band.description

    ``Number``
    Get the Raster description.

Methods
-------

.. function:: Band.isNoData(value)

    :arg value: ``Object`` The value to check

    Determine whether the value is a no data value.