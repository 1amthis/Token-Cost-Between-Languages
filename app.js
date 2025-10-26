// Token Visualizer - Main Application Logic

// Import gpt-tokenizer for o200k encoding (browser-compatible)
import { encode, decode } from 'https://esm.sh/gpt-tokenizer@2.1.1';

// Import franc-min for language detection (browser-compatible)
import { francAll } from 'https://esm.sh/franc-min@6.2.0';

// Modules are ready to use
console.log('✓ Tokenizer module loaded');
console.log('✓ Language detection module loaded');

// Helper function to get individual token strings with word mapping
function encodeAndSplit(text) {
    const tokens = encode(text);
    const tokenStrings = [];

    for (let i = 0; i < tokens.length; i++) {
        const tokenText = decode([tokens[i]]);
        tokenStrings.push(tokenText);
    }

    // Map tokens to words
    const wordMapping = mapTokensToWords(text, tokenStrings);

    return { tokens, tokenStrings, wordMapping };
}

// Map tokens to their corresponding words
function mapTokensToWords(originalText, tokenStrings) {
    const words = [];
    let charPosition = 0;
    let tokenIndex = 0;

    // Split text into words (by whitespace and punctuation boundaries)
    const wordRegex = /\S+/g;
    let match;

    while ((match = wordRegex.exec(originalText)) !== null) {
        const word = match[0];
        const wordStart = match.index;
        const wordEnd = wordStart + word.length;

        // Find which tokens belong to this word
        const wordTokens = [];
        let reconstructed = '';
        const startTokenIndex = tokenIndex;

        // Keep adding tokens until we've covered this word
        while (tokenIndex < tokenStrings.length && charPosition < wordEnd) {
            const token = tokenStrings[tokenIndex];
            wordTokens.push(tokenIndex);
            reconstructed += token;
            charPosition += token.length;
            tokenIndex++;

            // If we've covered the word, break
            if (charPosition >= wordEnd) {
                break;
            }
        }

        if (wordTokens.length > 0) {
            words.push({
                word: word,
                tokenIndices: wordTokens,
                tokenCount: wordTokens.length,
                startPos: wordStart,
                endPos: wordEnd
            });
        }
    }

    return words;
}

// Helper function to count words
function countWords(text) {
    if (!text || !text.trim()) {
        return 0;
    }

    // Remove extra whitespace and split by whitespace
    // This handles most languages that use spaces
    const words = text.trim().split(/\s+/);

    // Filter out empty strings
    return words.filter(word => word.length > 0).length;
}

// Detect language of text using franc-min
function detectLanguage(text) {
    if (!text || text.trim().length < 10) {
        // Need at least 10 characters for reliable detection
        detectedLanguageSpan.classList.add('hidden');
        return null;
    }

    try {
        // francAll returns array of [language, confidence] pairs
        const results = francAll(text, { minLength: 10 });

        if (results.length > 0 && results[0][0] !== 'und') {
            const langCode = results[0][0];
            const langName = LANGUAGE_NAMES[langCode] || langCode.toUpperCase();

            // Display detected language
            detectedLanguageSpan.textContent = `Detected: ${langName}`;
            detectedLanguageSpan.classList.remove('hidden');

            return langName;
        } else {
            // Unknown language
            detectedLanguageSpan.classList.add('hidden');
            return null;
        }
    } catch (error) {
        console.error('Language detection error:', error);
        detectedLanguageSpan.classList.add('hidden');
        return null;
    }
}

// Language code to name mapping for franc-min
const LANGUAGE_NAMES = {
    'eng': 'English',
    'spa': 'Spanish',
    'fra': 'French',
    'deu': 'German',
    'cmn': 'Chinese',
    'jpn': 'Japanese',
    'kor': 'Korean',
    'ara': 'Arabic',
    'rus': 'Russian',
    'por': 'Portuguese',
    'ita': 'Italian',
    'nld': 'Dutch',
    'hin': 'Hindi',
    'tur': 'Turkish',
    'pol': 'Polish',
    'swe': 'Swedish',
    'nor': 'Norwegian',
    'vie': 'Vietnamese',
    'tha': 'Thai',
    'heb': 'Hebrew',
    'cat': 'Catalan',
    'ces': 'Czech',
    'dan': 'Danish',
    'fin': 'Finnish',
    'ell': 'Greek',
    'hun': 'Hungarian',
    'ind': 'Indonesian',
    'ron': 'Romanian',
    'ukr': 'Ukrainian'
};

