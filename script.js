const form = document.querySelector("form");
const text = document.querySelector("#main-text");
const count = document.querySelector("#count");
const cooldown = document.querySelector("#cooldown");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: actionInTabActive,
    args: [text.value, count.value, cooldown.value],
  });
});

function actionInTabActive(text, maxCount, cooldown) {
  (main = document.querySelector("#main")),
    (textarea = main.querySelector(`div[contenteditable="true"]`));

  if (!textarea) {
    alert("Não há uma conversa aberta");
    return;
  }

  let count = 0;

  async function sendMessage() {
    count++;
    textarea.focus();
    document.execCommand("insertText", false, text);
    textarea.dispatchEvent(new Event("change", { bubbles: true }));

    setTimeout(() => {
      (
        main.querySelector(`[data-testid="send"]`) ||
        main.querySelector(`[data-icon="send"]`)
      ).click();
    }, 100);

    await new Promise((resolve) => setTimeout(resolve, 1000 * cooldown));

    if (count >= maxCount) {
      alert("Enviou tudo");
    } else sendMessage();
  }

  sendMessage();
}
