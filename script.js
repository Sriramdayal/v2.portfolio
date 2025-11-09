document.getElementById("ask-btn").addEventListener("click", askAI);

async function askAI() {
  const prompt = document.getElementById("user-prompt").value.trim();
  const chatBox = document.getElementById("chat-box");

  if (!prompt) return;

  chatBox.innerHTML += `<p><strong>You:</strong> ${prompt}</p>`;

  const response = await fetch("/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();
  const reply = data.response || "No reply.";

  chatBox.innerHTML += `<p><strong>AI:</strong> ${reply}</p>`;
  document.getElementById("user-prompt").value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}
