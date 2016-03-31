(function(exports) {

    var socket;
    var messagesContainer;
    var textInputEl;
    var submitButtonEl;
    var audio;
    var session;

    var generateMessage = function (id, sender_name, message, timestamp) {
        var senderSpan = document.createElement("span");
        senderSpan.className = "sender";
        senderSpan.innerText = sender_name + ": ";

        var messageSpan = document.createElement("span");
        messageSpan.className = "message";
        messageSpan.innerText = message;

        var timeSplit = timestamp.split(" ");

        var dateSpan = document.createElement("span");
        dateSpan.className = "datestamp";
        dateSpan.innerText = timeSplit[0];

        var timeSpan = document.createElement("span");
        timeSpan.className = "timestamp";
        timeSpan.innerText = timeSplit[1] + " " + timeSplit[2];

        var container = document.createElement("div");
        container.id = id;
        container.appendChild(senderSpan);
        container.appendChild(messageSpan);
        container.appendChild(dateSpan);
        container.appendChild(timeSpan);
        return container;
    }

    var publishMessage = function (data) {
        if (!document.getElementById(data.id)) {
            var message = generateMessage(data.id, data.sender_name, data.message, data.timestamp);
            messagesContainer.insertBefore(message, messagesContainer.firstChild);
            messagesContainer.scrollTop = 0;
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
                audio.play();
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
        var message = message.trim();
        if (message.length < 1) {
            console.log("Error: Message is empty.");
        } else {
            socket.emit("send_message", message, session, function (data) {
                console.log(data);
            });
        }
    };

    exports.broadcast = function () {
        var message = (textInputEl.value).trim();
        if (message.length < 1) {
            console.log("Error: Message is empty.");
        } else {
            sendMessage(message);
        }
        textInputEl.value = "";
    };

    exports.broadcastWithMessage = function (message) {
        sendMessage(message);
    };

    exports.toggleAudio = function (toggle) {

    };

    exports.deleteWithId = function (id) {

    }

    exports.init = function (url, container, audioUrl, sessionStr, textInput, submitButton) {
        socket = io.connect(url);
        messagesContainer = document.querySelector(container);
        textInputEl = document.querySelector(textInput);
        submitButtonEl = document.querySelector(submitButton);
        audio = new Audio(audioUrl);
        session = sessionStr;
        if (submitButtonEl) {
            buttonInit();
        }
        socketInit();
    };

})(this.BroadcastClient = {});