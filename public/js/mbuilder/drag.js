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
		e.dataTransfer.setData('action', "create");
        e.dataTransfer.setData('widgetid', this.dataset.compenent);
	}
	
	function dragOverEvent(e) {
        doMoveWidget( e.clientX, e.clientY )
		EventHelpers.preventDefault(e);
	}
	
	function dropEvent(e) {
        var action = e.dataTransfer.getData('action');
        doaction( action, e.dataTransfer );
		EventHelpers.preventDefault(e);
	}
	
}
