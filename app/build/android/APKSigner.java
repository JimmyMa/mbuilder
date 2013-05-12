package build.android;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

public class APKSigner {

    public static String sign(File apk, File key, String storepass, String alias,
            File signed_apk) throws IOException, InterruptedException {
        
        /*
         * JDK for Linux does not need to specify full path
         */
        String jarsigner ="jarsigner";
        
        /*
         * jarsigner -keystore KEY_FILE -storepass STORE_PASS -keypass KEY_PASS
         * APK_FILE ALIAS_NAME
         * jarsigner -keystore demo.keystore -signedjar mbuilder_signed.apk mbuilder.ap_ demo.keystore
         */
        ProcessBuilder pb = new ProcessBuilder(new String[]{jarsigner,
                    "-keystore", key.getAbsolutePath(), "-storepass", storepass,
                    "-signedjar", signed_apk.getAbsolutePath(), apk.getAbsolutePath(), alias});
        Process p = pb.start();

        StringBuffer sb = new StringBuffer();
        InputStream stream = p.getInputStream();
        try {
            int read = 0;
            byte[] buf = new byte[1024 * 99];
            while ((read = stream.read(buf)) > 0) {
                sb.append(new String(buf, 0, read));
            }
        } finally {
            if (stream != null) {
                stream.close();
            }
        }

        p.waitFor();

        return sb.toString().trim();
    }
}
