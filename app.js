const API_KEY = '45bd6a0b1b704040e917782b'; // Replace with your API key
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  msg.innerText = "Getting exchange rate...";
  
  try {
    // Using the pair conversion endpoint for better efficiency
    const URL = `${BASE_URL}/${API_KEY}/pair/${fromCurr.value}/${toCurr.value}/${amtVal}`;
    const response = await fetch(URL);
    const data = await response.json();
    
    if (data.result === "success") {
      const finalAmount = data.conversion_result;
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } else {
      throw new Error(data["error-type"]);
    }
  } catch (error) {
    msg.innerText = "An error occurred. Please try again later.";
    console.error("Error fetching exchange rate:", error);
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Add event listener for swap icon
const swapIcon = document.querySelector(".fa-arrow-right-arrow-left");
swapIcon.addEventListener("click", () => {
  // Get the current values
  let tempCode = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = tempCode;
  
  // Update the flags
  updateFlag(fromCurr);
  updateFlag(toCurr);
  
  // Update the exchange rate
  updateExchangeRate();
});

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});