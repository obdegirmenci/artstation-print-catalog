function a(x) {console.log(x)};

document.addEventListener('DOMContentLoaded', pageReady(), false);

function pageReady() {
    const form = document.getElementById("catalog");
    const submitButton = document.getElementById("submit");

    form.addEventListener('click', e => {
        if (e.target.id == "submit") {
            e.preventDefault();
            let data = new FormData(form);
            
            for (let [key, value] of data) {
                a(`${key}: ${value}`);
                /*
                if (key === "length_unit") {
                    a(`${value}`);
                    //a(`${key}: ${value}`);
                }
                */
                /*
                switch (key) {
                    case "length_unit":
                        a(`${value}`);
                        break;
                
                    default:
                        break;
                }
                */
            }

            //a(data.getAll("product_types"))
            
        }
    });
}