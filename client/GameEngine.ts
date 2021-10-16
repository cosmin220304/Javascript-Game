class MouseClass {
  private _position: Position
  private _click: boolean

  constructor(canvas: HTMLCanvasElement) {
    this._position = new Position(undefined, canvas.width / 2, canvas.height / 2)
    this._click = false
    canvas.addEventListener("mousedown", (e) => {
      const canvasPosition = canvas.getBoundingClientRect();
      this._position.x = e.x - canvasPosition.left;
      this._position.y = e.y - canvasPosition.top;
      this._click = true;
    });
    canvas.addEventListener("mouseup", (e) => {
      this._click = false;
    });
  }

  public get Position() {
    return new Position(this._position);
  }

  public set Position(position: Position) {
    this._position = new Position(position)
  }

  public get Click() {
    return this._click;
  }

  public set Click(click: boolean) {
    this._click = click;
  }
}

class GameEngineClass {
  // singleton pattern
  private static instance: GameEngineClass | undefined

  // canvas logic
  private _canvas: HTMLCanvasElement
  private _ctx: CanvasRenderingContext2D
  private _mouse: MouseClass

  // objects logic
  private _id: number                           // id for identifying objects
  private _updateSubscribers: Array<GameObject> // subscribers to update function

  private constructor(canvas?: HTMLCanvasElement, canvasId?: string) {
    this._canvas = canvas || document.getElementById(canvasId || "canvas") as HTMLCanvasElement
    this._ctx = this._canvas.getContext("2d") as CanvasRenderingContext2D;
    this._canvas.width = 800;
    this._canvas.height = 500;
    this._ctx.font = "50px Georgia";
    this._mouse = new MouseClass(this._canvas)
    this._updateSubscribers = new Array<GameObject>()
    this._id = 0
    this.update()
  }

  public static getInstance() {
    if (!GameEngineClass.instance) {
      GameEngineClass.instance = new GameEngineClass()
    }
    return GameEngineClass.instance
  }

  public generateId() {
    this._id += 1
    return this._id
  }

  public subscribe(subscriber: GameObject) {
    this._updateSubscribers.push(subscriber)
  }

  private update() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    for (const subscriber of this._updateSubscribers) {
      subscriber.update();
    }
    this.collisionCheck();
    requestAnimationFrame(this.update.bind(this));
  }

  private collisionCheck() {
    const length = this._updateSubscribers.length
    for (let i = 0; i < length - 1; i++) {
      for (let j = i + 1; j < length; j++) {
        const subscriber1 = this._updateSubscribers[i]
        const subscriber2 = this._updateSubscribers[j]
        if (subscriber1.Id === subscriber2.Id) continue;

        const diffX = Math.abs(subscriber1.Transform.Position.x - subscriber2.Transform.Position.x)
        const diffY = Math.abs(subscriber1.Transform.Position.y - subscriber2.Transform.Position.y)

        if (diffX * 2 <= subscriber1.Transform.Size.x + subscriber2.Transform.Size.x
          && diffY * 2 <= subscriber1.Transform.Size.y + subscriber2.Transform.Size.y) {
          console.log("Collision!!")
        }
      }
    }
  }

  public renderSquare(transform: Transform, color?: string) {
    const centerPositionX = transform.Position.x - transform.Size.x / 2
    const centerPositionY = transform.Position.y - transform.Size.y / 2
    this._ctx.fillStyle = color || "pink";
    this._ctx.beginPath();
    this._ctx.rect(centerPositionX, centerPositionY, transform.Size.x, transform.Size.y);
    this._ctx.fill();
    this._ctx.closePath();
  }

  public renderLine(start: Position, finish: Position, width?: number) {
    this._ctx.lineWidth = width || 0.2;
    this._ctx.beginPath();
    this._ctx.moveTo(start.x, start.y);
    this._ctx.lineTo(finish.x, finish.y);
    this._ctx.stroke();
  }

  public get Mouse() {
    return this._mouse
  }

  public get Canvas() {
    return this._canvas
  }
}

//#region OBJECT PRIMITIVES

class Position {
  x: number;
  y: number
  constructor(position?: Position, x?: number, y?: number) {
    if (position) {
      this.x = position.x;
      this.y = position.y;
    } else if (x && y) {
      this.x = x
      this.y = y
    } else {
      this.x = 0
      this.y = 0
    }
  }
}

class Size {
  x: number;
  y: number;
  constructor(size?: Size, x?: number, y?: number) {
    if (size) {
      this.x = size.x;
      this.y = size.y;
    } else if (x && y) {
      this.x = x
      this.y = y
    } else {
      this.x = 0
      this.y = 0
    }
  }
}

class Transform {
  private _position: Position
  private _size: Size
  constructor(transform?: Transform) {
    if (transform) {
      this._position = new Position(transform.Position)
      this._size = new Size(transform.Size)
    } else {
      this._position = new Position()
      this._size = new Size()
    }
  }

  public get Position() {
    return this._position
  }

  public set Position(position: Position) {
    this._position = position
  }

  public get Size() {
    return this._size
  }

  public set Size(size: Size) {
    this._size = size
  }
}

class Collider { }

//#endregion

class GameObject {
  private gameEngine: GameEngineClass
  private _transform: Transform
  private _id: Number
  constructor() {
    this.gameEngine = GameEngineClass.getInstance()
    this.gameEngine.subscribe(this)
    this._id = this.gameEngine.generateId()
    this._transform = new Transform()
  }

  update(): void { }

  public get Transform() {
    return this._transform
  }

  public set Transform(transform: Transform) {
    this._transform = transform
  }

  public get Id() {
    return this._id
  }
}

const GameEngine = GameEngineClass.getInstance()
const Mouse = GameEngine.Mouse

export {
  GameEngine, Mouse, GameObject, Position, Transform, Size
}