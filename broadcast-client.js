(function(exports) {

    var socket;
    var messagesContainer;
    var textInputEl;
    var submitButtonEl;

    var generateMessage = function (id, sender_name, message, timestamp) {
        var messageSpan = document.createElement("span");
        messageSpan.className = "message";
        messageSpan.innerText = message;

        var timeSpan = document.createElement("span");
        timeSpan.className = "timestamp";
        timeSpan.innerText = timestamp + ": ";

        var container = document.createElement("div");
        container.id = id;
        container.appendChild(timeSpan);
        container.appendChild(messageSpan);
        return container;
    }

    var publishMessage = function (data) {
        if (!document.getElementById(data.id)) {
            var message = generateMessage(data.id, data.sender_name, data.message, data.timestamp);
            messagesContainer.appendChild(message);
        }
    };

    var socketInit = function() {
        socket.on("connect", function() {
            socket.emit("fetch_all_broadcasts", function(data) {
                for (var i = 0; i < data.length; i++) {
                    publishMessage(data[i]);
                }
            });

            socket.on("receive_message", function(data) {
                publishMessage(data);
            });
        });
    };

    var buttonInit = function () {
        submitButtonEl.onclick = function () {
            exports.broadcast();
        }
    };

    var sendMessage = function (message) {
        socket.emit("send_message", message, function (data) {
            console.log(data);
        });
    };

    exports.broadcast = function () {
        var message = textInputEl.value;
        sendMessage(message);
    };

    exports.broadcastWithMessage = function (message) {
        sendMessage(message);
    };

    exports.init = function (url, container, textInput, submitButton) {
        socket = io.connect(url);
        messagesContainer = document.querySelector(container);
        textInputEl = document.querySelector(textInput);
        submitButtonEl = document.querySelector(submitButtonEl);
        if (submitButtonEl) {
            buttonInit();
        }
        socketInit();
    };

})(this.BroadcastClient = {});