

function draw() {

  scale(window_resize_factor,window_resize_factor);

  // aqui va el buffer de albedo (diffuse) 
  image(diffuse_canvas, 0,0);



  // aqui va el buffer de micro-relieve bump
  blendMode(OVERLAY);
  image(bumpShade_canvas, 0,0);
  blendMode(BLEND);




  // aqui van los random walkers 
  for (let i = 0; i < walkers.length; i++) {
    walkers[i].update(); // actualiza posicion de los caminantes
    walkers[i].show(); // dibujar caminantes
  }  
  //tint(0,0,100,20);
  //image(walkers_canvas,0,0,width,height);
  //noTint();
  blendMode(OVERLAY);
  image(walkers_canvas, 0,0);
  blendMode(BLEND);



  // plano de la casa         //quitar esto, la varaible show_plan y la funcion de tecla "p"
  if(show_plan){
    tint(0,0,100,10);
    image(house_canvas, 0,0);   // grande
    noTint();
    image(house_canvas, 750,50, width/5,height/5);     // peq
  }



  // aqui va el buffer de sombras
  if(show_shadow){
    blendMode(MULTIPLY);
    //tint(30,0,100,180);
    image(shadow_canvas, 0,0);
    //noTint();
    blendMode(BLEND);
  }




  // Overlays
  noStroke();
  textSize(12);
  fill(0);  
  textAlign(LEFT,TOP);  
  text(fc, 6, 10);
  text(light_angle, 490, 10);
  text(window_resize_factor, 950, 10);

  console.log(light_angle);



  //noLoop();




/*
  scale(window_resize_factor,window_resize_factor);




  if(render_battery == true && fc == 1){
    // BATCH. Pegar este bloque al finalizar el dibujo.                         // Comentar el bloque entero si no se necesita que recomience 
    if (parseInt(sessionStorage.reloadCount) <= max_reloads) {
      save("Voyager_test_#" + sessionStorage.reloadCount + "_seed_" + seed + "_filter_" + film_filter + "_" + film_filter_name + ".jpg");    //save the canvas as a JPG image file
      sessionStorage.reloadCount = parseInt(sessionStorage.reloadCount) + 1;
      setTimeout(function() {location.reload();}, 5000);      // recarga tras esperar 5 segundos (5000 milisegundos)
    } 
  }
  


  */


  fc++; 

  
} // end Draw




