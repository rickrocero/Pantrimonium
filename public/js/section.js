console.log("section forms js linked");

const addItemBtn = document.querySelector('#add-item-button');       // modal form add button
const addItemForm = document.querySelector('#add-item-form');

const updateItemBtn = document.querySelector('#update-item-btn');    // modal form update button
const updateItemForm = document.querySelector('#update-item-form');

const rowUpdateBtns = document.querySelectorAll('.update-btn');      // all row item update buttons
const rowDeleteBtns = document.querySelectorAll(".delete-btn");      // all row item update buttons

// add event listeners to every row update & delete button rendered to page
// when button is clicked, id variable is updated to button's id
// global id variable is then injected into PUT/POST/DELETE url /api/items/:id
let id; 
rowUpdateBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        id = parseInt(e.target.getAttribute("data-id"));

        // update form inputs to default to the item's current state
        // references data attributes added to html via handlebars
        document.querySelector("#update-modal-label").textContent =  "Update " + e.target.getAttribute("data-name");
        updateItemForm.querySelector('#update-modal-cat').value = e.target.getAttribute("data-cat") || null;
        updateItemForm.querySelector('#update-modal-qty').value = parseInt(e.target.getAttribute("data-qty")) || 0;
        updateItemForm.querySelector('#update-modal-par').value = parseInt(e.target.getAttribute("data-parlvl")) || 0;
        updateItemForm.querySelector('#update-modal-uom').value = e.target.getAttribute("data-uom") || "total";
        updateItemForm.querySelector('#update-modal-exp').value = e.target.getAttribute("data-exp") || null;
    });
});

// DELETE
// completely removes an item from the db
rowDeleteBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        id = parseInt(e.target.getAttribute("data-id"));

        // send a delete request to /api/items/:id
        const deleteUrl = `/api/items/${id}`
        fetch(deleteUrl, {
            method:'DELETE',
        }).then(res=>{
            if(res.ok){
                console.log('SUCCESS');
                location.reload();
            } else {
                console.log('Error');
            }
        });
    })
});

// PUT
// update item data
updateItemBtn.addEventListener('click',  e=> {
    e.preventDefault();

    // collect input data from modal form
    const inputCat = updateItemForm.querySelector('#update-modal-cat').value.trim() || null;
    const inputQty  = updateItemForm.querySelector('#update-modal-qty').value || 0;
    const inputPar = updateItemForm.querySelector('#update-modal-par').value || 0;
    const inputUOM = updateItemForm.querySelector('#update-modal-uom').value.trim()|| "total";
    const inputExp = updateItemForm.querySelector('#update-modal-exp').value || null;      
    const inputSection = updateItemForm.querySelector('#update-modal-section').value;  // current section by dafault

    // build object
    const updateFormObj = {
    type: inputCat,
    quantity: inputQty,
    unit_of_measurement: inputUOM,
    par_level: inputPar,
    exp_date: inputExp,
    section_id: inputSection
    }

    console.log(updateFormObj);

    // id is set by click event attached to row update button   
    const putUrl = `/api/items/${id}`;

    fetch(putUrl, {
        method:'PUT',
        body:JSON.stringify(updateFormObj),
        headers: {
            'Content-Type':'application/json'
        }
    }).then(res=>{
        if(res.ok){
            console.log('SUCCESS');
            location.reload();
        } else {
            console.log('Error');
        }
    });
  });

// POST
// creates a new item in db with given data
addItemBtn.addEventListener('click',  e=> {
  e.preventDefault();

    // collect input data from modal form
    const inputDesc = addItemForm.querySelector('#add-modal-name').value.trim();
    const inputCat = addItemForm.querySelector('#add-modal-cat').value.trim() || "-"; 
    const inputQty  = addItemForm.querySelector('#add-modal-qty').value || 0;
    const inputPar = addItemForm.querySelector('#add-modal-par').value || 0; 
    const inputUOM = addItemForm.querySelector('#add-modal-uom').value.trim() || "total";
    const inputExp = addItemForm.querySelector('#add-modal-exp').value || null;
    const sectionID = parseInt(document.querySelector('#section-head').getAttribute("data-id"));


    if (inputDesc) {
        //build object
        const addFormObj = {
            name: inputDesc,
            type: inputCat,
            quantity: inputQty,
            unit_of_measurement: inputUOM,
            par_level: inputPar,
            exp_date: inputExp,
            section_id: sectionID
            }
        
        const postUrl = `/api/items/`;
    
        console.log(addFormObj);
        console.log(postUrl);
    
        // post request to server to update db
        fetch(postUrl, {
        method:'POST',
        body:JSON.stringify(addFormObj),
        headers: {
            'Content-Type':'application/json'
        }
        }).then(res=>{
            if(res.ok){
                console.log('SUCCESS');
                location.reload();
            } else {
                console.log('Error');
            }
        });
    }
});