
function quick_sort() {
  const sortOption = document.getElementById("sort-options").value;
  // alert(sortOption);

  fetch(`/quick_sort?criteria=${sortOption}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      updateProductList(data); // Update the products on the page
    })
    .catch((error) => console.error("Error fetching sorted data:", error));
}

function category_filter(id) {  
    if (id) {
      window.location.href = `/shop?category=${id}`;
    }
  }

function applyBackgroundImages() {
  document.querySelectorAll(".set-bg").forEach((element) => {
    const bg = element.getAttribute("data-setbg");
    if (bg) {
      element.style.backgroundImage = `url(${bg})`;
    }
  });
}

// Function to dynamically update product list
function updateProductList(products) {;
  const productList = document.getElementById("product-list");
  productList.innerHTML = ""; // Clear current products

  products.forEach((product) => {
    // console.log(product.images[0]);
    let rated_star = `<span class="rating-star filled" >&#9733;</span>`
    let unrated_star = `<span class="rating-star" >&#9734;</span>`
    let ratings =''
      for (let i = 0; i < 5; i++) {
        if (i <= Math.floor(product.rating)) {
          ratings +=rated_star
        }else{
          ratings +=unrated_star
        }   
      }

    const productItem = `
                              <div class="col-lg-4 col-md-6 col-sm-6">
                                  <div class="product__item">
                                    
                                    <div class="product__item__pic set-bg" onclick="location.href='/product_details?id=${product._id}'"data-setbg="assets/uploads/${product.images[0]}">
                                        <ul class="product__hover">
                                            <li>
                                              <div onclick="add_to_wishlist(event,'${product._id}')">
                                                <svg  width="23px" height="23px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z" stroke="#444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                              </div>
                                            </li>
                                    </ul>
                                    </div>
                                    <div class="product__item__text">
                                        <h6>${product.product_name}</h6> 
                                        <a href="#" class="add-cart" onclick="add_to_cart(event,'${product._id}',qty=1)" data-id="${product._id}">+ Add To Cart</a> 
                                                   
                                        
                                        <div class="rating-container">
                                            ${ratings}
                                        </div>


                                        <div style="display: flex; ">
                                            <h5>₹${product.offer_price}</h5>
                                            <h6 style="padding-left: 5px; color: red;"><del> ₹${product.price}/</del></h6>
                                        </div>
                                    </div>
                                  </div>
                              </div>`

    productList.insertAdjacentHTML("beforeend", productItem);
  });
  applyBackgroundImages();
}
