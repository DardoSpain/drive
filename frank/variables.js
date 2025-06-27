
// BATH Renders
// Ese bloque hay que pegarlo al inicio del script
const max_reloads = 1000;    // Establecer aqui el numero de tests que se deseen lanzar. 0: no guarda render. 1: guarda render. >1: automatico y guarda renders
if (!sessionStorage.reloadCount) {
    sessionStorage.reloadCount = 1;
}
let render_batch = false; //                 // si se habilita el render_batch
let save_animation = false; //



// Variables Globales 

let dwidth=2000, dheight=2400; 
let diffuse_buffer, heightMap_buffer, bumpShade_buffer_0, bumpShade_buffer_90, shadow_buffer, temp_buffer;
let window_resize_factor=1, do_resize = true;
let is_running = true;
let seed;
let fc = 0;


let house_buffer, walkers_buffer; 
let walkers = [];
let inhabitants = 0;
let region; 
let noise_offsets = [];


let colorBG1, colorBG2;

let light_angle, light_dist, light_pos, show_plan = false, show_shadow = true; 
let sun_traslation = 0, sun_rotation = 0, sun_traslation_speed = .4, sun_rotation_speed = .0375;          //sun_rotation_speed = .02; 


// eliminar estas variables de debug
let setup_time; 



// Texto
let mrsSaintFont;
function preload() {
    mrsSaintFont = loadFont("MrsSaintDelafield.ttf"); // Cargar la fuente
  }


// Fechas
let date, day, month, year, week_date; 
let dates_list = [
    70842, 70942, 71042, 71142, 71242, 81442, 82142, 90242, 92142, 92542, 92742, 92942, 100142, 100342, 100742, 100942, 101442, 102042, 102942, 110242, 110542, 110742, 111042, 111242, 111742, 111942, 112042, 112842, 120742, 121042, 121342, 122242, 11343, 13043, 20543, 22743, 30443, 31043, 31243, 31843, 31943, 32543, 32743, 40143, 40243, 42743, 50143, 50243, 51843, 61343, 61543, 71143, 71343, 71643, 72343, 72643, 72943, 80343, 80543, 80743, 80943, 81043, 82343, 91043, 91643, 92943, 101743, 110343, 111143, 111743, 112743, 120643, 122443, 122743, 122943, 123043, 10244, 10644, 10744, 11244, 11544, 11944, 12244, 12444, 12844, 13044, 20344, 20844, 21244, 21444, 21544, 21644, 21744, 21844, 21944, 22044, 22344, 22744, 22844, 30144, 30244, 30444, 30644, 30844, 31044, 31144, 31244, 31444, 31644, 31744, 31844, 31944, 32044, 32344, 32444, 32544, 32744, 32844, 32944, 33144, 40144, 40344, 40544, 40644, 41144, 41444, 41544, 41644, 41744, 41944, 42544, 42744, 42844, 50244, 50344, 50544, 50644, 50844, 50944, 51044, 51144, 51344, 51644, 51944, 52044, 52244, 52544, 52644, 53144, 60244, 60544, 60644, 60944, 61344, 61644, 62344, 62744, 63044, 70644, 70844, 71544, 72144, 80144
];
