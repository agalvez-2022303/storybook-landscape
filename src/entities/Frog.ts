export class Frog {
  x: number;
  y: number;
  baseY: number;
  time: number = 0;
  popStart: number;
  scale: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    // Frogs pop up halfway through the story
    this.popStart = 0.4 + Math.random() * 0.3;
  }

  update(time: number, scrollVelocity: number, scrollProgress: number) {
    this.time = time;
    this.baseY -= scrollVelocity * 250; // Parallax
    
    // Pop up spring effect
    if (scrollProgress > this.popStart) {
       const p = Math.min(1, (scrollProgress - this.popStart) / 0.05);
       // spring equation approximation
       this.scale = 1 - Math.cos(p * Math.PI * 3.5) * Math.exp(-p * 4);
    } else {
       this.scale = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.scale <= 0.01) return;

    ctx.save();
    ctx.translate(this.x, this.baseY);

    const breathe = Math.sin(this.time * 0.003) * 0.04;
    ctx.scale(this.scale * (1 + breathe), this.scale * (1 - breathe * 0.5));

    const frogGreen = '#22c55e';
    const darkGreen = '#166534';
    const bellyGreen = '#86efac';

    // Back legs
    ctx.fillStyle = darkGreen;
    ctx.beginPath();
    ctx.ellipse(-28, -6, 18, 12, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(28, -6, 18, 12, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = frogGreen;
    ctx.beginPath();
    ctx.ellipse(0, -18, 28, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = bellyGreen;
    ctx.beginPath();
    ctx.ellipse(0, -12, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes bulges
    ctx.fillStyle = frogGreen;
    ctx.beginPath();
    ctx.arc(-14, -36, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(14, -36, 10, 0, Math.PI * 2);
    ctx.fill();

    // Eyeballs
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-14, -36, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(14, -36, 6, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#0f172a';
    const lookX = Math.sin(this.time * 0.001) * 3;
    const blink = (this.time % 4000 < 150) ? 0 : 1;

    if (blink > 0) {
      ctx.beginPath();
      ctx.arc(-14 + lookX, -36, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(14 + lookX, -36, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = darkGreen;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-18, -36);
      ctx.lineTo(-10, -36);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, -36);
      ctx.lineTo(18, -36);
      ctx.stroke();
    }

    // Front legs
    ctx.fillStyle = frogGreen;
    ctx.beginPath();
    ctx.ellipse(-14, -4, 7, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(14, -4, 7, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mouth (smile)
    ctx.strokeStyle = darkGreen;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, -22, 12, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Blush
    ctx.fillStyle = 'rgba(244, 63, 94, 0.5)';
    ctx.beginPath();
    ctx.arc(-20, -22, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(20, -22, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
