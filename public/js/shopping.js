console.log("shopping forms js linked");

const addBtn = document.querySelector('#addbtn');
const shoppingAddModal = document.querySelector('#newShoppingItemForm');

const updateBtn = document.querySelector('#updatebtn');
const shoppingUpdateModal = document.querySelector('#updateShoppingItemForm');

const rowUpdateBtns = document.querySelectorAll('.updateBtn');

// add event listeners to every update button rendered to page
// when button is clicked, id variable is updated to button's id
// global id variable is then injected into PUT url
let id; 
rowUpdateBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    id = btn.id
  })
});

// POST
// creates a new item in db with qty = 0
addBtn.addEventListener('click',  e=> {
  e.preventDefault();
  
  // collect input data from modal form
  const inputName = shoppingAddModal.querySelector('#addModalName').value.trim();
  const inputType = shoppingAddModal.querySelector('#addModalCat').value.trim() || "-";
  const inputUOM = shoppingAddModal.querySelector('#addModalUOM').value.trim() || "-";
  const inputSection = shoppingAddModal.querySelector('#addModalSec').value;

  // save input data into object
  const formObj = {
    name: inputName,
    type: inputType,
    unit_of_measurement: inputUOM,
    section_id: inputSection
  }

  // post request to server to update db
  if (inputName) {
    fetch('/api/items', {
      method:'POST',
      body:JSON.stringify(formObj),
      headers: {
        'Content-Type':'application/json'
      }
    }).then(res=>{
      if(res.ok){
        location.replace('/shopping');
      } else {
        location.reload();
      }
    });
  }
});

// PUT
// update qty and expiration date of a purchased item
updateBtn.addEventListener('click',  e=> {
  e.preventDefault();
  
  // collect input data from modal form
  const inputQty = Math.floor(shoppingUpdateModal.querySelector('#updateModalQty').value);
  const inputExp = shoppingUpdateModal.querySelector('#updateModalExp').value || null;      // null if no date selected

  if (inputQty < 0) {
    inputQty = 0;
  }

  // at least need update qty to submit
  if (inputQty) {

    const formObj = {
      quantity: inputQty,
      exp_date: inputExp,
    }

    // id is set by click event attached to row update button
    fetch(`/api/items/${id}`, {
      method:'PUT',
      body:JSON.stringify(formObj),
      headers: {
        'Content-Type':'application/json'
      }
    }).then(res=>{
      shoppingUpdateModal.querySelector('#updateModalQty').value = null;
      shoppingUpdateModal.querySelector('#updateModalExp').value = null;
      if(res.ok){
        console.log('SUCCESS');
        location.reload();
      } else {
        console.log('Error');
      }
    });
  }
});

// hide row from shopping list
function hideMe(id) {
  var x = document.getElementById(id);
  x.style.display = "none";
}
