


// ---------------- CLASSES ----------------

// Definición de la clase Walker
class Walker {
    constructor(x, y, id) {
      this.pos = createVector(x, y); // Posicion inicial
      this.id = id;
      this.vel = p5.Vector.random2D(); // Vector de velocidad aleatoria
      this.vel.mult(random(5,10)); // Modulo aleatorio para la velocidad      // originalmente random(2,5)
    }
  
    // actualizar la posicion del walker
    update() {
      this.vel.rotate(map(noise(this.id/2, fc/100), 0,.94, -.1,.1));

      // Verificar colisiones con las paredes y mantenerlo confinado
      while(stayConfined(this.pos.x + this.vel.x,this.pos.y + this.vel.y) == false){
        this.vel.rotate(360);
      }
    
      this.pos.add(this.vel);
    }
  
    // mostrar el walker
    show() {
      walkers_canvas.fill(0,0,0,160 + 5*this.id);
      //walkers_canvas.fill(30,30,2*this.id,170);
      //walkers_canvas.fill(10*this.id,80,10,150);
      //walkers_canvas.fill(0,0,0,170 - 5*this.id);
      walkers_canvas.noStroke();
      //walkers_canvas.circle(this.pos.x, this.pos.y, 10);

      walkers_canvas.push();
      walkers_canvas.translate(this.pos.x, this.pos.y);
      //walkers_canvas.rotate(this.angle);  
      walkers_canvas.rotate(random(360));
      walkers_canvas.textSize(40);
      walkers_canvas.textAlign(CENTER, CENTER);
      walkers_canvas.text(String.fromCharCode(floor(random(65, 123))), 0,0);      // 97 al 123
      walkers_canvas.pop();
    }
  }
