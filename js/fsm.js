// FSM constructor
let FSM = function(reference, initState) {
	this.ref = reference;
	this.activeState = initState;
}

// If an active state is set, run the state
FSM.prototype.update = function() {
	this.activeState(this.ref);
}
