// document.addEventListener('DOMContentLoaded', () => {// 页面加载完成后执行
// 函数被定义在了这个回调函数内部，导致它的作用域被限制在这个回调函数内，无法在全局范围内访问到。因此，无法在 HTML 中直接调用
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

/**
 * Socket.io
 */
// 获取输入框和按钮的元素
var inputBox = document.getElementById("consultInput");
var sendBtn = document.getElementById("sendBtn");

// 监听输入框的键盘按下事件
inputBox.addEventListener("keydown", function(event) {
    // 判断按下的是否是 Enter 键（keyCode 为 13）
    if (event.keyCode === 13) {
        // 阻止默认的 Enter 键行为（如换行）
        event.preventDefault();
        // 触发按钮的点击事件
        sendBtn.click();
    }
});

function initializeSocket(url) {
    var socket = io.connect(url); // 初始化 socket 连接

    // 监听服务端的消息,当收到消息时的处理函数
    if (url.includes("customer")) {// 如果 url 包含 "customer"
        socket.on('message', function (message) {
            chatbox(message, "在线客服 ",'/static/icon/agent.png');

        });
        document.getElementById('sendBtn').addEventListener('click', function () {
            var chatInput = document.getElementById('consultInput');
            var message = chatInput.value;
            if (message.trim() !== '') {
                socket.emit('customer_message', message);
                chatbox_right(message, "用户",'/static/icon/customer.png');
                chatInput.value = '';
            }
        });
    } else if (url.includes("agent")) {// 如果 url 包含 "agent"
        socket.on('message', function (message) {
            chatbox(message, "用户",'/static/icon/customer.png');

        });
        document.getElementById('sendBtn').addEventListener('click', function () {
            var chatInput = document.getElementById('consultInput');
            var message = chatInput.value;
            if (message.trim() !== '') {
                socket.emit('agent_message', message);
                chatbox_right(message, "客服",'/static/icon/agent.png');
                chatInput.value = '';
            }
        });
    }
}

function chatbox(message, user,src) {
    var chatContent = document.getElementById('MessageContent');
    var messageElement = document.createElement('div');
    var messageHeader = document.createElement('div');
    var messageUser = document.createElement('img');
    var messageTime = document.createElement('span');
    var messageContent = document.createElement('div');
    var messagetext = document.createElement('span');

    messageElement.classList.add('consult-message-div');
    messageHeader.classList.add('consult-message-time');
    messageUser.classList.add('consult-img');
    messageTime.classList.add('consult-time');
    messageContent.classList.add('consult-message-area');
    messagetext.classList.add('consult-message-text');
    messageUser.src = src;

    messageTime.textContent = user + new Date().toLocaleString();
    messagetext.textContent = message;

    chatContent.appendChild(messageElement)
    messageElement.appendChild(messageHeader);
    messageHeader.appendChild(messageUser);
    messageHeader.appendChild(messageTime);
    messageElement.appendChild(messageContent);
    messageContent.appendChild(messagetext);

    // 自动滚动到底部
    chatContent.scrollTop = chatContent.scrollHeight;
}

function chatbox_right(message, user,src) {
    var chatContent = document.getElementById('MessageContent');
    var messageElement = document.createElement('div');
    var messageHeader = document.createElement('div');
    var messageUser = document.createElement('img');
    var messageTime = document.createElement('span');
    var messageContent = document.createElement('div');
    var messagetext = document.createElement('span');

    messageElement.classList.add('consult-message-div');
    messageHeader.classList.add('consult-message-time');
    messageUser.classList.add('consult-img');
    messageTime.classList.add('consult-time');
    messageContent.classList.add('consult-message-area');
    messagetext.classList.add('consult-message-text');
    messageHeader.classList.add('consult-right');
    messageContent.classList.add('consult-right');
    messageUser.src = src;

    messageTime.textContent = user + new Date().toLocaleString();
    messagetext.textContent = message;

    chatContent.appendChild(messageElement)
    messageElement.appendChild(messageHeader);
    messageHeader.appendChild(messageUser);
    messageHeader.appendChild(messageTime);
    messageElement.appendChild(messageContent);
    messageContent.appendChild(messagetext);
    // 自动滚动到底部
    chatContent.scrollTop = chatContent.scrollHeight;
}

// 获取消息框和图片的元素
var consultBox = document.querySelector(".consult");
var sidebarIcon = document.getElementById("chat");
var closeIcon = document.getElementById("chat-close");

// 定义点击事件处理函数
function toggleConsultBox() {
    // 切换消息框的显示状态
    if (consultBox.style.display === "block") {
        consultBox.style.display = "none";
    } else {
        consultBox.style.display = "block";
    }
}
sidebarIcon.addEventListener("click", toggleConsultBox);
closeIcon.addEventListener("click", toggleConsultBox);