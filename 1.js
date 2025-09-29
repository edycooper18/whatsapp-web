// Dados simulados das conversas (podem ser expandidos)
const chats = [
  {
    id: 1,
    name: "MINHA IRMA",
    avatar: "https://i.pravatar.cc/150?img=32",
    online: true,
    messages: [
      { type: "received", text: "N precisa", time: "12:15" },
      { type: "received", text: "ta iai eduardo", time: "13:01" },
      { type: "received", text: "vai chega sp amanha", time: "13:01" },
      { type: "received", text: "slk", time: "13:01" },
      { type: "sent", text: "Quer q eu te espere na padaria??", time: "12:14" },
      { type: "sent", text: '<img src="https://i.imgur.com/mJWbJuE.gif" alt="gif gato"/>' , time: "12:10" },
      { type: "sent", text: '<img src="https://i.imgur.com/mJWbJuE.gif" alt="gif gato"/>' , time: "12:15" },
      { type: "sent", text: "Ue", time: "13:02" },
      { type: "sent", text: "Tô no curso po", time: "13:02" },
      { type: "sent", text: "Tu falo q não precisava de espera", time: "13:02" },
    ],
  },
  {
    id: 2,
    name: "Ezicas",
    avatar: "https://i.pravatar.cc/150?img=5",
    online: false,
    messages: [
      { type: "received", text: "Ahh bom", time: "13:29" },
      { type: "sent", text: "Tudo bem?", time: "13:28" },
    ],
  },
  {
    id: 3,
    name: "vava dos uótchais",
    avatar: "https://i.pravatar.cc/150?img=12",
    online: false,
    messages: [
      { type: "received", text: "Slk", time: "13:30" },
    ],
  }
];

let activeChatId = 1;

const chatListEl = document.getElementById("chat-list");
const chatHeaderEl = document.getElementById("chat-header");
const chatMessagesEl = document.getElementById("chat-messages");
const chatInputEl = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");
const searchInput = document.getElementById("search");

// Função para formatar horários mostrando os últimos 5 min para simulção
function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().slice(0,5);
}

// Renderizar lista de conversas
function renderChatList(filterText = "") {
  chatListEl.innerHTML = "";
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(filterText.toLowerCase())
  );

  filteredChats.forEach(chat => {
    const lastMessage = chat.messages[chat.messages.length-1];
    const chatItem = document.createElement("div");
    chatItem.classList.add("chat-item");
    if(chat.id === activeChatId) chatItem.classList.add("active");

    chatItem.innerHTML = `
      <div class="chat-avatar" style="background-image: url('${chat.avatar}')"></div>
      <div class="chat-info">
        <div class="chat-name">${chat.name}</div>
        <div class="chat-last-message">${lastMessage ? (lastMessage.type === 'sent' ? "Você: " : "") + stripTags(lastMessage.text) : ''}</div>
      </div>
      <div class="chat-time">${lastMessage ? lastMessage.time : ""}</div>
    `;

    chatItem.addEventListener("click", () => {
      activeChatId = chat.id;
      renderChatList(searchInput.value);
      renderChatWindow();
    });

    chatListEl.appendChild(chatItem);
  });
}

// Função para remover tags html simples das mensagens (ex: para preview)
function stripTags(html) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

// Renderizar área do chat da conversa ativa
function renderChatWindow() {
  const chat = chats.find(c => c.id === activeChatId);
  if(!chat) return;

  // Header
  chatHeaderEl.innerHTML = `
    <div class="chat-header-avatar" style="background-image: url('${chat.avatar}')"></div>
    <div>
      <div class="chat-header-info">${chat.name}</div>
      <div class="chat-header-status">${chat.online ? "online" : "offline"}</div>
    </div>
  `;

  // Mensagens
  chatMessagesEl.innerHTML = "";

  chat.messages.forEach(m => {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message");
    msgDiv.classList.add(m.type);
    msgDiv.innerHTML = m.text;
    const time = document.createElement("time");
    time.textContent = m.time;
    msgDiv.appendChild(time);
    chatMessagesEl.appendChild(msgDiv);
  });

  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

// Enviar mensagem
function sendMessage() {
  const text = chatInputEl.value.trim();
  if(text === "") return;

  const chat = chats.find(c => c.id === activeChatId);

  // Adicionar mensagem enviada
  chat.messages.push({
    type: "sent",
    text: text,
    time: getCurrentTime(),
  });

  chatInputEl.value = "";
  renderChatList(searchInput.value);
  renderChatWindow();
}

// Enviar mensagem ao clicar no botão
sendButton.addEventListener("click", sendMessage);

// Enviar mensagem ao pressionar Enter no input
chatInputEl.addEventListener("keydown", e => {
  if(e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Filtrar lista de conversas ao digitar na busca
searchInput.addEventListener("input", () => {
  renderChatList(searchInput.value);
});

// Inicializa
renderChatList();
renderChatWindow();
