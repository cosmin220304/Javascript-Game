import { GameEngine, Mouse, GameObject, Position, Transform, Size } from "./GameEngine.js";

class Player extends GameObject {
  constructor() {
    super()
    this.Transform.Size = new Size(undefined, 50, 50)
    this.Transform.Position = new Position(undefined, GameEngine.Canvas.width / 2, GameEngine.Canvas.height / 2)
  }

  update(): void {
    const dx = this.Transform.Position.x - Mouse.Position.x;
    const dy = this.Transform.Position.y - Mouse.Position.y;
    if (Mouse.Position.x != this.Transform.Position.x) {
      this.Transform.Position.x -= dx / 30;
    }
    if (Mouse.Position.y != this.Transform.Position.y) {
      this.Transform.Position.y -= dy / 30;
    }
    if (Mouse.Click) {
      GameEngine.renderLine(this.Transform.Position, Mouse.Position)
    }
    GameEngine.renderSquare(this.Transform)
  }
}

class Object extends GameObject {
  constructor() {
    super()
    this.Transform.Size = new Size(undefined, 250, 200)
  }

  update() {
    GameEngine.renderSquare(this.Transform)
  }
}

const player = new Player();
const object = new Object()