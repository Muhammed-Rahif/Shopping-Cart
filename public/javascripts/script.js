function addToCart(proId,userId) {
    if (userId) {
        $.ajax({
            url: '/add-to-cart/' + proId,
            method: 'get',
            success: (response) => {
                alert("Product added to cart!")
                if (response.status) {
                    let count=$('#cart-count').html()
                    count=parseInt(count)+1
                    $('#cart-count').html(count)
                }
            }
        })
    } else {
        alert("Please login first...!")
        window.location.href = '/login';
    }
}