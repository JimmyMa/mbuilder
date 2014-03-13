package controllers;

import java.util.Date;
import java.util.List;

import mbuilder.MProject;
import models.Project;
import models.S3File;
import models.User;

import org.codehaus.jackson.JsonNode;

import play.Logger;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;
import views.html.preview;
import controllers.common.CachedProjects;
import controllers.common.ControllersUtils;

public class Application extends Controller {
  
  public static Result index() {
    return ok(index.render());
  }
  
  public static Result preview() { 
	return ok(preview.render( CachedProjects.get(session().get( "project" )), false, "/assets/") );
  }
  
	public static Result addUser() {
		JsonNode json = request().body().asJson();
		User user = Json.fromJson(json, User.class);
		user.save();
		Secured.login( user );
        return ok( Json.toJson(user));
	}
  
	public static Result getProjects() {
		List<Project> projects = Project.find.where()
				.eq("user.id", Secured.getUserId())
				.orderBy( "id desc"  ).findList();
		

		return ok( Json.toJson(projects));
	}

	
	public static Result addProject() {
		JsonNode json = request().body().asJson();
		Project project = Json.fromJson(json, Project.class);
		project.user = User.find.byId( Secured.getUserId() );
		project.create_date = new Date();
		project.save();
        return ok( ControllersUtils.getSuccessMessage( "OK!" ) );
	}
	
	public static Result getProjectSource(int projectid) {
		
		MProject mp = CachedProjects.get("project" + projectid );
		if ( mp != null ) {
			Logger.info( "P ID1: " + projectid);
			return ok( Json.toJson(mp) );
		} else {
			Logger.info( "P ID2: " + projectid);
    		S3File s3File = new S3File();
    		s3File.name = "" + projectid;
    		s3File.userId = Secured.getUserId();
    		try {
	    		String json = new String( s3File.get() );
	    		return ok( Json.parse(json) );
    		} catch ( Exception e ) {
    			return badRequest( ControllersUtils.getErrorMessage( "no project found!" ) );
    		}
		}
	}

}