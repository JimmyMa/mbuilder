package build.android;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import models.Code;
import play.Logger;
import play.api.Play;

public class Andriod {
	
	static File rootDir = Play.current().getFile( "resources/android" );
	
	public static String build( Code codes ) {
        File unsignedApkFile = new File(rootDir, "MBuilder.ap_");

        try {
        	List<String> entryNames = new ArrayList<String>();
        	List<String> entryContents = new ArrayList<String>();

        	entryNames.add("assets/www/index.html");
        	entryContents.add( Utils.replaceTemplate( "resources/templates/index.tmp", codes.cleanedHtmlCodes ) );

        	entryNames.add("assets/www/js/app.js");
        	entryContents.add( Utils.replaceTemplate( "resources/templates/appjs.tmp", codes.getJavascriptCodes() ) );

        	String unsignedApk = JarUpdater.updateIndexHTML(unsignedApkFile, entryNames, entryContents);
        	
        	File key = new File( rootDir, "demo.keystore" );
        	String storepass = "123456";
        	String alias = "demo.keystore";
        	File signed_apk = File.createTempFile( "demo_signed.apk", null);
        	
        	Logger.info( "unsignedApk: " + unsignedApk );
        	unsignedApkFile = new File(unsignedApk);
        	APKSigner.sign( new File(unsignedApk), key, storepass, alias, signed_apk);
        	unsignedApkFile.delete();
        	return signed_apk.getAbsolutePath();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        return null;
	}

}
