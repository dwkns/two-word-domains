import { words } from './words.js';

export function generateDomainName() {
    // Get two random words from the words array
    const firstWord = words[Math.floor(Math.random() * words.length)];
    const secondWord = words[Math.floor(Math.random() * words.length)];
    
    // Combine the words and append .com
    return `${firstWord}${secondWord}.com`;
} 