// DOM Elements
const apiKeyInput = document.getElementById('apiKey');
const toggleKeyBtn = document.getElementById('toggleKey');
const keyStatus = document.getElementById('keyStatus');
const inputText = document.getElementById('inputText');
const charCount = document.getElementById('charCount');
const translateBtn = document.getElementById('translateBtn');
const translatedTextDiv = document.getElementById('translatedText');
const originalTokensSpan = document.getElementById('originalTokens');
const translatedTokensSpan = document.getElementById('translatedTokens');
const tokenDiffSpan = document.getElementById('tokenDiff');
const percentDiffSpan = document.getElementById('percentDiff');
const wordDiffSpan = document.getElementById('wordDiff');
const moreEfficientSpan = document.getElementById('moreEfficient');
const loadingIndicator = document.getElementById('loadingIndicator');
const originalTokensDisplay = document.getElementById('originalTokensDisplay');
const translatedTokensDisplay = document.getElementById('translatedTokensDisplay');
const originalWordsSpan = document.getElementById('originalWords');
const translatedWordsSpan = document.getElementById('translatedWords');
const originalRatioSpan = document.getElementById('originalRatio');
const translatedRatioSpan = document.getElementById('translatedRatio');
const detectedLanguageSpan = document.getElementById('detectedLanguage');
const targetLanguageSelect = document.getElementById('targetLanguage');
const toggleGroupViewBtn = document.getElementById('toggleGroupView');

// State
let currentOriginalTokens = 0;
let currentTranslatedTokens = 0;
let currentOriginalWords = 0;
let currentTranslatedWords = 0;
let translatedContent = '';
let showGroupedView = false; // Toggle state for word grouping (default: simple view)

// Initialize - use both DOMContentLoaded and immediate execution to handle all cases
function initApp() {
    loadApiKey();
    setupEventListeners();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM is already loaded
    initApp();
}

// Load API key from localStorage
function loadApiKey() {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
        apiKeyInput.value = savedKey;
        updateKeyStatus(true);
        updateTranslateButton();
    }
}

// Save API key to localStorage
function saveApiKey() {
    const key = apiKeyInput.value.trim();
    if (key) {
        localStorage.setItem('openai_api_key', key);
        updateKeyStatus(true);
    } else {
        localStorage.removeItem('openai_api_key');
        updateKeyStatus(false);
    }
    updateTranslateButton();
}

// Update API key status indicator
function updateKeyStatus(isValid) {
    if (isValid && apiKeyInput.value.trim()) {
        keyStatus.innerHTML = '<span class="status-success">✓ Key saved</span>';
    } else {
        keyStatus.innerHTML = '<span class="status-error">✗ No key</span>';
    }
}

// Setup event listeners
function setupEventListeners() {
    // API Key input
    apiKeyInput.addEventListener('input', saveApiKey);
    apiKeyInput.addEventListener('blur', saveApiKey);

    // Toggle API key visibility
    toggleKeyBtn.addEventListener('click', () => {
        if (apiKeyInput.type === 'password') {
            apiKeyInput.type = 'text';
            toggleKeyBtn.textContent = 'Hide';
        } else {
            apiKeyInput.type = 'password';
            toggleKeyBtn.textContent = 'Show';
        }
    });

    // Input text changes
    inputText.addEventListener('input', () => {
        updateCharCount();
        countOriginalTokens();
        detectLanguage(inputText.value);
        updateTranslateButton();
    });

    // Translate button
    translateBtn.addEventListener('click', translateText);

    // Toggle group view button
    toggleGroupViewBtn.addEventListener('click', () => {
        showGroupedView = !showGroupedView;

        // Update button text
        toggleGroupViewBtn.textContent = showGroupedView ? 'Simple View' : 'Grouped View';

        // Re-render both token displays
        const originalText = inputText.value.trim();
        if (originalText) {
            const result = encodeAndSplit(originalText);
            displayTokens(result.tokenStrings, originalTokensDisplay, showGroupedView ? result.wordMapping : []);
        }

        if (translatedContent) {
            const result = encodeAndSplit(translatedContent);
            displayTokens(result.tokenStrings, translatedTokensDisplay, showGroupedView ? result.wordMapping : []);
        }
    });

    // Enter key in input (Shift+Enter for translate)
    inputText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            if (!translateBtn.disabled) {
                translateText();
            }
        }
    });
}

// Update character count
function updateCharCount() {
    const length = inputText.value.length;
    charCount.textContent = `${length} / 500`;

    // Visual feedback for character limit
    charCount.classList.remove('warning', 'danger');
    if (length >= 450) {
        charCount.classList.add('danger');
    } else if (length >= 400) {
        charCount.classList.add('warning');
    }
}

