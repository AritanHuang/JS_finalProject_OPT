// C3.js
let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: [
            ['Louvre 雙人床架', 1],
            ['Antony 雙人床架', 2],
            ['Anty 雙人床架', 3],
            ['其他', 4],
        ],
        colors: {
            "Louvre 雙人床架": "#DACBFF",
            "Antony 雙人床架": "#9D7FEA",
            "Anty 雙人床架": "#5434A7",
            "其他": "#301E5F",
        }
    },
});
// 後台初始化
function init() {
    getOrderData();
}
init();
//取得訂單API
let orderData = [];
function getOrderData() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
        headers: {
            'Authorization': token
        }
    }).then(function (response) {
        orderData = response.data.orders;
        renderOrderData();
        // console.log(orderData);
    }).catch(function (error) {
        console.log(error);
    })
}
//渲染後台訂單頁面
const orderTable = document.querySelector('.order-table');
function renderOrderData() {
    let str = '';
    orderData.forEach(function (value) {
        //訂單狀態處理
        let orderStatus = '';
        if (value.paid == true) {
            orderStatus = '已處理';
        }
        else {
            orderStatus = '未處理';
        }
        // console.log(orderStatus);
        //處理時間戳訂單日期
        let timeStamp = value.createdAt;
        let date = new Date(timeStamp * 1000);
        let newDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        //組產品名稱字串
        let productItemStr = '';
        let productItem = value.products;
        productItem.forEach(function (productValue) {
            productItemStr += ` <p>${productValue.title}*${productValue.quantity}</p>`
        })
        // console.log(value);
        str += ` <tr>
        <td>${value.id}</td>
        <td>
            <p>${value.user.name}</p>
            <p>${value.user.tel}</p>
        </td>
        <td>${value.user.address}</td>
        <td>${value.user.email}</td>
        <td>
            ${productItemStr}
        </td>
        <td>${newDate}</td>
        <td class="orderStatus">
            <a href="#" class="orderStatusBtn" data-id='${value.id}' data-status='${value.paid}'>${orderStatus}</a>
        </td>
        <td>
            <input type="button" class="delSingleOrder-Btn" value="刪除">
        </td>
    </tr>`
    })
    orderTable.innerHTML = str;
}
//觸發點擊修改按鈕
orderTable.addEventListener('click', function (e) {
    let dataStatus;
    dataStatus = e.target.getAttribute('data-status');
    let dataId = e.target.getAttribute('data-id');
    if (e.target.getAttribute('class') == 'orderStatusBtn') {
        e.preventDefault();
        if (dataStatus == 'false') {
            dataStatus = true;
        }
        else {
            dataStatus = false;
        }
        changeStatus(dataId, dataStatus);
    }
})
//修改訂單狀態api
function changeStatus(dataId, dataStatus) {
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders
    `, {
        "data": {
            "id": dataId,
            "paid": dataStatus
        }
    },
        {
            headers: {
                'Authorization': token
            }
        }).then(function (response) {
            alert(`${dataId}此筆訂單狀態已修改`);
            getOrderData();
        }).catch(function (error) {
            alert(`${dataId}訂單狀態修改失敗`);
            console.log(error);
        })
}
