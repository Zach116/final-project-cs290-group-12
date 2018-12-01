var textBox =  document.getElementById("text-input");

var sendButton = document.getElementById("send-button");
sendButton.addEventListener('click', function(event) {
  var textBoxContent = textBox.value;
  if (textBoxContent !== "") {
    console.log("sent message");
    sendMessage(textBoxContent);
    textBox.value = "";
  }
});

function sendMessage(message) {
  var messageContext = {
    "message": message
  }

  var messageHTML = Handlebars.templates.messageBubble(messageContext);
  var messageContainer = document.getElementById("messages"); 

  messageContainer.insertAdjacentHTML('beforeend', messageHTML);
}
