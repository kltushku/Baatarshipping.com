const form = document.getElementById("quoteForm");
const quoteValue = document.getElementById("quoteValue");
const quoteMeta = document.getElementById("quoteMeta");

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  quoteMeta.textContent = "Calculating estimate...";

  try {
    const response = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Unable to fetch estimate.");
    }

    const data = await response.json();
    quoteValue.textContent = formatCurrency(data.estimate);
    quoteMeta.textContent = `${data.mode.toUpperCase()} · ${data.origin} → ${data.destination}`;
  } catch (error) {
    quoteMeta.textContent = "We could not retrieve an estimate. Please try again.";
  }
});
