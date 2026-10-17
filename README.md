# Toolbox

A mobile-first collection of practical file and everyday utilities: PDF tools, image compression/conversion, OCR scanning, QR tools, text utilities, and generators.

## Current tools

- **PDF:** raster-based PDF size reduction, merge PDFs, images to PDF, extract searchable PDF text, save selected pages, inspect page count and size.
- **Images:** compress, resize, convert JPG/PNG/WebP, sample the center pixel colour.
- **Scan & OCR:** extract text from an image or first page of a PDF (English, Arabic, Malayalam, Hindi, Urdu); read QR codes in supported browsers.
- **Text:** word/character counter, case converter, whitespace cleaner, duplicate-line remover.
- **Generators:** QR code maker, random password generator, placeholder text generator.

## Privacy and limitations

Files are processed in the browser; there is no Toolbox upload endpoint. PDF.js, pdf-lib, Tesseract.js, and QRCode are loaded from public CDNs, so an internet connection is needed for those libraries. OCR may download language data on first use. Very large files can exceed a phone's available memory.

PDF compression works by rasterising each page and rebuilding a PDF. It can reduce file size, but it is lossy and removes selectable text, links, form fields, accessibility structure, and other interactive PDF features. Compare the output before using it for important documents. The QR reader uses the browser BarcodeDetector API and may not be supported in every browser.

## Run locally

Open index.html in a modern browser, or serve this directory with any static file server. For best PDF.js worker behavior, use a local HTTP server rather than the file URL protocol.

## Hourly improvement process

GitHub Actions validates the static app on a schedule and on pull requests. Scheduled validation does not itself create features; code changes are prepared on feature branches and should be reviewed before merging or deploying.


## Data & Dev utilities

The Data & Dev category adds ten browser-local tools:

- **JSON formatter:** parses JSON before pretty-printing or minifying it; invalid JSON produces an error instead of a partial result.
- **URL encoder / decoder:** encodes or decodes a URL component. Encode the component you intend to place in a URL, not a complete URL with separators that must remain structural.
- **Base64 converter:** converts UTF-8 text to/from Base64. Decoding rejects invalid Base64 or invalid UTF-8.
- **CSV to JSON:** supports quoted cells, escaped double quotes, commas inside quoted cells, and newline-separated rows. The first row is treated as unique column headers.
- **JSON to CSV:** converts a non-empty array of objects. Columns are the union of object keys; nested values are serialized as JSON text.
- **Markdown outline:** lists ATX headings (one to six leading # characters) and source line numbers.
- **Slug generator:** normalizes text and converts runs of punctuation/spacing into hyphens.
- **Line sorter:** sorts naturally, reverses, or removes duplicate lines while preserving the first occurrence for deduplication.
- **Word frequency:** counts Unicode letters/numbers and ranks up to 100 distinct words. Results are intended for quick analysis, not linguistic tokenization.
- **Line numbers:** adds stable line numbers to each input line.

All ten tools run in the browser and do not send input to a Toolbox server. Copy and download are available for generated results. Use caution with sensitive data on shared devices; clipboard and downloaded files may persist outside the app.
