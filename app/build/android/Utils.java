package build.android;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import play.api.Play;

public class Utils {

	public static String replaceTemplate( String templateName, String replacement ) {
		StringBuffer sb = new StringBuffer();
		try {
			BufferedReader br = new BufferedReader( new InputStreamReader( new FileInputStream( Play.current().getFile(templateName ) ) ) );
			String line = "";

			while ( (line = br.readLine()) != null ) {
				if ( line.startsWith( "<content>" ) ) {
					sb.append( replacement + "\n" );
					continue;
				}
				sb.append( line + "\n");
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return sb.toString();
	}
}
