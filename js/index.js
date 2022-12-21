const productWrap = document.querySelector('.productWrap');
//初始化畫面
function init() {
    getProductData();
    getCartData();
}
init();
// 取得產品資料API
let productData = [];
function getProductData() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products
    `).then(function (response) {
        productData = response.data.products;
        // console.log(productData);
        renderProductData();
    })
}
//組產品資料字串函式
function combineProductStr(value) {
    return `<li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${value.images}"
            alt="">
        <a href="#" class="addCardBtn" data-id="${value.id}" data-name="${value.title}">加入購物車</a>
        <h3>${value.title}</h3>
        <del class="originPrice">NT$${toThousands(value.origin_price)}</del>
        <p class="nowPrice">NT$${toThousands(value.price)}</p>
    </li>`
}
function renderProductData() {
    let str = '';
    productData.forEach(function (value) {
        // console.log(value);
        str += combineProductStr(value);
    })
    productWrap.innerHTML = str;
}
//產品篩選功能
const productSelect = document.querySelector('.productSelect');
productSelect.addEventListener('change', function (e) {
    let str = '';
    productData.forEach(function (value) {
        if (e.target.value == value.category) {
            str += combineProductStr(value);
        }
        if (e.target.value == '全部') {
            str += combineProductStr(value);
        }
    })
    productWrap.innerHTML = str;
})
//顯示購物車資料
const cartsTable = document.querySelector('.carts-table');
const cartsTotal = document.querySelector('.carts-total');
let cartsData;
function getCartData() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).then(function (response) {
        cartsData = response.data;
        // console.log(cartsData.carts);
        renderCartData();
    })
}
function renderCartData() {
    let str = '';
    cartsData.carts.forEach(function (value) {
        // console.log(value);
        str += `<tr>
        <td>
            <div class="cardItem-title">
                <img src="${value.product.images}" alt="">
                <p>${value.product.title}</p>
            </div>
        </td>
        <td>NT$${toThousands(value.product.price)}</td>
        <td>${value.quantity}</td>
        <td>NT$${toThousands(value.product.price * value.quantity)}</td>
        <td class="discardBtn">
            <a href="#" class="material-icons" id="delete-cart" data-id='${value.id}' data-name='${value.product.title}' >
                clear
            </a>
        </td>
    </tr>`
    })
    cartsTable.innerHTML = str;
    cartsTotal.textContent = `NT$${toThousands(cartsData.finalTotal)}`;
}
//加入購物車功能

// API要求格式
// "data": {
//     "productId": "FKjWDdP6x5PqxrlGqVAp",
//     "quantity": 1
//   }

productWrap.addEventListener('click', function (e) {
    e.preventDefault();
    // console.log(productID);
    let productName = e.target.getAttribute('data-name');
    let productID = e.target.getAttribute('data-id');
    let productNum = 1;
    if (e.target.getAttribute('class') !== 'addCardBtn') {
        console.log('沒有點擊到加入購物車按鈕');
    }
    cartsData.carts.forEach(function (value) {
        if (productID == value.product.id) {
            console.log('購物車已有此項商品');
            value.quantity = value.quantity + 1;
            productNum = value.quantity;
        }
    })
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts
    `, {
        "data": {
            "productId": productID,
            "quantity": productNum
        }
    }).then(function (response) {
        console.log(response);
        Swal.fire(
            '成功!',
            `${productName}加入購物車成功`,
            'success'
        )

        getCartData();
    }).catch(function (error) {
        console.log(error);
        Swal.fire(
            '失敗!',
            `${productName}加入購物車失敗`,
            'error'
        )
    })
})
//刪除單筆購物車資料
cartsTable.addEventListener('click', function (e) {
    e.preventDefault();
    let cartID = e.target.getAttribute('data-id');
    let productName = e.target.getAttribute('data-name');
    if (e.target.getAttribute('id') == 'delete-cart') {
        axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartID}
        `).then(function (response) {
            Swal.fire(
                '成功!',
                `${productName}已從購物車刪除`,
                'success'
            )
            getCartData();
        }).catch(function (error) {
            console.log(error);
            Swal.fire(
                '失敗!',
                `${productName}購物車刪除失敗`,
                'error'
            )
        })
    }
})
//刪除購物車所有資料
const discardAllBtn = document.querySelector('.discardAllBtn');
discardAllBtn.addEventListener('click', function (e) {
    e.preventDefault();
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).then(function (response) {
        console.log(response);
        getCartData();
        Swal.fire(
            '成功!',
            `購物車資料已全數刪除`,
            'success'
        )
    }).catch(function (error) {
        console.log(error);
        Swal.fire(
            '失敗!',
            `購物車目前已無資料`,
            'error'
        )
    })
})