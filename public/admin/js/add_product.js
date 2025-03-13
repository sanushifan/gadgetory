

        const imageInput = document.getElementById('imageInput');
        const imagePreview = document.getElementById('imagePreview');
        const cropModal = document.getElementById('cropModal');
        const cropImage = document.getElementById('cropImage');
        const cropButton = document.getElementById('cropButton');
        const closeModal = document.getElementById('closeModal');

        let imageStack = [];
        let cropper;

        // Handle image selection
        imageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    cropImage.src = e.target.result;
                    cropModal.style.display = 'flex';  // Show modal
                    initializeCropper();  // Initialize Cropper.js
                };
                reader.readAsDataURL(file);
            }
        });
        function initializeCropper() {
            if (cropper) cropper.destroy();  // Destroy previous instance
            cropper = new Cropper(cropImage, {
                aspectRatio: 1,  // Set the desired aspect ratio (1 for square)
                viewMode: 2
            });
        }

        // Handle cropping
        cropButton.addEventListener('click', function(event) {
            event.preventDefault()
            cropper.getCroppedCanvas().toBlob((blob) => {
                const croppedFile = new File([blob], `cropped-${Date.now()}.png`, { type: 'image/png' });
                imageStack.push(croppedFile);  // Add cropped image to the stack
                displayImages();
                cropModal.style.display = 'none';  // Close modal
            });
        });

        // Close modal without cropping
        closeModal.addEventListener('click', function(event) {
            event.preventDefault()

            cropModal.style.display = 'none';
        });

        // Display images in the preview area
        function displayImages() {
            imagePreview.innerHTML = '';  // Clear existing previews
            imageStack.forEach((file, index) => {
                const imgElement = document.createElement('div');
                imgElement.classList.add('image-item');
                imgElement.innerHTML = `
                    <img src="${URL.createObjectURL(file)}" alt="Cropped Image">
                    <button class="remove-btn" onclick="removeImage(${index})">x</button>
                `;
                imagePreview.appendChild(imgElement);
            });
        }

        // Remove image from stack
        window.removeImage = function(index) {
            imageStack.splice(index, 1);
            displayImages();
        };


        document.getElementById('productForm').addEventListener('submit', async function(event) {
            event.preventDefault();
            let isValid = true;
            console.log('insode form validation');
            
            const product_name = document.getElementById('productName').value.trim();
            const brand = document.getElementById('brand').value.trim();
            const size = document.getElementById('size').value.trim();
            const color = document.getElementById('color').value.trim();
            const category = document.getElementById('selectedCategoriesInput').value.trim();
            const quantity = document.getElementById('quantity').value;
            const material = document.getElementById('material').value.trim();
            const price = document.getElementById('price').value;
            const offer_price = document.getElementById('offerPrice').value;
            const description = document.getElementById('description').value.trim();
        
            // Clear previous error messages
            document.getElementById('productNameError').style.display = 'none';
            document.getElementById('brandError').style.display = 'none';
            document.getElementById('sizeError').style.display = 'none';
            document.getElementById('colorError').style.display = 'none';
            document.getElementById('materialError').style.display = 'none';
            document.getElementById('descriptionError').style.display = 'none';
        
            console.log(selectedCategoriesInput.value)
            // Validate Product Name
            if (product_name === '') {
                document.getElementById('productNameError').style.display = 'inline';
                isValid = false;
            }
        
            // Validate Brand
            if (brand === '') {
                document.getElementById('brandError').style.display = 'inline';
                isValid = false;
            }
        
            // Validate Size
            if (size === '') {
                document.getElementById('sizeError').style.display = 'inline';
                isValid = false;
            }
        
            // Validate Color
            if (color === '') {
                document.getElementById('colorError').style.display = 'inline';
                isValid = false;
            }
        
            // Validate Material
            if (material === '') {
                document.getElementById('materialError').style.display = 'inline';
                isValid = false;
            }
        
            // Validate Description
            if (description === '') {
                document.getElementById('descriptionError').style.display = 'inline';
                isValid = false;
            }
        
            // Validate Image Selection
            if (imageStack.length === 0) {
                Swal.fire(
                    ``,
                    `Please add at least one image..`,
                    'warning'
                )
                return;
            }
        
            if (isValid) {
                const formData = new FormData();
                // Append the form fields
                formData.append('product_name', product_name);
                formData.append('brand', brand);
                formData.append('size', size);
                formData.append('color', color);
                formData.append('category', category);
                formData.append('quantity', quantity);
                formData.append('material', material);
                formData.append('price', price);
                formData.append('offer_price', offer_price);
                formData.append('description', description);
        
                // Append the image files
                imageStack.forEach((file) => {
                    formData.append('product_image', file);  // 'images' is the field name
                });
        
                // Debug: log FormData entries
                for (let pair of formData.entries()) {
                    console.log(pair[0] + ':', pair[1]);
                }
        
                try {
                    // Send the FormData via a POST request

                    const response = await fetch('/admin/add_product', {
                        method: 'POST',
                        body: formData,  // The FormData object is automatically processed by fetch
                    });
        
                    const result = await response.json();
                    console.log('heloo');
                    
                    if (result.status === 'success') {
                        Swal.fire(
                            `success`,
                            `Product added Successfully.`,
                            'success'
                        ).then(()=> location.href='/admin/product_manage' )
                        imageStack = [];  // Clear the image stack after successful upload
                        document.getElementById('productForm').reset();  // Reset the form

                        imagePreview.innerHTML = '';  // Clear the image preview
                    } else if(result.status === 'Failed') {
                        Swal.fire(
                            `Failed`,
                            `Product added Failed ${result.message}.`,
                            'Failed'
                        )
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred while uploading.');
                }
            }
        });






        function resetForm() {
            document.getElementById('productForm').reset();
            const imagesPreview = document.getElementById('imagesPreview');
            imagesPreview.innerHTML = 'Image Previews'; // Reset previews
            }



        //category setup

        const categoryList = document.getElementById('category-list');
        const selectedCategoriesContainer = document.getElementById('selected-categories');
        const selectedCategoriesInput = document.getElementById('selectedCategoriesInput');
        const search_box = document.getElementById('search-box');

        let selectedCategories = [];
        let selectedCategoriesId = [];
        // Function to update the hidden input field with selected categories
        function updateSelectedCategoriesInput() {
            selectedCategoriesInput.value = selectedCategoriesId.join(',');

        }

        // Event listener to handle selecting a category
        categoryList.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('category-item')) {
                const category = e.target.getAttribute('data-category');
                const category_id = e.target.getAttribute('data-category-id');

                if (!selectedCategories.includes(category)) {
                    // Add the category to the selected categories list
                    selectedCategories.push(category);
                    selectedCategoriesId.push(category_id);
                    // Mark the category as selected visually
                    e.target.classList.add('selected');
                    // Add the category to the displayed selected categories
                    const selectedCategoryDiv = document.createElement('div');
                    selectedCategoryDiv.classList.add('selected-category');
                    selectedCategoryDiv.textContent = category;

                    // Add a remove button to the selected category
                    const removeButton = document.createElement('span');
                    removeButton.classList.add('remove-cat-btn');
                    removeButton.textContent = 'X';
                    removeButton.onclick = function() {
                        removeCategory(category,category_id, selectedCategoryDiv, e.target);
                    };

                    selectedCategoryDiv.appendChild(removeButton);
                    selectedCategoriesContainer.appendChild(selectedCategoryDiv);
                    // Update the hidden input field
                    updateSelectedCategoriesInput();
                }
            }
        });


        // Function to remove a selected category
        function removeCategory(category,category_id, categoryDiv, categoryItem) {
            // Remove the category from the selected list
            selectedCategories = selectedCategories.filter(c => c !== category);
            selectedCategoriesId = selectedCategoriesId.filter(c => c !== category_id);
            // Remove the category div
            categoryDiv.remove();
            // Remove the visual "selected" class from the category item
            categoryItem.classList.remove('selected');
            // Update the hidden input field
            updateSelectedCategoriesInput();
        }

        // Function to filter categories based on search input
        function filterCategories() {
            const searchText = search_box.value.toLowerCase();
            const categoryItems = document.querySelectorAll('.category-item');

            categoryItems.forEach(item => {
                const categoryName = item.getAttribute('data-category').toLowerCase();
                if (categoryName.includes(searchText)) {
                    item.style.display = 'inline-block';
                } else {
                    item.style.display = 'none';
                }
            });
        }
