package controllers;

import java.io.File;

import models.Code;

import org.codehaus.jackson.JsonNode;

import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import build.android.Andriod;
import controllers.common.ControllersUtils;

public class Actions extends Controller {

	static String signedApk;
	
	public static Result export() {
		JsonNode vendorJson = request().body().asJson();
		Code code = Json.fromJson(vendorJson, Code.class);
		if ( code == null) {
            return badRequest( ControllersUtils.getErrorMessage( "Failed to save!" ) );
        } else {
        	signedApk = Andriod.build( code.cleanCodes );
            return ok(ControllersUtils.getSuccessMessage( "OK!" ) );
        }
	}
	
	public static Result download() {
		File apkFile = new File( signedApk );
		if ( apkFile.exists() ) {
			response().setHeader("Content-Disposition", "attachment; filename=demo.apk");
			return ok( apkFile, (int)apkFile.length() );
			
		}
		return badRequest( ControllersUtils.getErrorMessage( "Failed to save!" ) );
	}
}