// Count tokens in original text
function countOriginalTokens() {
    const text = inputText.value.trim();

    if (!text) {
        currentOriginalTokens = 0;
        currentOriginalWords = 0;
        originalTokensSpan.textContent = '0';
        originalWordsSpan.textContent = '0';
        originalRatioSpan.textContent = '-';
        originalTokensDisplay.innerHTML = '<span class="text-gray-400 italic">Tokens will appear here...</span>';
        updateComparison();
        return;
    }

    try {
        const { tokens, tokenStrings } = encodeAndSplit(text);
        currentOriginalTokens = tokens.length;
        currentOriginalWords = countWords(text);

        // Update token count
        originalTokensSpan.textContent = currentOriginalTokens.toLocaleString();
        originalTokensSpan.classList.add('token-update');
        setTimeout(() => originalTokensSpan.classList.remove('token-update'), 300);

        // Update word count
        originalWordsSpan.textContent = currentOriginalWords.toLocaleString();

        // Update token/word ratio
        if (currentOriginalWords > 0) {
            const ratio = (currentOriginalTokens / currentOriginalWords).toFixed(2);
            originalRatioSpan.textContent = ratio;
        } else {
            originalRatioSpan.textContent = '-';
        }

        // Display visual token breakdown with word grouping (if enabled)
        const result = encodeAndSplit(text);
        displayTokens(result.tokenStrings, originalTokensDisplay, showGroupedView ? result.wordMapping : []);

        updateComparison();
    } catch (error) {
        console.error('Error counting tokens:', error);
        currentOriginalTokens = 0;
        currentOriginalWords = 0;
        originalTokensSpan.textContent = 'Error';
        originalWordsSpan.textContent = 'Error';
        originalRatioSpan.textContent = 'Error';
        originalTokensDisplay.innerHTML = '<span class="text-red-600">Error tokenizing</span>';
    }
}

// Count tokens in translated text
function countTranslatedTokens() {
    if (!translatedContent) {
        currentTranslatedTokens = 0;
        currentTranslatedWords = 0;
        translatedTokensSpan.textContent = '0';
        translatedWordsSpan.textContent = '0';
        translatedRatioSpan.textContent = '-';
        translatedTokensDisplay.innerHTML = '<span class="text-gray-400 italic">Tokens will appear here...</span>';
        updateComparison();
        return;
    }

    try {
        const { tokens, tokenStrings } = encodeAndSplit(translatedContent);
        currentTranslatedTokens = tokens.length;
        currentTranslatedWords = countWords(translatedContent);

        // Update token count
        translatedTokensSpan.textContent = currentTranslatedTokens.toLocaleString();
        translatedTokensSpan.classList.add('token-update');
        setTimeout(() => translatedTokensSpan.classList.remove('token-update'), 300);

        // Update word count
        translatedWordsSpan.textContent = currentTranslatedWords.toLocaleString();

        // Update token/word ratio
        if (currentTranslatedWords > 0) {
            const ratio = (currentTranslatedTokens / currentTranslatedWords).toFixed(2);
            translatedRatioSpan.textContent = ratio;
        } else {
            translatedRatioSpan.textContent = '-';
        }

        // Display visual token breakdown with word grouping (if enabled)
        const result = encodeAndSplit(translatedContent);
        displayTokens(result.tokenStrings, translatedTokensDisplay, showGroupedView ? result.wordMapping : []);

        updateComparison();
    } catch (error) {
        console.error('Error counting tokens:', error);
        currentTranslatedTokens = 0;
        currentTranslatedWords = 0;
        translatedTokensSpan.textContent = 'Error';
        translatedWordsSpan.textContent = 'Error';
        translatedRatioSpan.textContent = 'Error';
        translatedTokensDisplay.innerHTML = '<span class="text-red-600">Error tokenizing</span>';
    }
}

// Helper function to escape HTML and visualize whitespace
function escapeAndVisualizeToken(token) {
    return token
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/ /g, '·')
        .replace(/\n/g, '↵\n')
        .replace(/\t/g, '→');
}

