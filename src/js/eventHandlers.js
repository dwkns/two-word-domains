
import { updateDomain, switchOrder, checkAvailability, saveDomain, toggleLockFirst, toggleLockSecond, clearSavedDomains, setFirstWordLength, setSecondWordLength, getFirstWordLength, getSecondWordLength, setTld, getTld } from "./domainGenerator.js";

const generateButton = document.getElementById("generateButton");
const switchOrderBtn = document.getElementById("switchOrderBtn");
const checkAvailabilityButton = document.getElementById("checkAvailabilityButton");
const saveDomainButton = document.getElementById("saveDomainButton");
const lockFirstWordBtn = document.getElementById("lockFirstWord");
const lockSecondWordBtn = document.getElementById("lockSecondWord");

if (lockFirstWordBtn) {
  lockFirstWordBtn.addEventListener("click", toggleLockFirst);
}
if (lockSecondWordBtn) {
  lockSecondWordBtn.addEventListener("click", toggleLockSecond);
}

const clearSavedDomainsButton = document.getElementById("clearSavedDomainsButton");

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
if (clearSavedDomainsButton) {
  clearSavedDomainsButton.addEventListener("click", clearSavedDomains);
}

generateButton.addEventListener("click", debounce(() => updateDomain(true), 300));
switchOrderBtn.addEventListener("click", () => {
  switchOrder();
  if (firstWordLengthSelect) firstWordLengthSelect.value = getFirstWordLength();
  if (secondWordLengthSelect) secondWordLengthSelect.value = getSecondWordLength();
});
checkAvailabilityButton.addEventListener("click", checkAvailability);
saveDomainButton.addEventListener("click", saveDomain);

// Word length selects
const firstWordLengthSelect = document.getElementById("firstWordLength");
const secondWordLengthSelect = document.getElementById("secondWordLength");

if (firstWordLengthSelect) {
  firstWordLengthSelect.value = getFirstWordLength();
  firstWordLengthSelect.addEventListener("change", () => {
    setFirstWordLength(firstWordLengthSelect.value);
  });
}

if (secondWordLengthSelect) {
  secondWordLengthSelect.value = getSecondWordLength();
  secondWordLengthSelect.addEventListener("change", () => {
    setSecondWordLength(secondWordLengthSelect.value);
  });
}

// TLD select
const tldSelect = document.getElementById("tldSelect");
if (tldSelect) {
  tldSelect.value = getTld();
  tldSelect.addEventListener("change", () => {
    setTld(tldSelect.value);
  });
}
