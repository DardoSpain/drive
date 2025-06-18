

// ---------------- FUNCTIONS ----------------


function findTextBlock(tokenID) {
  let target_block = `#${tokenID}`;  
  let is_in_target_block = false;
  for (let i = 0; i < texts.length; i++) {
    if (texts[i].startsWith("#")) {
      if (texts[i].startsWith(target_block)) {
        is_in_target_block = true;
        narration_gender = texts[i].slice(-1);
        continue; 
      } else if (is_in_target_block) {
        break;
      }
    }
    if (is_in_target_block) {
      if (text_to_write === "") {
        text_to_write += texts[i];
      } else {
        text_to_write += "\n" + texts[i];
      }
    }
  }
}



function text2seed(mytext){
  let subtotal = 0; 
  for(let i=0; i<mytext.length; i++){
    subtotal = subtotal + 31*mytext.charCodeAt(i);    
  }
  return subtotal; 
}


function setNarrationVoice() {
  if(narration_gender == "m"){
    narration.setVoice(random(["Google UK English Male"]));    
  } else {
    narration.setVoice(random(["Google UK English Female", "Google US English"]));    
  }
  narration.setPitch(random(.8,1.2));
  narration.setRate(.9);
}


function narratePhrase() {
  if (current_phrase < text_phrases.length) {
    narration.speak(text_phrases[current_phrase]);
    current_phrase++;
  } else {    
    current_phrase = 0;     
    setTimeout(() => {
      narration.speak(text_phrases[current_phrase]); 
      current_phrase++;
    }, 3000); 
  }
}


function createVignetting(canv,do_vignet,darkness){
  let vignet_offset = random(200);
  canv.noStroke();
  if(do_vignet == true){
    canv.background(0,darkness);     
    canv.fill(100,6);  
    canv.push();
    canv.translate(-vignet_offset*light_cos, -vignet_offset*light_sin);
    for(let i=.4; i<1.05; i = i + 0.01){
      canv.push();
      canv.translate(dwidth/2,dheight/2);
      canv.scale(1,dheight/dwidth);
      canv.circle(0,0,i*dwidth);
      canv.pop();
    }  
    canv.pop();
    canv.filter(BLUR, 20);
  }
}



function mousePressed() {
  if (!is_narrating) {  
    is_narrating = true; 
    setTimeout(narratePhrase, 1000);
    loop();
  }
}

function keyPressed() {
  if (!is_narrating) {  
    is_narrating = true; 
    setTimeout(narratePhrase, 1000);
    loop();
  }
}