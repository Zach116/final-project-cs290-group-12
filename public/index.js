var textBox =  document.getElementById("text-input");

var sendButton = document.getElementById("send-button");
sendButton.addEventListener('click', function(event) {
  var textBoxContent = textBox.value;
  if (textBoxContent !== "") {
    var postRequest = new XMLHttpRequest();
    var requestURL = '/message/addMessage';
    postRequest.open('POST', requestURL);

    var requestBody = JSON.stringify({
      message: textBoxContent
    });

    console.log("sent message:", requestBody);

    postRequest.addEventListener('load', function (event) {
      console.log("incoming status:", event.target.status);
      if (event.target.status === 200) {
        sendMessage(textBoxContent);
        textBox.value = "";
      } else {
        alert("Error storing message: " + event.target.response);
      }
    });

    postRequest.setRequestHeader('Content-Type', 'application/json');
    postRequest.send(requestBody);
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
