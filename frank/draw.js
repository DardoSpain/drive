

function draw() {

  if(do_resize === true){
    window_resize_factor = windowHeight/dheight;    // reescalado responsive 
    if(windowHeight > windowWidth){
      window_resize_factor = windowWidth/dwidth;
    }
    //window_resize_factor = 1200/dheight;         // aqui fijamos una resolucion concreta (por ejemplo, altura 1200)
  }

  resizeCanvas(dwidth*window_resize_factor, dheight*window_resize_factor);      // a partir de aqui recomienza a pintar con unas nuevas dimensiones 

  scale(window_resize_factor,window_resize_factor);
  background(0,100,100);



  // 1.- aqui va el buffer de albedo (Diffuse) 
  image(diffuse_buffer, 0,0);




  // 2.- aqui va el buffer de micro-relieve Bump
  blendMode(OVERLAY);

  if(fc<2400){                                        // CUIDADO, estos dos buffers se mapean en base a fc=2400 (anochecer) y fc=2700 (recomienza)
    tint(0,0,100, map(fc, 0,2400, 255,0));
    image(bumpShade_buffer_0, 0,0);
    noTint();
    tint(0,0,100, map(fc, 0,2400, 0,255));
    image(bumpShade_buffer_90, 0,0);
  }
  else{
    tint(0,0,100, map(fc, 2400,2700, 0,255));
    image(bumpShade_buffer_0, 0,0);
    noTint();
    tint(0,0,100, map(fc, 2400,2700, 255,0));
    image(bumpShade_buffer_90, 0,0);
  }
  noTint();
  blendMode(BLEND);




  // creacion de los 8 caminantes de forma secuencial 
  if (fc >= 200 && fc % 100 === 0 && inhabitants < 8) {
    let is_rejected = true;
    while (is_rejected) {
      let randX = random(dwidth); 
      let randY = random(dheight);
      if (rejection(randX, randY) === false) {
        let w = new Walker(randX, randY, inhabitants);
        walkers.push(w);
        inhabitants++;
        is_rejected = false;
      }
    }
  }

  // 3.- aqui va el buffer de los Caminantes
  for (let i = 0; i < walkers.length; i++) {
    walkers[i].update(); // actualiza posicion de los caminantes
    walkers[i].show(); // dibujar caminantes
  }  
  //tint(0,0,100,20);
  //image(walkers_buffer, 0,0);     // refuerzo de los walkers con negro suave
  //noTint();
  blendMode(OVERLAY);
  tint(100, map(constrain(fc,2400,2700), 2400,2700, 255,0));
  image(walkers_buffer, 0,0);
  noTint();
  blendMode(BLEND);




  // plano de la casa         //QUITAR, la variable show_plan y la funcion de tecla "p"
  if(show_plan){
      tint(0,0,100,20);
      image(house_buffer, 0,0);   // grande
      noTint();
    image(house_buffer, 1580,20, 400,480);     // plano peq
    image(walkers_buffer, 1580,520, 400,480);     // walkers peq

  }




  // 4.- aqui va el buffer de Sombras            // esto deberia estar activo siempre, QUITAR if(), variable show_shadow y tecla "s"
  if(show_shadow){
    blendMode(MULTIPLY);

    temp_buffer.imageMode(CENTER);
    temp_buffer.push();
    temp_buffer.translate(light_pos.x,light_pos.y);
    temp_buffer.rotate(light_angle - sun_rotation);             // esta rotacion mueve la luz de la ventana 
    temp_buffer.translate(sun_traslation,0);                    // esta traslacion mueve la luz de la ventana     
    temp_buffer.background(0);

    if(fc<200){
      temp_buffer.tint(100, map(fc, 0,200, 0,255));
    }
    if(fc>=2200){
      temp_buffer.tint(100, map(constrain(fc,2200,2400), 2200,2400, 255,0));
    }
    temp_buffer.image(shadow_buffer, 0,0);
    temp_buffer.noTint();
    temp_buffer.pop();
    temp_buffer.imageMode(CORNER);

    if(fc<1200){                            // amanecer. 160 es la oscuridad maxima por la noche. 100 es la claridad maxima al mediodia (fc=1200)
      tint(100, map(fc, 0,1200, 160,100));
    }
    else{                                   // anochecer
      tint(100, map(constrain(fc,1200,2400), 1200,2400, 100,160));
    }
    
    image(temp_buffer, 0,0);
    noTint();  
    
    blendMode(BLEND);
    
  }






  // Overlays         // QUITAR
  noStroke();
  textFont("sans-serif");   // restaura la tipografia por defecto para los overlays
  textSize(24);
  fill(100);  
  textAlign(LEFT,TOP);  
  text(fc, 12,dheight - 30);
  text("inhabitants: " + inhabitants, 250,dheight - 30);
  text("initial light angle: " + nf(light_angle,1,2), 600,dheight - 30);
  text("sun rotation: " + nf(sun_rotation,1,2), 1100,dheight - 30);
  text("setup time: " + nf(setup_time/1000,1,3) + "s", 1500,dheight - 30);
  text(nf(window_resize_factor,1,3), 1900,dheight - 30);





  

  if(save_animation){
    save("Frank_v14_2K_seed_#" + seed + "_frame_" + nf(fc,4) + ".jpg");         // exportacion automatica del fotograma actual para guardar un video
    setTimeout(function() {
      loop(); // Reanuda el bucle de draw despues de la espera
    }, 3000); // Espera de 3 segundos
    noLoop();
  }





  // BATCH. Pegar este bloque al finalizar el dibujo                           // Comentar el bloque entero si no se necesita que recomience 
  if(fc===700 && render_batch===true){    
    if (parseInt(sessionStorage.reloadCount) <= max_reloads) {
      save("Frank_v14_2K_seed_#" + seed + "_frame_" + nf(fc,4) + ".jpg");               // save the canvas as a JPG image file
      sessionStorage.reloadCount = parseInt(sessionStorage.reloadCount) + 1;
      setTimeout(function() {location.reload();}, 5000);                             // recarga tras esperar 5 segundos (5000 milisegundos)
    } 
  }
  




  sun_traslation = sun_traslation + sun_traslation_speed;
  sun_rotation = sun_rotation + sun_rotation_speed;

  fc++; 
  





  if(fc >= 2700){                  // Recomenzar
    fc = 0;
    sun_traslation = sun_rotation = 0;
    walkers = [];
    inhabitants = 0;
    walkers_buffer.clear();
    //noLoop();
    //return; 
  }



  
} // end Draw




