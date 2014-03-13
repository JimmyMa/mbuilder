package controllers.common;

import java.util.HashMap;
import java.util.Map;

import mbuilder.MProject;

public class CachedProjects {

	private static Map<String, MProject> projects = new HashMap<String, MProject>();
	
	public static void put( String key, MProject code ) {
		projects.put( key, code );
	}
	
	public static MProject get( String key ) {
		return projects.get( key );
	}
}
