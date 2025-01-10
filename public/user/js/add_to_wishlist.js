function add_to_wishlist(event,id){
    event.stopPropagation()

    fetch('/add_to_wishlist', {
        method: 'POST',
        headers: {
'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message=='added') {
            iziToast.show({
                title: '<span style="color: #fff;">+ Added to Wishlist!</span>',
                // message:'<span style="color: #fff;">product</span>',
                position: 'topRight',
                backgroundColor:'#111',
                timeout: 2000,
              });
        }else if(data.message=='existed'){
            iziToast.show({
                title: '<span style="color: #fff;">Exists in Wishlist !</span>',
                // message:'<span style="color: #fff;">product</span>',
                position: 'topRight',
                backgroundColor:'#111',
                timeout: 2000,
              });
        }
        
    
    })
    .catch(error => {
        console.error('Error:', error);
        iziToast.show({
            title: '<span style="color: #fff;">Error Adding to Wishlist !</span>',
            // message:'<span style="color: #fff;">product</span>',
            position: 'topRight',
            backgroundColor:'#red',
            timeout: 2000,
          });
    });



}