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
function showShadow(){
    if (window.pageYOffset>0) {
        document.getElementById('nav-header').classList.add('down-shadow')
    } else {
        document.getElementById('nav-header').classList.remove('down-shadow')
    }
}

ScrollReveal().reveal('.card',{reset:true,interval: 16});