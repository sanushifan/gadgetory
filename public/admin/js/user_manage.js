
async function block_user(id) {

    let response = await fetch(`/admin/block_user?id=${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
}
async function delete_user(id) {

    let response = await fetch(`/admin/delete_user?id=${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
}
