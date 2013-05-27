package controllers;

import models.Project;

import org.codehaus.jackson.JsonNode;

import play.Logger;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import controllers.common.ControllersUtils;
import controllers.common.Projects;

public class Editor extends Controller {
	  
	public static Result save() {
		JsonNode vendorJson = request().body().asJson();
		Project code = Json.fromJson(vendorJson, Project.class);
		if ( code == null) {
            return badRequest( ControllersUtils.getErrorMessage( "Failed to save!" ) );
        } else {
        	Logger.info( "Json111:" + request().remoteAddress() );
        	Projects.put(request().remoteAddress(), code);
            return ok(ControllersUtils.getSuccessMessage( "OK!") );
        }
	}

}
