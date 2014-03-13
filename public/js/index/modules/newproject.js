define(function() {
    return function() {
        this.init = function() {
            console.log( "init" );
        };
        
        this.name = ko.observable();
        
        this.description = ko.observable();
        
        this.submit = function() {
            $.ajax({ url: "/project", data: ko.toJSON(this), 
                type: "PUT", 
                dataType:"json",
                contentType: 'application/json',
                success: function(data, textStatus, jqXHR){
                    location.hash = "#projects";
                    window.onhashchange();                
                },
                error: function(){
                   alert( "failed£¡" );
            }});
        }
    };
});