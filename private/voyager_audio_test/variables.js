


// Variables Globales 

let dwidth=1000, dheight=1200; 
let do_resize = true, window_resize_factor=1;
let seed;
let vignet_canvas, light_angle, light_sin, light_cos;

// Logo 
let voyager_logo;

// Texto
let texts, text_mode, text_lead = 20; 
let text_to_write = "", text_to_write_sliced = "";
let text_phrases, current_phrase = 0;

//Tipografias
let typewriterfont, romanfont;
function preload() {
    voyager_logo = loadImage("voyager_logo.png");
    texts = loadStrings("texts.txt");
    typewriterfont = loadFont("CourierPrime_redux.ttf"); // Cargar la fuente
  }

//Narracion
let narration, narration_gender = "", is_narrating = false;