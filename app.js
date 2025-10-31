const $ = (sel) => document.querySelector(sel);
const escapeHTML = (str) =>
  str.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const STATE_KEY = "proj1-state";
const loadState = () => JSON.parse(localStorage.getItem(STATE_KEY) || "{}");
const saveState = (s) => localStorage.setItem(STATE_KEY, JSON.stringify(s));

const state = { ...loadState(), lastResult: loadState().lastResult ?? "" };

const form = $("#form");
const input = $("#inputText");
const statusEl = $("#status");
const resultEl = $("#result");

const setStatus = (msg, type="") => {
  statusEl.className = type;
  statusEl.textContent = msg;
};

if (state.lastResult) {
  resultEl.innerHTML = state.lastResult; 
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const raw = input.value.trim();

  if (!raw) {
    setStatus("Virhe: syöte ei voi olla tyhjä.", "error");
    resultEl.innerHTML = "";
    return;
  }

  setStatus("Ladataan...", ""); 
  resultEl.innerHTML = "";

  try {
   
    await new Promise((r) => setTimeout(r, 500)); 
    const safe = escapeHTML(raw);
    const output = `<p class="success"><strong>Tulos:</strong> ${safe}</p>`;
    resultEl.innerHTML = output;
    state.lastResult = output;
    saveState(state);
    setStatus("Valmis.", "");
  } catch (err) {
    console.error(err);
    setStatus("Odottamaton virhe. Yritä uudelleen.", "error");
  }
});
