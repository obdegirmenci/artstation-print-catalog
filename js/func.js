function log(x) { console.log(x) };

const orientations = ["landscape", "portrait", "square"];
const defaultOrientation = orientations[0]; // [0] landscape, [1] portrait, [2] square

// All available print sizes that in landscape orientation.
// Portraits are calculated with on the fly just by reversing them.

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
    // TODO
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
 * Updates SELECT options based on user selections in the form.
 *
 * @param {object} el Which SELECT element will be updated. Values are "size" or "aspect_ratio".
 * @param {string} orientation The orientation value of SELECT.
 * @param {string} aspect_ratio The aspect ratio value of SELECT.
 */
function updateSelect(el, orientation, aspect_ratio, form) {
    let fragment = new DocumentFragment();

    if (el.id === "size") {
    let sizeList = [];
        
    for (let type of form.getAll("product_types")){
        log("\n");
        log(`[${type}] checked`);
        log(`[${type}] DEFAULT SIZES:`);

        Object.values(printSizes[aspect_ratio][type]).forEach( size => {
            log(size);
            sizeList.push(size);
        });

    }

    // New size list from unique values with ordered by width
    let sortedSizeList = [... new Set(sizeList) ].sort( (a, b) => {
        if ( Number(a.split("x")[0]) > Number(b.split("x")[0]) ) {  return 1;  }
        if ( Number(a.split("x")[0]) < Number(b.split("x")[0]) ) {  return -1;   }
    });
    
    log("\n");
    log(`UNIQUE SIZES: [ ${sortedSizeList.join(" | ")} ]`);

    sortedSizeList.forEach( size => {
        let visibleSize = size;
        let option = document.createElement("option");

        if (orientation === "portrait") {
            visibleSize = size.split("x").reverse().join("x");
        }

        option.value = size;
        option.innerHTML = `${visibleSize}: ${calcResolution(visibleSize)}`;
        fragment.appendChild(option);
    })


    } else if (el.id === "aspect_ratio") {
    for(let ratio of Object.keys(printSizes)) {
        let option = document.createElement("option");

        if (orientation === "square" && ratio === "1:1") {
        // If is square
        //log(ratio);
        option.value = ratio;
        option.innerHTML = `${ratio}`;
        fragment.appendChild(option);
        } else if (orientation === "landscape" && ratio !== "1:1") {
        // If is landscape
        //log(ratio);
        option.value = ratio;
        option.innerHTML = `${ratio}`;
        fragment.appendChild(option);
        } else if (orientation === "portrait" && ratio !== "1:1") {
        // If is portrait
        option.value = ratio;
        ratio = ratio.split(":").reverse().join(":");
        //log(ratio);
        option.innerHTML = `${ratio}`;
        fragment.appendChild(option);
        }
        
    }
    
    } else if (el.id === "orientation") {
    for (let shape of orientations) {

        let option = document.createElement("option");
        option.value = shape;
        option.innerHTML = capitalizeFirstLetter(shape);

        if (shape === orientation) {
            option.selected = true;
        }

        fragment.appendChild(option);
    }

    }

    el.replaceChildren(fragment);
}

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

/**
 * Creates SKU with given ID.
 *
 * @param {object} print Print type.
 * @param {string} userId ID that will be part of the SKU.
 * @return {string} SKU in AAAA-BBBB-CCCC format.
 */
function createSKU(print, userId) {
    let sku1;
    let sku2 = userId;
    let sku3 = "0101";

    switch (print) {
        case "art_poster":
            sku1 = "APST";
            break;
        case "art_print":
            sku1 = "APRN";
            break;
        case "canvas_print":
            sku1 = "CPRN";
            break;
        case "hd_metal_print":
            sku1 = "MPRN";
            break;
        default:
            break;
    }

    let newId = `${sku1}-${sku2}-${sku3}`;
    return newId;
}

function correctRatio(userRatio, formData) {
// Correct the ratio if is portrait just before creating result.
    if (userRatio === "portrait") {
        let oldRatio = formData.get("aspect_ratio");
        correctedRatio = oldRatio.split(":").reverse().join(":");
        formData.set("aspect_ratio", correctedRatio);
        log(`${formData.get("aspect_ratio")} (converted from ${oldRatio})`);
    } else {
        //log("neeeein");
    }
}


document.addEventListener('DOMContentLoaded', pageReady(), false);

function pageReady() {
    const form = document.getElementById("catalog");
    const formActions = document.querySelector(".controls");
    //const submitButton = document.getElementById("submit");
    //const userTypes = document.getElementsByTagName("product_types");
    const userOrientation = document.getElementById("orientation");
    const userAspectRatio = document.getElementById("aspect_ratio");
    const userSize= document.getElementById("size");
    
    function initializeForm() {
        updateSelect(userOrientation, defaultOrientation);
        updateSelect(userAspectRatio, userOrientation.value);
        updateSelect(userSize, userOrientation.value, userAspectRatio.value, data);
    }

    let data = new FormData(form);
    
    // Initialize the Form.
    initializeForm();

    getSortableList(data);

    // Check changes for update the fields.
    form.addEventListener('change', e => {
        data = new FormData(form);

        switch (e.target.name) {
            case "product_types":
                updateSelect(userSize, userOrientation.value, userAspectRatio.value, data);
                break;
            case "orientation":
                log(`${e.target.value} is selected`);
                updateSelect(userAspectRatio, userOrientation.value, userAspectRatio.value);
                updateSelect(userSize, userOrientation.value, userAspectRatio.value, data);
                break;
            case "aspect_ratio":
                log(`${e.target.value} is selected`);
                updateSelect(userSize, userOrientation.value, userAspectRatio.value, data);
                break;
                
            default:
                break;
        }
    });

    // Form actions.
    formActions.addEventListener('click', e => {
        if (e.target.id == "submit") {
            // Don't submit to anywhere
            e.preventDefault();

            // Update the data with current form values
            data = new FormData(form);
            let userId = data.get("id");
            let userSize = data.get("size");

            //correctRatio(userOrientation.value, data);

            // Produce as much as given Product Type
            for (let print of data.getAll("product_types")) {

                Object.values(printSizes[data.get("aspect_ratio")][print]).forEach( size => {

                    // Max size control
                    if (userSize < size) {
                        log("\n");
                        log(`[${size}] SKIPPED`);
                    } else {
                        log("\n");
                        log(`[${print}]-[${userSize}] in process.`);
                        log(`[${size}] PASSED`);

                        // Don't include Product Type.
                        if (data.has("product_types")) {
                            data.delete("product_types");
                        }
                        
                        // Change ID to formatted SKU.
                        data.set("id", createSKU(print, userId));

                        // Match product's size produced size.
                        //size.split("x").reverse().join("x")
                        data.set("size", size);
        
                        
        
                        let result = [];
                        for (let value of data.values()) {
                            
                            result.push(value);
                        }
                        let newResult = result.join(", ");
                        log(newResult);
                    }
                });
                
            }


            
        } else if (e.target.id == "resetbutton") {
            e.preventDefault();

            while (userOrientation.firstChild) userOrientation.removeChild(userOrientation.firstChild);
            while (userAspectRatio.firstChild) userAspectRatio.removeChild(userAspectRatio.firstChild);

            form.reset();

            // Initialize the Form again after RESET.
            initializeForm();
        }
    });
}
