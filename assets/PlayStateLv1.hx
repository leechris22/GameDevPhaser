package;
import flixel.FlxObject;
import flixel.FlxG;
import flixel.FlxState;
import flixel.FlxG.keys;
import flixel.tile.FlxTilemap;
import flixel.tile.FlxBaseTilemap;
import flixel.addons.editors.tiled.*;
import flixel.group.FlxGroup;
import flixel.math.FlxPoint;
import flixel.util.FlxColor;

class PlayStateLv1 extends FlxState
{
	var da_player : Player;
	var da_map : TiledMap;
	var da_walls : FlxTilemap;
	var guards : FlxTypedGroup<Guard>;
	var mirrors : FlxTypedGroup<Mirror>;
	var beam = new Array<Light>();
	var pg = new PuzzleGrid(32, 32, 32, 0, 0);
	var gemActivated = false;
	var target : Target;
	var entrance : Gate;
	var exit : Gate;
	var emitterX = 13;
	var emitterY = 0;
	var endX = 0;
	var endY = 0;
	override public function create():Void
	{
		// Scene Fade-in Animation
		FlxG.camera.fade(FlxColor.BLACK, .33, true);

		guards = new FlxTypedGroup<Guard>();
		mirrors = new FlxTypedGroup<Mirror>();
		da_player = new Player(0, 300);
		da_map = new TiledMap(AssetPaths.Level1__tmx);
		da_walls = new FlxTilemap();
		// *** 1 *** Set position of Target, Entrance and Exit
		//entrance = new Gate(200,0,"Entrance",32,"assets/images/EntranceOpen.png","assets/images/EntranceClose.png");
		exit = new Gate(300,992,"Exit",32,"assets/images/ExitClose.png","assets/images/ExitOpen.png");
		
		// we put "Layer1" in the getLayer function because the map(wall & floor) layer in
		// test map is named "Layer1". 
		//
		// should be changed if the map layer have another name.
		
		da_walls.loadMapFromArray(cast(da_map.getLayer("Tile Layer 1"), TiledTileLayer).tileArray,
		   da_map.width, da_map.height, AssetPaths.MapTileSet__png, da_map.tileWidth, da_map.tileHeight, 1,1,16);
		da_walls.follow();
		for(i in 1...12){
			da_walls.setTileProperties(i, FlxObject.NONE);
		}

		add(da_walls);


















		//read in mirror and gem location
		var tmpMap_t : TiledTileLayer = cast da_map.getLayer("Tile Layer 2");
		var counter: Int = 0;
		for (e in tmpMap_t.tileArray){
			if (e == 18)
			{
				var m: Mirror = new Mirror(0, 0);
				pg.addObjectToGridLocation(counter % 32, Std.int(Std.int(counter) / 32), m);
				mirrors.add(m);
				m.flip();
			}
			else if (e == 17)
			{	
				endY = Std.int(Std.int(counter) / 32);
				endX = (counter % 32);
				target = new Target(Std.int(Std.int(counter) / 32) * 32,(counter % 32) * 32,32,"assets/images/Crystal.png");
			}
			counter++;
				
		}	

































	
	
				
		FlxG.camera.follow(da_player, NO_DEAD_ZONE, 1);
		pg.setPositionForAllObjects();


		add(mirrors);
		add(da_player);
		placeGuards();
		add(guards);
		for (g in guards)
		{
			add(g.flashlight);
		}
		add(target);
		add(target.caseSprite);
		//add(entrance);
		add(exit);
		var emitter = new Emitter(13 * 32, 0);
		add(emitter);
		beam = pg.getDataForLightBeam(emitterX, emitterY, endX, endY, 1).beamSprites;
		for (sprite in beam)
		{
			add(sprite);
		}
	}

	public function placeGuards()
	{
		var points1 = new Array<FlxPoint>();
		points1.push(new FlxPoint(11 * 32, 10 * 32));
		points1.push(new FlxPoint(11 * 32, 20 * 32));
		points1.push(new FlxPoint(19 * 32, 20 * 32));
		points1.push(new FlxPoint(19 * 32, 14 * 32));
		points1.push(new FlxPoint(16 * 32, 14 * 32));
		points1.push(new FlxPoint(16 * 32, 10 * 32));
		
		var times1 = new Array<Float>();
		times1.push(1.0);
		times1.push(1.5);
		times1.push(2.0);
		times1.push(0.2);
		times1.push(0.2);
		times1.push(0.2);
			

		var g1 = new Guard(0, 0, points1, times1);
		guards.add(g1);

		var points2 = new Array<FlxPoint>();
		points2.push(new FlxPoint(24 * 32, 24 * 32));
		points2.push(new FlxPoint(31 * 32, 24 * 32));
	
		var times2 = new Array<Float>();
		times2.push(0.1);
		times2.push(0.1);

		var g2 = new Guard(0, 0, points2, times2);
		guards.add(g2);

	}

