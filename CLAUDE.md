# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Token Cost Visualizer is a client-side web application that compares token costs between different languages using GPT-4o mini for translation and the o200k tokenizer (GPT-4o's tokenizer). Features automatic language detection and multi-language translation support.

**Live deployment**: https://1amthis.github.io/Token-Cost-Between-Languages/

## Architecture

This is a pure frontend application with no build process:

- **index.html**: Main HTML structure with Tailwind CSS (via CDN)
- **app.js**: ES6 module containing all application logic
- **style.css**: Custom CSS styles for token visualization

### Key Technical Details

**Language Detection**: Uses `franc-min@6.2.0` library imported via ESM CDN for client-side language detection:
- `francAll(text, { minLength: 10 })`: Returns array of [language code, confidence] pairs
- Requires minimum 10 characters for reliable detection
- Language codes (ISO 639-3) mapped to readable names via `LANGUAGE_NAMES` constant
- Detection runs automatically on input change

**Tokenization**: Uses `gpt-tokenizer@2.1.1` library imported via ESM CDN (https://esm.sh) for o200k encoding. The tokenizer provides:
- `encode(text)`: Returns array of token IDs
- `decode([tokenId])`: Converts token ID back to string
- `encodeAndSplit()` helper in app.js combines these for visual token display

**Translation**: Direct browser-to-OpenAI API calls using fetch() to `https://api.openai.com/v1/chat/completions` with gpt-4o-mini model:
- Target language selected via dropdown (17 popular languages)
- System prompt dynamically includes selected target language
- Translation works bidirectionally (any language to any language)

**State Management**: Simple global state variables in app.js:
- `currentOriginalTokens`, `currentTranslatedTokens`: Token counts
- `currentOriginalWords`, `currentTranslatedWords`: Word counts
- `translatedContent`: Cached translation result

**API Key Storage**: OpenAI API key is stored in browser localStorage, never sent anywhere except OpenAI's servers.

## Development Commands

### Running Locally

Since this uses ES6 modules, you MUST run a local server (file:// protocol won't work):

```bash
# Recommended: Use the provided script
./start-server.sh

# Alternative: Direct Python command
python3 -m http.server 8000
```

Then visit http://localhost:8000

### Testing Changes

No build step required. Just:
1. Make changes to HTML/CSS/JS files
2. Refresh browser (hard reload: Ctrl+Shift+R / Cmd+Shift+R)
3. Check browser console for any errors

## Important Implementation Notes

### Token Display Logic

The `displayTokens()` function (app.js:263) creates visual token breakdown:
- Uses 6-color rotation for token boxes
- Whitespace visualization: spaces → `·`, newlines → `↵`, tabs → `→`
- Each token is HTML-escaped and wrapped in a colored span

### Character Limits

- Input text: 500 character hard limit (enforced by HTML maxlength)
- Visual warnings at 400 chars (warning) and 450 chars (danger)
- Translation max_tokens: 1000 (set in API request)

### Real-time Updates

Token counting happens on every input change:
- `inputText.addEventListener('input')` triggers `countOriginalTokens()`
- Translated tokens counted only after successful API response
- Comparison stats update whenever either count changes

### Error Handling

- API errors display in translated text area in red
- Tokenization errors show "Error" in token count displays
- Invalid API keys show "✗ API Error" status after failed request
