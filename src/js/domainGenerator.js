import { words } from "./words.js";

const domainDisplay = document.getElementById("domainDisplay");
const lockFirstWordBtn = document.getElementById("lockFirstWord");
const lockSecondWordBtn = document.getElementById("lockSecondWord");
const lockFirstWordText = document.getElementById("lockFirstWordText");
const lockSecondWordText = document.getElementById("lockSecondWordText");

// State management
let lockFirst = false;
let lockSecond = false;
let wordLengthFirst = localStorage.getItem("wordLengthFirst") || "any";
let wordLengthSecond = localStorage.getItem("wordLengthSecond") || "any";
let tld = localStorage.getItem("tld") || ".com";

const LENGTH_RANGES = {
  any: null,
  short: [3, 4],
  medium: [5, 6],
  long: [7, Infinity],
};

let filteredWordsFirst = null;
let filteredWordsSecond = null;

const filterByLength = (lengthKey) => {
  const range = LENGTH_RANGES[lengthKey];
  if (!range) return words;
  const [min, max] = range;
  const result = words.filter(w => w.length >= min && w.length <= max);
  return result.length > 0 ? result : words;
};

const buildFilteredWords = () => {
  filteredWordsFirst = filterByLength(wordLengthFirst);
  filteredWordsSecond = filterByLength(wordLengthSecond);
};

buildFilteredWords();

// Clear saved domains
export const clearSavedDomains = () => {
  localStorage.removeItem("savedDomains");
  updateSavedDomainsList();
};

export const toggleLockFirst = () => {
  if (order === "normal") {
    lockFirst = !lockFirst;
    if (lockFirst) lockSecond = false;   // Only one word can be locked at a time
  } else {
    lockSecond = !lockSecond;
    if (lockSecond) lockFirst = false;
  }
  updateDomain();
  updateLockButtonStyles();
};

export const toggleLockSecond = () => {
  if (order === "normal") {
    lockSecond = !lockSecond;
    if (lockSecond) lockFirst = false; // Only one word can be locked at a time
  } else {
    lockFirst = !lockFirst;
    if (lockFirst) lockSecond = false;
  }
  updateDomain();
  updateLockButtonStyles();
};

let firstWord = "";
let secondWord = "";
let order = "normal";


const randomWordFrom = (pool) => {
  if (!pool || pool.length === 0) return "error";
  return pool[Math.floor(Math.random() * pool.length)];
};

export const updateDomain = (forceNew = false) => {
  if (!words.length) {
    domainDisplay.textContent = "Error: Word list unavailable";
    return;
  }

  // Initialize words if they're empty or force new is requested
  if (firstWord === "" || secondWord === "" || forceNew) {
    if (!lockFirst) firstWord = randomWordFrom(filteredWordsFirst);
    if (!lockSecond) secondWord = randomWordFrom(filteredWordsSecond);
  }

  let displayFirst = firstWord;
  let displaySecond = secondWord;
  let firstLock = lockFirst;
  let secondLock = lockSecond;

  // If order is reversed, swap display order only
  if (order === "reverse") {
    [displayFirst, displaySecond] = [secondWord, firstWord];
    [firstLock, secondLock] = [secondLock, firstLock];
  } else {
    [displayFirst, displaySecond] = [firstWord, secondWord];
  }

  domainDisplay.innerHTML = '';
  
  const firstWordSpan = document.createElement('span');
  firstWordSpan.textContent = displayFirst;
  firstWordSpan.className = firstLock ? 'text-red-700' : 'text-gray-900';
  
  const secondWordSpan = document.createElement('span');
  secondWordSpan.textContent = displaySecond;
  secondWordSpan.className = secondLock ? 'text-red-700' : 'text-gray-700';
  
  domainDisplay.appendChild(firstWordSpan);
  domainDisplay.appendChild(secondWordSpan);

  // Handle opacity transition
  domainDisplay.style.opacity = '0';
  requestAnimationFrame(() => {
    domainDisplay.style.opacity = '1';
  });
  
  updateLockButtonStyles();
};

