export class Ladybug {
  x: number;
  y: number;
  baseY: number;
  time: number = 0;
  seed: number;
  scale: number = 0;
  popStart: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = height - 50 + Math.random() * 40; 
    this.baseY = this.y;
    this.seed = Math.random();
    this.popStart = 0.1 + Math.random() * 0.3; 
  }

  update(time: number, scrollVelocity: number, scrollProgress: number) {
    this.time = time;
    this.baseY -= scrollVelocity * 300; 
    
    if (scrollProgress > this.popStart) {
       this.scale = Math.min(1, (scrollProgress - this.popStart) * 10);
    } else {
       this.scale = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.scale <= 0.01) return;
    ctx.save();
    
    // Slow crawling
    const crawl = Math.sin(this.time * 0.0005 + this.seed * 100) * 15;
    
    ctx.translate(this.x + crawl, this.baseY);
    ctx.scale(this.scale * 0.8, this.scale * 0.8);
    
    // Rotate in direction of crawl
    const dir = Math.cos(this.time * 0.0005 + this.seed * 100);
    if (dir < 0) ctx.scale(-1, 1);

    // Body (Red Shell)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -5, 6, 0, Math.PI, true); 
    ctx.fill();

    // Head
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(-5, -3, 2.5, 0, Math.PI*2);
    ctx.fill();

    // Spots
    ctx.fillStyle = '#1c1917';
    ctx.beginPath(); ctx.arc(-2, -6, 1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(2, -5, 1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -3, 1.5, 0, Math.PI*2); ctx.fill();

    // Legs
    ctx.strokeStyle = '#1c1917';
    ctx.lineWidth = 1;
    const w = Math.sin(this.time * 0.02) * 2;
    ctx.beginPath(); ctx.moveTo(-3, -2); ctx.lineTo(-4 + w, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(w, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(3, -2); ctx.lineTo(4 - w, 0); ctx.stroke();

    ctx.restore();
  }
}
