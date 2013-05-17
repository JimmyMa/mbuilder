package build.android;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

public class JarUpdater {
    public static void main(String[] args) {

        File jarFile = new File("D:/Projects/MBuilder/PGProjects/keys/MBuilder.ap_");

        try {
        	String[] contents = new String[1];
        	contents[0] = Utils.replaceTemplate( "resources/templates/index.tmp", "ssssssssssssssssssssssss" );
//        	updateIndexHTML(jarFile, new String[]{"assets/www/index.html"}, contents);
        	
        	
        	File apk = new File( "D:/Projects/MBuilder/PGProjects/keys/MBuilder.ap_" );
        	File key = new File( "D:/Projects/MBuilder/PGProjects/keys/demo.keystore" );
        	String storepass = "123456";
        	String alias = "demo.keystore";
        	File signed_apk = File.createTempFile( "mbuilder_signed.apk", null);
        	
        	APKSigner.sign( apk, key, storepass, alias, signed_apk);
        	
        	System.out.println( "File: " + signed_apk.getAbsolutePath() );
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

    }

    public static String updateIndexHTML(File zipFile,
            List<String> names, List<String> contents) throws IOException {
               // get a temp file
        File tempFile = File.createTempFile(zipFile.getName(), null);

        byte[] buf = new byte[1024];

        ZipInputStream zin = new ZipInputStream(new FileInputStream(zipFile));
        ZipOutputStream out = new ZipOutputStream(new FileOutputStream(tempFile));

        ZipEntry entry = zin.getNextEntry();
        while (entry != null) {
            String name = entry.getName();
            boolean notInFiles = true;
            for (String newname : names) {
                if (newname.equals(name)) {
                    notInFiles = false;
                    break;
                }
            }
            if (notInFiles) {
                // Add ZIP entry to output stream.
                out.putNextEntry(new ZipEntry(name));
                // Transfer bytes from the ZIP file to the output file
                int len;
                while ((len = zin.read(buf)) > 0) {
                    out.write(buf, 0, len);
                }
            }
            entry = zin.getNextEntry();
        }
        // Close the streams        
        zin.close();
        // Compress the files
        for (int i = 0; i < names.size(); i++) {
            // Add ZIP entry to output stream.
            out.putNextEntry(new ZipEntry(names.get(i)));
            out.write(contents.get(i).getBytes(), 0, contents.get(i).getBytes().length);
            // Complete the entry
            out.closeEntry();
        }
        // Complete the ZIP file
        out.close();
        return tempFile.getAbsolutePath();
    }
}
