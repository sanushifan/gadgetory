function confirmStatus(order_id){

    let selected = document.getElementById("status").value
    Swal.fire({
        title: 'Are you sure?',
        text: `This action will Set Order as ${selected} .`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: `Yes, Set ${selected}!`
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/admin/update_order`, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id,selected })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire(
                        `${data.success}`,
                        `The Order status set has .${data.success}`,
                        'success'
                    );
                    setTimeout(() =>location.href='/admin/orders', 2000 );
                } else {
                    Swal.fire(
                        'Error!',
                        'There was a problem in Order Updating.',
                        'error'
                    );
                }

            })
            .catch(error => {
                Swal.fire('Error!', 'Something went wrong.', 'error');
                console.error("Error:", error);
            });
        }
    });
}
