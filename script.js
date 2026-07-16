var hamburger = document.querySelector(".hamburger");
var mobileMenu = document.querySelector("#mobileMenu");
var cart = document.querySelector("#cart");
var cartBtn = document.querySelector("#cartBtn");
var closeCart = document.querySelector("#closeCart");
var cartItems = document.querySelector("#cartItems");
var total = document.querySelector("#total");
var cartCount = document.querySelector("#cartCount");
var signBtn = document.querySelector("#signBtn");
var signInBox = document.querySelector("#signInBox");
var closeSignIn = document.querySelector("#closeSignIn");
var signInForm = document.querySelector("#signInForm");
var searchBtn = document.querySelector("#searchBtn");

var items = JSON.parse(localStorage.getItem("ecoCart")) || [];
var activeCat = "all";

var products = [
  { name: "Essential Tee", price: 24.99, cat: "tshirts", colours: ["Black", "White", "Grey"], image: "images/Essential Tee.jpg" },
  { name: "Oversized Signature Tee", price: 29.99, cat: "tshirts", colours: ["Black", "Sand", "Forest Green"], image: "images/Oversized Signature Tee.jpg" },
  { name: "Classic Pullover Hoodie", price: 54.99, cat: "hoodies", colours: ["Black", "Grey", "Navy"], image: "images/Classic Pullover Hoodie.jpg" },
  { name: "Heritage Polo Shirt", price: 34.99, cat: "other", colours: ["White", "Navy", "Sage"], image: "images/Heritage Polo Shirt.jpg" },
  { name: "Urban Cargo Trousers", price: 59.99, cat: "trousers", colours: ["Black", "Khaki", "Olive"], image: "images/Urban Cargo Trousers.jpg" },
  { name: "Core Jeans", price: 64.99, cat: "trousers", colours: ["Blue", "Black", "Grey"], image: "images/Core Jeans.jpg" },
  { name: "Everyday Joggers", price: 44.99, cat: "trousers", colours: ["Black", "Grey", "Cream"], image: "images/Everyday Joggers.jpg" },
  { name: "Summer Chino Shorts", price: 39.99, cat: "other", colours: ["Beige", "Black", "Khaki"], image: "images/Summer Chino Shorts.jpg" }
];

function getColour(colour) {
  if (colour === "Black") return "#111111";
  if (colour === "White") return "#ffffff";
  if (colour === "Grey") return "#999999";
  if (colour === "Sand") return "#d6c2a1";
  if (colour === "Forest Green") return "#1f5c3b";
  if (colour === "Navy") return "#1b2f5b";
  if (colour === "Sage") return "#9caf88";
  if (colour === "Khaki") return "#b6a46f";
  if (colour === "Olive") return "#6b7b3e";
  if (colour === "Blue") return "#3d6fb6";
  if (colour === "Cream") return "#f4ead2";
  if (colour === "Beige") return "#d8c7a3";
  return "#42d79f";
}

function openNavigationSearch() {
  if (document.querySelector("#navigationSearch")) {
    document.querySelector("#navigationSearch").focus();
    return;
  }

  var searchForm = document.createElement("form");

  searchForm.className = "navigation-search";
  searchForm.innerHTML =
    "<input id='navigationSearch' type='search' placeholder='Search products...' aria-label='Search products'>" +
    "<button type='submit'>Go</button>" +
    "<button class='close-search' type='button'>×</button>";

  document.body.appendChild(searchForm);

  var input = document.querySelector("#navigationSearch");
  input.focus();

  searchForm.onsubmit = function (event) {
    event.preventDefault();

    if (input.value.trim() !== "") {
      window.location.href = "products.html?search=" + encodeURIComponent(input.value.trim());
    } else {
      window.location.href = "products.html";
    }
  };

  document.querySelector(".close-search").onclick = function () {
    searchForm.remove();
  };
}

if (searchBtn) {
  searchBtn.onclick = openNavigationSearch;
}

if (hamburger) {
  hamburger.onclick = function () {
    mobileMenu.classList.toggle("open");
  };
}

if (cartBtn) {
  cartBtn.onclick = function () {
    cart.classList.add("open");
  };
}

if (closeCart) {
  closeCart.onclick = function () {
    cart.classList.remove("open");
  };
}

if (signBtn) {
  signBtn.onclick = function () {
    signInBox.classList.add("open");
  };
}

if (closeSignIn) {
  closeSignIn.onclick = function () {
    signInBox.classList.remove("open");
  };
}

if (signInForm) {
  signInForm.onsubmit = function (event) {
    event.preventDefault();
    document.querySelector("#signInMsg").textContent = "You have signed in successfully.";
    signInForm.reset();
  };
}

function updateCart() {
  var sum = 0;
  var output = "";

  for (var i = 0; i < items.length; i++) {
    sum += items[i].price;

    output += "<div class='cart-row'>";
    output += "<span>" + items[i].name + "<br>";
    output += "Colour: " + (items[i].colour || "Not selected");
    output += " — Size: " + (items[i].size || "Not selected") + "</span><br>";
    output += "<b>&pound;" + items[i].price.toFixed(2) + "</b><br>";
    output += "<button onclick='removeItem(" + i + ")'>Remove</button>";
    output += "</div>";
  }

  if (items.length === 0) {
    output = "<p>Your cart is empty.</p>";
  }

  cartItems.innerHTML = output;
  total.innerHTML = "Total: &pound;" + sum.toFixed(2);
  cartCount.textContent = items.length;

  localStorage.setItem("ecoCart", JSON.stringify(items));
}

