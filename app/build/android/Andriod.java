package build.android;

import java.io.File;
import java.io.IOException;

import play.Logger;
import play.api.Play;

public class Andriod {
	
	static File rootDir = Play.current().getFile( "resources/android" );
	
	public static String build( String codes ) {
        File unsignedApkFile = new File(rootDir, "MBuilder.ap_");
        Logger.info( "unsignedApkFile exists? : " + unsignedApkFile.exists() );

        try {
        	String[] contents = new String[1];
        	contents[0] = Utils.replaceTemplate( "resources/templates/index.tmp", codes );
        	Logger.info( "contents: " + contents[0] );
        	String unsignedApk = JarUpdater.updateIndexHTML(unsignedApkFile, new String[]{"assets/www/index.html"}, contents);
        	
        	
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
