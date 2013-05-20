mbuilder.createEditor( "property.texteditor", 
    function(id, property, widgetData) {
        var filter = "#" + id;
        var widget = $(filter);
        var editor = new TINY.editor.edit('editor',{
            id:id, // (required) ID of the textarea
            width:320, // (optional) width of the editor
            height:175, // (optional) heightof the editor
            cssclass:'te', // (optional) CSS class of the editor
            controlclass:'tecontrol', // (optional) CSS class of the buttons
            rowclass:'teheader', // (optional) CSS class of the button rows
            dividerclass:'tedivider', // (optional) CSS class of the button diviers
            controls:['bold', 'italic', 'underline', 'strikethrough', '|', 'orderedlist', 'unorderedlist', '|' ,'outdent' ,'indent', 'n', 'leftalign', 'centeralign', 'rightalign', '|', 'image', 'hr', 'link', 'unlink', 'n', 'font', 'size', 'style', '|', 'update'], 
            footer:true, // (optional) show the footer
            fonts:['Verdana','Arial','Georgia','Trebuchet MS'],  // (optional) array of fonts to display
            xhtml:true, // (optional) generate XHTML vs HTML
            cssfile:'js/TinyEditor/style.css', // (optional) attach an external CSS file to the editor
            
            content:widgetData.properties[property], // (optional) set the starting content else it will default to the textarea content
            css:'body{background-color:white}', // (optional) attach CSS to the editor
            bodyid:'editor', // (optional) attach an ID to the editor body
            footerclass:'tefooter', // (optional) CSS class of the footer
            toggle:{text:'source',activetext:'wysiwyg',cssclass:'toggle'}, // (optional) toggle to markup view options
            resize:{cssclass:'resize'}, // (optional) display options for the editor resize
            update: function() {
                editor.post();
                var updatedInfo = { mbuilderid: widgetData.mbuilderid, property: property, value: widget.val() };
                publishToChildren( "widget.action.updated", updatedInfo );
            }
        });
        /*
        var filter = "#" + id;
        $($.find( filter )[0]).keyup(function() {
            var updatedInfo = { mbuilderid: widgetData.mbuilderid, property: property, value: this.value };
            publishToChildren( "widget.action.updated", updatedInfo );
        });
        */
    }
);
