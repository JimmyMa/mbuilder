function init() {
    $(document).bind( "pagechangefailed", function( e, data ) {
        console.log( e );
    });
    $.each( window.m.documentReadyFuncs, function( index, readyFunc ) {
        readyFunc();
    });
}
