
// Function to enable editing mode
function enableEditing() {
    // Enable all form fields in the personal info section
    document.querySelectorAll('#personalInfoForm input').forEach(input => input.disabled = false);
    document.querySelector('#personalInfoForm #email').disabled = true

    // Show the password section and the save buttons for both forms
    document.getElementById('passwordSection').style.display = 'block';
    document.getElementById('savePersonalBtn').style.display = 'inline-block';
    document.getElementById('cancelPersonalBtn').style.display = 'inline-block';
    document.getElementById('savePasswordBtn').style.display = 'inline-block';

    // Hide the "Edit" button
    document.getElementById('editButton').style.display = 'none';
}

// Function to cancel editing for a section
function cancelEdit(section) {
    if (section === 'personal') {
        // Reset and disable personal info form
        document.getElementById('personalInfoForm').reset();
        document.querySelectorAll('#personalInfoForm input').forEach(input => input.disabled = true);
        document.getElementById('savePersonalBtn').style.display = 'none';
        document.getElementById('cancelPersonalBtn').style.display = 'none';

    } else {
        // Reset password form
        document.getElementById('passwordForm').reset();
    }
    // Hide the password section and save button after cancel
    document.getElementById('passwordSection').style.display = 'none';
    document.getElementById('savePasswordBtn').style.display = 'none';

    // Show the "Edit" button again
    document.getElementById('editButton').style.display = 'inline-block';
}

// Handle form submission for personal info form
document.getElementById('personalInfoForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let is_valid = true;
      
    const first_name = document.getElementById('firstName').value.trim();
    const last_name = document.getElementById('lastName').value.trim();
    const phno_number = document.getElementById('phone').value.trim();

    // Clear previous error messages
    document.getElementById('first_name_error').style.display = 'none';
    document.getElementById('last_name_error').style.display = 'none';
    document.getElementById('phone_error').style.display = 'none';
    
    // Validate First name
    if (first_name == '') {
        document.getElementById('first_name_error').style.display = 'block';
        is_valid = false;
    }

    // Validate Last name
    if (last_name === '') {
        document.getElementById('last_name_error').style.display = 'block';
        is_valid = false;
    }

    // Validate Phone number
    const phonePattern = /^\d{10}$/;
    if (!phno_number.match(phonePattern)) {
        document.getElementById('phone_error').style.display = 'block';
        is_valid=false
    }
    
    if (is_valid) {
        // alert('Personal information changes saved successfully!');
        // cancelEdit('personal'); // Reset the form and hide editable state

        fetch("/edit_user_detail", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ first_name,last_name,phno_number })
        })

        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                Swal.fire({
                    title: 'Changes Saved!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
                
            }else{
                Swal.fire({
                    title: 'Error!',
                    text: 'Something went wrong.',
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                })
            }
        })
        .catch( (error)=>{
        console.error("Error:", error);
        });
    }

});

// Handle form submission for password form
document.getElementById('passwordForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let is_valid = true;
      
    const current_password = document.getElementById('current_password').value.trim();
    const new_password = document.getElementById('new_password').value.trim();
    const confirm_password = document.getElementById('confirm_password').value.trim();

    // Clear previous error messages
    document.getElementById('current_password_error').style.display = 'none';
    document.getElementById('new_password_error').style.display = 'none';
    document.getElementById('confirm_password_error').style.display = 'none';
    
    // Validate current_password 
    if (current_password == '') {
        document.getElementById('current_password_error').style.display = 'block';
        is_valid = false;
    }

    // Validate  new_password
    if (new_password === '' || new_password.length < 8) {
        document.getElementById('new_password_error').style.display = 'block';
        is_valid = false;
    }

    // Validate confirm_password
    if (confirm_password === ''|| confirm_password.length < 8) {
        document.getElementById('confirm_password_error').style.display = 'block';
        is_valid = false;
    }
    if (new_password !== confirm_password) {
        document.getElementById('not_match_error').style.display = 'block';
        is_valid = false;
    }
    if (is_valid) {
        fetch("/reset_password", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ current_password,new_password,confirm_password})
        })

        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                Swal.fire({
                    title: 'Chenged!',
                    text: 'Password chenged Successfully!.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
                cancelEdit('password');
            }else{
                Swal.fire({
                    title: 'Error!',
                    text: 'current Password is Wrong.',
                    icon: 'error',
                    confirmButtonText: 'Try Again'

                })
            }
        })
        .catch( (error)=>{
        console.error("Error:", error);
        });
    }

});


