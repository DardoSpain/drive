

function setup() { 



  if(do_resize == true){
    window_resize_factor = windowHeight/dheight;    // reescalado responsive 
    if(windowHeight > windowWidth){
      window_resize_factor = windowWidth/dwidth;
    }

    //window_resize_factor = 1200/dheight;         // aqui fijamos una resolucion concreta (por ejemplo, altura 1200)
  }

       
  //seed = 61;
  seed = floor(random(1, 99999999999));
  //seed = 333;         //////////////////////////////////
  //seed = 32177062572;
  //seed = 89569876587;
  console.log("· Seed: " + seed);

  randomSeed(seed);
  noiseSeed(seed);
  
  frameRate(30);


  createCanvas(dwidth,dheight);                                            // buffer principal
  pixelDensity(1);
  angleMode(DEGREES);  
  colorMode(HSB,360,100,100,255);
  colorCement = color(0,0,100);
  colorBG1 = color(0,0,50);
  colorBG2 = color(210,35,10);
  colorBG3 = color(30,30,30);
  background(colorBG1);
  noStroke();


  // Crear Diffuse canvas en HSB
  diffuse_canvas = createGraphics(dwidth, dheight);
  diffuse_canvas.colorMode(HSB, 360,100,100, 255);
  
  // Crear heightMap en HSB
  heightMap_canvas = createGraphics(dwidth, dheight);
  heightMap_canvas.colorMode(HSB, 360,100,100, 255);
  heightMap_canvas.background(50);
  heightMap_canvas.angleMode(DEGREES);
  heightMap_canvas.noStroke();

  // Crear bumpShade en HSB
  bumpShade_canvas_0 = createGraphics(dwidth, dheight);
  bumpShade_canvas_0.colorMode(HSB, 360,100,100, 255);
  bumpShade_canvas_0.angleMode(DEGREES);
  // Crear bumpShade_90 en HSB
  bumpShade_canvas_90 = createGraphics(dwidth, dheight);
  bumpShade_canvas_90.colorMode(HSB, 360,100,100, 255);
  bumpShade_canvas_90.angleMode(DEGREES);

  // Crear shadow en HSB
  shadow_canvas = createGraphics(3*dwidth, 3*dheight);
  shadow_canvas.colorMode(HSB, 360,100,100, 255);
  shadow_canvas.background(0);
  shadow_canvas.angleMode(DEGREES);
  shadow_canvas.rectMode(CENTER);
  shadow_canvas.noStroke();


  // Crear house canvas en HSB para el plano de la casa 
  house_canvas = createGraphics(dwidth, dheight);
  house_canvas.colorMode(HSB, 360,100,100, 255);
  house_canvas.background(0);


  // Crear walkers canvas en HSB con los caminantes 
  walkers_canvas = createGraphics(dwidth, dheight);
  walkers_canvas.colorMode(HSB,360,100,100,255);
  walkers_canvas.clear();
  walkers_canvas.textFont(mrsSaintFont);   // activar la fuente MrsSaintDelafield



 /////////////////////////////////////////


  // Direccion de la luz
  light_angle = random(-80,0);     //light_angle = -80; ///////////////
  light_dist = 900;
  light_pos = createVector(width/2 - light_dist*cos(light_angle), height/2 - light_dist*sin(light_angle));
  
  // Direccion de la luz para el bump. OJO: las coordenadas x e y deben aparecer aqui con el signo cambiado
  let light_vector_0 = createVector(1,0).rotate(light_angle);
  let light_vector_bump_0 = createVector(-light_vector_0.x, -light_vector_0.y, 1).normalize()

  let light_vector_90 = createVector(1,0).rotate(light_angle - 90);
  let light_vector_bump_90 = createVector(-light_vector_90.x, -light_vector_90.y, 1).normalize()

  
  // creacion del haz luminoso 
  let l1, l2, h1, h2; 
  l1 = random(600,1100);   
  l2 = random(300,1000);   
  h1 = random(500,900); 
  h2 = h1*random(1, 1.3);

  shadow_canvas.push();
  shadow_canvas.fill(100,255);
  shadow_canvas.translate(shadow_canvas.width/2, shadow_canvas.height/2);
  //shadow_canvas.rotate(light_angle);

  shadow_canvas.beginShape();      // trapecio
  shadow_canvas.vertex(l1, -h1);
  shadow_canvas.vertex(l1 + l2, -h2);
  shadow_canvas.vertex(l1 + l2, h2);
  shadow_canvas.vertex(l1, h1);
  shadow_canvas.endShape(CLOSE);

  shadow_canvas.fill(0);           // parteluz
  shadow_canvas.rect(0,random(-1.2*h2,1.2*h2), 2*dheight,random(100,180));
  
  shadow_canvas.pop();

  shadow_canvas.filter(BLUR,80);

  /*
  // quitar. circulo que indentifica posicion y desplazamiento del sol 
  shadow_canvas.fill(50,100,100,100); shadow_canvas.circle(shadow_canvas.width/2, shadow_canvas.height/2, 10);
  shadow_canvas.strokeWeight(1);shadow_canvas.stroke(50,100,100,150);shadow_canvas.line(shadow_canvas.width/2, shadow_canvas.height/2,shadow_canvas.width/2 + 30, shadow_canvas.height/2);
  */



  shadow_canvas.background(100,random(80,120));    // aqui definimos la claridad de la sombra de la habitacion (60,100)





 /////////////////////////////////////////

  

  // EMPEZAMOS A DECORAR EL LIENZO PRINCIPAL (DIFFUSE) 
  // brochazos de fondo
  for(let i=0; i<20; i++){
    squareWalker(this, [random(dwidth),random(dheight), 40,0,50,20], 50, colorBG2, [-20,20], ["brush",300,40,4], 60, 360); 
    squareWalker(this, [100*i,0, 100*i,dheight], 200, colorBG2, [-5,10], ["brush",240,40,4], 20, 360);   
    squareWalker(this, [random(dwidth),random(dheight/2), 80,90,10,20], 50, colorBG1, [-25,45], ["brush",360,140,4], 120, 30); 
    }    



  // uso temporalmente el bumpShade_canvas_90 para pintar manchas de color y gotas 
  bumpShade_canvas_90.clear();
  for(let i=0; i<10; i++){
    let tempX = random(dwidth);
    let tempY = random(dheight);
    squareWalker(bumpShade_canvas_90, [tempX,tempY, 30,0,200,20], 150, colorBG3, [20,60], ["square",60,200,1], 0, 0);           // manchas
    squareWalker(bumpShade_canvas_90, [tempX,tempY, 4,90,.5,10], random(150,250), colorBG3, [50,70], ["square",10,20,1], 0, 0);   // gotas
    }
  tint(0,0,100,90);
  image(bumpShade_canvas_90,0,0);
  noTint();


  // sprays gotas salpicadas negras y blancas
  //squareWalker(this, [random(width),random(height), 2,90,20,1000], 1000, color(0), [5,10], ["square",0,20,1], 200, 0);    // gotas negras
  squareWalker(this, [random(dwidth),random(dheight), 2,90,20,1000], 1000, color(100), [5,10], ["square",0,20,1], 200, 0);    // gotas blancas
  

  // mas brochazos colorBG1  
  for(let i=0; i<40; i++){
    squareWalker(this, [random(dwidth),random(3*dheight/2), 60,90,10,20], 10, colorBG1, [-15,20], ["brush",360,140,4], 60, 10); 
    } 





/*
    // identificar la posicion de la fuente luminosa 
    fill(50,100,100);
    stroke(50,100,100);
    strokeWeight(1);
    circle(light_pos.x, light_pos.y, 20);
    line(width/2,height/2, light_pos.x, light_pos.y);
    push();
    translate(width/2,height/2);
    rotate(light_angle);    
    line(0,0, -5,-5);
    line(0,0, -5,5);
    pop();
    noStroke();
    noFill();
*/




  /*    // brochazos-tipo con el squareWalker 
  circle(100,100, 10);
  circle(100,100, 10);
  // linea recta de brochazos sencillos 
  squareWalker(this, [100,100, 800,100], 50, color(0), [0,15], ["brush",120,40,2], 10, 10); 

  circle(100,300, 10);
  // linea recta de cuadradosos 
  squareWalker(this, [100,300, 800,300], 100, colorBG2, [0,10], ["square",30,100,0], 20, 10);  
  
  circle(100,500, 10)
  // noise walker de brochazos [xAbs,yAbs,adv,angle0,angle_adv,angle_noisyness]
  squareWalker(this, [100,500, 7,0,50,10], 50, colorBG2, [0,5], ["brush",150,80,1], 0, 10);  
  
  circle(100,900, 10)
  // noise walker de cuadrados [xAbs,yAbs,adv,angle0,angle_adv,angle_noisyness]
  squareWalker(this, [100,900, 7,0,50,10], 50, colorBG2, [0,5], ["square",30,100,0], 0, 0);  
  
  */





 /////////////////////////////////////////

  
  // GENERAR RELIEVE BUMP. Pintar el mapa de alturas en el heightMap_canvas

  // RELIEVE n1: muescas hacia dentro
  heightMap_canvas.background(50);
  noiseDetail(8);
  for (let y = 0; y < dheight; y++) {
    for (let x = 0; x < dwidth; x++) {
      noise_value = noise(x/240,y/240);      // no bajar de /50, o empiezan a verse patrones repetidos
      if(noise_value < .3){
        heightMap_canvas.fill(0,0,0, map(noise_value, 0,.3, 250,0)); 
        heightMap_canvas.rect(x,y,1);
        
        fill(hue(colorCement), saturation(colorCement), brightness(colorCement), 20); // blanco
        rect(x,y,1);
      }
    }
  }
  noiseDetail(4);  
  //heightMap_canvas.background(50,150);        // artenuador 150


  // uso temporalmente el bumpShade_canvas_90 para pintar los relieves walkers hacia dentro
  bumpShade_canvas_90.clear();
  bumpShade_canvas_90.noStroke();
  // relieve walkers hacia dentro
  for (let i=0; i<100; i++) {
    bumpShade_canvas_90.fill(0,random(2,20)); // negro
    bumpShade_canvas_90.push();
    bumpShade_canvas_90.translate(random(dwidth), random(dheight));
    for (let s=0; s<200; s++) {
      bumpShade_canvas_90.circle(0,0, random(4,8));
      bumpShade_canvas_90.translate(random(-4,4), random(-4,4));
    }
    bumpShade_canvas_90.pop();
  }
  heightMap_canvas.push();
  heightMap_canvas.tint(0,0,100,50);
  heightMap_canvas.image(bumpShade_canvas_90,0,0);
  heightMap_canvas.noTint();
  heightMap_canvas.pop();
  bumpShade_canvas_90.clear();      // fin del uso temporal del bumpShade_canvas_90 para los relieves walkers hacia dentro



  // mini puntos relieve 
  for (let i=0; i<1000; i++) {
    bumpShade_canvas_90.fill(100,random(50,220)); // blanco grandes
    bumpShade_canvas_90.circle(random(dwidth), random(dheight), random(2,8));
  }
  for (let i=0; i<5000; i++) {
    bumpShade_canvas_90.fill(100,random(25,140)); // blanco pequeñas
    bumpShade_canvas_90.circle(random(dwidth), random(dheight), random(5));
  }
  for (let i=0; i<1000; i++) {
    bumpShade_canvas_90.fill(0,random(25,140)); // negro grandes
    bumpShade_canvas_90.circle(random(dwidth), random(dheight), random(2,8));
  }
  for (let i=0; i<5000; i++) {
    bumpShade_canvas_90.fill(0,random(25,140)); // negro
    bumpShade_canvas_90.circle(random(dwidth), random(dheight), random(5));
  }
  bumpShade_canvas_90.filter(BLUR,1);
  heightMap_canvas.push();
  heightMap_canvas.tint(0,0,100,20);
  heightMap_canvas.image(bumpShade_canvas_90,0,0);
  heightMap_canvas.noTint();
  heightMap_canvas.pop();
  bumpShade_canvas_90.clear();      // fin del uso temporal del bumpShade_canvas_90 para los mini puntos relieve




  // relieve noise fino
  noiseDetail(8);
  for (let y = 0; y < dheight; y++) {
    for (let x = 0; x < dwidth; x++) {
      //bumpShade_canvas_90.fill(100, map(noise(x/40, y/40), 0,1, 0,250)); // blanco translucido
      bumpShade_canvas_90.fill(map(noise(x/40, y/40), 0,1, 0,100), 200); // blanco translucido
      bumpShade_canvas_90.rect(x,y,1);
    }
  }
  noiseDetail(4);
  heightMap_canvas.push();
  heightMap_canvas.tint(0,0,100,40);                      // fuerza 20  (a menos fuerza, mas banding)
  heightMap_canvas.image(bumpShade_canvas_90,0,0);
  heightMap_canvas.noTint();
  heightMap_canvas.pop();
  bumpShade_canvas_90.clear();      // fin del uso temporal del bumpShade_canvas_90 para el relieve noise fino




  /*      // ESTE DESACTIVADO
  // relieve fibras lineas  
  heightMap_canvas.stroke(100, 4);
  heightMap_canvas.strokeWeight(.5);
  for (let i = 0; i < 1000; i++) {
    heightMap_canvas.push();
    heightMap_canvas.translate(random(heightMap_canvas.width), random(heightMap_canvas.height));
    heightMap_canvas.rotate(random(360));
    heightMap_canvas.line(-100, 0, random(50, 100), 0);
    heightMap_canvas.pop();
  }
  */
  

  
  // uso temporalmente el bumpShade_canvas_90 para pintar el relieve noise grueso
  // relieve noise grueso
  noiseDetail(8);
   for (let y = 0; y < dheight; y++) {
    for (let x = 0; x < dwidth; x++) {
      noise_value = noise(x/400, y/600);
      if(noise_value > .3){
        if(noise_value < .35){
          bumpShade_canvas_90.fill(0,0,80, map(noise_value, .3, .35, 0, 200)); // blanco           //30
          fill(0,0,100, map(noise_value, .3, .35, 0, 20)); // blanco
        }
        else{
          bumpShade_canvas_90.fill(0,0,80, 200); // blanco. altura de la cota maxima               //30
          fill(0,0,100, 20); // blanco
        }
        bumpShade_canvas_90.rect(x,y,1);
        rect(x,y,1);
      }
    }
  }
  noiseDetail(4);

  heightMap_canvas.push();
  heightMap_canvas.tint(0,0,100,90);
  heightMap_canvas.image(bumpShade_canvas_90,0,0);
  heightMap_canvas.noTint();
  heightMap_canvas.pop();
  bumpShade_canvas_90.clear();      // fin del uso temporal del bumpShade_canvas_90 para noise grueso



  //Grieta
  let crackX, crackY, crack_dir;
  crackX = random(.1,.9)*dwidth;       //crackX = 500;
  crackY = random(.1,.4)*dheight;      //crackX = 400;
  crack_dir = random(180);

  // random walker circular en el origen de la grieta
  squareWalker(heightMap_canvas, [crackX,crackY, 1,crack_dir+180,25,50], 20, color(0), [1,3], ["square",4,20,0], 0, 0);    //.5,2

  // uso temporalmente el bumpShade_canvas_90 para pintar las grietas  
  crack(bumpShade_canvas_90,crackX,crackY,crack_dir,200,[.4,4],10);    // Grieta princial
  crack(bumpShade_canvas_90,random(.1,.9)*dwidth,random(.1,.4)*dheight,random(180),150,[.4,4],30);    // grieta secundaria random
  heightMap_canvas.push();
  heightMap_canvas.tint(0,0,100,15);
  heightMap_canvas.image(bumpShade_canvas_90,0,0);
  heightMap_canvas.noTint();
  heightMap_canvas.pop();
  bumpShade_canvas_90.clear();      // fin del uso temporal del bumpShade_canvas_90 para las grietas



  //Rebabas
  if(random()<.3){
    if(random()<.5){
      let tempY = random(.1,.9)*dheight;    // rebaba horizontal
      squareWalker(this, [0,tempY+20, dwidth,tempY+20], 120, color(0), [2,10], ["square",20,160,.5], 0, 360);
      squareWalker(heightMap_canvas, [0,tempY, dwidth,tempY], 1000, color(100), [1.5,4], ["square",4,24,.5], 0, 360);      //1,2.5
    } else {      
      let tempX = random(.1,.9)*dwidth;    // rebaba vertical
      squareWalker(this, [tempX,0, tempX,dheight], 100, color(0), [2,10], ["square",10,160,.5], 0, 360);
      squareWalker(heightMap_canvas, [tempX,0, tempX,dheight], 1200, color(100), [1.5,3.5], ["square",4,24,.5], 0, 360);      //1,2
    }
  }



  // mini puntos relieve spray walker
  squareWalker(heightMap_canvas, [random(dwidth),random(dheight), 4,0,20,200], 500, color(0), [1,5], ["square",0,6,1], 120, 0);





 /////////////////////////////////////////



  // Creacion del plano de la casa
  createHousePlan(150, 100, 200);



  // Creacion de los 8 caminantes 
  let inhabitants = 0;
  while(inhabitants < 8){
    let randX = random(dwidth); 
    let randY = random(dheight);
    if(rejection(randX,randY) == false) {
      let w = new Walker(randX,randY,inhabitants);
      walkers.push(w);
      inhabitants++;
    }
  }








 /////////////////////////////////////////

  
  // Copiar todo el buffer principal al Diffuse canvas
  diffuse_canvas.image(get(), 0, 0);

  

  // Generar el sombreado en el bumpShade canvas  0
  generateBumpMapping(bumpShade_canvas_0, light_vector_bump_0, 30);         //hoy25    //ayer20

// Generar el sombreado en el bumpShade canvas  90
  generateBumpMapping(bumpShade_canvas_90, light_vector_bump_90, 30);       //hoy25    //ayer20


 /////////////////////////////////////////




  resizeCanvas(dwidth*window_resize_factor, dheight*window_resize_factor);      // a partir de aqui recomienza a pintar con unas nuevas dimensiones 

  
  // noLoop();
  

  } // end Setup

