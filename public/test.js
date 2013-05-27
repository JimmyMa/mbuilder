function Page1ViewModel() {
    var that = this;
    that.titles = ko.observableArray();
    that.getRSS = function( e ) {
        $.get('http://cn.engadget.com/rss.xml', 'xml' , 
            function(data) {
                $(data).find('item').each(function() {
                    var title = $(this).find('title').text();
                    var link = $(this).find('link').text();
                    that.titles.push( {link: link, title: title} );
                });
        });
    };
    
    that.getDetail = function( e ) {
        window.theurl = this.link;
        m.activePage( "page5000" );
    };
}

function Page1ViewModel() {
    var that = this;
    that.title=ko.observable();
    that.body=ko.observable();
}

$( 'page5000' ).on( 'pageshow',function(event, ui){
    $.get( window.theurl, 'html' , 
        function(data) {
            that.title($(data).find( ".posttitle" ).html());
            that.body($(data).find( ".postbody" ).html());
    });
});
