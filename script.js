const chatInput = document.querySelector(".chat-input textarea");
const sendChatbtn = document.querySelector(".chat-input button");
const chatbox = document.querySelector(".chatbox");

let userMessage; 
const API_KEY = "sk-proj-wgjrzowtnqWIMZgJcBskT3BlbkFJC34xTvTT09Crbi4cif7i"; 

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    
    let chatContent;
    if (className === "outgoing") {
        chatContent = `<p>${message}</p>`;
    } else {
        chatContent = `<img class="icon" src="icon.jpg" alt="User Icon"><p>${message}</p>`;
    }

    chatLi.innerHTML = chatContent;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = { 
        method: "POST",
        headers: {
            "Content-Type": "applicatio/json",  // Typo here
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", 
            messages: [{ role: "user", content: userMessage }]
        })
    };

    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.textContent = "oops! Something went wrong. Please try again";
    });
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Append user message to chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);

        // Using API
        generateResponse(incomingChatLi);
    }, 600);

    // Clear the textarea after sending the message
    chatInput.value = "";

    // Optionally, scroll to the bottom of the chatbox
    chatbox.scrollTop = chatbox.scrollHeight;
}

sendChatbtn.addEventListener("click", handleChat);
