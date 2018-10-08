// FSM constructor
let FSM = function(reference, initState = null) {
	this.ref = reference;
	this.activeState = initState;
}

// If an active state is set, run the state
FSM.prototype.update = function() {
	if (this.activeState != null) {
		this.activeState(this.ref);
	}
}