function removeItem(number) {
  items.splice(number, 1);
  updateCart();
}

function addCartButtons() {
  var buttons = document.querySelectorAll(".add");

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
      var card = this.closest(".shop-card, .card");
      var selectedSize = card.querySelector(".size-btn.selected");
      var selectedColour = card.querySelector(".colour-dot.selected");

      if (card.classList.contains("shop-card") && !selectedColour) {
        alert("Please choose a colour before adding this item to your cart.");
        return;
      }

      if (card.classList.contains("shop-card") && !selectedSize) {
        alert("Please choose a size before adding this item to your cart.");
        return;
      }

      items.push({
        name: this.getAttribute("data-name"),
        price: Number(this.getAttribute("data-price")),
        colour: selectedColour ? selectedColour.getAttribute("data-colour") : "Not selected",
        size: selectedSize ? selectedSize.getAttribute("data-size") : "Not selected"
      });

      updateCart();
      cart.classList.add("open");
    };
  }
}

function addChoiceButtons() {
  var choiceButtons = document.querySelectorAll(".size-btn, .colour-dot");

  for (var i = 0; i < choiceButtons.length; i++) {
    choiceButtons[i].onclick = function () {
      var selector;

      if (this.classList.contains("size-btn")) {
        selector = ".size-btn";
      } else {
        selector = ".colour-dot";
      }

      var choices = this.parentElement.querySelectorAll(selector);

      for (var j = 0; j < choices.length; j++) {
        choices[j].classList.remove("selected");
      }

      this.classList.add("selected");
    };
  }
}

function renderProducts() {
  var grid = document.querySelector("#productGrid");

  if (!grid) {
    return;
  }

  var search = document.querySelector("#searchInput").value.toLowerCase();
  var sort = document.querySelector("#sortProducts").value;
  var list = products.slice();

  if (activeCat !== "all") {
    list = list.filter(function (product) {
      return product.cat === activeCat;
    });
  }

  if (search !== "") {
    list = list.filter(function (product) {
      return product.name.toLowerCase().includes(search);
    });
  }

  if (sort === "low") {
    list.sort(function (a, b) {
      return a.price - b.price;
    });
  }

  if (sort === "high") {
    list.sort(function (a, b) {
      return b.price - a.price;
    });
  }

  if (sort === "az") {
    list.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  var output = "";

  if (list.length === 0) {
    output = "<p>No products found. Try another search.</p>";
  }

  for (var j = 0; j < list.length; j++) {
    output += "<article class='shop-card'>";
    output += "<div class='image-box'>";
    output += "<img class='product-img' src='" + list[j].image + "' alt='" + list[j].name + "'>";
    output += "</div>";
    output += "<div class='shop-info'>";
    output += "<h2>" + list[j].name + "</h2>";
    output += "<p>&pound;" + list[j].price.toFixed(2) + "</p>";

    output += "<p><strong>Choose a colour:</strong></p>";
    output += "<div class='colour-row'>";

    for (var k = 0; k < list[j].colours.length; k++) {
      output += "<button class='colour-dot' type='button' ";
      output += "data-colour='" + list[j].colours[k] + "' ";
      output += "title='" + list[j].colours[k] + "' ";
      output += "aria-label='" + list[j].colours[k] + "' ";
      output += "style='background:" + getColour(list[j].colours[k]) + "'></button>";
    }

    output += "</div>";

    output += "<p><strong>Choose a size:</strong></p>";
    output += "<div class='size-row'>";
    output += "<button class='size-btn' type='button' data-size='XS'>XS</button>";
    output += "<button class='size-btn' type='button' data-size='S'>S</button>";
    output += "<button class='size-btn' type='button' data-size='M'>M</button>";
    output += "<button class='size-btn' type='button' data-size='L'>L</button>";
    output += "<button class='size-btn' type='button' data-size='XL'>XL</button>";
    output += "<button class='size-btn' type='button' data-size='XXL'>XXL</button>";
    output += "</div>";

    output += "<button class='add' type='button' ";
    output += "data-name='" + list[j].name + "' ";
    output += "data-price='" + list[j].price + "'>Add to Cart</button>";

    output += "</div>";
    output += "</article>";
  }

  grid.innerHTML = output;

  addChoiceButtons();
  addCartButtons();
}

var categoryButtons = document.querySelectorAll(".category");

for (var i = 0; i < categoryButtons.length; i++) {
  categoryButtons[i].onclick = function () {
    for (var j = 0; j < categoryButtons.length; j++) {
      categoryButtons[j].classList.remove("active");
    }

    this.classList.add("active");
    activeCat = this.getAttribute("data-category");

    renderProducts();
  };
}

var sortBox = document.querySelector("#sortProducts");

if (sortBox) {
  sortBox.onchange = renderProducts;
}

var searchBox = document.querySelector("#searchInput");

if (searchBox) {
  var urlSearch = new URLSearchParams(window.location.search).get("search");

  if (urlSearch) {
    searchBox.value = urlSearch;
  }

  searchBox.oninput = renderProducts;
}

var filterBtn = document.querySelector("#filterBtn");

if (filterBtn) {
  filterBtn.onclick = function () {
    document.querySelector("#filterPanel").classList.toggle("open");
  };
}

var contactForm = document.querySelector("#contactForm");

if (contactForm) {
  contactForm.onsubmit = function (event) {
    event.preventDefault();
    document.querySelector("#formMsg").textContent = "Thank you, your message has been sent.";
    contactForm.reset();
  };
}

updateCart();
addCartButtons();
renderProducts();