
// BATH Renders
// Ese bloque hay que pegarlo al inicio del script
const max_reloads = 1000;    // Establecer aqui el numero de tests que se deseen lanzar. 0: no guarda render. 1: guarda render. >1: automatico y guarda renders
if (!sessionStorage.reloadCount) {
    sessionStorage.reloadCount = 1;
}
let render_battery = false; //                 // si se habilita el renderBattery



// Variables Globales 

let dwidth=1000, dheight=1200; 
let diffuse_canvas, heightMap_canvas, bumpShade_canvas, shadow_canvas;
let window_resize_factor=1, do_resize = true;
let seed;
let fc = 0;


let house_canvas, walkers_canvas; 
let walkers = [];
let num_walkers = 8;
let region; 
let noise_offsets = [];


let colorBG1, colorBG2;

let light_angle, light_vector, light_dist, light_pos, show_shadow = true, show_plan = false; 



// Texto
let mrsSaintFont;
function preload() {
    mrsSaintFont = loadFont("MrsSaintDelafield.ttf"); // Cargar la fuente
  }