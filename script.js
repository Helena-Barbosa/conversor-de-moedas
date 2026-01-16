
const button = document.querySelector(".convert-button");
const input = document.querySelector(".input-currency");
const fromSelect = document.querySelector(".from-currency");
const toSelect = document.querySelector(".to-currency");
const toggleTheme = document.querySelector(".toggle-theme");
const section = document.querySelector("section");
const rateText = document.querySelector(".exchange-rate");

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

function updateVisibleCurrencies(from, to) {
  const currencyBoxes = document.querySelectorAll(".currency-box");

  const fromBox = document.querySelector(
    `.currency-box[data-currency="${from}"]`
  );
  const toBox = document.querySelector(
    `.currency-box[data-currency="${to}"]`
  );

  currencyBoxes.forEach(box => {
    box.style.display = "none";
  });

  if (fromBox && toBox) {
    fromBox.style.display = "flex";
    toBox.style.display = "flex";

    section.appendChild(fromBox);
    section.appendChild(toBox);
  }
}

async function convert() {
  if (!rates.dolar) await getRates();

  const value = Number(
    input.value.replace(/\./g, "").replace(",", ".")
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
    }

    if (currency === to) {
      el.textContent = converted.toLocaleString("pt-BR", formats[currency]);
    }
  });


  const rate = rates[to] / rates[from];
  rateText.textContent =
    `💱 Taxa usada: 1 ${from.toUpperCase()} = ${rate.toFixed(6)} ${to.toUpperCase()}`;

  updateVisibleCurrencies(from, to);
}

input.addEventListener("input", () => {
  let value = input.value.replace(/\D/g, "");
  value = (Number(value) / 100).toFixed(2);
  value = value.replace(".", ",");
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  input.value = value;

  button.disabled = value === "0,00";
});


toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  toggleTheme.textContent = document.body.classList.contains("dark")
    ? "☀️ Modo claro"
    : "🌙 Modo escuro";
});


button.addEventListener("click", convert);


updateVisibleCurrencies(fromSelect.value, toSelect.value);