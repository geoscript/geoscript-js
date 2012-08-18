package org.geoscript.js.process;

import java.util.Map;

import org.geotools.data.Parameter;
import org.geotools.process.Process;
import org.geotools.process.ProcessException;
import org.opengis.util.ProgressListener;

public class MetaProcess implements Process {

    private org.geotools.process.Process process;
    String title;
    String description;
    Map<String, Parameter<?>> inputs;
    Map<String, Parameter<?>> outputs;
    
    MetaProcess(org.geotools.process.Process process, String title, 
            String description, Map<String, Parameter<?>> inputs,
            Map<String, Parameter<?>> outputs) {
        this.process = process;
        this.title = title;
        this.description = description;
        this.inputs = inputs;
        this.outputs = outputs;
    }
    
    public String getTitle() {
        return title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public Map<String, Parameter<?>> getInputs() {
        return inputs;
    }
    
    public Map<String, Parameter<?>> getOutputs() {
        return outputs;
    }
    
    public Map<String, Object> execute(Map<String, Object> input,
            ProgressListener monitor) throws ProcessException {
        return process.execute(input, monitor);
    }


}
