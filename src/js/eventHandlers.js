
import { updateDomain, switchOrder, checkAvailability, saveDomain, toggleLockFirst, toggleLockSecond, clearSavedDomains } from "./domainGenerator.js";

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
switchOrderBtn.addEventListener("click", switchOrder);
checkAvailabilityButton.addEventListener("click", checkAvailability);
saveDomainButton.addEventListener("click", saveDomain);