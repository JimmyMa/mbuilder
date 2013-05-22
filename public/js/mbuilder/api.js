(function(window) {
    if ( window.m == undefined ) {
        window.m = {
            activePage: function( pageId ) {
                $.mobile.changePage( "#" + pageId );
            }
        }
    }
})(window);
