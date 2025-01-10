async function delete_product(id,is_deleted) {
    
    let response = await fetch("/admin/delete_product", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id,is_deleted }),
    });

    // const response_data = await response.json();
    // let product = response_data.product;
    // console.log(product);
    // for(let x in product) {
    //     document.getElementById("dynamic_tr").innerHTML(`
    //         <tr id="dynamic_tr">
    //                 <td class="cell">${x._id}</td>
    //                 <td class="cell"><span class="truncate">${x.product_name}</span></td>
    //                 <td class="cell">${x.brand}</td>
    //                 <td class="cell"><span> ${x.category}</span></td>
    //                 <td class="cell"><span>${x.quantity} </span></td>
    //                 <td class="cell">${x.price}<span>/-</span></td>
    //                 <td class=""><a class=" btn btn-sm btn-primary" href="#">View</a></td>
    //                 <td class=" "><button class="btn btn-danger btn-sm" id="delete_btn" onclick="delete_product('<%= x._id %>')" style="color: #ffffff; background-color: #f54013 ;">delete</button></td>
                            
    //             </tr>
    //     `)
    // }
}
