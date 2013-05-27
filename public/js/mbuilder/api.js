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

if ( ko ) {
    ko.bindingHandlers.jqmforeach = { 
     init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var res = ko.bindingHandlers.foreach.init(element, valueAccessor()['listview']);
        $(element).listview();
        return res;
     },
     update: function(element, valueAccessor) { 
       ko.utils.unwrapObservable(valueAccessor()); //just to create a dependency
       try {
        $(element).listview("refresh"); 
       } catch (e) {
       }
     } 
    };
}