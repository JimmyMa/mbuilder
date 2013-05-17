    var that = this;
    that.titles = ko.observableArray();
    that.click1 = function( e ) {
        $.get('http://cn.engadget.com/rss.xml', 'xml' , 
            function(data) {
                $(data).find('item').each(function() {
                    var title = $(this).find('title').text();
                    that.titles.push( title );
                });
        });
    }
