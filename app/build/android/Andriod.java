package build.android;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import mbuilder.MProject;
import play.Logger;
import play.api.Play;
import views.html.preview;

public class Andriod {
	
	static File rootDir = Play.current().getFile( "resources/android" );
	
	public static String build( MProject project ) {
        File unsignedApkFile = new File(rootDir, "MBuilder.ap_");

        try {
        	List<String> entryNames = new ArrayList<String>();
        	List entryContents = new ArrayList();

        	entryNames.add("assets/www/index.html");
        	entryContents.add( preview.render( project, true, "" ).body() );

        	entryNames.add("assets/www/js/app.js");
        	entryContents.add( Utils.replaceTemplate( "resources/templates/appjs.tmp", project.getJavascriptCodes() ) );

        	for ( String cssFile : project.cssFiles ) {
        		entryNames.add( "assets/www/" + cssFile );
        		entryContents.add( Utils.readFile( "public/" + cssFile ) );
        	}
        	
        	for ( String jsFile : project.jsFiles ) {
        		entryNames.add( "assets/www/" + jsFile );
        		entryContents.add( Utils.readFile( "public/" + jsFile ) );
        	}

        	for ( String file : project.files ) {
        		entryNames.add( "assets/www/" + file );
        		entryContents.add( Utils.readFile( "public/" + file ) );
        	}
        	
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
