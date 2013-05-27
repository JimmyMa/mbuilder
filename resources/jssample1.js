    var that = this;
    that.titles = ko.observableArray();
    that.getRSS = function( e ) {
        $.get('http://engadget.com/rss.xml', 'xml' , 
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
         page5003View.body( "loading ....." );
        m.activePage( "page5003" );
    };
    
--------------------
var that = this;
that.title=ko.observable();
that.body=ko.observable();

--------------------
m.addDocumentReady( function() {
    $( '#page5002' ).on( 'pageshow',function(event, ui){
        $.get( window.theurl, 'html' , 
            function(data) {
               page5002View.title($(data).find( "h1[itemprop='headline']" ).text());
               page5002View.body($(data).find( ".post-body" ).html());
        });
    });
});

page0View.titles.subscribe(function() {
    $("ul[data-role='listview']").listview("refresh");  
});
====================

    var that = this;
    that.images = ko.observableArray();
    that.getDog = function( e ) {
        that.images.removeAll();
        that.getImages( "dog" );
    };
    that.getPig = function( e ) {
        that.images.removeAll();
        that.getImages( "pig" );
    };
    that.getImages = function( type ) {
        var photoSwipeInstance = Code.PhotoSwipe.getInstance( "page0" );
        if (typeof photoSwipeInstance != "undefined" && photoSwipeInstance != null) {
            Code.PhotoSwipe.detatch(photoSwipeInstance);
        }

        $.get('http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=8e7562919b37eecf87ff136e257ad3c4&tags=' + type + '&format=rest', 'xml' , 
            function(data) {
                $(data).find('photo').each(function() {
                    var url = "http://farm" + $(this).attr('farm') + ".static.flickr.com/" + $(this).attr('server') + "/" + $(this).attr('id') + "_" + $(this).attr('secret') + ".jpg";
                    that.images.push( url );
                });
                setTimeout(function(){
                    var options = {},
                    photoSwipeInstance = $("ul.gallery a", $("#page0")).photoSwipe(options,  "page0");
                },500);
        });
    };