// Update the visual state of lock buttons
const updateLockButtonStyles = () => {
  if (lockFirstWordBtn && lockSecondWordBtn) {
    const firstIsLocked = order === "normal" ? lockFirst : lockSecond;
    const secondIsLocked = order === "normal" ? lockSecond : lockFirst;
    
    // Update first word button
    if (firstIsLocked) {
        lockFirstWordBtn.classList.remove('border-gray-200', 'text-gray-600');
        lockFirstWordBtn.classList.add('border-red-600', 'text-red-700');
        lockFirstWordBtn.querySelector('#lockFirstWordUnlocked').classList.add('hidden');
        lockFirstWordBtn.querySelector('#lockFirstWordLocked').classList.remove('hidden');
    } else {
        lockFirstWordBtn.classList.remove('border-red-600', 'text-red-700');
        lockFirstWordBtn.classList.add('border-gray-200', 'text-gray-600');
        lockFirstWordBtn.querySelector('#lockFirstWordUnlocked').classList.remove('hidden');
        lockFirstWordBtn.querySelector('#lockFirstWordLocked').classList.add('hidden');
    }
    
    if (secondIsLocked) {
        lockSecondWordBtn.classList.remove('border-gray-200', 'text-gray-600');
        lockSecondWordBtn.classList.add('border-red-600', 'text-red-700');
        lockSecondWordBtn.querySelector('#lockSecondWordUnlocked').classList.add('hidden');
        lockSecondWordBtn.querySelector('#lockSecondWordLocked').classList.remove('hidden');
    } else {
        lockSecondWordBtn.classList.remove('border-red-600', 'text-red-700');
        lockSecondWordBtn.classList.add('border-gray-200', 'text-gray-600');
        lockSecondWordBtn.querySelector('#lockSecondWordUnlocked').classList.remove('hidden');
        lockSecondWordBtn.querySelector('#lockSecondWordLocked').classList.add('hidden');
    }
    
    // Update tooltip texts
    const firstTooltip = lockFirstWordBtn.querySelector('div');
    const secondTooltip = lockSecondWordBtn.querySelector('div');
    if (firstTooltip) firstTooltip.textContent = firstIsLocked ? 'Unlock first word' : 'Lock first word';
    if (secondTooltip) secondTooltip.textContent = secondIsLocked ? 'Unlock second word' : 'Lock second word';
  }
};

export const switchOrder = () => {
  order = order === "normal" ? "reverse" : "normal";
  [wordLengthFirst, wordLengthSecond] = [wordLengthSecond, wordLengthFirst];
  localStorage.setItem("wordLengthFirst", wordLengthFirst);
  localStorage.setItem("wordLengthSecond", wordLengthSecond);
  buildFilteredWords();
  updateDomain(false);
  updateLockButtonStyles();
};

export const setFirstWordLength = (value) => {
  wordLengthFirst = value;
  localStorage.setItem("wordLengthFirst", value);
  buildFilteredWords();
  if (!lockFirst) updateDomain(true);
};

export const setSecondWordLength = (value) => {
  wordLengthSecond = value;
  localStorage.setItem("wordLengthSecond", value);
  buildFilteredWords();
  if (!lockSecond) updateDomain(true);
};

export const getFirstWordLength = () => wordLengthFirst;
export const getSecondWordLength = () => wordLengthSecond;

export const setTld = (value) => {
  tld = value;
  localStorage.setItem("tld", value);
};

export const getTld = () => tld;

export const checkAvailability = () => {
  const domain = domainDisplay.textContent + tld;
  window.open(`https://www.godaddy.com/en-uk/domainsearch/find?domainToCheck=${domain}`, "_blank").focus();
};

const showNotification = (message, isError = false) => {
  const notification = document.getElementById('notification');
  if (!notification) return;
  
  notification.textContent = message;
  notification.classList.remove('hidden', 'bg-green-100', 'border-green-300', 'text-green-800', 'bg-red-100', 'border-red-300', 'text-red-800');
  notification.classList.add(
    isError ? 'bg-red-100' : 'bg-green-100',
    isError ? 'border-red-300' : 'border-green-300',
    isError ? 'text-red-800' : 'text-green-800'
  );
  
  // Show notification
  notification.classList.remove('hidden');
  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 3000);
};

export const saveDomain = () => {
  const domain = domainDisplay.textContent + tld;
  const savedDomains = JSON.parse(localStorage.getItem("savedDomains") || "[]");
  if (!savedDomains.includes(domain)) {
    savedDomains.push(domain);
    localStorage.setItem("savedDomains", JSON.stringify(savedDomains));
    updateSavedDomainsList();
    showNotification("Domain saved!");
  } else {
    showNotification("Domain already saved!", true);
  }
};

export const updateSavedDomainsList = () => {
  const savedDomainsSection = document.getElementById("savedDomains");
  const savedDomainsList = document.getElementById("savedDomainsList");
  const savedDomains = JSON.parse(localStorage.getItem("savedDomains") || "[]");
  
  if (savedDomains.length === 0) {
    savedDomainsSection.style.opacity = "0";
    setTimeout(() => {
      savedDomainsSection.classList.add('hidden');
    }, 200);
  } else {
    savedDomainsSection.classList.remove('hidden');
    requestAnimationFrame(() => {
      savedDomainsSection.style.opacity = "1";
    });
    savedDomainsList.innerHTML = savedDomains.map(domain => `<li class="py-1">${domain}</li>`).join("");
  }
};

// Initialize immediately to prevent layout shift
document.addEventListener('DOMContentLoaded', () => {
  // Set initial states immediately
  updateDomain();
  updateSavedDomainsList();
  updateLockButtonStyles();
}, { once: true });

// Also initialize immediately in case the script runs after DOMContentLoaded
updateDomain();
updateSavedDomainsList();
updateLockButtonStyles();