mbuilder.createEditor( "binding.input", 
    function(id, property, widgetData) {
        var filter = "#" + id;
        $($.find( filter )[0]).keyup(function() {
            var updatedInfo = { mbuilderid: widgetData.mbuilderid, property: property, value: this.value };
            publishToChildren( "widget.binding.updated", updatedInfo );
        });
    }
);
