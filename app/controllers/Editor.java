package controllers;

import java.io.File;

import mbuilder.MProject;
import models.S3File;

import org.codehaus.jackson.JsonNode;

import play.Logger;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import controllers.common.CachedProjects;
import controllers.common.ControllersUtils;
import controllers.common.Util;

public class Editor extends Controller {
	  
	public static Result save() {
		JsonNode vendorJson = request().body().asJson();
		MProject code = Json.fromJson(vendorJson, MProject.class);
		if ( code == null) {
            return badRequest( ControllersUtils.getErrorMessage( "Failed to save!" ) );
        } else {
        	CachedProjects.put("project" + code.projectId, code);
        	
        	File file = Util.createTempFile( vendorJson.toString().getBytes() );
    		S3File s3File = new S3File();
    		s3File.file = file;
    		s3File.name = "" + code.projectId;
    		s3File.userId = Secured.getUserId();
    		s3File.save();
        	
            return ok(ControllersUtils.getSuccessMessage( "OK!") );
        }
	}

}
