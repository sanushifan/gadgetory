
function loginForm(event) {
    alert
    event.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    // Validate Email
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        document.getElementById("email_error").innerText="Please enter a valid email address."
    }

    fetch("/admin/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email,password })
    })
      .then((response) => response.json())
      .then((data) => {
          if(data.success){
            window.location.href = data.redirect_url;
          }else if(!data.success){
            iziToast.show({
              title: '<span style="color: #fff;">ERROR!</span>',
              message:'<span style="color: #fff;">Email Or Password is incorrect </span>',
              position: 'topRight',
              backgroundColor:'#f15252',
              timeout: 4000,
            });
          }
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  }