// Display tokens visually with color-coded boxes and word grouping
function displayTokens(tokenStrings, container, wordMapping = []) {
    // Clear previous content
    container.innerHTML = '';

    // Color palette for word groups
    const colors = [
        'bg-blue-100 border-blue-300 text-blue-800',
        'bg-green-100 border-green-300 text-green-800',
        'bg-purple-100 border-purple-300 text-purple-800',
        'bg-pink-100 border-pink-300 text-pink-800',
        'bg-yellow-100 border-yellow-300 text-yellow-800',
        'bg-indigo-100 border-indigo-300 text-indigo-800',
    ];

    // Create a map of tokenIndex -> wordInfo
    const tokenToWord = new Map();
    wordMapping.forEach((wordInfo, wordIndex) => {
        wordInfo.tokenIndices.forEach(tokenIdx => {
            tokenToWord.set(tokenIdx, { ...wordInfo, wordIndex, color: colors[wordIndex % colors.length] });
        });
    });

    tokenStrings.forEach((token, index) => {
        const wordInfo = tokenToWord.get(index);
        const isMultiToken = wordInfo && wordInfo.tokenCount > 1;

        // Create word group container if this is the first token of a multi-token word
        if (wordInfo && wordInfo.tokenIndices[0] === index && isMultiToken) {
            const wordGroup = document.createElement('span');
            wordGroup.className = 'word-group';

            // Extract color name from the color class (e.g., 'bg-blue-100' -> 'blue')
            const colorMatch = wordInfo.color.match(/bg-(\w+)-/);
            const colorName = colorMatch ? colorMatch[1] : 'blue';

            // Add token count badge on the top-right
            const badge = document.createElement('span');
            badge.className = `token-count-badge badge-${colorName}`;
            badge.textContent = wordInfo.tokenCount;
            badge.title = `"${wordInfo.word}" splits into ${wordInfo.tokenCount} tokens`;

            // Create tokens container
            const tokensContainer = document.createElement('span');
            tokensContainer.className = `tokens-container border-${colorName}`;

            // Add all tokens for this word
            wordInfo.tokenIndices.forEach((tokenIdx, posInWord) => {
                const tokenSpan = document.createElement('span');
                const isFirst = posInWord === 0;
                const isLast = posInWord === wordInfo.tokenIndices.length - 1;

                tokenSpan.className = `token-box grouped-token ${wordInfo.color} ${isFirst ? 'first-token' : ''} ${isLast ? 'last-token' : ''}`;
                tokenSpan.innerHTML = escapeAndVisualizeToken(tokenStrings[tokenIdx]);
                tokenSpan.title = `Word: "${wordInfo.word}" (${wordInfo.tokenCount} tokens)\nToken ${posInWord + 1}/${wordInfo.tokenCount}: "${tokenStrings[tokenIdx]}"`;

                tokensContainer.appendChild(tokenSpan);
            });

            wordGroup.appendChild(badge);
            wordGroup.appendChild(tokensContainer);
            container.appendChild(wordGroup);
        }
        // Skip if this token is part of a multi-token word (already rendered above)
        else if (wordInfo && wordInfo.tokenIndices[0] !== index && isMultiToken) {
            return;
        }
        // Single-token word or punctuation
        else {
            const colorClass = wordInfo ? wordInfo.color : colors[index % colors.length];

            // In grouped view, wrap single tokens in same structure for alignment
            if (wordMapping.length > 0) {
                // Extract color name for consistency
                const colorMatch = colorClass.match(/bg-(\w+)-/);
                const colorName = colorMatch ? colorMatch[1] : 'blue';

                // Wrap single tokens in the same structure for alignment
                const wordGroup = document.createElement('span');
                wordGroup.className = 'word-group';

                // Add invisible badge for alignment (but don't display it)
                const badge = document.createElement('span');
                badge.className = 'token-count-badge badge-invisible';
                badge.innerHTML = '&nbsp;'; // Non-breaking space to maintain height

                // Create container for single token
                const tokensContainer = document.createElement('span');
                tokensContainer.className = `tokens-container border-invisible`;

                const span = document.createElement('span');
                span.className = `token-box grouped-token ${colorClass}`;
                span.innerHTML = escapeAndVisualizeToken(token);
                span.title = wordInfo
                    ? `Word: "${wordInfo.word}" (1 token)`
                    : `Token ${index + 1}: "${token}"`;

                tokensContainer.appendChild(span);
                wordGroup.appendChild(badge);
                wordGroup.appendChild(tokensContainer);
                container.appendChild(wordGroup);
            }
            // In simple view, use simple token boxes
            else {
                const span = document.createElement('span');
                span.className = `token-box ${colorClass}`;
                span.innerHTML = escapeAndVisualizeToken(token);
                span.title = wordInfo
                    ? `Word: "${wordInfo.word}" (1 token)`
                    : `Token ${index + 1}: "${token}"`;

                container.appendChild(span);
            }
        }
    });
}

