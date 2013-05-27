package controllers.common;

import java.util.HashMap;
import java.util.Map;

import models.Project;

public class Projects {

	private static Map<String, Project> projects = new HashMap<String, Project>();
	
	public static void put( String key, Project code ) {
		projects.put( key, code );
	}
	
	public static Project get( String key ) {
		return projects.get( key );
	}
}
