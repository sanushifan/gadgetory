
function delete_category(id,is_deleted) {
    if(is_deleted){
        Swal.fire({
            title: 'Are you sure?',
            text: "This Action will delete the Category",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Do it!'
        }).then((result)=>{
            if (result.isConfirmed) {
    
                fetch('/admin/delete_category', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({id,is_deleted}),
                })
                .then(response => response.json())
                .then((data) => {
                    if (data.success) {
                        Swal.fire(
                                `success`,
                                `Category deleted Successfully.`,
                                'success'
                                
                            ).then((result)=>{
                                if (result.isConfirmed) {
                                    window.location.reload()
                                }
                            })
                            
                    } else {
                        Swal.fire(
                                `failed`,
                                `Category deletion Failed Please try again~!.`,
                                'failed',
                            );
                    }
                })
                .catch((error) => {
                    alert('An error occurred: ' + error);
                });
            }
        })
    }else{
        fetch('/admin/delete_category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id,is_deleted}),
        })
        .then(response => response.json())
        .then((data) => {
            if (data.success) {
                Swal.fire(
                        `success`,
                        `Category Restored Successfully.`,
                        'success'
                        
                    ).then((result)=>{
                        if (result.isConfirmed) {
                            window.location.reload()
                        }
                    })
            } else {
                Swal.fire(
                        `failed`,
                        `Category Restore Failed Please try again~!.`,
                        'failed',
                    );
            }
        })
        .catch((error) => {
            alert('An error occurred: ' + error);
        });
    }
    
}


function categoryForm(event) {
    event.preventDefault();  // Prevent form submission
    let is_valid = true;

    // Clear all error messages
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.style.display = 'none');

    const category_name = document.getElementById('category_name').value.trim();
    const category_offer = document.getElementById('category_offer').value.trim();

    const description = document.getElementById('description').value.trim();


    if (category_name === '') {
        document.getElementById('category_name_error').style.display = 'block';
        is_valid = false;
    }  

    if (category_offer === '') {
        document.getElementById('category_offer_error').style.display = 'block';
        is_valid = false;
    }
    
    if (description === '') {
        document.getElementById('description_error').style.display = 'block';
        is_valid = false;
    }   

    // If validation passes, send the data
    if (is_valid) {
        const data = {
            category_name,
            category_offer: category_offer || 0,
            description,
        };

        // Send the data to the server using fetch
        fetch('/admin/add_category', {
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
                        `Category created Successfully.`,
                        'success'
                    ).then((result)=>{
                        if (result.isConfirmed) {
                            location.href='/admin/category'
                        }
                    })
                    
            } else {
                Swal.fire(
                        `failed`,
                        `Category created Failed Please try again~!.`,
                        'failed',
                    );
            }
        })
        .catch((error) => {
            alert('An error occurred: ' + error);
        });
    }
}

function editedCategoryForm(event,id) {
    event.preventDefault();  // Prevent form submission
    let is_valid = true;

    // Clear all error messages
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.style.display = 'none');

    const category_name = document.getElementById('category_name').value.trim();
    const category_offer = document.getElementById('category_offer').value.trim();
 
    const description = document.getElementById('description').value.trim();


    if (category_name === '') {
        document.getElementById('category_name_error').style.display = 'block';
        is_valid = false;
    }   
    if (category_offer === '') {
        document.getElementById('category_offer_error').style.display = 'block';
        is_valid = false;
    } 
    if (description === '') {
        document.getElementById('description_error').style.display = 'block';
        is_valid = false;
    }   

    // If validation passes, send the data
    if (is_valid) {
        const data = {
            id,
            category_name,
            category_offer: category_offer || 0,
            description,
        };

        // Send the data to the server using fetch
        fetch('/admin/edit_category', {
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
                        `Category Editing Successfully.`,
                        'success'
                    ).then((result)=>{
                        if (result.isConfirmed) {
                            location.href='/admin/category'
                        }
                    })
                    
            } else {
                Swal.fire(
                        `failed`,
                        `Category editing Failed Please try again~!.`,
                        'failed',
                    );
            }
        })
        .catch((error) => {
            alert('An error occurred: ' + error);
        });
    }
}





