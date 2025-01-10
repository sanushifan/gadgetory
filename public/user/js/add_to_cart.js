function add_to_cart (event,id,qty) {
    event.preventDefault(); 

    const productId = id

    fetch('/add_to_cart', {
        method: 'POST',
        headers: {
'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: productId ,quantity:qty})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Added to Cart',
                text: 'Your product has been added to the cart!',
            });
        } else {
            window.location.href = data.redirect_url;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong. Please try again.',
        });
    });
};
