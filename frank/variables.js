
// BATH Renders
// Ese bloque hay que pegarlo al inicio del script
const max_reloads = 1000;    // Establecer aqui el numero de tests que se deseen lanzar. 0: no guarda render. 1: guarda render. >1: automatico y guarda renders
if (!sessionStorage.reloadCount) {
    sessionStorage.reloadCount = 1;
}
let render_batch = true; //                 // si se habilita el render_batch
let save_animation = false; //



// Variables Globales 

let dwidth=2000, dheight=2400; 
let diffuse_canvas, heightMap_canvas, bumpShade_canvas_0, bumpShade_canvas_90, shadow_canvas;
let window_resize_factor=1, do_resize = true;
let is_running = true;
let seed;
let fc = 0;


let house_canvas, walkers_canvas; 
let walkers = [];
let num_walkers = 8;
let region; 
let noise_offsets = [];


let colorBG1, colorBG2;

let light_angle, light_dist, light_pos, show_plan = false, show_shadow = true; 
let sun_traslation = 0, sun_rotation = 0, sun_traslation_speed = .4, sun_rotation_speed = .02; 


// Texto
let mrsSaintFont;
function preload() {
    mrsSaintFont = loadFont("MrsSaintDelafield.ttf"); // Cargar la fuente
  }