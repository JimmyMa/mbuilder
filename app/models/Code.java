package models;

import java.util.List;

public class Code {
	
	public String rawHtmlCodes;
	public String cleanedHtmlCodes;
	public List<JavascriptCode> javascriptCodes;
	
	public String getJavascriptCodes() {
		StringBuffer codes = new StringBuffer();
		StringBuffer readyCodes = new StringBuffer();
		readyCodes.append( "$(document).ready( function() {" );
		for (JavascriptCode code : javascriptCodes ) {
			if ( code.pageId.equals( "global") ) {
				codes.append( code.javascript );
				continue;
			}
			
			readyCodes.append( "var " + code.pageId + "View = new " + code.pageId + "ViewModel();" );
			readyCodes.append( "ko.applyBindings(" + code.pageId + "View, document.getElementById('" + code.pageId + "'));" );
			
		    codes.append( "function " + code.pageId + "ViewModel() {" );
		    codes.append( code.javascript );
		    codes.append( "}" );
		}
		
		
		readyCodes.append( "});" );

		return readyCodes.toString() + codes.toString();
	}
}

class JavascriptCode {
	
	public String pageId;
	public String javascript;
}
