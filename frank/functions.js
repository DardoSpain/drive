


// ---------------- FUNCTIONS ----------------


function calculateWeekDay(date) {
  let month_index = int(date.substring(0, 2));
  day = int(date.substring(2, 4));  
  let raw_year = int(date.substring(4, 6));
  year = raw_year + 1900;  

  let month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  month = month_names[month_index - 1];  

  // Ajustes temporales para Zeller
  let zeller_month = month_index;
  let zeller_year = year;
  if (zeller_month < 3) {
    zeller_month += 12;
    zeller_year -= 1;
  }
  let K = zeller_year%100;
  let J = Math.floor(zeller_year/100);

  // Calculo de Zeller
  let week_day_index = (day + Math.floor(13*(zeller_month + 1)/5) + K + Math.floor(K/4) + Math.floor(J/4) + 5*J) % 7;

  let day_names = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  week_day = day_names[week_day_index];
}




// Random Walker Cuadrado
function squareWalker(canv, params, steps, co, op, shape, scatter, rot) {
  canv.colorMode(HSB, 360, 100, 100, 255);
  canv.rectMode(CENTER);
  canv.noStroke();
  
  let len, local_angle, threads, thickness, roundness;
  if(shape[0] === "brush"){          // si shape.type="brush", son brochazos [type,len,threads,thickness]. Si shape.type="square", son cuadrados/circulos [type,ladoMin,ladoMax,roundness]
    len = shape[1], threads = shape[2], thickness = shape[3];
   }
  
  if(params.length === 4) {        // 4 Params el walker recorre una linea recta definida por incio y final [x0,y0,x1,y1] 
    let x0 = params[0], y0 = params[1], x1 = params[2], y1 = params[3]; 
    let distance = dist(x0, y0, x1, y1), xAbs = x0, yAbs = y0, angle = atan2(y1 - y0, x1 - x0);
    local_angle = atan2(y1 - y0, x1 - x0);
    for(let s = 0; s < steps; s ++){
      canv.push();
      canv.translate(xAbs, yAbs);
      canv.rotate(local_angle + random(-1,1)*rot);
      canv.translate(0, random(-1,1)*scatter);
      if(shape[0] === "square"){        // cuadrados/circulos. shape=[type,ladoMin,ladoMax,roundness]
        thickness = random(shape[1],shape[2]);
        roundness = .5*shape[3]*thickness;
        canv.fill(color(hue(co), saturation(co), brightness(co), random(op[0],op[1]))); 
        canv.rect(0,0, thickness,thickness, roundness);
        }
      else {
        for(let e=0; e<=threads; e++){
          canv.fill(color(hue(co), saturation(co), brightness(co), random(op[0],op[1])));  
          canv.rect(random(-0.1,0.1)*len, pow(-1,e)*ceil(e/2)*thickness, len, thickness);
          }
      }
      canv.pop();

      //actualiza valores del walker
      xAbs = xAbs + cos(angle)*distance/steps; 
      yAbs = yAbs + sin(angle)*distance/steps; 
      }
    }
    
  if(params.length === 6) {      // 6 Parametros es un noise walker [xAbs,yAbs,adv,angle0,angle_adv,angle_noisyness]
    let xAbs = params[0], yAbs = params[1], adv = params[2], angle0 = params[3], angle_adv = params[4], angle_noisyness = params[5]; 
    local_angle = angle0;
    for (let s = 0; s < steps; s++) {      
      canv.push();
      canv.translate(xAbs, yAbs);
      canv.rotate(local_angle + random(-1,1)*rot);
      canv.translate(0, random(-1,1)*scatter);
      if(shape[0] === "square"){        // cuadrados. shape=[type,ladoMin,ladoMax,roundness] 
        thickness = random(shape[1],shape[2]);
        roundness = .5*shape[3]*thickness;
        canv.fill(color(hue(co), saturation(co), brightness(co), random(op[0],op[1]))); 
        canv.rect(0,0, thickness,thickness, roundness);
        }
      else {
        for(let e=0; e<=threads; e++){
          canv.fill(color(hue(co), saturation(co), brightness(co), random(op[0],op[1])));  
          canv.rect(random(-0.1,0.1)*len, pow(-1,e)*ceil(e/2)*thickness, len, thickness);
          }
      }        
      canv.pop();

      //actualiza valores del walker
      local_angle = local_angle + map(noise(xAbs/angle_noisyness, yAbs/angle_noisyness), 0, 0.94, -1, 1)*angle_adv;
      xAbs = xAbs + adv*cos(local_angle);
      yAbs = yAbs + adv*sin(local_angle);    
    }
  }
  
  canv.noStroke();
  canv.noFill();
  canv.rectMode(CORNER);
}


// antigua funcion CRACK 
function crack0(canv,x0,y0,a0,steps,thick,bright){
  let x1=0, y1=0, x2=0, y2=0;
  canv.stroke(0,0,bright);
  canv.push();
  canv.translate(x0,y0);  
  canv.rotate(a0);      
  for (let s=0; s<steps; s++){
    x2 = x1 + random(10,20);
    y2 = y1 + random(-10,10);
    canv.strokeWeight(map(noise((x0 + x1)/10, (y0 + y1)/10), 0,1, thick[0],thick[1]));
    canv.line(x1,y1, x2,y2);
    x1 = x2;
    y1 = y2;
    
    if(random()<.001){
      crack(canv,x2,y2,random(360),steps - 50,[.25,2.5],bright);
    }

  }  
  canv.pop();
  canv.noStroke();
}




