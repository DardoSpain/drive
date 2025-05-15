
// ARTIFICIAL LIFE
// A generative art project by Dario Lanza
// www.dariolanza.com


// VARIABLES GLOBALES MODIFICABLES
let num_particles = 3000;
let particles_rad = 2;
let vel_min = 0.1, vel_max = 0.5;
let spring_force = 0.0005; // menor porque fuerza se aplica con dist²
let AMORTIGUACION = 0.98;

// FLOW FIELD
let flowScale = 0.01;
let flowStrength = 0.05;
let flowZ = 0;
let flowSpeed = 0.003;

let particulas = [];
let conexiones = [];

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  noiseDetail(4, 0.5);
  for (let i = 0; i < num_particles; i++) {
    particulas.push(new Particula(random(width), random(height)));
  }
}

function draw() {
  background(0);
  conexiones = [];
  flowZ += flowSpeed;

  //displayFlowField(40); // Mostrar campo

  let desiredDistSq = (2 * particles_rad) ** 2;
  let maxDistSq = (3 * particles_rad) ** 2;

  for (let i = 0; i < particulas.length; i++) {
    let a = particulas[i];
    for (let j = i + 1; j < particulas.length; j++) {
      let b = particulas[j];

      let dx = b.pos.x - a.pos.x;
      let dy = b.pos.y - a.pos.y;
      let distSq = dx * dx + dy * dy;

      if (distSq < desiredDistSq && !a.conectadas.has(b)) {
        a.conectadas.add(b);
        b.conectadas.add(a);
      }

      if (a.conectadas.has(b)) {
        if (distSq > maxDistSq) {
          a.conectadas.delete(b);
          b.conectadas.delete(a);
          continue;
        }

        // Fuerza aproximada sin sqrt
        let deltaSq = distSq - desiredDistSq;
        let fX = (dx / (distSq + 1e-6)) * deltaSq * spring_force;
        let fY = (dy / (distSq + 1e-6)) * deltaSq * spring_force;

        let fuerza = createVector(fX, fY);
        a.aplicarFuerza(fuerza);
        b.aplicarFuerza(p5.Vector.mult(fuerza, -1));

        conexiones.push([a.pos.x, a.pos.y, b.pos.x, b.pos.y]);
      }
    }
  }

  for (let p of particulas) {
    p.actualizar();
    p.mostrarPart();
  }

  // Dibujar conexiones
  stroke(50, 170);
  strokeWeight(2);
  for (let c of conexiones) {
    line(c[0], c[1], c[2], c[3]);
  }
}

class Particula {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.display_rad = random(1, 1.5) * particles_rad;
    this.vel = p5.Vector.random2D().mult(random(0.1, 5));
    this.acel = createVector(0, 0);
    this.conectadas = new Set();
  }

  aplicarFuerza(f) {
    this.acel.add(f);
  }

  actualizar() {
    // Flow field dinámico
    let angle = noise(this.pos.x * flowScale, this.pos.y * flowScale, flowZ) * 360 * 4;
    let flowVec = p5.Vector.fromAngle(radians(angle)).mult(flowStrength);
    this.aplicarFuerza(flowVec);

    this.vel.add(this.acel);

    if (this.conectadas.size > 0) {
      this.vel.mult(AMORTIGUACION);
    }

    let vMag = this.vel.mag();
    if (vMag < vel_min) this.vel.setMag(vel_min);
    else if (vMag > vel_max) this.vel.setMag(vel_max);

    this.pos.add(this.vel);
    this.acel.set(0, 0);

    if (this.pos.x < particles_rad || this.pos.x > width - particles_rad) {
      this.vel.x *= -0.7;
      this.pos.x = constrain(this.pos.x, particles_rad, width - particles_rad);
    }
    if (this.pos.y < particles_rad || this.pos.y > height - particles_rad) {
      this.vel.y *= -0.7;
      this.pos.y = constrain(this.pos.y, particles_rad, height - particles_rad);
    }
  }

  mostrarPart() {
    fill(250, 100);
    noStroke();
    circle(this.pos.x, this.pos.y, this.display_rad * 2);
  }
}

function displayFlowField(step) {
  stroke(250, 70);
  strokeWeight(1);
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      let angle = noise(x * flowScale, y * flowScale, flowZ) * 360 * 4;
      let v = p5.Vector.fromAngle(radians(angle)).setMag(step * 0.4);
      line(x, y, x + v.x, y + v.y);
    }
  }
}
