function remove_product(productId) {
  if (productId) {
    fetch(`/remove_from_wishlist?id=${productId}`, { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload();
      })
      .catch((error) => {
        Swal.fire(
            'Error!',
            `There was a problem in removing .`,
            'error'
        );
        console.error(error);
      });
  } else {
    alert("server Error");
  }
}
 