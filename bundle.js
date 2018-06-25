"use strict";
var Water = (function () {
    function Water() {
    }
    Water.prototype.render = function () {
        this.tank.text = "hi i'm water";
    };
    return Water;
}());
