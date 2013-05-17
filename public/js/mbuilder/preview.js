function init() {
$(document).bind( "pagechangefailed", function( e, data ) {

    console.log( e );
});
}

function refreshPages() {
    renderPages();
}

function renderPages() {
    if ( getCurrentPageId() != "pageinit" ) {
        $('#pageinit').bind('pageshow',function(event, ui){
            $("#pageinit").prevAll().remove();
            var codes = parent.$("#codesIframe").get(0).contentWindow.$("body" ).html();
            var cleanCodes = parent.removeMBuilderCodes( codes  );
            
            var el = $(cleanCodes.trim());
            getCurrentPage().before( el );
            
            $("#page0").page();
            
            $.mobile.changePage( "#page0" );
            loadJavascript();
        });
        $.mobile.changePage( "#pageinit" );
    } else {
        $("#pageinit").prevAll().remove();
        var codes = parent.$("#codesIframe").get(0).contentWindow.$("body" ).html();
        var cleanCodes = parent.removeMBuilderCodes( codes  );
        
        var el = $(cleanCodes.trim());
        getCurrentPage().before( el );
        
        $("#page0").page();
        
        $.mobile.changePage( "#page0" );
        loadJavascript();
    }
}

function loadJavascript() {
    $.each( parent.$(".javascript"), function( index, jsDiv ) {
        var id = jsDiv.id;
        id = id.substring( 0,id.length - 3 );
        eval.call(window, composeJavascript( id, jsDiv.textContent ) );
    });
}

function composeJavascript( pageId, js ) {
    if ( pageId == "global" ) {
        return js;
    }
    var contents = "function " + pageId + "ViewModel() {";
    contents += js;
    contents += "}";
    contents += "var " + pageId + "View = new " + pageId + "ViewModel();";
    contents += "ko.applyBindings(" + pageId + "View, document.getElementById('" + pageId + "'));";
    console.log( contents );
    return contents;
}