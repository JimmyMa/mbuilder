mbuilder.createEditor( "input", 
    function(property, widgetData) {
        var filter = "input[targetmbuildid='" + widgetData.mbuilderid + "']";
        $($.find( filter )[0]).keyup(function() {
            var updatedInfo = { mbuilderid: widgetData.mbuilderid, property: property, value: this.value };
            publishToPhone( "widget.action.updated", updatedInfo );
        });
    }
);
