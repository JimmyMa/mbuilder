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
        var widgetid = e.dataTransfer.getData('component');
        createWidget( widgetid );
        
		EventHelpers.preventDefault(e);
	}
	
}
