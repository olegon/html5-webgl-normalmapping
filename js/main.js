var GameState = (function () {
    function GameState() {
    }
    return GameState;
}());
var core = new Core("canvasElement");
core.gameState = new GameState();
core.init(function () {
});
core.setDrawCallback(function (dt, state) {
    console.log(dt);
});
core.setUpdateCallback(function (dt, state) {
});
core.start();
