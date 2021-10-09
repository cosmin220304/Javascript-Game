class MouseClass {
  x: number
  y: number
  click: boolean

  constructor(canvas: HTMLCanvasElement) {
    this.x = canvas.width / 2
    this.y = canvas.width / 2
    this.click = false
    canvas.addEventListener("mousedown", (e) => {
      const canvasPosition = canvas.getBoundingClientRect();
      this.x = e.x - canvasPosition.left;
      this.y = e.y - canvasPosition.top;
      this.click = true;
    });
    canvas.addEventListener("mouseup", (e) => {
      this.click = false;
    });
  }
}

class GameEngineClass {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  mouse: MouseClass
  updateSubscribers: Array<any>

  constructor(canvas?: HTMLCanvasElement, canvasId?: string) {
    this.canvas = canvas || document.getElementById(canvasId || "canvas") as HTMLCanvasElement
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.canvas.width = 800;
    this.canvas.height = 500;
    this.ctx.font = "50px Georgia";
    this.mouse = new MouseClass(this.canvas)
    this.updateSubscribers = new Array()
    this.update()
  }

  subscribe(subscriber: any) {
    this.updateSubscribers.push(subscriber)
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const subscriber of this.updateSubscribers) {
      subscriber.update();
    }
    requestAnimationFrame(this.update.bind(this));
  }
}

const GameEngine = new GameEngineClass()
const Mouse = GameEngine.mouse

export {
  GameEngine, Mouse
}