const productWrap = document.querySelector('.productWrap');
//初始化畫面
function init() {
    getProductData();
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
        <a href="#" class="addCardBtn">加入購物車</a>
        <h3>${value.title}</h3>
        <del class="originPrice">NT$${toThousands(value.origin_price)}</del>
        <p class="nowPrice">NT$${toThousands(value.price)}</p>
    </li>`
}
function renderProductData() {
    let str = '';
    productData.forEach(function (value) {
        console.log(value);
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