// Update comparison statistics
function updateComparison() {
    if (currentOriginalTokens === 0 && currentTranslatedTokens === 0) {
        tokenDiffSpan.textContent = '-';
        percentDiffSpan.textContent = '-';
        wordDiffSpan.textContent = '-';
        moreEfficientSpan.textContent = '-';
        return;
    }

    // Token difference
    const diff = currentTranslatedTokens - currentOriginalTokens;
    const diffSign = diff > 0 ? '+' : '';
    tokenDiffSpan.textContent = `${diffSign}${diff.toLocaleString()}`;
    tokenDiffSpan.classList.add('token-update');
    setTimeout(() => tokenDiffSpan.classList.remove('token-update'), 300);

    // Percentage difference
    if (currentOriginalTokens > 0) {
        const percentDiff = ((currentTranslatedTokens - currentOriginalTokens) / currentOriginalTokens * 100).toFixed(1);
        const percentSign = percentDiff > 0 ? '+' : '';
        percentDiffSpan.textContent = `${percentSign}${percentDiff}%`;
        percentDiffSpan.classList.add('token-update');
        setTimeout(() => percentDiffSpan.classList.remove('token-update'), 300);
    } else {
        percentDiffSpan.textContent = '-';
    }

    // Word difference
    const wordDiff = currentTranslatedWords - currentOriginalWords;
    const wordDiffSign = wordDiff > 0 ? '+' : '';
    wordDiffSpan.textContent = `${wordDiffSign}${wordDiff.toLocaleString()}`;
    wordDiffSpan.classList.add('token-update');
    setTimeout(() => wordDiffSpan.classList.remove('token-update'), 300);

    // More efficient language
    if (currentTranslatedTokens > 0 && currentOriginalTokens > 0) {
        const targetLanguage = targetLanguageSelect.value;
        if (currentOriginalTokens < currentTranslatedTokens) {
            moreEfficientSpan.textContent = 'Original';
            moreEfficientSpan.style.color = '#2563eb'; // Blue
        } else if (currentTranslatedTokens < currentOriginalTokens) {
            moreEfficientSpan.textContent = targetLanguage;
            moreEfficientSpan.style.color = '#10b981'; // Green
        } else {
            moreEfficientSpan.textContent = 'Equal';
            moreEfficientSpan.style.color = '#6366f1'; // Indigo
        }
        moreEfficientSpan.classList.add('token-update');
        setTimeout(() => moreEfficientSpan.classList.remove('token-update'), 300);
    } else {
        moreEfficientSpan.textContent = '-';
    }
}

// Update translate button state
function updateTranslateButton() {
    const hasApiKey = apiKeyInput.value.trim().length > 0;
    const hasText = inputText.value.trim().length > 0;
    translateBtn.disabled = !hasApiKey || !hasText;
}

// Translate text using OpenAI API
async function translateText() {
    const apiKey = apiKeyInput.value.trim();
    const text = inputText.value.trim();
    const targetLanguage = targetLanguageSelect.value;

    if (!apiKey || !text) {
        return;
    }

    // Show loading indicator
    loadingIndicator.classList.remove('hidden');
    translateBtn.disabled = true;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are a professional translator. Translate the following text to ${targetLanguage}. If the text is already in ${targetLanguage}, return it as is. Only return the translation, no explanations or additional text.`
                    },
                    {
                        role: 'user',
                        content: text
                    }
                ],
                temperature: 0.3,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API Error: ${response.status}`);
        }

        const data = await response.json();
        translatedContent = data.choices[0].message.content.trim();

        // Update UI with translation
        translatedTextDiv.textContent = translatedContent;
        translatedTextDiv.classList.add('has-content');

        // Count tokens in translated text
        countTranslatedTokens();

    } catch (error) {
        console.error('Translation error:', error);
        translatedTextDiv.innerHTML = `<span class="text-red-600">Error: ${error.message}</span>`;
        translatedContent = '';
        currentTranslatedTokens = 0;
        translatedTokensSpan.textContent = '0';
        updateComparison();

        // Show error status
        keyStatus.innerHTML = '<span class="status-error">✗ API Error</span>';
    } finally {
        // Hide loading indicator
        loadingIndicator.classList.add('hidden');
        updateTranslateButton();
    }
}

// Export for debugging
window.debugTokens = () => {
    console.log('Original tokens:', currentOriginalTokens);
    console.log('Translated tokens:', currentTranslatedTokens);
    console.log('Encode function available:', typeof encode === 'function');
};
