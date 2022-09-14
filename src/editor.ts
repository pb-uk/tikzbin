export { createCodeEditor } from './codemirror-editor.js';
import { addLanguages } from './codemirror-editor.js';

// CodeMirror language imports.
import { StreamLanguage } from '@codemirror/language';
import { stex } from '@codemirror/legacy-modes/mode/stex';

// Define all available languages here.
addLanguages({
  stex: StreamLanguage.define(stex),
});
