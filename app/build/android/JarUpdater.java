package build.android;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

public class JarUpdater {
    public static void main(String[] args) {

        File jarFile = new File("D:/Projects/MBuilder/PGProjects/keys/MBuilder.ap_");

        try {
        	updateIndexHTML(jarFile, new String[]{"assets/www/index.html"}, new String[]{"aaaa"});
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public static void updateIndexHTML(File zipFile,
             String[] names, String[] contents) throws IOException {
               // get a temp file
        File tempFile = File.createTempFile(zipFile.getName(), null);
               // delete it, otherwise you cannot rename your existing zip to it.
        tempFile.delete();

        boolean renameOk=zipFile.renameTo(tempFile);
        if (!renameOk)
        {
            throw new RuntimeException("could not rename the file "+zipFile.getAbsolutePath()+" to "+tempFile.getAbsolutePath());
        }
        byte[] buf = new byte[1024];

        ZipInputStream zin = new ZipInputStream(new FileInputStream(tempFile));
        ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFile));

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
        for (int i = 0; i < names.length; i++) {
            // Add ZIP entry to output stream.
            out.putNextEntry(new ZipEntry(names[i]));
            out.write(contents[i].getBytes(), 0, contents[i].getBytes().length);
            // Complete the entry
            out.closeEntry();
        }
        // Complete the ZIP file
        out.close();
        tempFile.delete();
    }
}
