


function checkout_btn(data) {

    if (data =='') {
        Swal.fire({
                    icon: 'error',
                    title: 'nothing in Cart',
                    text: 'At Least Add One Product in Cart',
                });
    }else{
        window.location.href='/checkout'
    }
    
}


function change_quantity(product_id, change) {
    const quantityInput = document.querySelector(`[data-product-id="${product_id}"]`);
    let quantity = parseInt(quantityInput.value);

    quantity += change;

    if (quantity < 1) {
        quantity = 1;
    }

    // Update the input value
    quantityInput.value = quantity;

    // Update the total price
    update_cart();
}

function update_cart(event) {
    // Prevent default form submission if the event is from a form
    if (event) event.preventDefault();

    let totalAmount = 0;

    // Loop through each product to update totals
    document.querySelectorAll('.product_qty').forEach(input => {
        const quantity = parseInt(input.value);
        const product_id = input.dataset.productId;
        const productRow = input.closest('tr');
        const offerPrice = parseFloat(productRow.querySelector('h5').textContent.replace('₹', ''));
        const totalCell = productRow.querySelector('.cart__price');

        // Calculate the new total for this product
        const productTotal = quantity * offerPrice;
        totalCell.textContent = `₹${productTotal.toFixed(2)}/-`;

        // Update the subtotal (grand total)
        totalAmount += productTotal;

        fetch('/add_to_cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({product_id,quantity}),
        })
                .then(response => response.json())
        .then((data) => {
            if (data.success) {
                console.log('quantity changed');
             }
        })
        .catch((error) => {
            console.error('Error:', error);

            // Network/Error toast
            iziToast.show({
                title: '<span style="color: #fff;">An unexpected error occurred in coupon.</span>',
                position: 'topRight',
                backgroundColor: '#e53637',
                timeout: 2000,
            });
        });
    });
    
    // Update the subtotal and total
    document.getElementById('subtotal').textContent = `₹${totalAmount.toFixed(2)}`;
    update_total();
}

function update_total() {
    let subtotal = parseFloat(document.getElementById('subtotal').textContent.replace('₹', ''));
    let discount = 0
    let totalAmount = subtotal - discount;

    // Display updated total
    document.getElementById('total_Amount').textContent = `₹${totalAmount.toFixed(2)}`;
}


function delete_cart_product(product_id) {
    fetch(`/delete_cart/${product_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove the product row from the DOM
            const productRow = document.querySelector(`[data-product-id="${product_id}"]`).closest('tr');
            productRow.remove();
            // Update the subtotal dynamically
            update_cart()
            // Swal.fire({
            //     icon: 'success',
            //     title: 'Product removed from cart!',
            //     text: data.message
            // });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message,
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to remove product.',
        });
    });
}