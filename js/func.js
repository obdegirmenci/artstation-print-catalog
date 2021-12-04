function log(x) { console.log(x) };

// All available print sizes are in landscape orientation.
// Portraits are calculated with on the fly just by reversing them.

/**
 * Returns input list of form which is sortable.
 *
 * @param {object} form The loaded form from page.
 * @return {array} Sortable item list.
 */
function getSortableList(formData) {
    let fragment = new DocumentFragment();
    let ul = document.querySelector(".tags");
    let items = [];
    let extraItems = ["AAAAAAAAA", "BBBB", "BBB"];
    extraItems.forEach(i => items.push(i) );
            
    for (let key of formData.keys()) {
        if (key !== "product_types") {
            items.push(key);
            //log(`${key} is Sortable`);
        }
    }

    //return items;
    log(items);

    items.forEach( item => {
        li = document.createElement("li");
        li.classList.add("tags__item");
        li.draggable = true;
        li.id = `tag-${item}`;
        li.setAttribute("data-tag", item);
        li.innerHTML = item;
        fragment.appendChild(li);
    })

    ul.appendChild(fragment);
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
 * Capitalizes first letter of string.
 *
 * @param {string} word Orientation string.
 * @return {string} Capitalized orientation.
 */
 function capitalizeFirstLetter(word) {
    return word[0].toUpperCase() + word.slice(1);
}

/**
 * Creates SKU with given ID.
 *
 * @param {object} print Print type.
 * @param {string} userId ID that will be part of the SKU.
 * @return {string} SKU in AAAA-BBBB-CCCC format.
 */
 function createSKU(print, id) {
    let sku1;
    let sku2 = id;
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

/**
 * Corrects the aspect ratio while sending.
 *
 * @param {object} formData Actual form data.
 */
function correctAspectRatio(formData) {
    let orientation = formData.get("orientation");

    // Correct the ratio if is portrait just before creating result.
    if (orientation === "portrait") {
        let oldRatio = formData.get("aspect_ratio");
        correctedRatio = oldRatio.split(":").reverse().join(":");
        formData.set("aspect_ratio", correctedRatio);
        log(`${formData.get("aspect_ratio")} (converted from ${oldRatio})`);
    }
}

/**
 * Corrects the size while sending.
 * @param {string} size Active size on form.
 * @param {object} formData Actual form data.
 */
function correctSize(size, formData) {
    let orientation = formData.get("orientation");
    
    if (orientation === "portrait") {
        let oldSize = size;
        correctedSize = oldSize.split("x").reverse().join("x");
        formData.set("size", correctedSize);
        log(`${formData.get("size")} (converted from ${oldSize})`);
    } else {
        formData.set("size", size);
    }
}

/**
 * Gets current form data
 *
 * @param {object} form Form that will be source.
 * @return {object} Form data.
 */
function getFormData(form) {
    return new FormData(form);
}

const orientations = ["landscape", "portrait", "square"];
const defaultOrientation = orientations[0]; // [0] landscape, [1] portrait, [2] square

/**
 * Updates orientation SELECT.
 *
 * @param {object} el The element that will be updated.
 */
function updateOrientation(el) {
    let fragment = new DocumentFragment();

    for (let shape of orientations) {
        let option = document.createElement("option");
        option.value = shape;
        option.innerHTML = capitalizeFirstLetter(shape);

        if (shape === defaultOrientation) {
            option.selected = true;
        }

        fragment.appendChild(option);
    }

    el.replaceChildren(fragment);
}

/**
 * Updates aspect ratio SELECT.
 *
 * @param {object} el The element that will be updated.
 * @param {object} formData Actual form data.
 */
 function updateAspectRatio(el, formData) {
    let fragment = new DocumentFragment();
    let orientation = formData.get("orientation");

    for(let aspectRatio of Object.keys(printSizes)) {
        let option = document.createElement("option");

        if (orientation === "square" && aspectRatio === "1:1") {
            // If is square

            option.value = aspectRatio;
            option.innerHTML = `${aspectRatio}`;
            fragment.appendChild(option);

        } else if (orientation === "landscape" && aspectRatio !== "1:1") {
            // If is landscape

            option.value = aspectRatio;
            option.innerHTML = `${aspectRatio}`;
            fragment.appendChild(option);

        } else if (orientation === "portrait" && aspectRatio !== "1:1") {
            // If is portrait

            option.value = aspectRatio;
            aspectRatio = aspectRatio.split(":").reverse().join(":");
            option.innerHTML = `${aspectRatio}`;
            fragment.appendChild(option);
        }
        
    }

    el.replaceChildren(fragment);
}

/**
 * Updates size SELECT.
 *
 * @param {object} el The element that will be updated.
 * @param {object} formData Actual form data.
 */
function updateSize(el, formData) {
    let fragment = new DocumentFragment();
    let orientation = formData.get("orientation");
    let aspectRatio = formData.get("aspect_ratio");
    let specificSizes = []; // Specific sizes by product type.
        
    for (let type of formData.getAll("product_types")){
        log("\n");
        log(`[${type}] checked`);
        log(`[${type}] DEFAULT SIZES:`);

        Object.values(printSizes[aspectRatio][type]).forEach( size => {
            log(size);
            specificSizes.push(size);
        });
    }

    // TODO. Don't exec if size count is 1.
    // New list from unique values with ordered by width.
    let uniqueSizes = [... new Set(specificSizes) ].sort( (a, b) => {
        if ( Number(a.split("x")[0]) > Number(b.split("x")[0]) ) {  return 1;  }
        if ( Number(a.split("x")[0]) < Number(b.split("x")[0]) ) {  return -1;   }
    });

    log("\n");
    log(`UNIQUE SIZES: [ ${uniqueSizes.join(" | ")} ]`);

    // Fill the SELECT with new OPTIONs.
    uniqueSizes.forEach( size => {
        let visibleSize = size;
        let option = document.createElement("option");

        if (orientation === "portrait") {
            visibleSize = size.split("x").reverse().join("x");
        }

        option.value = size;
        option.innerHTML = `${visibleSize}: ${calcResolution(visibleSize)}`;
        fragment.appendChild(option);
    });

    el.replaceChildren(fragment);
}



document.addEventListener('DOMContentLoaded', pageReady(), false);

function pageReady() {
    const form = document.getElementById("catalog");
    const formActions = document.querySelector(".controls");
    const inptOrientation = document.getElementById("orientation");
    const inptAspectRatio = document.getElementById("aspect_ratio");
    const inptSize= document.getElementById("size");
    let data = getFormData(form);
    
    function initializeForm() {
        updateOrientation(inptOrientation);
        
        // Retrieve latest status of form after it initialized. Otherwise the update funcs tries to work with empty inputs.
        data = getFormData(form);
        updateAspectRatio(inptAspectRatio, data);
        data = getFormData(form);
        updateSize(inptSize, data);
    }
    
    // Initialize the Form.
    initializeForm();

    getSortableList(data);

    // Check changes for update the fields.
    form.addEventListener('change', e => {
        data = getFormData(form);

        switch (e.target.name) {
            case "product_types":
                // Checkbox control
                let activePrints = data.getAll("product_types").length;
                if (activePrints < 1) {
                    log("PLEASE SELECT PRINT AT LEAST ONE");
                    e.target.checked = true;
                } else {
                    updateSize(inptSize, data);
                }
                break;
            case "orientation":
                log(`${e.target.value} is selected`);
                updateAspectRatio(inptAspectRatio, data);
                data = getFormData(form);
                updateSize(inptSize, data);
                break;
            case "aspect_ratio":
                log(`${e.target.value} is selected`);
                updateSize(inptSize, data);
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

            data = getFormData(form);
            let activeId = data.get("id");
            let activeSize = data.get("size");
            let originalAspectRatio = data.get("aspect_ratio");

            correctAspectRatio(data);

            // Produce as much as given Product Type
            for (let print of data.getAll("product_types")) {

                Object.values(printSizes[originalAspectRatio][print]).forEach( size => {

                    // Max size control
                    if (activeSize < size) {
                        log("\n");
                        log(`[${size}] SKIPPED`);
                    } else {
                        log("\n");
                        log(`[${print}]-[${activeSize}] in process.`);
                        log(`[${size}] PASSED`);

                        // Don't include Product Type.
                        if (data.has("product_types")) {
                            data.delete("product_types");
                        }
                        
                        // Change ID to formatted SKU.
                        data.set("id", createSKU(print, activeId));

                        // Match product's size to produced size.
                        correctSize(size, data);

                        let result = Array.from(data.entries());

                        // Reorder the result by user input.
                        let sortOrder = createTagCloud();
                        let orderedResult = Object.fromEntries( sorter(result, sortOrder) );
                        createResult(orderedResult);
                        /*
                        for(let [key, val] of Object.entries(orderedResult)) {
                            log(`${key}: ${val}`);
                        }
                        */ 
                    }
                });
            }
        } else if (e.target.id == "resetbutton") {
            // Don't reset until cleaning
            e.preventDefault();

            // Clean inputs.
            while (inptOrientation.firstChild) inptOrientation.removeChild(inptOrientation.firstChild);
            while (inptAspectRatio.firstChild) inptAspectRatio.removeChild(inptAspectRatio.firstChild);

            form.reset();

            // Initialize the Form again after RESET.
            initializeForm();
        }
    });

    function createResult(result) {
        let fragment = new DocumentFragment();
        let ul = document.querySelector(".lines");
        let li = document.createElement("li");

        let serializedResult = [];

        for(let [key, val] of Object.entries(result)) {
            //log(`${key}: ${val}`);
            serializedResult.push(val);
        }
        
        li.innerHTML = serializedResult;
        fragment.appendChild(li);
        ul.appendChild(fragment);
    }

    // Draggable tags
    let dragging = null;

    function handleDragStart(e) {
        let target = getLi(e.target);

        dragging = target;
        e.dataTransfer.setData('text/plain', null);
        target.classList.add("tags__item_drag-start");
        e.dataTransfer.setDragImage(target, -6, -14);
    }

    function handleDragOver(e) {
        e.preventDefault();
        let target = getLi(e.target);

        if (target && target !== dragging) {
            target.classList.add("tags__item_over");
            let bounding = target.getBoundingClientRect()
            let offset = bounding.x + (bounding.width/2);
    
            if (e.clientX - offset > 0) {
                target.classList.add("tags__item_over-right");
                target.classList.remove("tags__item_over-left");
            } else {
                target.classList.add("tags__item_over-left");
                target.classList.remove("tags__item_over-right");
            }
        }
    }

    function handleDragEnd(e) {
        let target = getLi(e.target);

        if (target) {
            target.classList.remove("tags__item_drag-start");
            target.classList.add("tags__item_dropped");
        }
    }

    function handleDragLeave(e) {
        let target = getLi(e.target);

        if (target && target !== dragging) {
            target.classList.remove("tags__item_over");
            target.classList.remove("tags__item_over-left");
            target.classList.remove("tags__item_over-right");
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        let target = getLi(e.target);

        if (target && target !== dragging) {
            target.classList.remove("tags__item_over");
            
            if ( target.classList.contains("tags__item_over-right") ) {
                target.classList.remove("tags__item_over-right");
                target.parentNode.insertBefore(dragging, e.target.nextSibling);
            } else {
                target.classList.remove("tags__item_over-left");
                target.parentNode.insertBefore(dragging, e.target);
            }
        }
    }

    function getLi(target) {
        if (target.nodeName.toLowerCase() == "li") {
            return target;
        } else {
            return false;
        }
    }

    function handleAnimation(e) {
        e.target.classList.remove("tags__item_dropped");
    }

    const tag = document.querySelector(".tags");
    tag.addEventListener('dragstart', handleDragStart);
    tag.addEventListener('dragend', handleDragEnd);
    tag.addEventListener('dragover', handleDragOver);
    tag.addEventListener('dragleave', handleDragLeave);
    tag.addEventListener('drop', handleDrop);
    tag.addEventListener('animationend', handleAnimation);

    function tagCallback(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.type === "childList" && mutation.addedNodes.length) {
                createTagCloud();
            }
        }
    }

    const tagObserverCfg = { attributes: false, childList: true, subtree: false };
    const tagObserver = new MutationObserver(tagCallback);
    tagObserver.observe(tag, tagObserverCfg);

    function createTagCloud() {
        let tagEl = Array.from(document.querySelectorAll("[data-tag]"));
        let tagCloud = [];

        tagEl.forEach(li => { tagCloud.push(li.getAttribute("data-tag")) });

        return tagCloud;
    }
}

function sorter(arr, cfg) {
    return arr.sort((a, b) => {
        return cfg.indexOf(a[0]) - cfg.indexOf(b[0]);
    })
}