document.addEventListener('DOMContentLoaded', () => {// 页面加载完成后执行
    "use strict";


    /**
     * download-link
     */
    // document.getElementById('download-link').addEventListener('click', function (event) {
    //     event.preventDefault(); // 防止默认点击行为
    //     const link = document.createElement('a');
    //     link.href = "/static/soft;
    //     link.download = 'GtreeSmall.rar';
    //     link.click();
    // });

    /**
     * regitsterForm
     */
    // 输入框输入内容时，自动清除空格和不可见字符
    function cleanInput(input) {
        var cleanedValue = input.replace(/\s/g, '');  // 使用正则表达式去除所有空格和不可见字符
        return cleanedValue;  // 将处理后的值设置回输入框中

    }

    // 发送验证码
    function sendIdentifyingCode() {
        var email = document.forms["registerForm"]["email"].value;
        validateForm(email);  // 验证邮箱格式是否正确
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/auth/send_code?email=" + encodeURIComponent(email), true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.status)//获取响应状态码
                console.log(xhr.statusText)//获取响应状态
                console.log(xhr.getAllResponseHeaders())//获取响应头
                console.log(xhr.response)//获取响应数据

                // 倒计时
                var countdown = 60; // 倒计时秒数
                var timer = setInterval(function () {
                    document.getElementById("send_code").innerHTML = "重新发送(" + countdown + ")";
                    countdown--;
                    if (countdown <= 0) {
                        clearInterval(timer);
                        document.getElementById("send_code").innerHTML = "发送验证码";
                    }

                }, 1000);

            }
        };
        //发送请求
        xhr.send()
    }

    // 验证邮箱格式是否正确
    function validateForm(email) {
        if (email == null || email == "") {
            alert("邮箱必须填写");
            return false;
        }
        var atpos = email.indexOf("@")// 检查是否有@符号
        var dotpos = email.lastIndexOf(".")// 检查是否有.符号
        // 如果没有@符号或.符号，则不是一个有效的e-mail地址
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 > email.length) {
            alert("不是一个有效的e-mail地址");
            return false;
        }
    }

// function submitForm() {
//     var name = document.getElementById("nameInput").value;
//     var form = document.getElementById("myForm");
//     form.action = "http://localhost:5000/score/" + name;
//     form.submit();
// }

    // 点击提交按钮时，发送请求到服务器
    function submitForm() {
        var name = document.getElementById("nameInput").value; // 获取输入框中的名字
        if (name == null || name == "") {
            alert("姓必须填写");
            return false;
        }
        name = cleanInput(name)
        var form = document.getElementById("myForm");
        var xhr = new XMLHttpRequest(); // 创建一个XMLHttpRequest对象
        xhr.open("POST", "/submit", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            // 当请求完成且响应状态为200时
            if (xhr.readyState === 4 && xhr.status === 200) {
                // 解析响应的JSON数据
                var response = JSON.parse(xhr.responseText);
                if (response.success) {
                    alert("查找成功");
                    form.action = "/score/" + name;

                } else {
                    alert("查找失败");
                    form.action = "/score"
                }
            }
            form.submit();
        };
        xhr.send("name=" + name);
    }

});


