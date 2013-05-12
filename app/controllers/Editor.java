package controllers;

import models.Code;

import org.codehaus.jackson.JsonNode;

import play.Logger;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import controllers.common.ControllersUtils;

public class Editor extends Controller {
	  
	public static Result save() {
		JsonNode vendorJson = request().body().asJson();
		Code code = Json.fromJson(vendorJson, Code.class);
		if ( code == null) {
            return badRequest( ControllersUtils.getErrorMessage( "Failed to save!" ) );
        } else {
        	Logger.info( "Json111:" + code );
            return ok(ControllersUtils.getSuccessMessage( "OK!") );
        }
	}

}
