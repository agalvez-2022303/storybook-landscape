export class Firefly {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  seed: number;
  time: number = 0;
  scrollProgress: number = 0;
  width: number;
  height: number;

  static glowCanvas: HTMLCanvasElement | null = null;

  static getGlow(): HTMLCanvasElement {
    if (!this.glowCanvas) {
      const r = 100;
      const c = document.createElement('canvas');
      c.width = r * 2;
      c.height = r * 2;
      const ctx = c.getContext('2d')!;
      const grad = ctx.createRadialGradient(r, r, 0, r, r, r);
      grad.addColorStop(0, 'rgba(253, 224, 71, 1)');
      grad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, r * 2, r * 2);
      this.glowCanvas = c;
    }
    return this.glowCanvas;
  }

  constructor(width: number, height: number, x: number, y: number) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.seed = Math.random() * Math.PI * 2;
  }

  update(time: number, scrollVelocity: number, scrollProgress: number) {
    this.time = time;
    this.scrollProgress = scrollProgress;
    this.baseY -= scrollVelocity * 150; 
    
    if (this.baseY < -200) this.baseY = this.height + 200;
    if (this.baseY > this.height + 200) this.baseY = -200;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    let cx = this.baseX + Math.sin(this.time * 0.001 + this.seed) * 40;
    let cy = this.baseY + Math.cos(this.time * 0.0008 + this.seed * 2) * 30;
    
    if (this.scrollProgress > 0.75) {
      const p = Math.min(1, (this.scrollProgress - 0.75) / 0.25);
      const pull = p * p * p; 
      const targetX = this.width / 2;
      const targetY = this.height / 2;
      
      cx = cx * (1 - pull) + targetX * pull + Math.sin(this.time * 0.005 + this.seed) * 150 * pull;
      cy = cy * (1 - pull) + targetY * pull + Math.cos(this.time * 0.005 + this.seed * 2) * 150 * pull;
    }

    this.x = cx;
    this.y = cy; 

    let glow = 0.3 + 0.7 * Math.sin(this.time * 0.002 + this.seed * 3);
    if (this.scrollProgress > 0.8) {
       glow += (this.scrollProgress - 0.8) * 15; 
    }

    ctx.translate(cx, cy);

    // Optimized drawing with cached glow
    if (glow > 0.1) {
      const radius = 15 + (this.scrollProgress > 0.8 ? (this.scrollProgress - 0.8)*150 : 0);
      ctx.globalAlpha = Math.min(glow * 0.6, 1);
      ctx.drawImage(Firefly.getGlow(), -radius, -radius, radius * 2, radius * 2);
      ctx.globalAlpha = 1; // reset
    }

    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(glow + 0.2, 1)})`;
    ctx.beginPath();
    ctx.arc(0, 0, 2 + (this.scrollProgress > 0.8 ? 3 : 0), 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }
}
