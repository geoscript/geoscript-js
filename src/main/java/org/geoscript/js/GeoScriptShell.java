package org.geoscript.js;

import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import jline.Completor;
import jline.ConsoleReader;
import jline.History;

import org.mozilla.javascript.Callable;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.EcmaError;
import org.mozilla.javascript.RhinoException;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.tools.ToolErrorReporter;
import org.mozilla.javascript.tools.shell.Global;

/**
 * The GeoScript JS shell.
 */
public class GeoScriptShell extends Global {

    /** serialVersionUID */
    private static final long serialVersionUID = 1L;

    private boolean quitting;

    @Override
    public String getClassName() {
        return "global";
    }

    /**
     * Convert a JavaScript object into the appropriate Java type.
     * @param value
     * @return
     */
    public static Object jsToJava(Object value) {
        if (value instanceof Wrapper) {
            value = ((Wrapper) value).unwrap();
        } else if (value instanceof Scriptable) {
            if (((Scriptable) value).getClassName().equals("Date")) {
                value = Context.jsToJava(value, java.util.Date.class);
            }
        }
        return value;
    }

    /**
     * Convert a Java object into the appropriate JavaScript type.
     * @param value
     * @param scope
     * @return
     */
    public static Object javaToJS(Object value, Scriptable scope) {
        if (value instanceof java.util.Date) {
            java.util.Date date = (java.util.Date) value;
            Object[] args = { new Long(date.getTime()) };
            Context cx = Context.getCurrentContext();
            value = cx.newObject(scope, "Date", args);
        }
        return Context.javaToJS(value, scope);
    }

    public static GeoScriptShell initShell(Context cx) {
        cx.setLanguageVersion(180);
        GeoScriptWrapFactory wrapFactory = new GeoScriptWrapFactory();
        wrapFactory.setJavaPrimitiveWrap(false);
        cx.setWrapFactory(wrapFactory);

        GeoScriptShell shell = new GeoScriptShell();
        cx.initStandardObjects(shell, true);
        List<String> paths = (List<String>) Arrays.asList(GeoScriptModules.getModulePath());
        shell.installRequire(cx, paths, true);

        shell.defineFunctionProperties(
                new String[] {"quit"}, 
                GeoScriptShell.class,
                ScriptableObject.DONTENUM);

        shell.defineFunctionProperties(
                new String[] {"print", "defineClass"}, 
                Global.class,
                ScriptableObject.DONTENUM);
        
        cx.setErrorReporter(new ToolErrorReporter(false, System.err));
        return shell;
    }

    /**
     * Main entry point.
     * @throws IOException 
     */
    public static void main(String args[]) throws IOException {
        // Associate a new Context with this thread
        Context cx = Context.enter();
        try {
            GeoScriptShell shell = GeoScriptShell.initShell(cx);
            shell.processInput(cx);
        } finally {
            Context.exit();
        }
    }

    public void processInput(Context cx) throws IOException {
        ConsoleReader reader = new ConsoleReader();
        reader.setBellEnabled(false);
        reader.addCompletor(new JSCompletor(this));

        File history = new File(System.getProperty("user.home"), ".geoscript-js-history");
        reader.setHistory(new History(history));

        PrintStream out = System.out;
        int lineno = 0;
        repl: while (true) {
            String source = "";
            String prompt = ">> ";
            while (true) {
                String newline = reader.readLine(prompt);
                if (newline == null) {
                    // NULL input, if e.g. Ctrl-D was pressed
                    out.println();
                    out.flush();
                    break repl;
                }
                source = source + newline + "\n";
                lineno++;
                if (cx.stringIsCompilableUnit(source)) {
                    break;
                }
                prompt = ".. ";
            }
            try {
                Object result = cx.evaluateString(this, source,
                        "<stdin>", lineno, null);
                if (result != Context.getUndefinedValue()) {
                    System.err.println(Context.toString(result));
                }

                lineno++;
                // trigger GC once in a while - if we run in non-interpreter mode
                // we generate a lot of classes to unload
                if (lineno % 10 == 0) {
                    System.gc();
                }
            } 
            catch (EcmaError e) {
                System.err.println(e.getMessage());
            }
            catch (RhinoException e) {
                System.err.println(e.getMessage());
                System.err.println(e.getScriptStackTrace());
            }
            catch (Exception e) {
                e.printStackTrace();
            }
            if (quitting) {
                // The user executed the quit() function.
                break repl;
            }
        }
        System.exit(0);
    }
    

    /**
     * Quit the shell.
     *
     * This only affects the interactive mode.
     *
     * This method is defined as a JavaScript function.
     */
    public void quit() {
        quitting = true;
    }

    class JSCompletor implements Completor {

        Pattern variables = Pattern.compile(
                "(^|\\s|[^\\w\\.'\"])([\\w\\.]+)$");
        Pattern keywords = Pattern.compile(
                "(^|\\s)([\\w]+)$");
        
        Scriptable scope;

        JSCompletor(Scriptable scope) {
            this.scope = scope;
        }

        @SuppressWarnings("unchecked")
        public int complete(String s, int i, List list) {
            int start = i;
            try {
                Matcher match = keywords.matcher(s);
                if (match.find() && s.length() == i) {
                    String word = match.group(2);
                    for(String str: jsKeywords) {
                        if (str.startsWith(word)) {
                            list.add(str);
                        }
                    }
                }
                match = variables.matcher(s);
                if (match.find() && s.length() == i) {
                    String word = match.group(2);
                    Scriptable obj = scope;
                    String[] parts = word.split("\\.", -1);
                    for (int k = 0; k < parts.length - 1; k++) {
                        Object o = ScriptableObject.getProperty(obj, parts[k]);
                        if (o == null || o == ScriptableObject.NOT_FOUND) {
                            return start;
                        }
                        obj = ScriptRuntime.toObject(scope, o);
                    }
                    String lastpart = parts[parts.length - 1];
                    // set return value to beginning of word we're replacing
                    start = i - lastpart.length();
                    while (obj != null) {
                        Object[] ids = obj.getIds();
                        collectIds(ids, obj, word, lastpart, list);
                        if (list.size() <= 3 && obj instanceof ScriptableObject) {
                            ids = ((ScriptableObject) obj).getAllIds();
                            collectIds(ids, obj, word, lastpart, list);
                        }
                        if (word.endsWith(".") && obj instanceof GeoScriptShell) {
                            // don't walk scope prototype chain if nothing to compare yet -
                            // the list is just too long.
                            break;
                        }
                        obj = obj.getPrototype();
                    }
                }
            } catch (Exception ignore) {
                // ignore.printStackTrace();
            }
            Collections.sort(list);
            return start;
        }

        @SuppressWarnings("unchecked")
        private void collectIds(Object[] ids, Scriptable obj, String word, String lastpart, List list) {
            for(Object id: ids) {
                if (!(id instanceof String)) {
                    continue;
                }
                String str = (String) id;
                if (str.startsWith(lastpart) || word.endsWith(".")) {
                    if (ScriptableObject.getProperty(obj, str) instanceof Callable) {
                        list.add(str + "(");
                    } else {
                        list.add(str);
                    }
                }
            }
        }

    }
    static String[] jsKeywords =
        new String[] {
            "break",
            "case",
            "catch",
            "continue",
            "default",
            "delete",
            "do",
            "else",
            "finally",
            "for",
            "function",
            "if",
            "in",
            "instanceof",
            "new",
            "return",
            "switch",
            "this",
            "throw",
            "try",
            "typeof",
            "var",
            "void",
            "while",
            "with"
    };

}
