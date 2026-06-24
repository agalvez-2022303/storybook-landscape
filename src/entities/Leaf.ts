export class Leaf {
  x: number;
  y: number;
  baseX: number;
  seed: number;
  time: number = 0;
  size: number;
  color: string;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height * 2 - height; // Spread initially
    this.baseX = this.x;
    this.seed = Math.random() * Math.PI * 2;
    this.size = 5 + Math.random() * 8;
    
    // Autumnal tones
    const colors = ['#ea580c', '#c2410c', '#b45309', '#f59e0b', '#dc2626'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(time: number, scrollVelocity: number) {
    this.time = time;
    
    // Gentle fall
    this.y += 0.5 + Math.sin(this.seed) * 0.3;
    
    // Scroll velocity affects the Y position (parallax)
    // When scrollVelocity > 0 (scrolling down), leaf goes UP relative to camera
    this.y -= scrollVelocity * 800; 

    // Horizontal sway
    this.x = this.baseX + Math.sin(this.time * 0.001 + this.seed) * 80;

    // Wrap vertically
    const margin = 100;
    if (this.y > window.innerHeight + margin) this.y = -margin;
    if (this.y < -margin) this.y = window.innerHeight + margin;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Rotation based on time and seed
    ctx.rotate(this.time * 0.001 * (this.seed > Math.PI ? 1 : -1) + this.seed);

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, -this.size);
    ctx.quadraticCurveTo(this.size, 0, 0, this.size);
    ctx.quadraticCurveTo(-this.size, 0, 0, -this.size);
    ctx.fill();

    ctx.restore();
  }
}
