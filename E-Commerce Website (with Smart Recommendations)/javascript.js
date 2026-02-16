const products = [
    {id:1, name:"Smartphone", price:12999, img:"https://picsum.photos/200?1"},
    {id:2, name:"Headphones", price:1999, img:"https://picsum.photos/200?2"},
    {id:3, name:"Laptop", price:55999, img:"https://picsum.photos/200?3"},
    {id:4, name:"Shoes", price:2999, img:"https://picsum.photos/200?4"},
    {id:5, name:"Watch", price:2499, img:"https://picsum.photos/200?5"},
    {id:6, name:"Backpack", price:1499, img:"https://picsum.photos/200?6"}
];

let cart = 0;
const list = document.getElementById("product-list");

products.forEach(product=>{
    const div = document.createElement("div");
    div.classList.add("product");

    div.innerHTML = `
        <img src="${product.img}">
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <button onclick="addToCart()">Add to Cart</button>
    `;

    list.appendChild(div);
});

function addToCart(){
    cart++;
    document.getElementById("cart-count").innerText = cart;
}

/* Banner slider */
let banner = document.getElementById("banner-img");
let i = 1;

setInterval(()=>{
    i++;
    banner.src = `https://picsum.photos/1200/400?random=${i}`;
},3000);
