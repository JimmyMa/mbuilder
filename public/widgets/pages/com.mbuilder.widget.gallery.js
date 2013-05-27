mbuilder.createWidget( 
	"com.mbuilder.widget.gallery", 
	"Gallery",
	"widgets/imgs/navbar.png",
    {

    }, 
    { 
        foreach: {
            label: "Array",
            type: "binding.input"
        }
    },
    {
        postCreated: function(widget, page) {
            //page.trigger('pageshow');
        }
    },
    //this is dependency
    {
        cssFiles: ["js/code.photoswipe-3.0.5/jquery-mobile.css","js/code.photoswipe-3.0.5/photoswipe.css"],
        jsFiles: ["js/code.photoswipe-3.0.5/lib/klass.min.js",
            "js/code.photoswipe-3.0.5/code.photoswipe.jquery-3.0.5.min.js",
            "widgets/pages/com.mbuilder.widget.gallery.func.js"],
        files: ["js/code.photoswipe-3.0.5/error.gif",
            "js/code.photoswipe-3.0.5/icons.png",
            "js/code.photoswipe-3.0.5/loader.gif"]
    }
);