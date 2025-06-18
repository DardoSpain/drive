

function setup() { 

  findTextBlock(random([1,2])); 

  if(do_resize == true){
    window_resize_factor = windowHeight/dheight;
    if(windowHeight > windowWidth){
      window_resize_factor = windowWidth/dwidth;
    }
  }

  seed = int(random(99999999999));

  randomSeed(seed);
  noiseSeed(seed);
  console.log("· Seed: " + seed);

  createCanvas(dwidth,dheight);                                            
  pixelDensity();
  colorMode(HSB,360,100,100,255);
  angleMode(DEGREES);  
  noStroke();

  resizeCanvas(dwidth*window_resize_factor, dheight*window_resize_factor);
  scale(window_resize_factor,window_resize_factor);
  background(100);

  vignet_canvas = createGraphics(dwidth, dheight);                          
  vignet_canvas.colorMode(HSB,360,100,100,255);
  vignet_canvas.clear();

  light_angle = random(10,170);  
  light_sin = sin(light_angle);
  light_cos = cos(light_angle);

  text_phrases = text_to_write.match(/[^.?!]+[.?!]*/g);                   

  narration = new p5.Speech();
  narration_gender = random(["m", "f"]); 
  narration.onLoad = setNarrationVoice;
  narration.onEnd = narratePhrase;

  blendMode(MULTIPLY);
  tint(0,0,100,15);
  image(voyager_logo, 300,560);
  noTint();
  blendMode(BLEND);

 
  // --------------------- 
  // Creacion del Texto
  text_mode = random([1,2]);
  textFont(typewriterfont);   
  textAlign(LEFT,TOP); 
  textSize(15);
  textLeading(text_lead);
  if(text_mode == 1){                               
    fill(40);
    text(text_to_write, 100,100, 800,1020);
  }
  if(text_mode == 2){                               
    fill(40);
    text(text_to_write, 100,100, 390,1010);   
    text(text_to_write, 530,100 - 49*text_lead, 390,1010 + 49*text_lead);
    fill(100);
    rect(530,0, dwidth - 530,100 + text_lead);
  }



  // crear Vigneteado en el vignet_canvas 
  createVignetting(vignet_canvas,true,random(0,90));       
  blendMode(MULTIPLY); 
  image(vignet_canvas,0,0);
  blendMode(BLEND);

  //noLoop();

  } // end Setup

