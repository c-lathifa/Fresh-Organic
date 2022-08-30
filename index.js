function addGlobalEventListener(type, selector, callback){
    document.addEventListener(type, e => {
        if (e.target.matches(selector)) {
            callback(e)
        }
}
)}
const cartItemWrapper = document.querySelector("[data-cart-items-wrapper]")
const cartButton = document.querySelector("[data-cart-button]")
let mainObj = {}
fetch('./items.json').then(function(response){
    return response.json()
})
.then(function(data){
    mainObj = data
    // console.log(mainObj)
     setUpStore(data)
    }
)
let shoppingCart = []
function setUpStore(data){
    if (itemContainer == null) return
    data.forEach(renderItems)
    addGlobalEventListener("click", "[data-add-to-cart-button]", e =>{
        let id = e.target.closest("[data-store-items]").dataset.dataId
        addToCart(parseInt(id))

    })
    shoppingCart = loadCart()
    renderCartItems()
}
cartButton.addEventListener("click",()=> {
    cartItemWrapper.classList.toggle("invisible")
})

let cartItemTemplate = document.querySelector("#cart-item-template")
let itemContainer = document.querySelector("#item-container")
let template = document.querySelector("#items-template")
let cartContainer = document.querySelector("#cart-container")
let cartTotal = document.querySelector("[cart-total-price]")
let cartQuantity = document.querySelector("[data-cart-quantity")
const SESSION_STORAGE_KEY = 'SHOPPING_CART-cart'
const cartIcon = document.querySelector("[data-cart]")
const purchaseBtn = document.querySelector("[data-purchase]")


function renderItems(data){
    const storeTemplate = template.content.cloneNode(true)
    const storecontainer = storeTemplate.querySelector("[data-store-items]")
    storecontainer.dataset.dataId = data.id

    let name = storeTemplate.querySelector("[data-name]")
    name.innerText = data.name

    let Image = storeTemplate.querySelector("[data-image]")
    Image.src = data.image
    
    let price = storeTemplate.querySelector("[data-price]")
    price.innerText = data.price
    let formatter = new Intl.NumberFormat(undefined, {
        style:"currency",
        currency:"USD"
    })
    price.innerText = formatter.format(data.price / 100)
    itemContainer.append(storeTemplate)
}


function renderCartItems(arr){
    
    const formatter = new Intl.NumberFormat(undefined, {
        style:"currency",
        currency:"USD"
    })
    const totalCents = shoppingCart.reduce((sum, entry) => {
        const data = mainObj.find(i => entry.id === i.id)
        return sum + data.price * entry.quantity
    }, 0)

    cartTotal.innerText = formatter.format(totalCents / 100)
    cartContainer.innerHTML = ''
    shoppingCart.forEach(entry =>{
    const data = mainObj.find(i => entry.id === i.id)
    const cartTemplate = cartItemTemplate.content.cloneNode(true)
    const storecontainer = cartTemplate.querySelector("[data-items]")
    storecontainer.dataset.dataId = data.id
    // console.log(storecontainer)

    let name = cartTemplate.querySelector("[data-name]")
    name.innerText = data.name

    let Image = cartTemplate.querySelector("[data-image]")
    Image.src = data.image

    // let quantity = cartTemplate.querySelector("[data-quantity]")
    let quantity = cartTemplate.querySelector("[data-quantity]")
    quantity.innerText = `x${entry.quantity}`
    
    let price = cartTemplate.querySelector("[data-price]")
    const formatter = new Intl.NumberFormat(undefined, {
        style:"currency",
        currency:"USD"
    })
    price.innerText = formatter.format((data.price * entry.quantity)/ 100)
    cartContainer.append(cartTemplate)
    })
    cartQuantity.innerText = shoppingCart.length
}


function renderCart(){
    if(shoppingCart.length === 0) {
        hideCart()
    }else{
        showCart()
        renderCartItems()
    }
}

function showCart(){
    cartIcon.classList.add("invisible")
}

function hideCart(){
    cartIcon.classList.remove("invisible")
    cartItemWrapper.classList.add("invisible")
}

function addToCart (id){
    const exsistingItem = shoppingCart.find(entry => entry.id === id)

    if(exsistingItem){
        exsistingItem.quantity++
    }else{
        shoppingCart.push({id : id, quantity : 1})
    }
    // console.log(shoppingCart)
    renderCartItems(mainObj)
    savaCart()
}

// let removeCartItem = document.querySelector("[data-remove-from-cart-button]")
document.addEventListener("click", e => {
    if (e.target.matches("[data-remove-from-cart-button]")){
        let id = parseInt(e.target.closest("[data-items]").dataset.dataId)
        removeCartItems(id)
    }
})
function removeCartItems (id){
    const exsistingItem = shoppingCart.find(entry => entry.id === id)
    if (exsistingItem == null) return
    shoppingCart = shoppingCart.filter(entry => entry.id !== id)
    // id.remove()
    renderCartItems()
    savaCart()
}
function savaCart(){
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(shoppingCart))
}
function loadCart(){
    const cart = sessionStorage.getItem(SESSION_STORAGE_KEY)
    return JSON.parse(cart) || []
}


purchaseBtn.addEventListener("click", () => {
  hideCart()
    alert("Successful Purchase. Thank you for shopping at Fresh&Organic")
    window.location.href = "./index.html"
})
