mbuilder.createEditor( "property.checkbox", 
    function(id, property, widgetData) {
        var filter = "#" + id;
        $( filter ).click(function(){
            var updatedInfo = { mbuilderid: widgetData.mbuilderid, property: property, value: $(this).prop("checked") };
            publishToChildren( "widget.action.updated", updatedInfo );
        });
    }
);
