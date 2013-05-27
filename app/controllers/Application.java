package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;
import views.html.preview;
import controllers.common.Projects;

public class Application extends Controller {
  
  public static Result index() {
    return ok(index.render("Your new application is ready."));
  }
  
  public static Result preview() { 
	return ok(preview.render( Projects.get(session().get( "project" )), false, "/assets/") );
  }
  
}