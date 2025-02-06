
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let is_valid=true

    const first_name = document.getElementById('first_name').value
    const last_name = document.getElementById('last_name').value
    const phno_number = document.getElementById('phno_number').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const referral_code = document.getElementById('referral_code').value

    document.getElementById('used_email').style.display = 'none';

    
    // First Name Validation
    
    fetch("/signup", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name,last_name,phno_number,email,password })
      })
        .then((response) => response.json())
        .then((data) => {
            

            const firstNameError = document.getElementById('firstNameError');
            const firstNamePattern = /^[A-Za-z]+$/;
            if (!first_name.match(firstNamePattern)) {
                firstNameError.style.display = 'block';
                is_valid=false
            } else {
                firstNameError.style.display = 'none';
            }

            // Last Name Validation
            const lastNameError = document.getElementById('lastNameError');
            if (!last_name.match(firstNamePattern)) {
                lastNameError.style.display = 'block';
                is_valid=false
            } else {
                lastNameError.style.display = 'none';
            }

            // Phone Number Validation
            const phoneError = document.getElementById('phoneError');
            const phonePattern = /^\d{10}$/;
            if (!phno_number.match(phonePattern)) {
                phoneError.style.display = 'block';
                is_valid=false
            } else {
                phoneError.style.display = 'none';
            }

            // Email Validation
            const emailError = document.getElementById('emailError');
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!email.match(emailPattern)) {
                emailError.style.display = 'block';
                is_valid=false
            } else {
                emailError.style.display = 'none';
            }

            // Password Validation
            const passwordError = document.getElementById('passwordError');
            const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
            if (!password.match(passwordPattern)) {
                passwordError.style.display = 'block';
                is_valid=false
            } else {
                passwordError.style.display = 'none';
            }

            // Last Name Validation
            const referralCodeError = document.getElementById('referralCodeError');
            if (!last_name.length === 8 ) {
                referralCodeError.style.display = 'block';
                is_valid=false
            } else {
                referralCodeError.style.display = 'none';
            }

            if(data.success && is_valid == true){
                window.location.href = data.redirect_url;
            }else if(!data.success){
                document.getElementById('used_email').style.display = 'block';  
            }
        })
        .catch(function (error) {
          console.error("Error:", error);
        });
});