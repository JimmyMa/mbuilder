function Page1ViewModel() {
    var that = this;
    that.title = ko.observableArray();
    that.title( "test" );
    
    that.toPage2 = function( e ) {
        $.mobile.changePage("#page2");
    }
}