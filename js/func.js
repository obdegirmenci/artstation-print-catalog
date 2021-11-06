const printSizes = {
  "1:1" : ["8x8", "10x10", "12x12", "16x16", "20x20", "24x24", "30x30", "36x36"],
  "5:4" : ["10x8", "20x16", "30x24"],
  "4:3" : ["16x12", "24x18", "40x30"],
  "3:2" : ["18x12", "24x16", "30x20", "36x24", "48x32"],
  "2:1" : ["20x10"]
};

function a(x) {console.log(x)};

document.addEventListener('DOMContentLoaded', pageReady(), false);

function pageReady() {
    const form = document.getElementById("catalog");
    const submitButton = document.getElementById("submit");
    const userOrientation = document.getElementById("orientation");
    const userAspectRatio = document.getElementById("aspect_ratio");
    const sizeEl= document.getElementById("size");
    
    updateSelect(userAspectRatio, userOrientation.value, undefined);
    //updateSelect(sizeEl, userOrientation.value, userAspectRatio.value);
    //let uid = `${uid1}-${uid2}-${uid3}`;

    form.addEventListener('change', e => {

        switch (e.target.id) {
            case "orientation":

                if (e.target.value !== "square") {
                  /*
                    for (let option of userAspectRatio.options) {
                      //Transition from square to others
                        if (option.disabled) {
                            option.style.display = "block";
                            option.disabled = false;
                        } else if (option.value === "1:1") {
                            option.disabled = true;
                            option.style.display = "none";
                        }
                    }
                    */
                } else {
                  /*
                    for (let option of userAspectRatio.options) {
                        if (option.value === "1:1") {
                            option.selected = true;
                        } else {
                            option.disabled = true;
                            option.style.display = "none";
                        }
                    }
                    */
                }
                updateSelect(userAspectRatio, userOrientation.value, userAspectRatio.value);
                updateSelect(sizeEl, userOrientation.value, userAspectRatio.value);
                break;
            case "aspect_ratio":
                a(`${e.target.value} is selected`);
                updateSelect(sizeEl, userOrientation.value, userAspectRatio.value);
                break;
                
            default:
                break;
        }
    });

    form.addEventListener('click', e => {
        if (e.target.id == "submit") {
            e.preventDefault();
            let data = new FormData(form);

            let uid1;
            let userId = data.get("id");
            let uid2 = "0101";

            let productWidth = data.get("width");
            let productHeight = data.get("height");

            //a(calcDimension(productWidth,productHeight));

            for (let print of data.getAll("product_types")) {
                //a(print);
                
                for (let [key, value] of data) {
                    //a(`${key}: ${value}`);
                    /*
                    switch (key) {
                        case "title":
                            
                            a(`${key}: ${value}`);
                            break;
                    
                        default:
                            break;
                    }
                    */
                    
                }

                data.delete("product_types");
                //data.set("product_types", print);
                
                switch (print) {
                    case "art_poster":
                        uid1 = "APST";
                        break;
                    case "art_print":
                        uid1 = "APRN";
                        break;
                    case "canvas_print":
                        uid1 = "CPRN";
                        break;
                    case "hd_metal_print":
                        uid1 = "MPRN";
                        break;

                    default:
                        break;
                }
                
                let newId = `${uid1}-${userId}-${uid2}`;
                data.set("id", newId);

                // Correct the ratio if is portrait just before creating result.
                if (userOrientation.value === "portrait") {
                  let ratio = data.get("aspect_ratio");
                  correctedRatio = ratio.split(":").reverse().join(":");
                  data.set("aspect_ratio", correctedRatio);
                  a(`${data.get("aspect_ratio")} (original ${ratio})`);
                }

                let result = [];
                for (let value of data.values()) {
                    
                    result.push(value);
                }
                a(result.join(", "));
                
            }


            
        }
    });
}

function calcDimension(width, height) {
    let productRatio = width / height;

    switch (productRatio) {
        case 1:
            a(productRatio + " Landscape");
            break;
        case 2:
            a(productRatio + " Landscape");
            break;
    
        default:
            break;
    }
}

function updateSelect(el, orientation, aspect_ratio) {
    let fragment = new DocumentFragment();

      if (el.id === "size") {
        for(let size of printSizes[aspect_ratio]) {

          if (orientation === "portrait") {
            size = size.split("x").reverse().join("x");
          }
  
          let ppi = 300;
          let resolutionX = size.split("x")[0] * ppi;
          let resolutionY = size.split("x")[1] * ppi;
          let resolution = `${resolutionX}x${resolutionY}`;
          
          //a(`${orientation} ${size}: ${resolution}`);
  
          let option = document.createElement("option");
          option.value = size;
          option.innerHTML = `${size}: ${resolution}`;
          fragment.appendChild(option);
        }
      } else if (el.id === "aspect_ratio") {
        for(let ratio of Object.keys(printSizes)) {
          let option = document.createElement("option");

          if (orientation === "square" && ratio === "1:1") {
            // If is square
            a(ratio);
            option.value = ratio;
            option.innerHTML = `${ratio}`;
            fragment.appendChild(option);
          } else if (orientation === "landscape" && ratio !== "1:1") {
            // If is landscape
            a(ratio);
            option.value = ratio;
            option.innerHTML = `${ratio}`;
            fragment.appendChild(option);
          } else if (orientation === "portrait" && ratio !== "1:1") {
            // If is portrait
            option.value = ratio;
            ratio = ratio.split(":").reverse().join(":");
            a(ratio);
            option.innerHTML = `${ratio}`;
            fragment.appendChild(option);
          }
          
        }
        
      }

    el.replaceChildren(fragment);
}