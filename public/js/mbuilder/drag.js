var IDCounter = 5000;
var dragObject = new function () {
	var me = this;
	
	var targetNode; 
	
	var dataTransferCommentString;
	
	me.init = function () {
	
		if (EventHelpers.hasPageLoadHappened(arguments)) {
			return;
		}	

		targetNode=document.getElementById('container-1062');
		
		/* These are events for the draggable objects */
		var dragNodes = cssQuery('[draggable=true]');
		for (var i = 0; i < dragNodes.length; i++) {
			var  dragNode=dragNodes[i]
			EventHelpers.addEvent(dragNode, 'dragstart', dragStartEvent);
		}
		
		/* These are events for the object to be dropped */
		if (targetNode) {
			EventHelpers.addEvent(targetNode, 'dragover', dragOverEvent);	
			EventHelpers.addEvent(targetNode, 'drop', dropEvent);
		}
	}
	
	function dragStartEvent(e) {
		e.dataTransfer.setData('component', this.dataset.compenent);
	}
	
	function dragOverEvent(e) {
		EventHelpers.preventDefault(e);
	}
	
	function dropEvent(e) {
        console.log( e.dataTransfer.getData('component') );
        var url = "components/" + e.dataTransfer.getData('component') + ".tmp";
        $.get( url,function(data) {
            var compiled = _.template( data, {componentid: IDCounter ++ } );
            var component = $("#screen" ).append(compiled);
            component.click(function(e) {
                var target = document.elementFromPoint( e.clientX, e.clientY);
                clearSelected();
                controlSelected( $(target).hasClass( "selectable" ) ? $(target) : $(target).parents( ".selectable:first" ) );
            });
            $("#screen" ).trigger('pagecreate');
        });
		EventHelpers.preventDefault(e);
	}
	
}

EventHelpers.addPageLoadEvent('dragObject.init');