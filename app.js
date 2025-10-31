const $ = (sel) => document.querySelector(sel);

const escapeHTML = (str) =>
  str.replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

const STATE_KEY = "proj1-state";
const loadState = () => {
  try { return JSON.parse(localStorage.getItem(STATE_KEY) || "{}"); }
  catch { return {}; }
};
const saveState = (s) => localStorage.setItem(STATE_KEY, JSON.stringify(s));

const form = $("#form");
const input = $("#inputText");
const statusEl = $("#status");
const resultEl = $("#result");
const submitBtn = $("#submitBtn");


const setStatus = (msg, type = "") => {
  statusEl.className = `mt ${type}`.trim();
  statusEl.textContent = msg;
};

const setLoading = (isLoading) => {
  form.setAttribute("aria-busy", String(isLoading));
  submitBtn.disabled = isLoading;
  if (isLoading) {
    submitBtn.classList.add("loading");
    setStatus("Loading...");
  } else {
    submitBtn.classList.remove("loading");
    setStatus("Done.");
  }
};


const state = { ...loadState() };
if (state.lastResultHTML) {
  resultEl.innerHTML = state.lastResultHTML; 
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const raw = input.value.trim();
  setLoading(true);
  resultEl.innerHTML = "";

  try {
    
    await new Promise((r) => setTimeout(r, 500));

    const safe = escapeHTML(raw);
    const output = `<p class="success"><strong>Result:</strong> ${safe}</p>`;

    resultEl.innerHTML = output;
    resultEl.focus({ preventScroll: false });

    state.lastResultHTML = output;
    saveState(state);

  } catch (err) {
    console.error(err);
    setStatus("Unexpected error. Please try again.", "error");
    return;
  } finally {
    setLoading(false);
  }
});
