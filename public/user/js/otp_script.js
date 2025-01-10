
    // Function to move focus to the next input field when a digit is entered
    function moveFocus(event, nextId) {
        if (event.target.value.length === 1) {
            document.getElementById(nextId).focus();
        }
    }

    // Function to check if all OTP fields are filled
    function validateOTP() {
        const otp1 = document.getElementById('otp1').value;
        const otp2 = document.getElementById('otp2').value;
        const otp3 = document.getElementById('otp3').value;
        const otp4 = document.getElementById('otp4').value;

        const otpValid = otp1 && otp2 && otp3 && otp4;
        const submitButton = document.getElementById('submitButton');
        submitButton.disabled = !otpValid; // Enable or disable the submit button based on OTP validity
    }

    // Function to handle OTP form submission
    async function handleSubmit(event) {
        event.preventDefault(); 

        // Capture the OTP values from the input fields
        const otp1 = document.getElementById('otp1').value;
        const otp2 = document.getElementById('otp2').value;
        const otp3 = document.getElementById('otp3').value;
        const otp4 = document.getElementById('otp4').value;

        const otp = otp1 + otp2 + otp3 + otp4; 

        // Send the OTP 
        const response = await fetch('/otp_verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ otp })
        });
        const response_data = await response.json(); 

        if (response_data.success) {
            iziToast.show({
              title: '<span style="color: #fff;">OTP Verified Successfully</span>',
              position: "topRight",
              backgroundColor: "#00db1d",
              timeout: 2000,
            })
            setTimeout(() => location.href='/login', 1000);

        } else {
          iziToast.show({
            title: '<span style="color: #fff;">OTP is not match!</span>',
            position: "topRight",
            backgroundColor: "#e53637",
            timeout: 2000,
          });
        }
    }

    function showNotification(type, message) {
      const notification = document.getElementById('notification');
      const messageElement = document.getElementById('notification-message');

      // Set message and type class
      messageElement.textContent = message;
      notification.className = ''; // Reset classes
      notification.classList.add('show', type);

      // Automatically hide after 4 seconds
      setTimeout(() => {
          closeNotification();
      }, 4000);
    }

      function closeNotification() {
          const notification = document.getElementById('notification');
          notification.classList.remove('show');
      }


//  OTP resend


  // Make an AJAX request to resend OTP
//   fetch('/get_otp_timer')
//   .then(response => response.json())
//   .catch(error => {
//     console.error('Error resending OTP:', error);
//     // alert('There was an error. Please try again.');
//   });
  
// Default expiry time (in seconds)


let otpExpiryTime =20
let otpTimerInterval;
let resendOtpLink = document.getElementById('resendOtpLink');
let otpTimer = document.getElementById('otp_timer');

// Start OTP timer when page loads
window.onload = startOtpTimer;

// Function to start and manage the OTP timer
function startOtpTimer() {
  resendOtpLink.classList.add('disabled'); // Disable the link initially
  otpTimer.textContent = formatTime(otpExpiryTime); // Set the initial time

  otpTimerInterval = setInterval(function() {
    otpExpiryTime--; // Decrease the time by 1 second
    otpTimer.textContent = formatTime(otpExpiryTime); // Update the timer display

    if (otpExpiryTime <= 0) {
      clearInterval(otpTimerInterval); // Stop the timer when it reaches 0
      otpTimer.textContent = '00:00'; // Display '00:00' when timer expires
      resendOtpLink.classList.remove('disabled'); // Enable the link again
    }
  }, 1000);
}

// Helper function to format the time in MM:SS format
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${padZero(minutes)}:${padZero(seconds)}`;
}

// Helper function to add leading zero if number is less than 10
function padZero(num) {
  return num < 10 ? `0${num}` : num;
}

// Event listener for "Resend OTP" link click
resendOtpLink.addEventListener('click', function(e) {
  if (this.classList.contains('disabled')) {
    e.preventDefault(); // Prevent click if link is disabled
    return;
  }

  // Disable the link and start the OTP timer again
  resendOtpLink.classList.add('disabled');
  otpExpiryTime = 60; // Reset timer
  startOtpTimer(); // Restart the timer


});
