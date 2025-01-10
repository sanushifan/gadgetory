function show_coupon() {
    document.querySelector('.coupon_form').style.display='flex'
}

function couponForm(event) {
    event.preventDefault(); 
    let is_valid = true;
    let coupon_code = document.getElementById('coupon_code').value.trim();

    // check if coupon code is empty
    if (coupon_code === '') {
        is_valid = false;

        // Show an error message if coupon code is blank
        iziToast.show({
            title: '<span style="color: #fff;">Please enter a coupon code</span>',
            position: 'topRight',
            backgroundColor: '#e53637',
            timeout: 2000,
        });

        // Highlight the input field
        document.getElementById('coupon_code').style.border = '2px solid #e53637';
    }

    // Proceed only if valid
    if (is_valid) {
        fetch('/coupon_check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ coupon_code }),
        })
        .then(response => response.json())
        .then((data) => {
            if (data.success) {
                // Success toast
                iziToast.show({
                    title: '<span style="color: #fff;">Coupon code is valid!</span>',
                    position: 'topRight',
                    backgroundColor: 'green',
                    timeout: 2000,
                });
                location.reload()
            }

            else if(data.expired){
                iziToast.show({
                    title: '<span style="color: #fff;">Coupon is not valid!</span>',
                    position: 'topRight',
                    backgroundColor: '#e53637',
                    timeout: 2000,
                });
            }
            else {
                // Invalid coupon toast
                iziToast.show({
                    title: '<span style="color: #fff;">Invalid coupon code!</span>',
                    position: 'topRight',
                    backgroundColor: '#e53637',
                    timeout: 2000,
                });
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
    }
}


function apply_address(address) {

            address = JSON.parse(address);
            document.getElementById('fullName').value = address.full_name;
            document.getElementById('phone_number').value = address.phone_number;
            document.getElementById('pincode').value = address.pincode;
            document.getElementById('state').value = address.state;
            document.getElementById('city').value = address.city;
            document.getElementById('house').value = address.house;
            document.getElementById('roadMap').value = address.road_map;
        }

        function form_submit(event) {
            event.preventDefault(); // Prevent the default form submission
            let is_valid =true
            // Collecting form values

            const fullName = document.getElementById('fullName').value.trim();
            const phoneNumber = document.getElementById('phone_number').value.trim();
            const pincode = document.getElementById('pincode').value.trim();
            const state = document.getElementById('state').value.trim();
            const city = document.getElementById('city').value.trim();
            const house = document.getElementById('house').value.trim();
            const roadMap = document.getElementById('roadMap').value.trim();
            const isRazorpayChecked = document.getElementById('razorpay').checked;
            const isCodChecked = document.getElementById('cod').checked;
            
            // let payment_option = document.getElementById('cod')

            document.querySelectorAll('.error-message').forEach(error => error.style.display = 'none');

            // Validate Full Name
            if (fullName === '') {
                document.getElementById('fullNameError').style.display = 'block';
                is_valid = false;
            }
            // Validate Phone Number
            const phonePattern = /^\d{10}$/;
            if (!phoneNumber.match(phonePattern)) {
                document.getElementById('phoneError').style.display = 'block';
                is_valid = false;
            }

            // Validate Pincode
            if (pincode === '' || !/^\d{6}$/.test(pincode)) {
                document.getElementById('pincodeError').style.display = 'block';
                is_valid = false;
            }
            // Validate State
            if (state === '') {
                document.getElementById('stateError').style.display = 'block';
                is_valid = false;
            }
            // Validate City
            if (city === '') {
                document.getElementById('cityError').style.display = 'block';
                is_valid = false;
            }
            // Validate House
            if (house === '') {
                document.getElementById('houseError').style.display = 'block';
                is_valid = false;
            }
            // Validate Road Map
            if (roadMap === '') {
                document.getElementById('roadMapError').style.display = 'block';
                is_valid = false;
            }
            if (!isRazorpayChecked && !isCodChecked) {
                document.getElementById('paymentOptionError').style.display = 'block';
                is_valid = false;
            }
            
            const order_data = {

                full_name: fullName,
                phone_number: phoneNumber,
                pincode: pincode,
                state: state,
                city: city,
                house: house,
                road_map: roadMap,
            };

            const paymentData = {
                address: order_data,
                payment_method: isRazorpayChecked ? 'Razorpay' : 'COD' 
            };
            if (is_valid) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "this will conform your order.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#097c30',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, Conform the Order it!'
                }).then((result) => {


                    if (result.isConfirmed){

                        // if (paymentData.payment_method=='Razorpay') {
                        // }
                        fetch('/confirm_order', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(paymentData),
                        })
                        .then((response)=> response.json())
                        .then((data)=> {
                            if (data && data.success) {
                                if (isRazorpayChecked) {
                                    // Initialize Razorpay payment if the checkbox is checked
                                    initiateRazorpayPayment(data.order_id, data.amount, data.currency);
                                } else {

                                    // Swal.fire({
                                    // icon: 'success',
                                    // title: 'success',
                                    // text: 'order placed successfull ',
                                    // });

                                    window.location.href='/order_success'
                                }
                            } else {

                                Swal.fire({
                                icon: 'failed',
                                title: 'Order Failed',
                                text: `${data.message}`,
                                })
                            }
                            // document.getElementById('addressForm').reset();
                        })
                        .catch((error)=> {
                            console.error('Error submitting address:', error);
                            alert('There was an error submitting the form. Please try again later.');
                        });
                    }
                }).catch((error)=> {
                    console.error('Error submitting address:', error);
                    alert(' Please try again later.');
                });
            }
        }

        
    // Razorpay Payment initiation
    function initiateRazorpayPayment(order_id, amount, currency) {

      const options = {
        key: 'rzp_test_cWpJLYyZQUl2I7',  // Razorpay Key ID
        amount: amount,  // Amount in paise
        currency: currency,
        order_id: order_id,  // Razorpay Order ID
        handler: function (response) {
          // Handle payment success
        //   alert('Payment successful. Payment ID: ' + response.razorpay_payment_id);

          fetch('/cofirm_payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({payment_id :response.razorpay_payment_id , order_id}),
            })
            .then((response)=> response.json())
            .then((data)=> {
                if (data.success) {
                        window.location.href='/order_success'    
                } else {

                        window.location.href='/order_failed'    
                }
            })
            .catch((error)=> {
                console.error('Error submitting address:', error);
                Swal.fire({
                    icon: 'failed',
                    title: 'Payment Failed',
                    text: ' Your Payment is Failed please Try Again ! ',
                    })
            });

        },
        prefill: {
            name: 'John Doe',
            email: 'johndoe@example.com',
            contact: '987654321011',
        },
        theme: {
          color: '#111111'
        }
      };

      const razorpay = new Razorpay(options);
      razorpay.open();  // Open the Razorpay payment window

    }

