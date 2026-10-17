# Toolbox utility additions

This release adds ten browser-side utilities to the existing Toolbox hub:

1. JSON formatter and validator, with pretty and compact output.
2. URL encoder and decoder, including component and full-URI modes.
3. UTF-8 Base64 encoder and decoder.
4. CSV to JSON conversion with quoted cells, escaped quotes, and multiline values.
5. JSON array to CSV conversion with combined columns and escaped cells.
6. Markdown heading outline with nesting and source line numbers.
7. URL slug generator for titles and phrases.
8. Line sorter with natural alphabetical order, reverse order, and duplicate removal.
9. English word-frequency analyzer, showing the most common 100 words.
10. Line-numbering utility for code or plain text.

## Privacy and limits

Text and data are processed in the browser; no Toolbox upload endpoint is used. CSV conversion requires a header row with unique, non-empty column names. Word frequency currently counts English letters, digits, and apostrophes. Large pasted text is capped by the input controls to keep the interface responsive.

## Validation

The repository includes toolbox-test.mjs, a lightweight regression suite covering all ten utility algorithms. Run it with Node.js using node toolbox-test.mjs.


## Additional tools

The next release adds more browser-side tools for everyday conversion and text analysis.
