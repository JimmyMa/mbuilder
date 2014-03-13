package models;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import play.Logger;
import plugins.S3Plugin;

import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;

import controllers.common.Util;

public class S3File {

	static String RootFolder = "D:/Temps/mbuilder/";
	
    private static String bucket = S3Plugin.s3Bucket;

    public String name;
    
    public Long userId;

    public File file;

    public String getUrl() {
    	if (S3Plugin.amazonS3 == null) {
    		return "/assets/imgs/users/" + userId + "/" + name;
    	} else {
    		return "https://s3.amazonaws.com/" + bucket + "/" + getActualFileName();
    	}
    }

    private String getActualFileName() {
        return userId + "/" + name;
    }

    public void save() {
        if (S3Plugin.amazonS3 == null) {
            try {
				Util.copyFile(file, new File( RootFolder + userId + "/" ) , name );
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }
        else {
            this.bucket = S3Plugin.s3Bucket;

            PutObjectRequest putObjectRequest = new PutObjectRequest(bucket, getActualFileName(), file);
            putObjectRequest.withCannedAcl(CannedAccessControlList.PublicRead); // public for all
            S3Plugin.amazonS3.putObject(putObjectRequest); // upload file
        }
    }
    
    public byte[] get() throws Exception  {
    	InputStream reader = null;
        if (S3Plugin.amazonS3 == null) {
           	reader = new FileInputStream( new File( RootFolder + userId + "/"  + name ) );
        }
        else {
            this.bucket = S3Plugin.s3Bucket;

            GetObjectRequest getObjectRequest = new GetObjectRequest(bucket, getActualFileName());
            S3Object object = S3Plugin.amazonS3.getObject(getObjectRequest);
            reader = new BufferedInputStream(object.getObjectContent());            

        }
        

        ByteArrayOutputStream writer = new ByteArrayOutputStream();

        int read = -1;


		while ( ( read = reader.read() ) != -1 ) {
		    writer.write(read);
		}
		writer.flush();
		writer.close();
		reader.close();

		return writer.toByteArray();
    }

    public static void delete(String url) {
        if (S3Plugin.amazonS3 == null) {
            Logger.error("Could not delete because amazonS3 was null");
        }
        else {
            S3Plugin.amazonS3.deleteObject(bucket, url.substring( url.indexOf( bucket ) + bucket.length() + 1 ) );
        }
    }
}
