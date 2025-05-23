

function setup() { 



  if(do_resize == true){
    window_resize_factor = windowHeight/dheight;    // reescalado responsive 
    if(windowHeight > windowWidth){
      window_resize_factor = windowWidth/dwidth;
    }
    //window_resize_factor = 2000/dheight;         // aqui fijamos una resolucion concreta (por ejemplo, altura 2000)
  }

       
  //seed = 61;
  seed = floor(random(1, 99999999999));
  console.log("· Seed: " + seed);

  //randomSeed(seed);
  //noiseSeed(seed);
  


  createCanvas(dwidth,dheight);                                            // buffer principal
  pixelDensity(1);
  angleMode(DEGREES);  
  colorMode(HSB,360,100,100,255);
  colorBG1 = color(0,0,50);
  colorBG2 = color(0,0,10);
  background(colorBG1);
  noStroke();


  // Crear Diffuse canvas en HSB
  diffuse_canvas = createGraphics(width, height);
  diffuse_canvas.colorMode(HSB, 360,100,100, 255);
  
  // Crear heightMap en HSB
  heightMap_canvas = createGraphics(width, height);
  heightMap_canvas.colorMode(HSB, 360,100,100, 255);
  heightMap_canvas.background(50);
  heightMap_canvas.angleMode(DEGREES);
  heightMap_canvas.noStroke();

  // Crear bumpShade en HSB
  bumpShade_canvas = createGraphics(width, height);
  bumpShade_canvas.colorMode(HSB, 360,100,100, 255);
  bumpShade_canvas.background(0,0,0);
  bumpShade_canvas.angleMode(DEGREES);

  // Crear shadow en HSB
  shadow_canvas = createGraphics(width, height);
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
  light_angle = random(-80,80);     //light_angle = -80; ///////////////
  light_dist = 450;
  light_vector = createVector(1,0).rotate(light_angle);
  light_pos = createVector(width/2 - light_dist*cos(light_angle), height/2 - light_dist*sin(light_angle));
  // Direccion de la luz para el bump. OJO: las coordenadas x e y deben aparecer aqui con el signo cambiado
  light_vector_bump = createVector(-light_vector.x, -light_vector.y, 1).normalize()

  
  // creacion del haz luminoso 
  let l1, l2, h1, h2; 
  l1 = random(350,550);
  l2 = random(150,500); 
  h1 = random(250,450); 
  h2 = h1*random(1, 1.3);

  shadow_canvas.push();
  shadow_canvas.fill(100,255);
  shadow_canvas.translate(light_pos.x, light_pos.y);
  shadow_canvas.rotate(light_angle);

  shadow_canvas.beginShape();      // trapecio
  shadow_canvas.vertex(l1, -h1);
  shadow_canvas.vertex(l1 + l2, -h2);
  shadow_canvas.vertex(l1 + l2, h2);
  shadow_canvas.vertex(l1, h1);
  shadow_canvas.endShape(CLOSE);

  shadow_canvas.fill(0);           // parteluz
  shadow_canvas.rect(0,random(-1.2*h2,1.2*h2), 2*height,random(50,90));
  
  shadow_canvas.pop();
  shadow_canvas.filter(BLUR,40);
  
  shadow_canvas.background(100,random(60,100));    // aqui definimos la claridad de la sombra de la habitacion (60,100)



  /*
  // creacion del haz luminoso 
  let window_width, window_length, window_dist; 
  window_width = random(100,1000);  //300
  window_length = random(500,100);       //600
  window_dist = random(500,800);   //600

  shadow_canvas.push();
  shadow_canvas.fill(100,255);
  shadow_canvas.translate(light_pos.x, light_pos.y);
  shadow_canvas.rotate(light_angle);
  for(let i=0; i<=10; i+=2 ){ 
    shadow_canvas.push();
    shadow_canvas.rotate(i); 
    shadow_canvas.rect(window_dist,0, window_length,window_width);   
    shadow_canvas.pop();
  }

  shadow_canvas.rotate(random(-5,5));   // parteluz
  shadow_canvas.fill(0,255);
  shadow_canvas.rect(0,random(-window_width,window_width), height*2,100);
  shadow_canvas.pop();
  shadow_canvas.filter(BLUR,40);
*/


 /////////////////////////////////////////

  

  // EMPEZAMOS A DECORAR EL LIENZO PRINCIPAL (DIFFUSE) 
  // linea recta de brochazos sencillos 
  for(let i=0; i<20; i++){
    squareWalker(this, [random(width),random(height), 20,0,50,10], 50, colorBG2, [-20,20], [150,40,2], 30, 360); 
    squareWalker(this, [50*i,0, 50*i,height], 200, colorBG2, [-5,10], [120,40,2], 10, 360);   
    squareWalker(this, [random(width),random(height/2), 40,90,10,10], 50, colorBG1, [-25,45], [180,140,2], 60, 30); 
    }    

  for(let i=0; i<40; i++){
    squareWalker(this, [random(width),random(3*height/2), 30,90,10,10], 10, colorBG1, [-15,20], [180,140,2], 60, 10); 
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
  // linea recta de brochazos sencillos 
  squareWalker(this, [100,100, 800,100], 50, color(0), [0,15], [120,40,2], 10, 10); 

  circle(100,300, 10);
  // linea recta de cuadradosos 
  squareWalker(this, [100,300, 800,300], 100, colorBG2, [0,10], [30,100], 20, 10);  
  
  circle(100,500, 10)
  // noise walker de brochazos [xAbs,yAbs,adv,angle0,angle_adv,angle_noisyness]
  squareWalker(this, [100,500, 7,0,50,10], 50, colorBG2, [0,5], [150,80,1], 0, 10);  
  
  circle(100,900, 10)
  // noise walker de cuadrados [xAbs,yAbs,adv,angle0,angle_adv,angle_noisyness]
  squareWalker(this, [100,900, 7,0,50,10], 50, colorBG2, [0,5], [30,100], 0, 0);  
  */





 /////////////////////////////////////////

  
  // GENERAR RELIEVE BUMP. Pintar el mapa de alturas en el heightMap_canvas

  // RELIEVE n1: muescas hacia dentro
  heightMap_canvas.background(50);
  noiseDetail(8);
  for (let y = 0; y < heightMap_canvas.height; y++) {
    for (let x = 0; x < heightMap_canvas.width; x++) {
      noise_value = noise(x/120,y/120);      // no bajar de /50, o empiezan a verse patrones repetidos
      if(noise_value < .3){
        heightMap_canvas.fill(0,0,0, map(noise_value, 0,.3, 150,0)); 
        heightMap_canvas.rect(x,y,1);
        
        fill(100,20); // blanco
        rect(x,y,1);
      }
    }
  }
  noiseDetail(4);


  // relieve walkers hacia dentro
  heightMap_canvas.noStroke();  
  for (let i=0; i<100; i++) {
    heightMap_canvas.fill(0,random(1,3)); // negro
    heightMap_canvas.push();
    heightMap_canvas.translate(random(heightMap_canvas.width), random(heightMap_canvas.height));
    for (let s=0; s<200; s++) {
      heightMap_canvas.circle(0,0, random(2,4));
      heightMap_canvas.translate(random(-2,2), random(-2,2));
    }
    heightMap_canvas.pop();
  }

  // mini puntos relieve 
  for (let i=0; i<1000; i++) {
    heightMap_canvas.fill(100,random(2,10)); // blanco grandes
    heightMap_canvas.circle(random(heightMap_canvas.width), random(heightMap_canvas.height), random(1,6));
  }
  for (let i=0; i<5000; i++) {
    heightMap_canvas.fill(100,random(2,8)); // blanco pequeñas
    heightMap_canvas.circle(random(heightMap_canvas.width), random(heightMap_canvas.height), random(3));
  }
  for (let i=0; i<1000; i++) {
    heightMap_canvas.fill(0,random(2,10)); // negro grandes
    heightMap_canvas.circle(random(heightMap_canvas.width), random(heightMap_canvas.height), random(1,6));
  }
  for (let i=0; i<5000; i++) {
    heightMap_canvas.fill(0,random(2,8)); // negro
    heightMap_canvas.circle(random(heightMap_canvas.width), random(heightMap_canvas.height), random(3));
  }



  // relieve noise fino
  for (let y = 0; y < heightMap_canvas.height; y++) {
    for (let x = 0; x < heightMap_canvas.width; x++) {
      heightMap_canvas.fill(100, map(noise(x/20, y/20), 0, 1, 0, 50)); // blanco translucido
      heightMap_canvas.rect(x,y,1);
    }
  }





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
  





  // relieve noise grueso
  heightMap_canvas.noStroke();
  for (let y = 0; y < heightMap_canvas.height; y++) {
    for (let x = 0; x < heightMap_canvas.width; x++) {
      noise_value = noise(x/200, y/300);
      if(noise_value > .3){
        if(noise_value < .35){
          heightMap_canvas.fill(0,0,50, map(noise_value, .3, .35, 0, 150)); // gris medio
          heightMap_canvas.rect(x,y,1);

          heightMap_canvas.fill(0,0,100, map(noise_value, .3, .35, 0, 30)); // blanco
          fill(0,0,100, map(noise_value, .3, .35, 0, 15)); // blanco
        }
        else{
          heightMap_canvas.fill(0,0,50, 150); // gris medio
          heightMap_canvas.rect(x,y,1);

          heightMap_canvas.fill(0,0,100, 30); // blanco. altura de la cota maxima 
          fill(0,0,100, 15); // blanco
        }
        heightMap_canvas.rect(x,y,1);
        rect(x,y,1);
      }
    }
  }



  //Grieta
  let crackX, crackY;
  crackX = random(.1,.9)*width;       //crackX = 500;
  crackY = random(.1,.4)*height;      //crackX = 400;
  heightMap_canvas.noStroke();  

  heightMap_canvas.fill(0,1); // negro
  heightMap_canvas.push();
  heightMap_canvas.translate(crackX, crackY);
  for (let s=0; s<50; s++) {
    heightMap_canvas.circle(0,0, random(3,5));
    heightMap_canvas.translate(random(-2,2), random(-2,2));
  }
  heightMap_canvas.pop();

  crack(heightMap_canvas,crackX,crackY,random(180),200,[.1,1],10);



 /////////////////////////////////////////



  // Creacion del plano de la casa
  createHousePlan(150, 50);





  let inhabitants = 0;

  while(inhabitants < 8){
    let randX = random(width); 
    let randY = random(height);
    if(rejection(randX,randY) == false) {
      let w = new Walker(randX,randY,inhabitants);
      walkers.push(w);
      inhabitants++;
    }

  }

  //w = new Walker(500,600,1);







 /////////////////////////////////////////

  
  // Copiar todo el buffer principal al Diffuse canvas
  diffuse_canvas.image(get(), 0, 0);

  

  // Generar el sombreado en el bumpShade canvas  
  generateBumpMapping(light_vector_bump, 20);   


 /////////////////////////////////////////


  resizeCanvas(dwidth*window_resize_factor, dheight*window_resize_factor);      // a partir de aqui recomienza a pintar con unas nuevas dimensiones 


  //noLoop();



  } // end Setup

