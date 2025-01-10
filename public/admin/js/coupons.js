
function inactivate_coupon(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "This Action will inactivate the Coupon",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, Do it!'
    }).then((result)=>{
        if (result.isConfirmed) {

            fetch('/admin/inactivate_coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id}),
            })
            .then(response => response.json())
            .then((data) => {
                if (data.success) {
                    Swal.fire(
                            `success`,
                            `Coupon inactivate Successfully.`,
                            'success'
                        ).then((result)=>{
                            if (result.isConfirmed) {
                                location.href='/admin/coupons'
                            }
                        })
                        
                } else {
                    Swal.fire(
                            `failed`,
                            `Coupon inactivated Failed Please try again~!.`,
                            'failed',
                        );
                }
            })
            .catch((error) => {
                alert('An error occurred: ' + error);
            });
        }
    })
}

function couponForm(event) {
    event.preventDefault();  // Prevent form submission

    let is_valid = true;

    // Clear all error messages
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.style.display = 'none');

    const coupon_code = document.getElementById('coupon_code').value.trim();
    const discount = document.getElementById('discount').value.trim();
    const expiry_date = document.getElementById('expiry_date').value.trim();
    const count = document.getElementById('count').value.trim();
    const min_purchase_value = document.getElementById('minPurchaseValue').value.trim();
    
    // Validation checks
    const regex = /^[a-zA-Z0-9]+$/; 
    if (coupon_code === '') {
        let error = document.getElementById('coupon_code_error')
        error.style.display = 'block';
        is_valid = false;

    }else if(!regex.test(coupon_code)){   
        let error = document.getElementById('coupon_code_error')
        error.style.display = 'block';
        error.innerText = 'Only allows alphabets and numbers'
        is_valid = false;

    }else if(coupon_code.length !== 8) {
        let error = document.getElementById('coupon_code_error')
        error.style.display = 'block';
        error.innerText = '8 charecters are required'
        is_valid = false;
    }else{

    }

    if (discount === '') {
        document.getElementById('discount_error').style.display = 'block';
        is_valid = false;
    }   


    let today = new Date()
    const check_date = Math.floor((today - new Date(expiry_date)) / (1000 * 60 * 60 * 24));
    if (check_date > 0) {
        document.getElementById('expiry_date_error').style.display = 'block';
        document.getElementById('expiry_date_error').innerText = 'the date is already expired'
        is_valid = false;
    }
    if (expiry_date === '') {
        document.getElementById('expiry_date_error').style.display = 'block';
        is_valid = false;
    }
    if ( expiry_date.length !== 10) {
        document.getElementById('expiry_date_error').style.display = 'block';
        document.getElementById('expiry_date_error').innerText = 'date formalt is wrong'
        is_valid = false;
    }
    if (today === expiry_date ) {
        document.getElementById('expiry_date_error').style.display = 'block';
        document.getElementById('expiry_date_error').innerText = 'date is already expired'
        is_valid = false;
    }
    

    
    if (count === '') {
        document.getElementById('count_error').style.display = 'block';
        is_valid = false;
    }
    if (min_purchase_value === '') {
        document.getElementById('minPurchaseValue_error').style.display = 'block';
        is_valid = false;
    }

    // If validation passes, send the data
    if (is_valid) {
        const data = {
            coupon_code,
            discount,
            expiry_date,
            count,
            min_purchase_value
        };

        // Send the data to the server using fetch
        fetch('/admin/add_coupon', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then((data) => {
            if (data.success) {
                Swal.fire(
                        `success`,
                        `Coupon created Successfully.`,
                        'success'
                    ).then((result)=>{
                        if (result.isConfirmed) {
                            location.href='/admin/coupons'
                        }
                    })
                    
            } else {
                Swal.fire(
                        `failed`,
                        `Coupon created Failed Please try again~!.`,
                        'failed',
                    );
            }
        })
        .catch((error) => {
            alert('An error occurred: ' + error);
        });
    }
}
