define(function() {
    return function() {
        var self = this;
        this.init = function() {
            $.ajax({ url: "/projects", data: {}, 
                type: "GET", 
                dataType:"json",
                contentType: 'application/json',
                success: function(data, textStatus, jqXHR){
                    self.projects( data );
                },
                error: function(){
                   alert( "failed£¡" );
            }});
        };
        
        this.projects = ko.observableArray();
        
        this.newProject = function() {
            location.hash = "#newproject";
            window.onhashchange();  
        }
    };
});