
// Random Access Memory 
// A generative art project by Dario Lanza
// www.dariolanza.com

// BATH Renders
// Ese bloque hay que pegarlo al inicio del script
const max_reloads = 9999;    // Establecer aqui el numero de tests que se deseen lanzar. 0: no guarda render. 1: guarda render. >1: automatico y guarda renders
let reloadCount = sessionStorage.getItem("reloadCount");
if (reloadCount === null) {
  reloadCount = 1;
} else {
  reloadCount = parseInt(reloadCount) + 1;
}
sessionStorage.setItem("reloadCount", reloadCount);
let render_battery = true;                           // para habilitar el render_Battery



// VARIABLES GLOBALES

let rawLines;
let data_blocks = [], selected_photo;
let go_online = true, photo_path;
let trait_title = "", trait_metadata = "", trait_url = "";
let photo_image, photo_width, photo_height, photo_aspectRatio, photo_dimX, photo_dimY, photo_zoomFactor; 
let sketch_width = 2000, sketch_height = 1500; 
let do_autoResize = true, windowResizeFactor = 1;
let fc = 0;
let save_frames = false; 


let canvasB;
let rect1, rect2, rectWidth, rectHeight; 
let proceedToDraw = false; // Variable para controlar la ejecucion de draw()
let delay_setup = 2000, delay_draw = 2000;  
let is_stopped = false;


function preload() {
  rawLines = loadStrings('online_photos.txt');
}


function setup() {  

  // PARSEO DE LOS DATOS
  // Unir todo y separar por bloques usando dobles saltos de linea
  let fullText = rawLines.join('\n');
  let rawBlocks = fullText.split(/\n\s*\n/); // separa por lineas en blanco

  // Procesar cada bloque
  for (let block of rawBlocks) {
    let lines = block.trim().split('\n');
    if (lines.length === 4) {
      data_blocks.push(lines);
    }
  }

  // Seleccionar un bloque aleatoriamente
  selected_photo = int(random(data_blocks.length));     //selected_photo = 11;   /////////////
  console.log("Block: " + selected_photo + "/" + data_blocks.length);

  // Identificar traits
  trait_title = data_blocks[selected_photo][0];
  trait_metadata = data_blocks[selected_photo][1];
  trait_url = data_blocks[selected_photo][2];
  photo_zoomFactor = data_blocks[selected_photo][3];

  console.log("Title:", trait_title);
  console.log("Metadata:", trait_metadata);
  console.log("URL:", trait_url);
  console.log("Zoom Factor:", photo_zoomFactor);

  
 if(go_online == true){           // la imagen se cargara desde la URL
    photo_path = trait_url;
    photo_zoomFactor = data_blocks[selected_photo][3];
 } else{                          // la imagen se cargara desde disco
    let filenumber = nf(selected_photo, 2) + ".jpg"; // convierte 2 → "02"
    photo_path = "offline_photos/" + filenumber;
    photo_zoomFactor = 1;
  }

  
  // CARGAR IMAGEN Y DEFINIR EL CANVAS 
    loadImage(photo_path, function(im) {
    photo_image = im;      
        
    // Guardar dimensiones
    photo_width = photo_image.width;
    photo_height = photo_image.height;
    photo_aspectRatio = photo_width/photo_height;

      
    // Creacion del canvas
    if(photo_width > photo_height){                     // FORMATO HORIZONTAL
      //sketch_width = 200; sketch_height = 150; 
      photo_aspectRatio = photo_width/photo_height;

      // Escalado proporcional de la foto
      if(photo_aspectRatio > 1.333333){            
        photo_dimY = sketch_height; 
        photo_dimX = photo_width*sketch_height/photo_height;
      } else{
        photo_dimX = sketch_width;
        photo_dimY = photo_height*sketch_width/photo_width;
      }
    }
    else{                                               // FORMATO VERTICAL
      [sketch_width, sketch_height] = [sketch_height, sketch_width]; 
      photo_aspectRatio = photo_height/photo_width;

      // Escalado proporcional de la foto
      if(photo_aspectRatio > 1.333333){   
        photo_dimX = sketch_width;
        photo_dimY = photo_height*sketch_width/photo_width;          
      } else{
        photo_dimY = sketch_height; 
        photo_dimX = photo_width*sketch_height/photo_height;
      }
    }


    // Reescalado responsive
    if(do_autoResize == true){
      windowResizeFactor = windowHeight/sketch_height;
      photo_dimX = photo_dimX*windowHeight/sketch_height;
      photo_dimY = photo_dimY*windowHeight/sketch_height;
      sketch_width = sketch_width*windowHeight/sketch_height;
      sketch_height = windowHeight;        
    }


    createCanvas(sketch_width,sketch_height);

    background(0);
    noStroke(); 
    noFill();

    imageMode(CENTER);
    image(photo_image, width/2,height/2, photo_dimX*photo_zoomFactor,photo_dimY*photo_zoomFactor);
    imageMode(CORNER);

    // Creamos bufferB
    canvasB = createGraphics(width,height);
    canvasB.image(get(),0,0);   // copiamos lo que haya en el lienzo principal al canvasB



    // Detener el bucle de draw por ahora
    noLoop();
      
    // pausa la ejecucion de setup durante un tiempo (delay_setup)
    setTimeout(() => {
      proceedToDraw = true; 
      loop(); 
    }, delay_setup); 


    });   // end loadImage


}   // end Setup



