function get_badge_counts() {
    return fetch('/get_badge_counts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error:', error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    let wishlist = document.getElementById('wishlist_badge')
    let cart = document.getElementById('cart_badge')
    get_badge_counts().then(data => {
        if (data) {
            if(data.wishlist_count>0){
                wishlist.style.display='flex'
                wishlist.textContent=data.wishlist_count
            }
            if(data.cart_count>0){
                cart.style.display='flex'
                cart.textContent=data.cart_count
            }
            
        }
    });
});
