var textBox =  document.getElementById("text-input");
var socket = io();
var username = "Guest";

var sendButton = document.getElementById("send-button");
sendButton.addEventListener('click', function(event) {
  var textBoxContent = textBox.value;
  if (textBoxContent !== "") {
    var postRequest = new XMLHttpRequest();
    var requestURL = '/message/addMessage';
    postRequest.open('POST', requestURL);

    var requestBody = JSON.stringify({
      username: username,
      message: textBoxContent
    });

    postRequest.addEventListener('load', function (event) {
      if (event.target.status === 200) {
        sendMessage(textBoxContent, username);
        textBox.value = "";
        socket.emit('saved message', textBoxContent, username);
      } else {
        alert("Error storing message: " + event.target.response);
      }
    });

    postRequest.setRequestHeader('Content-Type', 'application/json');
    postRequest.send(requestBody);
  }
});

function sendMessage(message, user) {
  var messageContext = {
    "username": user,
    "message": message
  }

  var messageHTML = Handlebars.templates.messageBubble(messageContext);
  var messageContainer = document.getElementById("messages");

  messageContainer.insertAdjacentHTML('beforeend', messageHTML);
}

socket.on('new post saved', function (message, user) {
  console.log("==Received event from socket that a new post was added");
  console.log("  - new message:", message);
  console.log("  - username:", user);
  sendMessage(message, user);
});

//===========
//MODAL STUFF
//===========
function toggleModal() {
  var modalBackdrop = document.getElementById('modal-backdrop');
  var changeUsernameModal = document.getElementById('change-username-modal');
  var usernameInputField = document.getElementById('username-input');

  //Clear text
  usernameInputField.value = "";

  modalBackdrop.classList.toggle('hidden');
  changeUsernameModal.classList.toggle('hidden');
}

function checkForEmptyField() {
  var usernameInputField = document.getElementById('username-input');

  if (usernameInputField.value === "") {
    return true;
  }

  return false;
}

function changeUsername() {
  if (checkForEmptyField()) {
    alert("Please input what you want your new username to be!");
  }
  else {
    username = document.getElementById('username-input').value;

    toggleModal();
  }
}

var changeUsernameButton = document.getElementById('change-username-button');
var modalClose = document.getElementById('modal-close');
var modalCancel = document.getElementById('modal-cancel');
var modalAccept = document.getElementById('modal-accept');
changeUsernameButton.addEventListener('click', toggleModal);
modalClose.addEventListener('click', toggleModal);
modalCancel.addEventListener('click', toggleModal);
modalAccept.addEventListener('click', changeUsername);