// address session

    //address book


        function add_address() {
            document.getElementById('address_add_box').style.display = 'flex';
        }
        
        function close_address() {
            document.getElementById('addressForm').reset()
            document.getElementById('editAddressForm').reset()
            document.getElementById('address_edit_box').style.display = 'none';
            document.getElementById('address_add_box').style.display = 'none';
            window.location.reload()
        }
        
        document.getElementById('addressForm').addEventListener('submit', function (event) {
            event.preventDefault();

            let is_valid = true;

            // Get form values
            const fullName = document.getElementById('fullName').value.trim();
            const phoneNumber = document.getElementById('phone_number').value.trim();
            const pincode = document.getElementById('pincode').value.trim();
            const state = document.getElementById('state').value;
            const city = document.getElementById('city').value.trim();
            const house = document.getElementById('house').value.trim();
            const roadMap = document.getElementById('roadMap').value.trim();

            // Clear previous error messages
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

            if (is_valid) {
                // Construct the payload
                const address_data = {
                    full_name:fullName,
                    phone_number:phoneNumber,
                    pincode,
                    state,
                    city,
                    house,
                    road_map:roadMap,
                };
                // alert('hhoooo')
                fetch("/add_address", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(address_data)
                })
                .then(response => response.json())
                .then(data => {
                if (data.success) {
                    Swal.fire(
                        'Saved!',
                        'The address Saved Successfully.',
                        'success'
                    ).then((result) => {
                        if (result.isConfirmed) {

                            close_address()
                        }
                    });    
                } else {
                    Swal.fire(
                        'Failed!',
                        'The address adding Failed .',
                        'Failed'
                    ).then((result) => {
                            if (result.isConfirmed) {
                                // Reload the page if the OK button is clicked
                                location.reload();
                            }
                    });  
                }
                })
                .catch(error => {
                console.error("Error:", error);
                });
            }
        });
    
    // deleting the address
        function delete_address(id) {
            Swal.fire({
                title: 'Are you sure?',
                text: "This action will delete the address permanently.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Proceed with deletion (e.g., send a request to your server)
                    fetch(`/delete_address/${id}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire(
                                'Deleted!',
                                'The address has been deleted.',
                                'success'
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    // Reload the page if the OK button is clicked
                                    location.reload();
                                }
                            });  
                        } else {
                            Swal.fire(
                                'Error!',
                                'There was a problem deleting the address.',
                                'error'
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    // Reload the page if the OK button is clicked
                                    location.reload();
                                }
                            });  
                        }
                    })
                    .catch(error => {
                        Swal.fire('Error!', 'Something went wrong.', 'error');
                        console.error("Error:", error);
                    });
                }
            });
        }
        function edit_address(address) {
            address = JSON.parse(address)
            
            document.getElementById('fullName1').value= address.full_name
            document.getElementById('phone_number1').value= address.phone_number
            document.getElementById('pincode1').value= address.pincode
            document.getElementById('state1').value = `Delhi`
            document.getElementById('city1').value= address.city
            document.getElementById('house1').value= address.house
            document.getElementById('roadMap1').value= address.road_map

            document.getElementById('address_edit_box').style.display = 'flex';

            document.getElementById('editAddressForm').addEventListener('submit', function (event) {
                event.preventDefault();
                let is_valid = true;

                // Get form values
                const fullName = document.getElementById('fullName1').value.trim();
                const phoneNumber = document.getElementById('phone_number1').value.trim();
                const pincode = document.getElementById('pincode1').value.trim();
                const state = document.getElementById('state1').value;
                const city = document.getElementById('city1').value.trim();
                const house = document.getElementById('house1').value.trim();
                const roadMap = document.getElementById('roadMap1').value.trim();

                // Clear previous error messages
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

                if (is_valid) {
                    // Construct the payload
                    const address_data = {
                        id:address._id,
                        full_name:fullName,
                        phone_number:phoneNumber,
                        pincode,
                        state,
                        city,
                        house,
                        road_map:roadMap,
                    };
                    // alert('hhoooo')
                    fetch("/edit_address", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(address_data)
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                                    Swal.fire(
                                        'Edit Saved!',
                                        'The Edited address Saved Successful.',
                                        'success'
                                    ).then((result) => {
                                        if (result.isConfirmed) {
                                            // Reload the page if the OK button is clicked
                                            location.reload();
                                        }
                                    });  
                        } else {
                            Swal.fire(
                                        'Failed!',
                                        'The address adding Failed .',
                                        'Failed'
                                    ).then((result) => {
                                        if (result.isConfirmed) {
                                            // Reload the page if the OK button is clicked
                                            location.reload();
                                        }
                                    });  
                        }
                    })
                    .catch(error => {
                        console.error("Error:", error);
                    });
                }
            });
        }

