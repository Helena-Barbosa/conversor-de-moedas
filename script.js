
const button = document.querySelector(".convert-button");
const input = document.querySelector(".input-currency");
const fromSelect = document.querySelector(".from-currency");
const toSelect = document.querySelector(".to-currency");
const toggleTheme = document.querySelector(".toggle-theme");



let rates = {};


const formats = {
  real: { style: "currency", currency: "BRL" },
  dolar: { style: "currency", currency: "USD" },
  euro: { style: "currency", currency: "EUR" },
  libra: { style: "currency", currency: "GBP" },
  bitcoin: {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6
  }
};


async function getRates() {
  const response = await fetch("https://api.exchangerate-api.com/v4/latest/BRL");
  const data = await response.json();

  rates = {
    real: 1,
    dolar: data.rates.USD,
    euro: data.rates.EUR,
    libra: data.rates.GBP,
    bitcoin: 190000
  };
}


async function convert() {

  if (!rates.dolar) await getRates();


  const value = Number(
    input.value
      .replace(/\./g, "")
      .replace(",", ".")
  );
  const from = fromSelect.value;
  const to = toSelect.value;

  if (isNaN(value) || value <= 0) {
    alert("Digite um valor válido");
    return;
  }

  if (from === to) {
    alert("Escolha moedas diferentes");
    return;
  }




  const valueInReal = value * rates[from];
  const converted = valueInReal / rates[to];


  document.querySelectorAll(".currency-box").forEach(box => {
    const currency = box.dataset.currency;
    const el = box.querySelector(".currency-value");

    if (currency === from) {
      el.textContent = value.toLocaleString("pt-BR", formats[currency]);
    } else if (currency === to) {
      el.textContent = converted.toLocaleString("pt-BR", formats[currency]);
    } else {
      el.textContent = (0).toLocaleString("pt-BR", formats[currency]);
    }

    box.classList.toggle(
      "active",
      currency === from || currency === to
    );
  });
}

input.addEventListener("input", () => {
  let value = input.value.replace(/\D/g, "");
  value = (Number(value) / 100).toFixed(2);
  value = value.replace(".", ",");
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  input.value = value;
});


toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    toggleTheme.textContent = "☀️ Modo claro";
  } else {
    toggleTheme.textContent = "🌙 Modo escuro";
  }
});


input.addEventListener("input", () => {
  button.disabled = input.value.trim() === "";
});


button.addEventListener("click", convert);