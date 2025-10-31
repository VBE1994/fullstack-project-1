const $ = (sel) => document.querySelector(sel);

const escapeHTML = (str) =>
  str.replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

const form = $("#form");
const input = $("#inputText");
const statusEl = $("#status");
const resultEl = $("#result");
const submitBtn = $("#submitBtn");

try {
  localStorage.removeItem("proj1-state");
  sessionStorage.removeItem("proj1-state");
} catch {}
resultEl.innerHTML = "";

window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    resultEl.innerHTML = "";
    statusEl.textContent = "";
  }
});

const setStatus = (msg, type = "") => {
  statusEl.className = `status ${type}`.trim();
  statusEl.textContent = msg;
};

const setLoading = (isLoading) => {
  form.setAttribute("aria-busy", String(isLoading));
  submitBtn.disabled = isLoading;
  setStatus(isLoading ? "Loading..." : "Done.");
};

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
    resultEl.classList.remove("fade-in");
    void resultEl.offsetWidth;
    resultEl.classList.add("fade-in");
    resultEl.focus({ preventScroll: false });

  } catch (err) {
    console.error(err);
    setStatus("Unexpected error. Please try again.", "error");
    return;
  } finally {
    setLoading(false);
  }
});
