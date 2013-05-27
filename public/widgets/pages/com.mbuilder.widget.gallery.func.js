m.addDocumentReady( function() {
		
		
    $('#page0').on('pageshow', function(e){
            
            var 
                currentPage = $(e.target),
                options = {},
                photoSwipeInstance = $("ul.gallery a", e.target).photoSwipe(options,  currentPage.attr('id'));
                
            return true;
            
        })
        
        .on('pagehide', function(e){
            
            var 
                currentPage = $(e.target),
                photoSwipeInstance = Code.PhotoSwipe.getInstance(currentPage.attr('id'));

            if (typeof photoSwipeInstance != "undefined" && photoSwipeInstance != null) {
                Code.PhotoSwipe.detatch(photoSwipeInstance);
            }
            
            return true;
            
        });


});