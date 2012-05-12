package org.geoscript.js;

import static org.junit.Assert.assertTrue;

import java.net.URI;

import org.junit.Test;
import org.ringojs.tools.launcher.Main;

public class RingoTest {

    @Test
    public void runRingoTests() throws Exception {
        String gsModulePath = new URI(GeoScriptModule.getModulePath()).getPath();
        String testModulePath = RingoTest.class.getResource("tests/all.js").getFile();
        String[] args = new String[] { testModulePath };
        String ringoHome = Main.class.getResource("/").getFile();
        System.setProperty("ringo.home", ringoHome);
        System.setProperty("ringo.classpath", "");
        System.setProperty("ringo.modulepath", gsModulePath);
        Main.main(args);
        assertTrue("all tests passed", true);
    }

}
