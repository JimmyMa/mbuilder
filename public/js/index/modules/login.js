define(function() {
    return function() {
        this.email = ko.observable();
        this.password = ko.observable();
        this.doLogin = function() {
            $.ajax({ url: "/login", data: ko.toJSON(this), 
                type: "POST", 
                dataType:"json",
                contentType: 'application/json',
                success: function(data, textStatus, jqXHR){
                    window.user = data;
                    location.hash = "#projects";
                    window.onhashchange();                
                },
                error: function(){
                   alert( "failed!" );
            }});
        };
        
        this.doRegister = function() {
            $.ajax({ url: "/register", data: ko.toJSON(this), 
                type: "POST", 
                dataType:"json",
                contentType: 'application/json',
                success: function(data, textStatus, jqXHR){
                    window.user = data;
                    location.hash = "#projects";
                    window.onhashchange();                
                },
                error: function(){
                   alert( "failed!" );
            }});
        };
    };
});