export class Environment {
  width: number;
  height: number;
  time: number = 0;
  scrollProgress: number = 0;
  stars: {x: number, y: number, r: number, alpha: number, phase: number}[] = [];

  // Cached backgrounds for extreme optimization
  cachedSkyProgress: number = -1;
  skyCanvas: HTMLCanvasElement;
  skyCtx: CanvasRenderingContext2D;

  sunGlowCanvas: HTMLCanvasElement;
  moonGlowCanvas: HTMLCanvasElement;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    
    // Offscreen canvas for sky background to avoid recreating huge linear gradient
    this.skyCanvas = document.createElement('canvas');
    this.skyCanvas.width = width;
    this.skyCanvas.height = height;
    this.skyCtx = this.skyCanvas.getContext('2d')!;

    // Sun Glow Cache
    this.sunGlowCanvas = document.createElement('canvas');
    this.sunGlowCanvas.width = 1000;
    this.sunGlowCanvas.height = 1000;
    const sCtx = this.sunGlowCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(500, 500, 0, 500, 500, 500);
    sGrad.addColorStop(0, 'rgba(245, 158, 11, 1)'); 
    sGrad.addColorStop(0.5, 'rgba(225, 29, 72, 0.4)'); 
    sGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 1000, 1000);

    // Moon Glow Cache
    this.moonGlowCanvas = document.createElement('canvas');
    this.moonGlowCanvas.width = 300;
    this.moonGlowCanvas.height = 300;
    const mCtx = this.moonGlowCanvas.getContext('2d')!;
    const mGrad = mCtx.createRadialGradient(150, 150, 0, 150, 150, 150);
    mGrad.addColorStop(0, 'rgba(226, 232, 240, 0.4)');
    mGrad.addColorStop(1, 'rgba(226, 232, 240, 0)');
    mCtx.fillStyle = mGrad;
    mCtx.fillRect(0, 0, 300, 300);

    for (let i=0; i<200; i++) {
      this.stars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.8),
        r: Math.random() * 2,
        alpha: Math.random(),
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  update(time: number, scrollProgress: number) {
    this.time = time;
    this.scrollProgress = scrollProgress;
  }

  interpolateColor(c1: number[], c2: number[], factor: number) {
    const p = Math.max(0, Math.min(1, factor));
    const r = Math.round(c1[0] + p * (c2[0] - c1[0]));
    const g = Math.round(c1[1] + p * (c2[1] - c1[1]));
    const b = Math.round(c1[2] + p * (c2[2] - c1[2]));
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0,0,0];
  }

  drawSky() {
    // Only update sky canvas if scroll progress changes significantly (optimization)
    const roundedProgress = Math.round(this.scrollProgress * 500) / 500;
    if (this.cachedSkyProgress === roundedProgress) return;
    this.cachedSkyProgress = roundedProgress;

    let g0, g1, g2, g3;
    if (this.scrollProgress < 0.6) {
      const p = this.scrollProgress / 0.6;
      g0 = this.interpolateColor([15, 23, 42], [40, 10, 15], p);
      g1 = this.interpolateColor([49, 46, 129], [80, 20, 20], p);
      g2 = this.interpolateColor([157, 23, 77], [180, 40, 10], p);
      g3 = this.interpolateColor([245, 158, 11], [210, 80, 10], p);
    } else {
      const p = (this.scrollProgress - 0.6) / 0.4;
      g0 = this.interpolateColor([40, 10, 15], [253, 224, 71], Math.pow(p, 3));
      g1 = this.interpolateColor([80, 20, 20], [250, 204, 21], Math.pow(p, 2));
      g2 = this.interpolateColor([180, 40, 10], [255, 255, 255], p);
      g3 = this.interpolateColor([210, 80, 10], [255, 255, 255], p);
    }

    const gradient = this.skyCtx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, g0); 
    gradient.addColorStop(0.4, g1);
    gradient.addColorStop(0.8, g2);
    gradient.addColorStop(1, g3);
    
    this.skyCtx.fillStyle = gradient;
    this.skyCtx.fillRect(0, 0, this.width, this.height);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawSky();
    
    // Draw pre-calculated sky
    ctx.drawImage(this.skyCanvas, 0, 0);

    ctx.save();
    for (const star of this.stars) {
      const distToSun = Math.hypot(star.x - 0, star.y - this.height);
      if (distToSun < this.width * 0.5) continue; 
      
      star.alpha = 0.4 + 0.6 * Math.sin(this.time * 0.001 + star.phase);
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();

    // The Moon
    const moonX = this.width * 0.8;
    const moonY = this.height * 0.2;
    
    // Cached Moon Glow
    ctx.drawImage(this.moonGlowCanvas, moonX - 150, moonY - 150, 300, 300);

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath(); ctx.arc(moonX, moonY, 30, 0, Math.PI*2); ctx.fill();
    
    ctx.fillStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.beginPath(); ctx.arc(moonX - 10, moonY - 5, 5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(moonX + 8, moonY + 12, 8, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(moonX + 15, moonY - 10, 4, 0, Math.PI*2); ctx.fill();

    // The Sun
    const sunX = this.width * 0.3;
    const sunY = this.height * 0.7 - this.scrollProgress * 150; 
    
    const sunGlowRadius = 500 + this.scrollProgress * 800;
    
    ctx.globalCompositeOperation = 'screen';
    // Use cached sun glow with calculated globalAlpha based on size
    const sunAlpha = 0.8 + (this.scrollProgress * 0.2); // max 1
    ctx.globalAlpha = sunAlpha;
    ctx.drawImage(this.sunGlowCanvas, sunX - sunGlowRadius, sunY - sunGlowRadius, sunGlowRadius*2, sunGlowRadius*2);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#fef08a';
    ctx.beginPath(); ctx.arc(sunX, sunY, 60, 0, Math.PI*2); ctx.fill();
    
    this.drawHills(ctx);
  }

  drawHills(ctx: CanvasRenderingContext2D) {
    const scrollOffset = this.scrollProgress * 300; 
    const hillColors = ['#0f766e', '#047857', '#064e3b'];
    
    for (let h = 0; h < 3; h++) {
      let color = hillColors[h];
      if (this.scrollProgress > 0.6) {
        color = this.interpolateColor(this.hexToRgb(color), [20, 10, 10], (this.scrollProgress - 0.6)*2.5);
      }
      ctx.fillStyle = color;
      
      ctx.beginPath();
      ctx.moveTo(0, this.height);
      
      const yBase = this.height - 250 + h * 70 + scrollOffset * (1 - h*0.2);
      let startY = yBase + Math.sin((this.time*0.0001) + h) * 15;
      ctx.lineTo(0, startY);
      
      // Increased stepping to 80px for massive optimization of lineTo calls
      for(let x = 0; x <= this.width + 80; x += 80) {
        let y = yBase + Math.sin((x * 0.004) + h + (this.time * 0.0004)) * 35;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(this.width, this.height);
      ctx.fill();
    }
    
    let fgColor = '#022c22';
    if (this.scrollProgress > 0.6) {
      fgColor = this.interpolateColor([2, 44, 34], [10, 5, 5], (this.scrollProgress - 0.6)*2.5);
    }
    ctx.fillStyle = fgColor;
    ctx.beginPath();
    
    const fgBase = this.height - 100 + scrollOffset * 0.5;
    ctx.moveTo(0, fgBase);
    ctx.lineTo(this.width, fgBase);
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.fill();
  }
}
