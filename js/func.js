function log(x) { console.log(x) };

// All available print sizes that in landscape orientation.
// Portraits are calculated with on the fly just by reversing them.
const printSizes = {
  "1:1" : ["8x8", "10x10", "12x12", "16x16", "20x20", "24x24", "30x30", "36x36"],
  "5:4" : ["10x8", "20x16", "30x24"],
  "4:3" : ["16x12", "24x18", "40x30"],
  "3:2" : ["18x12", "24x16", "30x20", "36x24", "48x32"],
  "2:1" : ["20x10"]
};

/**
 * Returns input list of form which is sortable.
 *
 * @param {object} form The loaded form from page.
 * @return {array} Sortable item list.
 */
function getSortableList(form) {
    let items = [];
            
    for (let key of form.keys()) {
        if (key !== "product_types") {
            items.push(key);
            //log(`${key} is Sortable`);
        }
    }

    return items;
}

/**
 * Creates sortable item list.
 *
 * @param {object} el The element that new items will be created inside.
 * @param {array} items The form items that will be used as sortable list items.
 */
function createSortItems(el, items) {
    
}

/**
 * Calculates digital resolution of prints by given size in inch.
 *
 * @param {string} dimension The width and height of print.
 * @return {string} Minimum resolution that should be at 300PPI.
 */
function calcResolution(dimension) {
    let ppi = 300;
    let resolutionX = dimension.split("x")[0] * ppi;
    let resolutionY = dimension.split("x")[1] * ppi;
    let resolution = `${resolutionX}x${resolutionY}`;
    return resolution;
}

/**
 * Updates the SELECT options based on user selections in the form.
 *
 * @param {object} el Which SELECT element will be updated. Values are "size" or "aspect_ratio".
 * @param {string} orientation The orientation value of SELECT.
 * @param {string} aspect_ratio The aspect ratio value of SELECT.
 */
function updateSelect(el, orientation, aspect_ratio) {
    let fragment = new DocumentFragment();

      if (el.id === "size") {
        for(let size of printSizes[aspect_ratio]) {

          if (orientation === "portrait") {
            size = size.split("x").reverse().join("x");
          }

          let option = document.createElement("option");
          option.value = size;
          option.innerHTML = `${size}: ${calcResolution(size)}`;
          fragment.appendChild(option);
        }
      } else if (el.id === "aspect_ratio") {
        for(let ratio of Object.keys(printSizes)) {
          let option = document.createElement("option");

          if (orientation === "square" && ratio === "1:1") {
            // If is square
            log(ratio);
            option.value = ratio;
            option.innerHTML = `${ratio}`;
            fragment.appendChild(option);
          } else if (orientation === "landscape" && ratio !== "1:1") {
            // If is landscape
            log(ratio);
            option.value = ratio;
            option.innerHTML = `${ratio}`;
            fragment.appendChild(option);
          } else if (orientation === "portrait" && ratio !== "1:1") {
            // If is portrait
            option.value = ratio;
            ratio = ratio.split(":").reverse().join(":");
            log(ratio);
            option.innerHTML = `${ratio}`;
            fragment.appendChild(option);
          }
          
        }
        
      }

    el.replaceChildren(fragment);
}

document.addEventListener('DOMContentLoaded', pageReady(), false);

function pageReady() {
    const form = document.getElementById("catalog");
    const submitButton = document.getElementById("submit");

    const userOrientation = document.getElementById("orientation");
    const userAspectRatio = document.getElementById("aspect_ratio");
    const userSize= document.getElementById("size");
    
    // Initiale the SELECTs.
    updateSelect(userAspectRatio, userOrientation.value, userAspectRatio);
    updateSelect(userSize, userOrientation.value, userAspectRatio.value);

    let data = new FormData(form);
    getSortableList(data);

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
                updateSelect(userSize, userOrientation.value, userAspectRatio.value);
                break;
            case "aspect_ratio":
                log(`${e.target.value} is selected`);
                updateSelect(userSize, userOrientation.value, userAspectRatio.value);
                break;
                
            default:
                break;
        }
    });

    form.addEventListener('click', e => {
        if (e.target.id == "submit") {
            // Don't submit to anywhere
            e.preventDefault();
            // Update the data with current form values
            data = new FormData(form);

            let uid1;
            let userId = data.get("id");
            let uid2 = "0101";

            // Produce as much as given Product Type
            for (let print of data.getAll("product_types")) {
                //log(print);
                
                for (let [key, value] of data) {
                    //log(`${key}: ${value}`);
                    /*
                    switch (key) {
                        case "title":
                            
                            log(`${key}: ${value}`);
                            break;
                    
                        default:
                            break;
                    }
                    */
                    
                }

                // Don't include Product Type.
                data.delete("product_types");
                
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
                // Works multiple times and gives error. It needs to work just one time.
                if (userOrientation.value === "portrait") {
                  let ratio = data.get("aspect_ratio");
                  correctedRatio = ratio.split(":").reverse().join(":");
                  data.set("aspect_ratio", correctedRatio);
                  log(`${data.get("aspect_ratio")} (original ${ratio})`);
                }

                let result = [];
                for (let value of data.values()) {
                    
                    result.push(value);
                }
                log(result.join(", "));
                
            }


            
        }
    });
}
