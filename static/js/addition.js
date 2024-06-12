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

function sendMessage() {
    // 获取表单元素
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value;

    // 验证输入内容是否为空
    if (!name || !email || !subject || !message) {
        alert("请填写所有必填字段。");
        return false;
    }
    // 验证邮箱格式是否正确
    if (!validateForm(email)) {
        return false;
    }

    // 使用AJAX发送数据到服务器
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/contact/", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // 处理服务器响应
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.status)//获取响应状态码
            console.log(xhr.statusText)//获取响应状态
            console.log(xhr.getAllResponseHeaders())//获取响应头
            console.log(xhr.response)//获取响应数据
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
                document.getElementById("ajax-contact").reset(); // 清空表单
            } else {
                alert("发送失败，请重试。");
            }
        }
    };

    // 发送表单数据
    var params = "name=" + encodeURIComponent(name) +
        "&email=" + encodeURIComponent(email) +
        "&subject=" + encodeURIComponent(subject) +
        "&message=" + encodeURIComponent(message);
    xhr.send(params);

    return false; // 阻止表单默认提交行为
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
    return true;
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
var sessionId = null;

function initializeSocket(url) {
    var socket = io.connect(url); // 初始化 socket 连接
    // 创建一个URL对象    // 从URL中获取sessionId参数
    var urlObj = new URL(url);
    var urlParams = new URLSearchParams(urlObj.search);
    sessionId = urlParams.get('sessionId');

    // 监听服务端的消息,当收到消息时的处理函数
    if (url.includes("customer")) {// 如果 url 包含 "customer"
        socket.on('message', function (message) {
            if (message.session_id === sessionId) {
                if (message.from_user === 'customer') {
                    chatbox_right(message, '/static/icon/customer.png');
                } else {
                    chatbox(message, '/static/icon/agent.png');
                }
            }
        });
        document.getElementById('sendBtn').addEventListener('click', function () {
            var chatInput = document.getElementById('MessageInput');
            var message = chatInput.value;
            let create_time = new Date().toLocaleString();
            const message_data = {
                "session_id": sessionId,
                'from_user': 'customer',
                'content': message,
                'create_time': create_time
            }
            if (message.trim() !== '') {// 发送消息前先清除输入框中的空格和不可见字符
                socket.emit('customer_message', message_data);
                chatbox_right(message_data, '/static/icon/customer.png');
                chatInput.value = '';
            }
        });
    } else {// 如果 url 包含 "agent"
        socket.on('message', function (message) {
            // MessageList(message);
            if (message.session_id === sessionId) {
                if (message.from_user === 'agent') {
                    chatbox_right(message, '/static/icon/agent.png');
                } else {
                    chatbox(message, '/static/icon/customer.png');
                }
            }

        });
        document.getElementById('sendBtn').addEventListener('click', function () {
            var chatInput = document.getElementById('MessageInput');
            var message = chatInput.value;
            let create_time = new Date().toLocaleString();
            const message_data = {
                "session_id": sessionId,
                'from_user': 'agent',
                'content': message,
                'create_time': create_time
            }
            if (message.trim() !== '') {
                socket.emit('agent_message', message_data);
                // MessageList(message_data);
                chatbox_right(message_data, '/static/icon/agent.png');
                chatInput.value = '';
            }
        });
    }
    return socket;
}

function chatbox(message, src) {
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

    messageTime.textContent = message.from_user + message.create_time;
    messagetext.textContent = message.content;

    chatContent.appendChild(messageElement)
    messageElement.appendChild(messageHeader);
    messageHeader.appendChild(messageUser);
    messageHeader.appendChild(messageTime);
    messageElement.appendChild(messageContent);
    messageContent.appendChild(messagetext);

    // 自动滚动到底部
    chatContent.scrollTop = chatContent.scrollHeight;
}

function chatbox_right(message, src) {
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

    messageTime.textContent = message.from_user + message.create_time;
    messagetext.textContent = message.content;

    chatContent.appendChild(messageElement)
    messageElement.appendChild(messageHeader);
    messageHeader.appendChild(messageUser);
    messageHeader.appendChild(messageTime);
    messageElement.appendChild(messageContent);
    messageContent.appendChild(messagetext);
    // 自动滚动到底部
    chatContent.scrollTop = chatContent.scrollHeight;
}

// 点击侧边栏图标或关闭按钮时，切换消息框的显示状态
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

if (sidebarIcon && closeIcon) {
    sidebarIcon.addEventListener("click", toggleConsultBox);
    closeIcon.addEventListener("click", toggleConsultBox);
}

// 点击发送按钮时，发送消息
var inputBox = document.getElementById("MessageInput");
var sendBtn = document.getElementById("sendBtn");

// 监听输入框的键盘按下事件
if (inputBox) {
    inputBox.addEventListener("keydown", function (event) {
        // 判断按下的是否是 Enter 键（keyCode 为 13）
        if (event.keyCode === 13) {
            // 阻止默认的 Enter 键行为（如换行）
            event.preventDefault();
            // 触发按钮的点击事件
            sendBtn.click();
        }
    });
}

function MessageList(message) {
    var messageItem = document.getElementById(message.session_id);
    var messageElement = document.createElement('div');
    messageElement.classList.add('message-item');
    messageElement.id = message.session_id;

    var imgdiv = document.createElement('div');
    var img = document.createElement('img');
    img.src = '/static/icon/agent.png'
    img.classList.add('headimg');

    imgdiv.appendChild(img);

    var msgMain = document.createElement('div');
    msgMain.classList.add('msg-main');

    var header = document.createElement('div');
    header.classList.add('d-flex', 'justify-content-between');

    var name = document.createElement('span');
    name.classList.add('msg-name');
    name.textContent = message.session_id.substring(0, 8);

    var time = document.createElement('span');
    time.classList.add('msg-time');
    time.textContent = formatDateTime(message.create_time);  // You may format this as needed

    header.appendChild(name);
    header.appendChild(time);

    var msg = document.createElement('div');
    msg.classList.add('msg');
    msg.textContent = message.content;

    msgMain.appendChild(header);
    msgMain.appendChild(msg);

    messageElement.appendChild(imgdiv);
    messageElement.appendChild(msgMain);

    if (messageItem) {
        messageItem.parentNode.replaceChild(messageElement, messageItem);
    }

}

function formatDateTime(dateTimeStr) {
    const now = new Date();
    const dateTime = new Date(dateTimeStr);

    const delta = now - dateTime;
    const deltaDays = Math.floor(delta / (1000 * 60 * 60 * 24));

    if (deltaDays === 0) {
        return `${dateTime.getHours()}:${String(dateTime.getMinutes()).padStart(2, '0')}`;
    } else if (deltaDays === 1) {
        return `昨天`;
    } else if (deltaDays === 2) {
        return `前天`;
    } else if (deltaDays < 7) {
        return `${deltaDays}天前`;
    } else {
        return `${dateTime.getMonth() + 1}-${dateTime.getDate()}`;
    }
}

