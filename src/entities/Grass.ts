export class Grass {
  x: number;
  y: number;
  baseY: number;
  height: number;
  seed: number;
  time: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.height = 15 + Math.random() * 25;
    this.seed = Math.random() * Math.PI * 2;
  }

  update(time: number) {
    this.time = time;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const wind = Math.sin(this.time * 0.0015 + this.seed) * 12;

    ctx.fillStyle = '#065f46'; // dark grass green
    ctx.beginPath();
    ctx.moveTo(this.x, this.baseY);
    // Left edge to tip
    ctx.quadraticCurveTo(this.x + wind * 0.5, this.baseY - this.height * 0.5, this.x + wind, this.baseY - this.height);
    // Right edge from tip back to base
    ctx.quadraticCurveTo(this.x + wind * 0.5 + 3, this.baseY - this.height * 0.5, this.x + 6, this.baseY);
    ctx.fill();

    ctx.restore();
  }
}
