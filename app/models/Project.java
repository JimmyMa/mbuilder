package models;

import java.util.List;

import play.Logger;

public class Project {
	
	public String rawHtmlCodes;
	public String cleanedHtmlCodes;
	public List<JavascriptCode> javascriptCodes;
	public String[] cssFiles;
	public String[] jsFiles;
	public String[] files;
	
	public String getJavascriptCodes() {
		StringBuffer codes = new StringBuffer();
		StringBuffer readyCodes = new StringBuffer();
		readyCodes.append( "$(document).ready( function() {\n" );
		for (JavascriptCode code : javascriptCodes ) {
			Logger.info( "--------Info: " + code.javascript );
			if ( code.pageId.equals( "global") ) {
				codes.append( code.javascript + "\n");
				continue;
			}
			
			readyCodes.append( "ko.applyBindings(" + code.pageId + "View, document.getElementById('" + code.pageId + "'));\n" );
			
		    codes.append( "function " + code.pageId + "ViewModel() {\n" );
		    codes.append( code.javascript + "\n" );
		    codes.append( "}\n" );
		    codes.append( "var " + code.pageId + "View = new " + code.pageId + "ViewModel();\n" );
		}
		
		
		readyCodes.append( "callDocumentReadyFuncs();});\n" );

		return readyCodes.toString() + codes.toString();
	}
}

class JavascriptCode {
	
	public String pageId;
	public String javascript;
}
