// 千分位工具
function toThousands(value) {
    if (value) {
        value += "";
        var arr = value.split(".");
        var re = /(\d{1,3})(?=(\d{3})+$)/g;

        return arr[0].replace(re, "$1,") + (arr.length == 2 ? "." + arr[1] : "");
    } else {
        return ''
    }
}

//表單驗證功能
// let pattern = /^[0-9]{10}$/g;
let constraints = {
    姓名: {
        presence: {
            message: "是必填欄位"
        }
    },
    Email: {
        presence: {
            message: "是必填欄位"
        },
        email: {
            message: "格式錯誤"
        }
    },
    寄送地址: {
        presence: {
            message: "是必填欄位"
        }
    },
    電話: {
        presence: {
            message: "是必填欄位"
        },
        length: {
            is: 10,
            message: '需為10碼'
        },
        numericality: {
            message: '需為數字'
        }
        // format: {
        //     pattern: /^[0-9]{10}$/g,
        //     message: "格式錯誤"
        // }
    }
};
