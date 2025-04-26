const USERS = {
  "Vedanth": { password: "2007" },
  "Sahashra": { password: "2007" }
};

let currentUser = "";

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    return;  // Don't proceed if username or password is empty
  }

  const formattedUsername = capitalizeFirstLetter(username);

  if (USERS[formattedUsername] && USERS[formattedUsername].password === password) {
    currentUser = formattedUsername;
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("chatScreen").classList.remove("hidden");
    document.getElementById("logoutBtn").style.display = "block";
    loadMessages();
  }
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    document.getElementById("chatScreen").classList.add("hidden");
    document.getElementById("loginScreen").classList.remove("hidden");
    document.getElementById("logoutBtn").style.display = "none";
    currentUser = "";
  }
}

function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const messageText = messageInput.value.trim();
  if (!messageText) return;

  const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  const messageData = {
    sender: currentUser,
    text: messageText,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase(),
    timestamp: new Date().getTime()
  };

  messages.push(messageData);
  localStorage.setItem("chatMessages", JSON.stringify(messages));

  messageInput.value = "";
  loadMessages();
}

function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  const chatMessages = document.getElementById("chatMessages");
  chatMessages.innerHTML = "";

  messages.sort((a, b) => a.timestamp - b.timestamp);

  messages.forEach((msg) => {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message");

    msgDiv.innerHTML = `
      <div class="header">
        <span class="sender">${msg.sender}:</span>
        <span class="time">${msg.time}</span>
      </div>
      <div class="text">${msg.text}</div>
    `;

    msgDiv.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (confirm("Edit this message?")) {
        const newText = prompt("Edit your message:", msg.text);
        if (newText !== null && newText.trim() !== "") {
          msg.text = newText.trim();
          localStorage.setItem("chatMessages", JSON.stringify(messages));
          loadMessages();
        }
      } else if (confirm("Delete this message?")) {
        const index = messages.indexOf(msg);
        if (index > -1) {
          messages.splice(index, 1);
          localStorage.setItem("chatMessages", JSON.stringify(messages));
          loadMessages();
        }
      }
    });

    chatMessages.appendChild(msgDiv);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Trigger login when password input changes
document.getElementById("password").addEventListener("input", function() {
  login();
});
