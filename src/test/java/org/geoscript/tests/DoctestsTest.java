package org.geoscript.tests;

import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.tools.shell.Global;

/**
 * Run doctests in folder src/test/doc.
 * 
 * A doctest is a test in the form of an interactive shell session; Rhino
 * collects and runs the inputs to the shell prompt and compares them to the
 * expected outputs.
 * 
 * Originally from org.mozilla.javascript.tests.DoctestsTest (Norris Boyd).
 * Distributed under MPL 1.1 (http://www.mozilla.org/MPL/).
 */
@RunWith(Parameterized.class)
public class DoctestsTest {
    static final String baseDirectory = "src" + File.separator + "test" + File.separator + "doc";
    String name;
    String source;
    int optimizationLevel;

    public DoctestsTest(String name, String source, int optimizationLevel) {
        this.name = name;
        this.source = source;
        this.optimizationLevel = optimizationLevel;
    }

    public static File[] getDoctestFiles() {
        return recursiveListFiles(new File(baseDirectory));
    }

    public static String loadFile(File f) throws IOException {
        int length = (int) f.length(); // don't worry about very long files
        char[] buf = new char[length];
        new FileReader(f).read(buf, 0, length);
        return new String(buf);
    }

    @Parameters
    public static Collection<Object[]> doctestValues() throws IOException {
        File[] doctests = getDoctestFiles();
        List<Object[]> result = new ArrayList<Object[]>();
        for (File f : doctests) {
            String contents = loadFile(f);
            result.add(new Object[] { f.getName(), contents, -1 });
            result.add(new Object[] { f.getName(), contents, 0 });
            result.add(new Object[] { f.getName(), contents, 9 });
        }
        return result;
    }

    @Test
    public void runDoctest() throws Exception {
        Context cx = Context.enter();
        cx.setLanguageVersion(170);
        cx.setOptimizationLevel(optimizationLevel);
        Global global = new Global();
        global.initStandardObjects(cx, true);
        global.installRequire(cx, (List<String>) Arrays.asList("lib"), false);
        try {
            // global.runDoctest throws an exception on any failure
            int testsPassed = global.runDoctest(cx, global, source, name, 1);
            System.out.println(name + "(" + optimizationLevel + "): " +
                    testsPassed + " passed.");
            assertTrue("tests run in " + name, testsPassed > 0);
        } catch (Exception ex) {
            System.out.println(name + "(" + optimizationLevel + "): FAILED due to "+ ex);
            throw ex;
        } finally {
            Context.exit();
        }
    }

    private static File[] recursiveListFiles(File dir) {
        if (!dir.isDirectory()) {
            throw new IllegalArgumentException(dir + " is not a directory");
        }
        List<File> fileList = new ArrayList<File>();
        recursiveListFilesHelper(dir, fileList);
        Collections.sort(fileList);
        return fileList.toArray(new File[fileList.size()]);
    }

    private static void recursiveListFilesHelper(File dir, List<File> fileList) {
        for (File f: dir.listFiles()) {
            if (f.isDirectory()) {
                recursiveListFilesHelper(f, fileList);
            } else {
                fileList.add(f);
            }
        }
    }
}
