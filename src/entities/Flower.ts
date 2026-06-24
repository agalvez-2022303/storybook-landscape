export class Flower {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  height: number;
  seed: number;
  time: number = 0;
  bloomStart: number;
  scale: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.height = 100 + Math.random() * 80;
    this.seed = Math.random() * Math.PI * 2;
    // Each flower starts blooming at a slightly different scroll progress
    this.bloomStart = 0.05 + Math.random() * 0.2; 
  }

  update(time: number, scrollVelocity: number, scrollProgress: number) {
    this.time = time;
    // Smooth growth between bloomStart and bloomStart + 0.15
    this.scale = Math.min(1, Math.max(0, (scrollProgress - this.bloomStart) / 0.15));
    // Easing out cubic
    this.scale = 1 - Math.pow(1 - this.scale, 3);
    
    this.baseY -= scrollVelocity * 300; // Parallax
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.scale <= 0) return; // Don't draw if not sprouted

    ctx.save();
    
    const wind = Math.sin(this.time * 0.001 + this.seed) * 20 * this.scale;
    const currentHeight = this.height * this.scale;
    const topX = this.baseX + wind;
    const topY = this.baseY - currentHeight;

    // Stem
    ctx.strokeStyle = '#15803d'; // green
    ctx.lineWidth = 5 * this.scale;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.baseX, this.baseY);
    ctx.quadraticCurveTo(this.baseX, this.baseY - currentHeight/2, topX, topY);
    ctx.stroke();

    // Leaves
    ctx.fillStyle = '#166534';
    // Left leaf
    ctx.beginPath();
    let lx = this.baseX;
    let ly = this.baseY - currentHeight * 0.3;
    ctx.moveTo(lx, ly);
    ctx.quadraticCurveTo(lx - 25 * this.scale, ly - 10 * this.scale, lx - 40 * this.scale + wind * 0.5, ly - 40 * this.scale);
    ctx.quadraticCurveTo(lx - 15 * this.scale, ly - 35 * this.scale, lx, ly);
    ctx.fill();

    // Right leaf
    ctx.beginPath();
    let rx = this.baseX;
    let ry = this.baseY - currentHeight * 0.6;
    ctx.moveTo(rx, ry);
    ctx.quadraticCurveTo(rx + 25 * this.scale, ry - 10 * this.scale, rx + 40 * this.scale + wind * 0.5, ry - 40 * this.scale);
    ctx.quadraticCurveTo(rx + 15 * this.scale, ry - 35 * this.scale, rx, ry);
    ctx.fill();

    // Tulip Head
    ctx.translate(topX, topY);
    const angle = Math.atan2(topY - (this.baseY - currentHeight/2), topX - this.baseX);
    ctx.rotate(angle + Math.PI/2);
    ctx.scale(this.scale, this.scale); // scale head

    ctx.fillStyle = `hsl(${(this.seed * 360) % 360}, 90%, 65%)`; 
    
    // Bloom mechanics: closed bud to open flower
    const openness = this.scale; // 0 to 1
    const p1 = -10 - 10 * openness; 
    const p2 = -20 - 5 * openness;

    // Main body
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.bezierCurveTo(p2, -10, p2 - 5, -35, p1, -45);
    ctx.lineTo(p1/2, -28);
    ctx.lineTo(0, -50 + 10*(1-openness)); // center goes up when blooming
    ctx.lineTo(-p1/2, -28);
    ctx.bezierCurveTo(-p2 + 5, -35, -p2, -10, 0, 5);
    ctx.fill();

    // Petal highlights
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.bezierCurveTo(p1, -5, p1, -25, p1/2, -28);
    ctx.lineTo(0, -50 + 10*(1-openness));
    ctx.lineTo(-p1/2, -28);
    ctx.bezierCurveTo(-p1, -25, -p1, -5, 0, 5);
    ctx.fill();

    ctx.restore();
  }
}
