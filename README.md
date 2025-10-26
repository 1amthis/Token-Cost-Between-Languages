# Token Cost Visualizer

🌍 **[Live Demo on GitHub Pages](https://1amthis.github.io/Token-Cost-Between-Languages/)**

A web application that compares token costs between different languages and English using GPT-4o mini for translation and the o200k tokenizer.

![Token Visualizer Screenshot](https://via.placeholder.com/800x400?text=Token+Cost+Visualizer)

## Features

- **Language Detection**: Automatic detection of input text language (supports 80+ languages)
- **Multi-Language Translation**: Translate to any of 17 popular languages (English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Russian, Portuguese, Italian, Dutch, Hindi, Turkish, Polish, Swedish, Norwegian)
- **Side-by-side comparison**: Input text in any language and see the translation
- **Real-time token counting**: Uses the o200k tokenizer (same as GPT-4o) to count tokens
- **Character limit**: Maximum 500 characters per input
- **Comparison metrics**:
  - Absolute token difference
  - Percentage difference
  - Which language is more token-efficient
- **Secure API key handling**: Your OpenAI API key is stored locally in your browser
- **Modern UI**: Built with Tailwind CSS for a clean, responsive interface

## How to Use

### Option 1: Use GitHub Pages (Easiest!)

Simply visit **[https://1amthis.github.io/Token-Cost-Between-Languages/](https://1amthis.github.io/Token-Cost-Between-Languages/)**

No installation needed! Works directly in your browser.

### Option 2: Run Locally

If you want to run it locally:

```bash
# Clone the repository
git clone https://github.com/1amthis/Token-Cost-Between-Languages.git
cd Token-Cost-Between-Languages

# Start a local server (required for ES6 modules)
python3 -m http.server 8000
# OR
./start-server.sh
```

Then open your browser and go to: **http://localhost:8000**

### Getting Started

1. **Get your OpenAI API key**:
   - Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Paste it in the "OpenAI API Key" field at the top
   - The key is stored **only in your browser** (localStorage) and never sent anywhere except OpenAI
   - You can click "Show/Hide" to toggle visibility

2. **Enter your text**:
   - Type or paste text in any language (up to 500 characters)
   - Token count, word count, and token/word ratio update automatically
   - Language is automatically detected and displayed (requires 10+ characters)

3. **Select target language**:
   - Choose your desired translation language from the dropdown menu
   - Options include English, Spanish, French, German, Chinese, Japanese, and more

4. **Translate**:
   - Click the "Translate" button (or press Shift+Enter)
   - GPT-4o mini will translate your text to the selected language
   - Both texts are tokenized using the o200k tokenizer

5. **Compare results**:
   - View token counts for both original and translated text
   - See the token difference and percentage
   - Check which language is more token-efficient

## Technical Details

- **Language Detection**: Uses franc-min library (client-side, free)
- **Translation**: Uses OpenAI's GPT-4o mini model
- **Tokenization**: Uses the o200k tokenizer via gpt-tokenizer library
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
