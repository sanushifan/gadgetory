document.addEventListener("DOMContentLoaded", () => {
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const stars = card.querySelectorAll(".rating-star");

    stars.forEach((star) => {
      star.addEventListener("mouseover", () => {
        const value = star.getAttribute("data-value");
        stars.forEach((s) => {
          if (s.getAttribute("data-value") <= value) {
            s.classList.add("hover");
          } else {
            s.classList.remove("hover");
          }
        });
      });

      star.addEventListener("mouseout", () => {
        stars.forEach((s) => s.classList.remove("hover"));
      });

      star.addEventListener("click", async () => {
        const value = star.getAttribute("data-value");
        const productId = card.getAttribute("data-id");

        // Send the rating to the server
        try {
          const response = await fetch("/rate_product", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product_id: productId, rating: value }),
          });

          const data = await response.json();
          if (data.success) {
            iziToast.show({
              title: '<span style="color: #fff;">Saved the Rating!</span>',
              position: "topRight",
              backgroundColor: "#00db1d",
              timeout: 2000,
            });
            // Update the stars based on the new rating
            stars.forEach((s, index) => {
              if (index < value) {
                s.classList.add("filled");
              } else {
                s.classList.remove("filled");
              }
            });
          } else {
            iziToast.show({
              title: '<span style="color: #fff;">Failed to Rating!</span>',
              position: "topRight",
              backgroundColor: "#e53637",
              timeout: 2000,
            });
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Error saving rating.");
        }
      });
    });
  });
});

function update_order_status(id, status) {
  if (status == "Cancel") {
    Swal.fire({
      title: "Are you sure?",
      text: `This action will Cancel the Order.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, do it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deletion (e.g., send a request to your server)
        fetch(`/update_order_status`, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              Swal.fire(
                `${status}ed!`,
                `The Order has been ${status}ed!.`,
                "success"
              ).then((result) => {
                if (result.isConfirmed) {
                  location.reload();
                }
              });
            } else {
              Swal.fire(
                "Error!",
                `There was a problem ${status} the Order.`,
                "error"
              );
            }
          })
          .catch((error) => {
            Swal.fire("Error!", `Something went wrong. on ${status}`, "error");
            console.error("Error:", error);
          });
      }
    });
  } else if (status == "Return") {
    Swal.fire({
      title: "Are you sure?",
      text: `This action will Return the Order.`,
      icon: "warning",
      input: "text",
      inputPlaceholder: "Type your Reason here",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, do it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const reason = result.value;
        fetch(`/update_order_status`, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status, reason }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              Swal.fire(
                `Returned!`,
                `The Order has send Request for Return!.`,
                "success"
              ).then((result) => {
                if (result.isConfirmed) {
                  location.reload();
                }
              });
            } else {
              Swal.fire(
                "Error!",
                `There was a problem Return the Order.`,
                "error"
              );
            }
          })
          .catch((error) => {
            Swal.fire("Error!", `Something went wrong. on ${status}`, "error");
            console.error("Error:", error);
          });
      }
    });
  } else {
    Swal.fire("Error!", `There was a problem ${status} the Order.`, "error");
  }
}

function generate_invoice(order_id) {
  fetch(`generate_invoice?order_id=${order_id}`).catch((error) => {
    Swal.fire("Error!", `Something went wrong.`, "error");
    console.error("Error:", error);
  });
}

// Razorpay Payment initiation
function initiateRazorpayPayment(order_id, amount, currency) {
  const options = {
    key: "rzp_test_cWpJLYyZQUl2I7", // Razorpay Key ID
    amount: amount, // Amount in paise
    currency: currency,
    order_id: order_id, // Razorpay Order ID
    handler: function (response) {
      // Handle payment success
      //  alert('Payment successful. Payment ID: ' + response.razorpay_payment_id);

      fetch("/cofirm_payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_id: response.razorpay_payment_id,
          order_id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            window.location.href = "/order_success";
          } else {
            Swal.fire({
              icon: "failed",
              title: "Payment Failed",
              text: " Your Payment Proccess is Failed please Try Again ! ",
            });
          }
        })
        .catch((error) => {
          console.error("Error submitting address:", error);
          Swal.fire({
            icon: "failed",
            title: "Payment Failed",
            text: " Your Payment is Failed please Try Again ! ",
          });
        });
    },
    prefill: {
      name: "John Doe",
      email: "johndoe@example.com",
      contact: "987654321011",
    },
    theme: {
      color: "#111111",
    },
  };

  const razorpay = new Razorpay(options);
  razorpay.open(); // Open the Razorpay payment window
}
