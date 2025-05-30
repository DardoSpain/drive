

function draw() {

  scale(window_resize_factor,window_resize_factor);
  background(0,100,100);

  // aqui va el buffer de albedo (diffuse) 
  image(diffuse_canvas, 0,0);



  // aqui va el buffer de micro-relieve bump
  blendMode(OVERLAY);
  tint(0,0,100, map(sun_rotation, 0,90, 255,0));
  image(bumpShade_canvas_0, 0,0);
  noTint();
  tint(0,0,100, map(sun_rotation, 0,90, 0,255));
  image(bumpShade_canvas_90, 0,0);
  noTint();
  blendMode(BLEND);




  // aqui van los random walkers 
  for (let i = 0; i < walkers.length; i++) {
    walkers[i].update(); // actualiza posicion de los caminantes
    walkers[i].show(); // dibujar caminantes
  }  
  //tint(0,0,100,20);
  //image(walkers_canvas, 0,0);     // refuerzo de los walkers con negro suave
  //noTint();
  blendMode(OVERLAY);
  image(walkers_canvas, 0,0);
  blendMode(BLEND);



  // plano de la casa         //quitar esto, la variable show_plan y la funcion de tecla "p"
  if(show_plan){
      tint(0,0,100,20);
      image(house_canvas, 0,0);   // grande
      noTint();
    image(house_canvas, 1580,20, 400,480);     // plano peq
    image(walkers_canvas, 1580,520, 400,480);     // walkers peq

  }




  // aqui va el buffer de sombras            // esto deberia estar activo siempre, quitar if(), variable show_shadow y tecla "s"
  if(show_shadow){
    imageMode(CENTER);
    blendMode(MULTIPLY);
    push();
    translate(light_pos.x,light_pos.y);
    rotate(light_angle - sun_rotation);             // esta rotacion mueve la luz de la ventana 
    translate(sun_traslation,0);                    // esta traslacion mueve la luz de la ventana 
    image(shadow_canvas, 0,0);
    pop();
    blendMode(BLEND);
    imageMode(CORNER);
  }





/*
  // Overlays
  noStroke();
  textSize(24);
  fill(100);  
  textAlign(LEFT,TOP);  
  text(fc, 12,20);
  text("initial light angle: " + nf(light_angle,1,2), 600,20);
  text("sun rotation: " + nf(sun_rotation,1,2), 1100,20);
  text(nf(window_resize_factor,1,3), 1900,20);
*/




  /*
  if(sun_rotation>90 || fc>2000){
    noLoop();
    return; 
  }
  */


  if(save_animation){
    save("Frank_v14_2K_seed_#" + seed + "_frame_" + nf(fc,4) + ".jpg");         // exportacion automatica del fotograma actual para guardar un video
    setTimeout(function() {
      loop(); // Reanuda el bucle de draw despues de la espera
    }, 3000); // Espera de 3 segundos
    noLoop();
  }





  // BATCH. Pegar este bloque al finalizar el dibujo                           // Comentar el bloque entero si no se necesita que recomience 
  if(fc==2000 && render_batch==true){    
    if (parseInt(sessionStorage.reloadCount) <= max_reloads) {
      //save("Frank_v14_2K_seed_#" + seed + "_frame_" + nf(fc,4) + ".jpg");               // save the canvas as a JPG image file
      sessionStorage.reloadCount = parseInt(sessionStorage.reloadCount) + 1;
      setTimeout(function() {location.reload();}, 5000);                             // recarga tras esperar 5 segundos (5000 milisegundos)
    } 
  }
  



  sun_traslation = sun_traslation + sun_traslation_speed;
  sun_rotation = sun_rotation + sun_rotation_speed;

  //console.log(fc);
  fc++; 
  



  
} // end Draw




