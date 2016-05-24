class GameState {

}

let core = new Core<GameState>("canvasElement");
core.gameState = new GameState();

core.init(function () {
    
});

core.setDrawCallback(function (dt, state) {
    console.log(dt);
});

core.setUpdateCallback(function (dt, state) {

});

core.start();
