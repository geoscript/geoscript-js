package org.geoscript.js.raster;

import net.miginfocom.layout.Grid;
import org.geoscript.js.GeoObject;
import org.geoscript.js.filter.Expression;
import org.geoscript.js.geom.Bounds;
import org.geoscript.js.proj.Projection;
import org.geotools.coverage.grid.GridCoverage2D;
import org.geotools.coverage.grid.GridEnvelope2D;
import org.geotools.coverage.grid.GridGeometry2D;
import org.geotools.coverage.grid.io.AbstractGridFormat;
import org.geotools.coverage.grid.io.GridFormatFinder;
import org.geotools.coverage.grid.io.UnknownFormat;
import org.geotools.gce.image.WorldImageFormat;
import org.geotools.util.factory.GeoTools;
import org.geotools.util.factory.Hints;
import org.mozilla.javascript.*;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;
import org.opengis.coverage.grid.GridCoverageReader;
import org.opengis.coverage.grid.GridCoverageWriter;
import org.opengis.parameter.GeneralParameterValue;
import org.opengis.parameter.ParameterValueGroup;

import java.awt.*;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class Format extends GeoObject implements Wrapper {

    private AbstractGridFormat gridFormat;

    private Object source;

    public Format() {
    }

    public Format(AbstractGridFormat gridFormat, Object source) {
        this.gridFormat = gridFormat;
        this.source = source;
    }

    public Format(Scriptable scope, AbstractGridFormat gridFormat, Object source) {
        this(gridFormat, source);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Format.class));
    }

    @JSGetter
    public String getName() {
        return gridFormat.getName();
    }

    @JSFunction
    public Raster read(Scriptable config) {
        Raster raster = new Raster();
        raster.setParentScope(this.getParentScope());

        Map<String, Object> options = (Map<String, Object>) jsObjectToMap(config);
        String name = null;
        if (options.containsKey("name")) {
            name = (String) options.get("name");
            options.remove(name);
        }

        Hints hints = GeoTools.getDefaultHints();
        if (options.containsKey("proj")) {
            Projection proj = (Projection) options.get("proj");
            hints.put(Hints.DEFAULT_COORDINATE_REFERENCE_SYSTEM, proj.unwrap());
        }

        GridCoverageReader reader = gridFormat.getReader(source, hints);
        try {
            if (options.containsKey("bounds")) {
                Bounds bounds = (Bounds) options.get("bounds");
                List<Integer> size = (List) jsToJava(options.get("size"));
                options.put("ReadGridGeometry2D", new GridGeometry2D(
                    new GridEnvelope2D(new Rectangle(size.get(0), size.get((1)))),
                    bounds.unwrap()
                ));
                options.remove("bounds");
                options.remove("size");
            }
            List<GeneralParameterValue> values = new ArrayList<>();
            ParameterValueGroup parameterValueGroup = reader.getFormat().getReadParameters();
            for(Map.Entry<String,Object> entry : options.entrySet()) {
                parameterValueGroup.parameter(entry.getKey()).setValue(entry.getValue());
                values.add(parameterValueGroup.parameter(entry.getKey()));
            }
            try {
                if (name != null) {
                    raster = new Raster(this.getParentScope(), (GridCoverage2D) reader.read(name, values.toArray(new GeneralParameterValue[]{})));
                } else {
                    raster = new Raster(this.getParentScope(), (GridCoverage2D) reader.read(values.toArray(new GeneralParameterValue[]{})));
                }
            } catch (IOException e) {
                throw ScriptRuntime.constructError("Error", "Error reading Raster.");
            }
        } finally {
            try {
                reader.dispose();
            } catch (IOException e) {
                throw ScriptRuntime.constructError("Error", "Error reading Raster.");
            }
        }

        return raster;
    }

    @JSFunction
    public void write(Raster raster, Scriptable config) {
        Map<String, Object> options = (Map<String, Object>) jsObjectToMap(config);
        GridCoverageWriter writer = gridFormat.getWriter(source);
        try {
            if (isWorldImage(source.toString())) {
                String worldImageFormat = WorldImageFormat.FORMAT.getDefaultValue();
                if (source instanceof File) {
                    String fileName = ((File)source).getName();
                    worldImageFormat = fileName.substring(fileName.lastIndexOf(".") + 1);
                }
                options.put(WorldImageFormat.FORMAT.getName().toString(), worldImageFormat);
            }
            List<GeneralParameterValue> values = new ArrayList<>();
            ParameterValueGroup parameterValueGroup = writer.getFormat().getWriteParameters();
            for(Map.Entry<String,Object> entry : options.entrySet()) {
                parameterValueGroup.parameter(entry.getKey()).setValue(entry.getValue());
                values.add(parameterValueGroup.parameter(entry.getKey()));
            }
            try {
                writer.write((GridCoverage2D)raster.unwrap(), values.toArray(new GeneralParameterValue[]{}));
            } catch (IOException e) {
                throw ScriptRuntime.constructError("Error", "Can't write Raster." + e.getMessage());
            }

        } finally {
            try {
                writer.dispose();
            } catch (IOException e) {
                throw ScriptRuntime.constructError("Error", "Error writing Raster.");
            }
        }
    }

    @JSGetter
    public NativeArray getNames() {
        List<String> names = new ArrayList<>();
        GridCoverageReader reader = this.gridFormat.getReader(source);
        try {
            try {
                names.addAll(Arrays.asList(reader.getGridCoverageNames()));
            } catch (IOException e) {
                throw ScriptRuntime.constructError("Error", "Error getting names.");
            }
        } finally {
            try {
                reader.dispose();
            } catch (IOException e) {
                throw ScriptRuntime.constructError("Error", "Error getting names.");
            }
        }
        return (NativeArray) javaToJS(names, this.getParentScope());
    }

    @Override
    public Object unwrap() {
        return gridFormat;
    }

    @JSConstructor
    public static Object constructor(Context cx, Object[] args, Function ctorObj, boolean inNewExpr) {
        if (args.length == 0) {
            return new Format();
        }
        Format format = null;
        Object arg = args[0];
        Object value = null;
        if (arg instanceof String || arg instanceof Number) {
            value = arg.toString();
        } else if (arg instanceof NativeObject) {
            NativeObject config = (NativeObject) arg;
            value = config.get("source", config).toString();
        } else {
            throw ScriptRuntime.constructError("Error", "Cannot create Format from provided value: " + Context.toString(ctorObj));
        }
        if (value.toString().startsWith("http")) {
            try {
                value = new URL(value.toString());
            } catch (MalformedURLException e) {
                e.printStackTrace();
            }
        } else {
            value = new File(value.toString());
        }

        if (inNewExpr) {
            try {
                if (isWorldImage(value.toString())) {
                    format = new Format(new WorldImageFormat(), value);
                } else {
                    format = new Format(GridFormatFinder.findFormat(value), value);
                }
            } catch (Exception e) {
                throw ScriptRuntime.constructError("Error", "Cannot create Format from provided value: " + Context.toString(ctorObj));
            }
        } else {
            format = new Format(ctorObj.getParentScope(), GridFormatFinder.findFormat(value), value);
        }
        return format;
    }

    private static boolean isWorldImage(String fileOrUrl) {
        return fileOrUrl.toLowerCase().endsWith("png") ||
                fileOrUrl.toLowerCase().endsWith("jpg") ||
                fileOrUrl.toLowerCase().endsWith("jpeg") ||
                fileOrUrl.toLowerCase().endsWith("gif");
    }
    
}
