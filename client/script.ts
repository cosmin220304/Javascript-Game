import { GameEngine, Mouse } from "./GameEngine.js";

class Player {
  x: number;
  y: number;
  radius: number;
  angle: number;
  frameX: number;
  frameY: number;
  frame: number;
  sprieWidth: number;
  spriteHeight: number;

  constructor() {
    this.x = GameEngine.canvas.width / 2;
    this.y = GameEngine.canvas.height / 2;
    this.radius = 50;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.sprieWidth = 498;
    this.spriteHeight = 327;
    GameEngine.subscribe(this)
  }

  update() {
    const dx = this.x - Mouse.x;
    const dy = this.y - Mouse.y;
    if (Mouse.x != this.x) {
      this.x -= dx / 30;
    }
    if (Mouse.y != this.y) {
      this.y -= dy / 30;
    }
    if (Mouse.click) {
      GameEngine.ctx.lineWidth = 0.2;
      GameEngine.ctx.beginPath();
      GameEngine.ctx.moveTo(this.x, this.y);
      GameEngine.ctx.lineTo(Mouse.x, Mouse.y);
      GameEngine.ctx.stroke();
    }
    this.renderGraphics()
  }

  renderGraphics() {
    GameEngine.ctx.fillStyle = "pink";
    GameEngine.ctx.beginPath();
    GameEngine.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    GameEngine.ctx.fill();
    GameEngine.ctx.closePath();
  }
}

const player = new Player();