package org.geoscript.js;

import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;
import org.mozilla.javascript.Context;

/**
 * Run doctests in doc folder next to this class.
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
    String name;
    String source;
    int optimizationLevel;
    static URL baseDirectory = DoctestsTest.class.getResource("doc");

    public DoctestsTest(String name, String source, int optimizationLevel) {
        this.name = name;
        this.source = source;
        this.optimizationLevel = optimizationLevel;
    }

    public static File[] getDoctestFiles() {
        return recursiveListFiles(new File(baseDirectory.getFile()));
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
        try {
            GeoScriptShell shell = GeoScriptShell.initShell(cx);
            cx.setOptimizationLevel(optimizationLevel);
            // shell.runDoctest throws an exception on any failure
            int testsPassed = shell.runDoctest(cx, shell, source, name, 1);
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
