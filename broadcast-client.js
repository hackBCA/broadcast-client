(function(exports) {
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

    var publishMessage = function (messages_container, data) {
        if (!document.getElementById(data.id)) {
            var message = generateMessage(data.id, data.sender_name, data.message, data.timestamp);
            messages_container.appendChild(message);
        }
    };

    var socket_init = function(socket, messages_container) {
        socket.on("connect", function() {
            socket.emit("fetch_all_broadcasts", function(data) {
                for (var i = 0; i < data.length; i++) {
                    publishMessage(messages_container, data[i]);
                }
            });

            socket.on("receive_message", function(data) {
                publishMessage(messages_container, data);
            });
        });
    };

    exports.init = function(url, container) {
        var socket = io.connect(url);
        var messages_container = document.querySelector(container);
        socket_init(socket, messages_container);
    };

})(this.BroadcastClient = {});