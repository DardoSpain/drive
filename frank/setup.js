

function setup() { 

  frameRate(30);
  let setup_start = performance.now();  // Marca de tiempo inicial 
  let tempX, tempY;

/*
  if(do_resize === true){
    window_resize_factor = windowHeight/dheight;    // reescalado responsive 
    if(windowHeight > windowWidth){
      window_resize_factor = windowWidth/dwidth;
    }

    //window_resize_factor = 1200/dheight;         // aqui fijamos una resolucion concreta (por ejemplo, altura 1200)
  }
*/

       
  //seed = 61;
  seed = floor(random(1, 99999999999));
  //seed = 333;         
  //seed = 32177062572;
  //seed = 89569876587;
  //seed = 35523986635;

  console.log("· Seed: " + seed);
  randomSeed(seed);
  noiseSeed(seed);  

  let date_index = floor(random(0, 164));         // QUITAR. Buscar que el dia lo marque el Mint
  date = nf(dates_list[date_index], 6);
  console.log("· Fecha: " + date + " (" + date_index + " de 163)");

  calculateWeekDay(date);
  console.log(week_day + ", " + month + " " + day + ", " + year);
    


  // Crear Canvas princial
  createCanvas(dwidth,dheight); 
  pixelDensity(1);
  angleMode(DEGREES);  
  colorMode(HSB,360,100,100,255);
  colorCement = color(0,0,100);
  colorBG1 = color(0,0,50);
  colorBG2 = color(210,35,10);
  colorBG3 = color(30,30,30);
  background(colorBG1);
  noStroke();


  // Crear Diffuse buffer en HSB
  diffuse_buffer = createGraphics(dwidth, dheight);
  diffuse_buffer.colorMode(HSB, 360,100,100, 255);
  

  // Crear heightMap en HSB
  heightMap_buffer = createGraphics(dwidth, dheight);
  heightMap_buffer.colorMode(HSB, 360,100,100, 255);
  heightMap_buffer.background(50);
  heightMap_buffer.angleMode(DEGREES);
  heightMap_buffer.noStroke();


  // Crear bumpShade_0 en HSB
  bumpShade_buffer_0 = createGraphics(dwidth, dheight);
  bumpShade_buffer_0.colorMode(HSB, 360,100,100, 255);
  bumpShade_buffer_0.angleMode(DEGREES);
  // Crear bumpShade_90 en HSB
  bumpShade_buffer_90 = createGraphics(dwidth, dheight);
  bumpShade_buffer_90.colorMode(HSB, 360,100,100, 255);
  bumpShade_buffer_90.angleMode(DEGREES);


  // Crear shadow en HSB
  shadow_buffer = createGraphics(3*dwidth, 3*dheight);
  shadow_buffer.colorMode(HSB, 360,100,100, 255);
  shadow_buffer.background(0);
  shadow_buffer.angleMode(DEGREES);
  shadow_buffer.rectMode(CENTER);
  shadow_buffer.noStroke();


  // Crear house buffer en HSB para el plano de la casa 
  house_buffer = createGraphics(dwidth, dheight);
  house_buffer.colorMode(HSB, 360,100,100, 255);
  house_buffer.background(0);


  // Crear walkers buffer en HSB con los caminantes 
  walkers_buffer = createGraphics(dwidth, dheight);
  walkers_buffer.colorMode(HSB,360,100,100,255);
  walkers_buffer.clear();
  walkers_buffer.noStroke();
  walkers_buffer.textFont(mrsSaintFont);   // activar la fuente MrsSaintDelafield. QUITAR cuando los caracteres sean propios
  walkers_buffer.textAlign(CENTER,CENTER);
  

  // Crear temp buffer en HSB para diversos usos
  temp_buffer = createGraphics(dwidth, dheight);
  temp_buffer.colorMode(HSB, 360,100,100, 255);
  temp_buffer.angleMode(DEGREES);
  temp_buffer.noStroke();


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

  shadow_buffer.push();
  shadow_buffer.fill(100,255);
  shadow_buffer.translate(shadow_buffer.width/2, shadow_buffer.height/2);
  //shadow_buffer.rotate(light_angle);

  shadow_buffer.beginShape();      // trapecio
  shadow_buffer.vertex(l1, -h1);
  shadow_buffer.vertex(l1 + l2, -h2);
  shadow_buffer.vertex(l1 + l2, h2);
  shadow_buffer.vertex(l1, h1);
  shadow_buffer.endShape(CLOSE);


  shadow_buffer.fill(0,0,0,255);        ////////////////////////////////////////////// parteluz
  shadow_buffer.rect(0,random(-1.2*h2,1.2*h2), 2*dheight,random(100,180));


  /*
  shadow_buffer.fill(0,255);      //////////////////////////////////////// persianas, rendijas horizontales
  for(let p=0; p<2000; p+=250){
    shadow_buffer.rect(p,0, 100,2*dheight);
  }
  */

  
  shadow_buffer.pop();
  shadow_buffer.filter(BLUR,80); 
  



  // QUITAR. circulo que indentifica posicion y desplazamiento del sol 
  //shadow_buffer.fill(50,100,100,100); shadow_buffer.circle(shadow_buffer.width/2, shadow_buffer.height/2, 10);
  //shadow_buffer.strokeWeight(1);shadow_buffer.stroke(50,100,100,150);shadow_buffer.line(shadow_buffer.width/2, shadow_buffer.height/2,shadow_buffer.width/2 + 30, shadow_buffer.height/2);






 /////////////////////////////////////////
 // EMPEZAMOS A DECORAR EL LIENZO PRINCIPAL (DIFFUSE) 


  // brochazos de fondo
  for(let i=0; i<20; i++){
    squareWalker(this, [random(dwidth),random(dheight), 40,0,50,20], 50, colorBG2, [-20,20], ["brush",300,40,4], 60, 360); 
    squareWalker(this, [100*i,0, 100*i,dheight], 200, colorBG2, [-5,10], ["brush",240,40,4], 20, 360);   
    squareWalker(this, [random(dwidth),random(dheight/2), 80,90,10,20], 50, colorBG1, [-25,45], ["brush",360,140,4], 120, 30); 
    }    



  // uso el temporalmente el temp_buffer para pintar manchas de color y gotas 
  temp_buffer.clear();
  for(let i=0; i<10; i++){
    tempX = random(dwidth);
    tempY = random(dheight);
    squareWalker(temp_buffer, [tempX,tempY, 30,0,200,20], 150, colorBG3, [20,60], ["square",60,200,1], 0, 0);           // manchas
    squareWalker(temp_buffer, [tempX,tempY, 4,90,.5,10], random(150,250), colorBG3, [50,70], ["square",10,20,1], 0, 0);   // gotas
    }
  tint(0,0,100,90);
  image(temp_buffer,0,0);
  noTint();


  // sprays gotas salpicadas negras y blancas
  //squareWalker(this, [random(width),random(height), 2,90,20,1000], 1000, color(0), [5,10], ["square",0,20,1], 200, 0);    // gotas negras
  squareWalker(this, [random(dwidth),random(dheight), 2,90,20,1000], 1000, color(100), [5,10], ["square",0,20,1], 200, 0);    // gotas blancas
  

  // mas brochazos colorBG1  
  for(let i=0; i<40; i++){
    squareWalker(this, [random(dwidth),random(3*dheight/2), 60,90,10,20], 10, colorBG1, [-15,20], ["brush",360,140,4], 60, 10); 
    } 



  // fecha escrita en el lienzo. QUITAR cuando los caracteres sean propios
  //noStroke();
  fill(0,150); 
  textFont(mrsSaintFont);   // activar la fuente MrsSaintDelafield para escribir la fecha
  textSize(60);
  text(week_day + ", " + month + " " + day + ", " + year, 40, 120);
  








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
 // GENERAR RELIEVE BUMP. Pintar el mapa de alturas en el heightMap_buffer







  ////// Relieve noise fino
  noiseDetail(8);
  for (let y=0; y<=dheight; y++) {
    for (let x=0; x<=dwidth; x++) {
      //temp_buffer.fill(100, map(noise(x/40, y/40), 0,1, 0,250)); // blanco traslucido
      temp_buffer.fill(map(noise(x/150, y/150), 0,1, 0,100), 200); // blanco traslucido
      temp_buffer.rect(x,y,1);
    }
  }
  noiseDetail(4);
  heightMap_buffer.tint(100,120);                      // fuerza 40    // fuerza 20  (a menos fuerza, mas banding)
  heightMap_buffer.image(temp_buffer,0,0);
  heightMap_buffer.noTint();
  temp_buffer.clear();      // fin del uso temporal del temp_buffer para el relieve noise fino





  ////// Relieve noise grueso que provoca mesetas 
  noiseDetail(8);
  let threshold = random([.3,.4]);
   for (let y = 0; y < dheight; y++) {
    for (let x = 0; x < dwidth; x++) {
      noise_value = noise(x/400, y/600);
      if(noise_value > threshold){
        if(noise_value < threshold + .03){
          temp_buffer.fill(100, map(noise_value, threshold, threshold + .03, 0, 250)); // blanco gradualmente aplanando           //30
          fill(100,map(noise_value, threshold, threshold + .03, 0, 20)); // blanco gradualmente aclarando el diffuse 
        }
        else{
          temp_buffer.fill(100, 250); // blanco aplanando. altura de la cota maxima               //30
          fill(100,20); // blanco aclarando el diffuse
        }
        temp_buffer.rect(x,y,1);
        rect(x,y,1);
      }
    }
  }
  noiseDetail(4);
  heightMap_buffer.push();
  heightMap_buffer.tint(100,35);
  heightMap_buffer.image(temp_buffer,0,0);
  heightMap_buffer.noTint();
  heightMap_buffer.pop();
  temp_buffer.clear();      // fin del uso temporal del temp_buffer para noise grueso






  ////// Rebabas
  if(random()<3.3){
    rectMode(CORNERS);
    fill(100,35);
    if(random()<.5){
      tempY = random(.1,.9)*dheight;    // rebaba horizontal
      rect(0,tempY, dwidth,dheight*random([-1,1]));
      squareWalker(this, [0,tempY+20, dwidth,tempY+20], 120, color(0), [2,10], ["square",20,160,.5], 0, 360);   // suciedad
      squareWalker(heightMap_buffer, [0,tempY, dwidth,tempY], 1000, color(100), [1.5,6], ["square",4,24,.5], 0, 360);      //1,2.5
    } else {      
      tempX = random(.1,.9)*dwidth;     // rebaba vertical
      rect(tempX,0, dwidth*random([-1,1]),dheight);
      squareWalker(this, [tempX,0, tempX,dheight], 100, color(0), [2,10], ["square",10,160,.5], 0, 360);   // suciedad
      squareWalker(heightMap_buffer, [tempX,0, tempX,dheight], 1200, color(100), [1.5,5.5], ["square",4,24,.5], 0, 360);      //1,2
    }
    rectMode(CORNER);
  }






  ////// Grietas
  let crackX, crackY, crack_dir;
  crackX = random(.1,.9)*dwidth;       //crackX = 500;
  crackY = random(.1,.4)*dheight;      //crackY = 400;
  crack_dir = random(180);

  // random walker circular en el origen de la grieta
  squareWalker(heightMap_buffer, [crackX,crackY, 1,crack_dir+180,25,50], 20, color(0), [1,3], ["square",4,20,0], 0, 0);    //.5,2

  // uso temporalmente el temp_buffer para pintar las grietas  
  //crack0(temp_buffer,crackX,crackY,crack_dir,200,[.4,4],10);    // Grieta princial
  //crack0(temp_buffer,random(.1,.9)*dwidth,random(.1,.4)*dheight,random(180),150,[.4,4],30);    // grieta secundaria random

  crack(temp_buffer,crackX,crackY,crack_dir,200,6,[.2,3],20);    // Grieta princial Nueva 
  crack(temp_buffer,random(.1,.9)*dwidth,random(.1,.4)*dheight,random(180),150,5,[.15,2.5],40);    // grieta secundaria random Nueva

  heightMap_buffer.push();
  heightMap_buffer.tint(0,0,100,15);
  heightMap_buffer.image(temp_buffer,0,0);
  heightMap_buffer.noTint();
  heightMap_buffer.pop();
  temp_buffer.clear();      // fin del uso temporal del temp_buffer para las grietas





  ////// Pequeños desconchones hacia dentro, mediante un Walker de walkers
  temp_buffer.clear();                                    // ¿Es realmente necesario este clear()?
  temp_buffer.noStroke();
  let walker_steps;
  
  for(let w=0; w<5; w++){    
    tempX = random(.2,.8)*dwidth;
    tempY = random(.2,.8)*dheight;
    for (let i=0; i<100; i++) {
      temp_buffer.fill(0,random(2,8)); // negro
      walker_steps = random([100,500,1000]);          // longitud de los walkers 
      for (let s=0; s<walker_steps; s++) {    
        temp_buffer.circle(tempX,tempY, random(2,9));
        tempX += random(-1.5,1.5);
        tempY += random(-1.5,1.5);
      }
      tempX += random(-1,1)*120;
      tempY += random(-1,1)*120;
    }
  }


  ////// Pequeños desconchones hacia dentro, mediante un salpicado aleatorio de walkers 
  for (let w=0; w<150; w++) {
    temp_buffer.fill(0,random(5,8)); // negro       //2,5
    tempX = random(dwidth);
    tempY = random(dheight);
    for (let s=0; s<300; s++) {          // longitud de los walkers          //for (let s=0; s<100 + 10*w; s++) {
      temp_buffer.circle(tempX,tempY, random(2,9));
      tempX += random(-1.2,1.2);
      tempY += random(-1.5,1.5);
    }
  }


  heightMap_buffer.tint(100,20);
  heightMap_buffer.image(temp_buffer,0,0);
  heightMap_buffer.noTint();
  temp_buffer.clear();      // fin del uso temporal del temp_buffer para los relieves walkers hacia dentro







  ////// GRANDES DESCONCHONES HACIA DENTRO 
  if(threshold < .4){
    noiseDetail(8);
    for (let y = 0; y < dheight; y++) {
      for (let x = 0; x < dwidth; x++) {
        noise_value = noise(x/240,y/240);      // no bajar de 50, o empiezan a verse patrones repetidos
        if(noise_value < .3){
          heightMap_buffer.fill(0, map(noise_value, 0,.3, 250,0)); 
          heightMap_buffer.rect(x,y,1);
          
          //fill(0,100,100, 20); // blanco
          fill(hue(colorCement), saturation(colorCement), brightness(colorCement), 35); // blanco
          rect(x,y,1);
        }
      }
    }
    noiseDetail(4);  
  }







  ////// mini puntos relieve 
  for (let i=0; i<1000; i++) {
    temp_buffer.fill(100,random(50,220)); // blanco grandes
    temp_buffer.circle(random(dwidth), random(dheight), random(2,8));
  }
  for (let i=0; i<5000; i++) {
    temp_buffer.fill(100,random(25,140)); // blanco pequeñas
    temp_buffer.circle(random(dwidth), random(dheight), random(5));
  }
  for (let i=0; i<1000; i++) {
    temp_buffer.fill(0,random(25,140)); // negro grandes
    temp_buffer.circle(random(dwidth), random(dheight), random(2,8));
  }
  for (let i=0; i<5000; i++) {
    temp_buffer.fill(0,random(25,140)); // negro
    temp_buffer.circle(random(dwidth), random(dheight), random(5));
  }
  temp_buffer.filter(BLUR,1);
  heightMap_buffer.tint(0,0,100,20);
  heightMap_buffer.image(temp_buffer,0,0);
  heightMap_buffer.noTint();
  temp_buffer.clear();      // fin del uso temporal del temp_buffer para los mini puntos relieve

  







 /////////////////////////////////////////


  // Generar el sombreado en el bumpShade_buffer_0
  generateBumpMapping(bumpShade_buffer_0, light_vector_bump_0, 30);         //hoy25    //ayer20

  // Generar el sombreado en el bumpShade_buffer_90
  generateBumpMapping(bumpShade_buffer_90, light_vector_bump_90, 30);       //hoy25    //ayer20



 /////////////////////////////////////////

  
  // Copiar todo el buffer principal al Diffuse buffer
  diffuse_buffer.image(get(), 0, 0);

  

 /////////////////////////////////////////


  // Creacion del plano de la casa
  createHousePlan(150, 100, 200);





  fc = 198;

  setup_time = performance.now() - setup_start;
  // noLoop();
  

  } // end Setup

