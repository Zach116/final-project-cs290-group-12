var textBox =  document.getElementById("text-input");

var sendButton = document.getElementById("send-button");
sendButton.addEventListener(click, function {
  var textBoxContent = textInput.value;
  if (textBoxContent !== "") {
    sendMessage(textBoxContent);
  }
});

function sendMessage(message) {
  var postContext = {
    "message": message
  }

  var messageHTML = Handlebars.templates.messageBubble(messageContext);
  var messageContainer = document.getElementById("messages");

  messageContainer.insertAdjacentHTML('beforeend', messageHTML);
}
