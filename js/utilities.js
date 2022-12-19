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