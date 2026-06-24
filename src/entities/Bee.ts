export class Bee {
  x: number;
  y: number;
  baseY: number;
  seed: number;
  time: number = 0;
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.x = Math.random() * width;
    this.y = Math.random() * height * 1.5;
    this.baseY = this.y;
    this.seed = Math.random() * Math.PI * 2;
  }

  update(time: number, scrollVelocity: number) {
    this.time = time;
    this.baseY -= scrollVelocity * 150;
    if (this.baseY < -200) this.baseY = this.height + 200;
    if (this.baseY > this.height + 200) this.baseY = -200;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    // Erratic hovering
    const hoverX = Math.sin(this.time * 0.005 + this.seed) * 50 + Math.cos(this.time * 0.002) * 20;
    const hoverY = Math.cos(this.time * 0.006 + this.seed) * 30;
    this.x = (this.x + hoverX * 0.05) % this.width;
    if (this.x < 0) this.x = this.width;
    
    ctx.translate(this.x, this.baseY + hoverY);
    ctx.scale(0.8, 0.8);

    // Wings (fast flapping)
    const flap = Math.sin(this.time * 0.05) * 5;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(-2, -5 + flap, 6, 8, Math.PI/4, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(2, -5 + flap, 6, 8, -Math.PI/4, 0, Math.PI*2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#fbbf24'; // Yellow
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 6, 0, 0, Math.PI*2);
    ctx.fill();

    // Stripes
    ctx.fillStyle = '#1c1917';
    ctx.beginPath(); ctx.ellipse(-2, 0, 2, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(2, 0, 2, 5.5, 0, 0, Math.PI*2); ctx.fill();

    // Head
    ctx.beginPath(); ctx.arc(7, 0, 3, 0, Math.PI*2); ctx.fill();

    ctx.restore();
  }
}
