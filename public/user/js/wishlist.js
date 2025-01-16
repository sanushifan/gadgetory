function remove_product(productId) {
  if (productId) {
    fetch(`/remove_from_wishlist?id=${productId}`, { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        fetchWishlist();
      })
      .catch((error) => {
        Swal.fire(
            'Error!',
            `There was a problem in removing .`,
            'error'
        );
        console.error(error);
      });
  } else {
    alert("server Error");
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

async function fetchWishlist() {
    const response = await fetch(`/fetch_wishlist`);
    const wishlist = await response.json();
    const wishlistContainer = document.getElementById("wishlist");

     wishlistContainer.innerHTML = "";

    
    
    wishlist.products.forEach((product) => {
        console.log(product.product_id.images[0]);
        let image_url = `assets/uploads/${product.product_id.images[0]}`
        let rated_star = `<span class="rating-star filled" >&#9733;</span>`
        let unrated_star = `<span class="rating-star" >&#9734;</span>`
        let ratings =''
        for (let i = 0; i < 5; i++) {
            if (i <= Math.floor(product.product_id.rating)) {
            ratings +=rated_star
            }else{
            ratings +=unrated_star
            }   
        }
        wishlistContainer.innerHTML +=  ` 
            <div class="col-lg-3 col-md-6 col-sm-6 col-md-6 col-sm-6 mix new-arrivals" >
            <div class="product__item">
            
            <div class="product__item__pic set-bg" onclick="location.href='/product_details?id=${product.product_id._id}'"data-setbg="${image_url}" loading="lazy">
                <ul class="product__hover">
                    <li>
                      <div onclick="add_to_wishlist(event,'${product.product_id._id}')">
                        <svg  width="23px" height="23px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z" stroke="#444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                      </div>
                    </li>
            </ul>
            </div>
            <div class="product__item__text">
                <h6>${product.product_id.product_name}</h6> 
                <a href="#" class="add-cart" onclick="add_to_cart(event,'${product.product_id._id}',qty=1)" data-id="${product.product_id._id}">+ Add To Cart</a> 
                           
                <div class="rating-container">
                    ${ratings}
                </div>

                <div style="display: flex; ">
                    <h5>₹${product.product_id.offer_price}</h5>
                    <h6 style="padding-left: 5px; color: red;"><del> ₹${product.product_id.price}/</del></h6>
                </div>
                <button class="remove-btn" onclick="remove_product('${ product.product_id._id }')">Remove</button>

            </div>
          </div>
      </div> `

    });
    
    applyBackgroundImages();

  }
  let original =`
    
                <!-- <div class="col-lg-3 col-md-6 col-sm-6 col-md-6 col-sm-6 mix new-arrivals" >
                    <div class="product__item" >
                        <div class="product__item__pic set-bg" onclick="location.href='/product_details?id=<%=x.product_id._id%>'" data-setbg="assets/uploads/<%=x.product_id.images[0]%>">
                            <ul class="product__hover">
                                <li><div onclick="add_to_wishlist(event,'<%=x.product_id._id%>')"><img src="user/img/icon/heart.png" alt=""></div></li>
                            </ul>
                        </div>
                        <div class="product__item__text">
                            <h6><%=x.product_id.product_name%></h6>
                            <a href="#"  class="add-cart" onclick="add_to_cart(event,'<%=x.product_id._id%>',qty=1)" data-id="<%=x.product_id._id%>">+ Add To Cart</a>
                            <div class="rating">
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                            </div>
                            <div class="d-flex justify-content-between ">
                                <div class="d-flex pt-2">
                                    <h5>₹<%=x.product_id.offer_price%></h5>
                                    <h6 style="padding-left: 5px; color: #eb2525;"><del> ₹<%=x.product_id.price%>/</del></h6>
    
                                </div>
                                <button class="remove-btn" onclick="remove_product('<%= x.product_id._id %>')">Remove</button>
    
                            </div>
                        </div>
                    </div>
                </div> -->  `



  // Fetch wishlist on page load
    fetchWishlist();
