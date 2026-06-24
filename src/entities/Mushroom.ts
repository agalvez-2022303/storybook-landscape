export class Mushroom {
  x: number;
  y: number;
  baseY: number;
  size: number;
  seed: number;
  time: number = 0;
  bloomStart: number;
  scale: number = 0;
  narrativeIntensity: number = 0;

  static glowCanvas: HTMLCanvasElement | null = null;

  static getGlow(): HTMLCanvasElement {
    if (!this.glowCanvas) {
      const r = 150;
      const c = document.createElement('canvas');
      c.width = r * 2; c.height = r * 2;
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

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.size = 15 + Math.random() * 20;
    this.seed = Math.random();
    this.bloomStart = 0.1 + Math.random() * 0.2;
  }

  update(time: number, scrollVelocity: number, scrollProgress: number, narrativeIntensity: number) {
    this.time = time;
    this.narrativeIntensity = narrativeIntensity;
    this.scale = Math.min(1, Math.max(0, (scrollProgress - this.bloomStart) / 0.1));
    this.scale = 1 - Math.pow(1 - this.scale, 3); 
    this.baseY -= scrollVelocity * 300; 
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.scale <= 0) return;

    ctx.save();
    ctx.translate(this.x, this.baseY);

    if (this.narrativeIntensity > 0) {
      const glowStr = this.narrativeIntensity * this.scale * (0.5 + 0.5 * Math.sin(this.time*0.003 + this.seed*10));
      if (glowStr > 0) {
        const rad = this.size * 3;
        ctx.globalAlpha = glowStr * 0.8;
        ctx.drawImage(Mushroom.getGlow(), -rad, -this.size - rad, rad * 2, rad * 2);
        ctx.globalAlpha = 1;
      }
    }

    const breathe = Math.sin(this.time * 0.002 + this.seed * 10) * 0.04;
    ctx.scale((1 + breathe) * this.scale, (1 - breathe) * this.scale);

    ctx.fillStyle = '#fef3c7'; 
    ctx.beginPath();
    ctx.moveTo(-this.size * 0.25, 0);
    ctx.quadraticCurveTo(-this.size * 0.35, -this.size, 0, -this.size * 1.6);
    ctx.quadraticCurveTo(this.size * 0.35, -this.size, this.size * 0.25, 0);
    ctx.fill();

    ctx.fillStyle = this.seed > 0.5 ? '#ef4444' : '#d946ef'; 
    ctx.beginPath();
    ctx.moveTo(-this.size * 1.4, -this.size * 1.3);
    ctx.bezierCurveTo(
      -this.size * 1.8, -this.size * 2.8, 
      this.size * 1.8, -this.size * 2.8, 
      this.size * 1.4, -this.size * 1.3
    );
    ctx.quadraticCurveTo(0, -this.size * 1.6, -this.size * 1.4, -this.size * 1.3);
    ctx.fill();

    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.moveTo(-this.size * 1.4, -this.size * 1.3);
    ctx.quadraticCurveTo(0, -this.size * 1.6, this.size * 1.4, -this.size * 1.3);
    ctx.quadraticCurveTo(0, -this.size * 1.4, -this.size * 1.4, -this.size * 1.3);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(-this.size * 0.6, -this.size * 1.9, this.size * 0.25, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(this.size * 0.7, -this.size * 1.7, this.size * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -this.size * 2.2, this.size * 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-this.size * 0.1, -this.size * 1.6, this.size * 0.15, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  }
}
