export class Butterfly {
  x: number;
  y: number;
  baseY: number;
  seed: number;
  time: number = 0;
  color: string;
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.x = Math.random() * width;
    this.y = Math.random() * height * 1.5;
    this.baseY = this.y;
    this.seed = Math.random() * Math.PI * 2;
    const colors = ['#38bdf8', '#f472b6', '#a78bfa', '#fb923c'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(time: number, scrollVelocity: number) {
    this.time = time;
    this.baseY -= scrollVelocity * 100;
    if (this.baseY < -200) this.baseY = this.height + 200;
    if (this.baseY > this.height + 200) this.baseY = -200;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    // Smooth flying
    const flyX = Math.sin(this.time * 0.001 + this.seed) * 100;
    const flyY = Math.cos(this.time * 0.0015 + this.seed) * 50;
    
    ctx.translate(this.x + flyX, this.baseY + flyY);
    ctx.scale(1.2, 1.2);
    ctx.rotate(Math.sin(this.time * 0.002) * 0.2);

    // Wings (slower flap)
    const flap = Math.abs(Math.sin(this.time * 0.005 + this.seed)); 
    const wingWidth = 10 * flap + 2;

    ctx.fillStyle = this.color;
    
    // Left Wing
    ctx.beginPath();
    ctx.ellipse(-wingWidth, -5, wingWidth, 8, Math.PI/6, 0, Math.PI*2);
    ctx.ellipse(-wingWidth*0.8, 5, wingWidth*0.8, 6, -Math.PI/6, 0, Math.PI*2);
    ctx.fill();

    // Right Wing
    ctx.beginPath();
    ctx.ellipse(wingWidth, -5, wingWidth, 8, -Math.PI/6, 0, Math.PI*2);
    ctx.ellipse(wingWidth*0.8, 5, wingWidth*0.8, 6, Math.PI/6, 0, Math.PI*2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(0, 0, 2, 8, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }
}
