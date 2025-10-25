# Token Cost Visualizer

A web application that compares token costs between different languages and English using GPT-4o mini for translation and the o200k tokenizer.

## Features

- **Side-by-side comparison**: Input text in any language and see the English translation
- **Real-time token counting**: Uses the o200k tokenizer (same as GPT-4o) to count tokens
- **Character limit**: Maximum 500 characters per input
- **Comparison metrics**:
  - Absolute token difference
  - Percentage difference
  - Which language is more token-efficient
- **Secure API key handling**: Your OpenAI API key is stored locally in your browser
- **Modern UI**: Built with Tailwind CSS for a clean, responsive interface

## How to Use

### Important: Run from a Local Web Server

**You MUST run this from a local web server, not by opening index.html directly!**

This is required because the application uses ES6 modules which don't work with the `file://` protocol.

**Quick Start:**

```bash
# Option 1: Use the included script
./start-server.sh

# Option 2: Use Python directly
python3 -m http.server 8000

# Option 3: Use Node.js
npx serve
```

Then open your browser and go to: **http://localhost:8000**

### Using the Application

1. **Make sure you're running the local web server** (see above)

2. **Enter your OpenAI API key**:
   - Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Paste it in the "OpenAI API Key" field at the top
   - The key is automatically saved in your browser's localStorage
   - You can click "Show/Hide" to toggle visibility

3. **Enter your text**:
   - Type or paste text in any language (up to 500 characters)
   - The token count updates automatically as you type

4. **Translate**:
   - Click the "Translate" button (or press Shift+Enter)
   - GPT-4o mini will translate your text to English
   - Both texts are tokenized using the o200k tokenizer

5. **Compare results**:
   - View token counts for both original and translated text
   - See the token difference and percentage
   - Check which language is more token-efficient

## Technical Details

- **Translation**: Uses OpenAI's GPT-4o mini model
- **Tokenization**: Uses the o200k tokenizer via `@dqbd/tiktoken`
- **Frontend**: Pure HTML/CSS/JavaScript (no build step required)
- **Styling**: Tailwind CSS via CDN
- **No backend**: All processing happens in your browser

## Privacy & Security

- Your OpenAI API key is stored only in your browser's localStorage
- The API key is sent only to OpenAI's servers, never to any third party
- All translation requests go directly from your browser to OpenAI

## Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Tailwind CSS CDN, tiktoken library, and OpenAI API)
- OpenAI API key with access to GPT-4o mini

## Files

- `index.html` - Main HTML structure
- `style.css` - Custom CSS styles
- `app.js` - Application logic, OpenAI integration, and tokenization
- `README.md` - This file

## Local Development

No build process needed! Just open `index.html` in your browser.

For local development with live reload, you can use any simple HTTP server:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (with npx)
npx serve

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## Troubleshooting

**Translation not working?**
- Verify your API key is correct
- Check browser console for error messages
- Ensure you have credits in your OpenAI account

**Token counts showing 0?**
- Wait a moment for the tiktoken library to load
- Check browser console for errors
- Try refreshing the page

**Can't see translated text?**
- Make sure you clicked "Translate"
- Check if the loading indicator appeared
- Look for error messages in the translation panel

## Cost Estimates

Using GPT-4o mini for translation:
- Input: ~$0.150 per 1M tokens
- Output: ~$0.600 per 1M tokens

For 500 characters (~100-200 tokens), each translation costs approximately $0.0001-$0.0002 (very cheap!).

## License

Feel free to use and modify this code for your own projects!
