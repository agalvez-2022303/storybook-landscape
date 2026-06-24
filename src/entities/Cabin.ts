export class Cabin {
  x: number;
  y: number;
  baseY: number;
  scale: number;
  time: number = 0;
  scrollProgress: number = 0;

  static glowCanvas: HTMLCanvasElement | null = null;

  static getGlow(): HTMLCanvasElement {
    if (!this.glowCanvas) {
      const r = 80;
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

  constructor(x: number, y: number, scale: number = 1) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.scale = scale;
  }

  update(time: number, scrollVelocity: number, scrollProgress: number) {
    this.time = time;
    this.scrollProgress = scrollProgress;
    this.baseY -= scrollVelocity * 200; 
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.baseY);
    ctx.scale(this.scale, this.scale);

    ctx.globalAlpha = Math.min(1, this.scrollProgress * 2.5);

    // Cabin Base
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.rect(-40, 0, 80, 60);
    ctx.fill();

    // Roof
    ctx.fillStyle = '#7c2d12'; 
    ctx.beginPath();
    ctx.moveTo(-50, 0);
    ctx.lineTo(0, -40);
    ctx.lineTo(50, 0);
    ctx.closePath();
    ctx.fill();

    // Chimney
    ctx.fillStyle = '#292524';
    ctx.beginPath();
    ctx.rect(20, -50, 15, 30);
    ctx.fill();

    // Smoke
    const smokeShift = Math.sin(this.time * 0.002) * 10;
    ctx.fillStyle = `rgba(156, 163, 175, ${0.4 + Math.sin(this.time * 0.003)*0.2})`;
    ctx.beginPath();
    ctx.arc(27 + smokeShift, -60, 8, 0, Math.PI*2);
    ctx.arc(27 + smokeShift*1.5, -75, 12, 0, Math.PI*2);
    ctx.arc(27 + smokeShift*2, -95, 18, 0, Math.PI*2);
    ctx.fill();

    // Cached Glowing Windows
    const glow = 0.5 + 0.5 * Math.sin(this.time * 0.005);
    ctx.globalAlpha = glow * 0.7 * Math.min(1, this.scrollProgress * 2.5);
    ctx.drawImage(Cabin.getGlow(), -15 - 80, 25 - 80, 160, 160);
    ctx.globalAlpha = Math.min(1, this.scrollProgress * 2.5);

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.rect(-25, 15, 20, 20);
    ctx.fill();
    
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-15, 15); ctx.lineTo(-15, 35);
    ctx.moveTo(-25, 25); ctx.lineTo(-5, 25);
    ctx.stroke();

    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.rect(10, 20, 20, 40);
    ctx.fill();
    
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(16, 30, 4, Math.PI, 0);
    ctx.arc(24, 30, 4, Math.PI, 0);
    ctx.lineTo(20, 38);
    ctx.fill();

    ctx.restore();
  }
}