	override public function update(elapsed:Float):Void
	{
		
		//press esc to return to menu
		if(FlxG.keys.pressed.ESCAPE){
			FlxG.switchState(new MenuState());
		}
		
		//collide detection
		//player hits wall
		//FlxG.collide(da_player, da_walls);

		//guards hit wall
		//FlxG.collide(guards, da_walls);

		//player hits guards
		//FlxG.collide(da_player, guards); //Why do we have this?
		FlxG.overlap(da_player, guards, playerTouchGuard);

		//player hits mirrors
		FlxG.overlap(da_player, mirrors, playerTouchMirror);
		
		//guard hit mirrors (?)
		FlxG.collide(guards, mirrors);

		// Player hits Target
		FlxG.overlap(da_player, target, playerTouchTarget);
		if (target.getActivateExitFlag()) {
			exit.activate();
		}

		// Player hits Entrance
		FlxG.overlap(da_player, entrance, playerTouchEntrance);

		// Player hits Exit
		FlxG.overlap(da_player, exit, playerTouchExit);
		
		for (guard in guards)
		{
			guard.update(elapsed);
		}
		
		super.update(elapsed);

		// Maintain positions of Target, Entrance, and Exit
		target.updatePosition();
		//entrance.updatePosition();
		exit.updatePosition();
		// Update activation status of target from gemActivated
		target.setActivationStatus(gemActivated);

	}
	function placeEntities(entityName:String, entityData:Xml):Void
	{
	     var x : Float = Std.parseFloat(entityData.get("x"));
	     var y : Float = Std.parseFloat(entityData.get("y"));
		 
		 // the player item should be named player
		 // same for mirror and guard items
		 
		if (entityName == "player")
		{
			da_player.x = x;
			da_player.y = y;
		}
		else if(entityName == "mirror"){
			var m = new Mirror(x, y);
trace("hi");
			mirrors.add(m);
			pg.addObjectToGridLocation(Std.int(Std.int(x) / 32), Std.int(Std.int(y) / 32), m);
			//need an extra parameter for the direction of the mirror.
		}
		else if(entityName == "guard"){
			//var g = new Guard(x, y);
			//guards.add(g);
			//need to get path data for the guards.
		}
		else if(entityName == "case"){
			//add case and gem
		}
	}
	function playerTouchGuard(p : Player, g : Guard):Void{
		// Shake camera
		FlxG.camera.shake(0.01, 0.2);
		// Scene Fade-out animation
		FlxG.camera.fade(FlxColor.BLACK,.33, false, function() {
		    FlxG.switchState(new LoseState());
		});
	}
	function playerTouchMirror(p : Player, m : Mirror):Void{
		if(FlxG.keys.justPressed.SPACE){
			m.flip();
			for (sprite in beam)
			{
				remove(sprite, true);
			}
			var lbd = pg.getDataForLightBeam(emitterX, emitterY, endX, endY, 1); //change to start and end points of beam and initial direction of beam.
			beam = lbd.beamSprites;
			for (sprite in beam)
			{
				add(sprite);
			}
			if (lbd.didContactGem && !gemActivated)
			{
				gemActivated = true;
			}
		}
		FlxObject.separate(p, m);
	}
	function playerTouchTarget(p : Player, t : Target):Bool{
		if (gemActivated) {
			// Hide Target (still reusable at stage)
			t.kill();
			// Set flag to activate Exit
			t.setActivateExitFlag(true);
			// returned value will activate Exit in Update function
			return true;
		}
		else {
			// Maintain position of Target
			t.updatePosition();
			FlxObject.separate(p, t);
			return false;
		}
	}
	function playerTouchExit(p : Player, g : Gate):Void{
		if (g.getActivationStatus()) {
			// Scene Fade-out animation
			FlxG.camera.fade(FlxColor.BLACK,.33, false, function() {
			    FlxG.switchState(new PlayStateLv2());
			});
		}
		else {
			FlxObject.separate(p, g);
			// Maintain position of Gate
			g.updatePosition();
		}
	}
	function playerTouchEntrance(p : Player, g : Gate):Void{
		if (g.getActivationStatus()) {
			FlxObject.separate(p, g);
			// Maintain position of Gate
			g.updatePosition();
		}
		else {
			g.activate();
			// Maintain position of Gate
			g.updatePosition();
		}
	}
}
	

