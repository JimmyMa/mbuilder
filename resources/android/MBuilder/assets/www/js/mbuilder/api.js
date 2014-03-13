(function(window) {
    if ( window.m == undefined ) {
        window.m = {
            
            activePage: function( pageId ) {
                $.mobile.changePage( "#" + pageId );
            },
            documentReadyFuncs: [],
            addDocumentReady: function( readyFun ){
                m.documentReadyFuncs.push( readyFun );
            }
        }
    }
})(window);

function callDocumentReadyFuncs() {
    $.each( window.m.documentReadyFuncs, function( index, readyFunc ) {
        readyFunc();
    });
}