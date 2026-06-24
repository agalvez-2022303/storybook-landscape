import './style.css';
import { Environment } from './entities/Environment';
import { Leaf } from './entities/Leaf';
import { Firefly } from './entities/Firefly';
import { Flower } from './entities/Flower';
import { Mushroom } from './entities/Mushroom';
import { Frog } from './entities/Frog';
import { Cabin } from './entities/Cabin';
import { Bee } from './entities/Bee';
import { Butterfly } from './entities/Butterfly';
import { Ladybug } from './entities/Ladybug';

const canvas = document.getElementById('app-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let width = window.innerWidth;
let height = window.innerHeight;
let dpr = window.devicePixelRatio || 1;

canvas.width = width * dpr;
canvas.height = height * dpr;
ctx.scale(dpr, dpr);

let environment: Environment;
let fauna: any[] = [];
let flora: any[] = []; 
let scenery: any[] = []; 

function init() {
  environment = new Environment(width, height);
  fauna = [];
  flora = [];
  scenery = [];

  for (let i = 0; i < 50; i++) flora.push(new Leaf(width, height));
  for (let i = 0; i < 70; i++) fauna.push(new Firefly(width, height, Math.random() * width, Math.random() * height * 2));
  for (let i = 0; i < 30; i++) flora.push(new Flower(Math.random() * width, height - 90 + Math.random() * 80));
  for (let i = 0; i < 25; i++) flora.push(new Mushroom(Math.random() * width, height - 70 + Math.random() * 60));
  
  fauna.push(new Frog(width * 0.25, height - 50));
  fauna.push(new Frog(width * 0.75, height - 30));
  fauna.push(new Frog(width * 0.5, height - 20));

  // Additional Bugs
  for (let i = 0; i < 12; i++) fauna.push(new Bee(width, height));
  for (let i = 0; i < 15; i++) fauna.push(new Butterfly(width, height));
  for (let i = 0; i < 15; i++) fauna.push(new Ladybug(width, height));

  scenery.push(new Cabin(width * 0.85, height - 180, 0.8));
}

init();

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.resetTransform();
  ctx.scale(dpr, dpr);
  init();
});

let scrollProgress = 0;
let scrollVelocity = 0;
let lastScrollY = window.scrollY;
let narrativeIntensity = 0;

function updateScroll() {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return;

  const currentScroll = window.scrollY;
  scrollProgress = Math.max(0, Math.min(1, currentScroll / maxScroll));
  
  scrollVelocity = (currentScroll - lastScrollY) / maxScroll;
  lastScrollY = currentScroll;
  
  const totalScenes = 12; // Updated to 12
  const progressPerScene = 1 / totalScenes;
  
  let currentIntensity = 0;

  for (let i = 0; i < totalScenes; i++) {
    const el = document.getElementById(`scene-${i}`);
    if (el) {
      const centerTarget = i * progressPerScene + (progressPerScene / 2);
      const distance = Math.abs(scrollProgress - centerTarget);
      
      let opacity = 0;
      if (distance < progressPerScene * 0.7) {
        const normalized = distance / (progressPerScene * 0.7);
        opacity = Math.max(0, 1 - Math.pow(normalized, 1.8)); 
        
        if (opacity > 0.5) {
          currentIntensity = Math.max(currentIntensity, opacity);
        }
      }
      
      const yOffset = (scrollProgress - centerTarget) * 200; 
      
      el.style.opacity = opacity.toString();
      el.style.transform = `translate(-50%, calc(-50% - ${yOffset}px))`;
    }
  }

  narrativeIntensity = currentIntensity;
}

window.addEventListener('scroll', updateScroll);
setTimeout(updateScroll, 50);

function animate(time: number) {
  ctx.clearRect(0, 0, width, height);
  
  environment.update(time, scrollProgress);
  environment.draw(ctx);

  const renderables = [...scenery, ...flora, ...fauna].sort((a, b) => (a.y || a.baseY) - (b.y || b.baseY));
  
  for (const entity of renderables) {
    if (entity instanceof Mushroom) {
      entity.update(time, scrollVelocity, scrollProgress, narrativeIntensity);
    } else {
      entity.update(time, scrollVelocity, scrollProgress);
    }
    entity.draw(ctx);
  }

  scrollVelocity *= 0.9;
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