function crack(canv,x0,y0,a0,steps,zigzag,thick,bright){
  let x1=0, y1=0, x2=0, y2=0; 
  let subtramoX1, subtramoY1, subtramoX2, subtramoY2, t;
  let temp_index = 0;
  canv.push();
  canv.noFill();
  canv.translate(x0,y0);  
  canv.rotate(a0);      
  for (let s=0; s<steps; s++){
    x2 = x1 + random(10,20);
    y2 = y1 + random(-1,1)*zigzag;
    canv.stroke(0,0,bright);    
      for (let i = 0; i < 10; i++) {
        subtramoX1 = x1;
        subtramoY1 = y1;
        t = i/9;  // t va de 0 hasta (numPoints - 1) / numPoints
        subtramoX2 = lerp(x1, x2, t) + random(-18,18);
        subtramoY2 = lerp(y1, y2, t);
        //canv.stroke(0,0,map(noise(temp_index/100), 0,1, bright,50));
        canv.stroke(0,0,bright);
        canv.strokeWeight(map(noise(temp_index/20), 0,1, thick[0],thick[1]));
        canv.line(subtramoX1,subtramoY1, subtramoX2,subtramoY2);
        temp_index++;
      }
    x1 = x2;
    y1 = y2;

    if(random()<.002){
      crack(canv,x2,y2,random(-90,90),steps - 50,6,[.1,2],bright+10);
    }

  }  
  canv.pop();
  canv.noStroke();  
}



function generateBumpMapping(canv, light_direction, bump_height) {
  canv.clear();
  canv.background(50);
  canv.noStroke();
  
  heightMap_buffer.loadPixels();  
  for (let y = 1; y < heightMap_buffer.height - 1; y++) {
    for (let x = 1; x < heightMap_buffer.width - 1; x++) {
      let idx = (x + y*heightMap_buffer.width)*4;

      let hL = heightMap_buffer.pixels[((x - 1) + y * heightMap_buffer.width) * 4] / 255.0;
      let hR = heightMap_buffer.pixels[((x + 1) + y * heightMap_buffer.width) * 4] / 255.0;
      let hT = heightMap_buffer.pixels[(x + (y - 1) * heightMap_buffer.width) * 4] / 255.0;
      let hB = heightMap_buffer.pixels[(x + (y + 1) * heightMap_buffer.width) * 4] / 255.0;

      let dx = (hR - hL)*bump_height;
      let dy = (hB - hT)*bump_height;

      let bent_normal = createVector(-dx, -dy, 1).normalize();          ///////////   let bent_normal = createVector(-dx, -dy, 1).normalize();
      let light_contribution = max(0, bent_normal.dot(light_direction));

      // aplica el sombreado en el lienzo bumpShade   
      canv.fill(0,0,light_contribution*100, 255);
      canv.rect(x,y,1);  
    }
  }
}




function createHousePlan(steps, advance, size){
  let x = 0, y = dheight/2;
  let choice;

  house_buffer.noStroke();
  house_buffer.fill(255);

  for(s=0; s<steps; s++){
    choice = floor(random(4));
    if (choice === 0) {x += advance;}
    else if (choice === 1) {x -= advance;}
    else if (choice === 2) {y += advance;}
    else {y -= advance};

    // Asegurar que el walker no salga de los limites del canvas
    x = constrain(x, 0, dwidth);
    y = constrain(y, 0, dheight);

    house_buffer.rect(x,y, size);
  }

  // el marco también se dibuja en el plano de la casa
  //house_buffer.stroke(0);
  //house_buffer.noFill();
  //house_buffer.strokeWeight(frame_thickness*2);
  //house_buffer.rect(0,0,width,height);

}


function rejection(x,y){
  if (house_buffer.get(x,y)[0] == 255) {
    return false;
  }
}

function stayConfined(x,y){
  if(house_buffer.get(x,y)[0] != 255){
    return false;
  }
}






function keyPressed() {
  if (key === ' ') {
    save("Frank_v16_2K_seed_#" + seed + "_frame_" + nf(fc,4) + ".jpg");    //save the canvas as a JPG image file
  }  
  if (key === 's') {    // shadows on/off
    show_shadow = !show_shadow;
  }  

  if (key === 'p') {    // plano on/off
    show_plan = !show_plan;
  } 

  if (key === 'l') {
    if(is_running === true){
      is_running = false; 
      noLoop();
    }
    else{
      is_running = true; 
      loop();
    }
  }


  if (key === 'z') {    // reescalado responsive on/off
    if(do_resize){
      window_resize_factor = 1;
    }
    else{
      window_resize_factor = windowHeight/dheight;  
      if(windowHeight > windowWidth){
        window_resize_factor = windowWidth/dwidth;
      }
    }
    do_resize = !do_resize;
  }  



  if (key === '1') {
    save(bumpShade_buffer_0, "Frank_bumpShade_buffer_0.jpg");    //save the bumpShade_0 buffer as a JPG image file
  }  
  if (key === '2') {
    save(bumpShade_buffer_90, "Frank_bumpShade_buffer_90.jpg");    //save the bumpShade_90 buffer as a JPG image file
  }  
  if (key === '0') {                  // Recomenzar
    fc = 0;
    sun_traslation = sun_rotation = 0;
    walkers = [];
    inhabitants = 0;
    walkers_buffer.clear();
  } 


}