function draw(){
  if (!proceedToDraw || is_stopped) return; // No hacer nada si todavia no esta permitido

  if (save_frames == true) {
    save("RandomAccessMemory_" + nf(sessionStorage.reloadCount, 4) + "_photo#" + selected_photo + "_fr_" + nf(fc, 3) + ".jpg");    
  }

  console.log("test:" + nf(sessionStorage.reloadCount, 4) + " frame:" + nf(fc, 3));

  fc++;
  
  // Generar y dibujar dos rectangulos no superpuestos
  generate2Rectangles();

  image(canvasB, rect2.x,rect2.y, rectWidth,rectHeight, rect1.x,rect1.y, rectWidth,rectHeight);     // image(canvas, destX,destY, destW,destH, origenX,origenY, regionW,regionH)
  image(canvasB, rect1.x,rect1.y, rectWidth,rectHeight, rect2.x,rect2.y, rectWidth,rectHeight);
  
  canvasB.image(get(),0,0);   // copiamos lo que haya en el lienzo principal al canvasB




  if (fc === 100) {
    if (render_battery == true && reloadCount < max_reloads) {
       console.log("Restarting sketch in 5 seconds...");
        setTimeout(() => location.reload(), 5000);
      } else {
        console.log("Random Access Memory batch finished!");
        is_stopped = true;
        noLoop();
      }
    }
  


  noLoop();
  setTimeout(() => loop(), delay_draw);



}   // end Draw






// ---------------------- FUNTIONS  ----------------------


function generate2Rectangles() {
  // Generar dimensiones aleatorias
  rectWidth = floor(random(20,600)*windowResizeFactor);
  rectHeight = floor(random(20,600)*windowResizeFactor);

  // Crear el primer rectangulo
  rect1 = generateRectangle(rectWidth, rectHeight);

  // Crear el segundo rectangulo
  rect2 = generateRectangle(rectWidth, rectHeight);

  // Comprobar si hay superposicion
  if (checkOverlap(rect1, rect2) == true) {     // si hay superposicion, volver a generar los rectangulos
    generate2Rectangles();
  } 
}



function generateRectangle(w, h) {
  var x = floor(random(0, sketch_width - w));
  var y = floor(random(0, sketch_height - h));
  return { x: x, y: y, width: w, height: h };
}



function checkOverlap(rect1, rect2) {
  if (
    rect1.x + rect1.width <= rect2.x ||
    rect2.x + rect2.width <= rect1.x ||
    rect1.y + rect1.height <= rect2.y ||
    rect2.y + rect2.height <= rect1.y
  ) {
    return false; // No hay superposicion
  } else {
    return true; // Hay superposicion
  }
}




function keyPressed() {
  if (key === ' ') {
    save("RandomAccessMemory_" + nf(sessionStorage.reloadCount, 4) + "_photo#" + selected_photo + "_fr_" + nf(fc, 3) + ".jpg");
  }  
  if (key === '+') {
    delay_draw = delay_draw - 100;
    if(delay_draw < 100){delay_draw = 100;}
    console.log(delay_draw);
  }  
  if (key === '-') {
    delay_draw = delay_draw + 100;
    if(delay_draw > 10000){delay_draw = 10000;}
    console.log(delay_draw);
  } 
}

