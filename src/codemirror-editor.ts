/**
 * Simple interface for CodeMirror 6.
 *
 * This file lets us get started with the totally rewritten CodeMirror 6 API
 * with the minimum amount of configuration.
 *
 * @copyright Copyright 2022 [pbuk](https://github.com/pb-uk).
 * @license MIT
 *
 * ```javascript
 * import { createCodeEditor } from './codemirror-editor.ts';
 *
 * // Create an editor from a document.
 * const editor = createCodeEditor({
 *   el: '#target',
 *   value: 'Hello World'.
 * });
 *
 * // Add an event listener.
 * editor.on('change', ({ value }) => console.log(value));
 *
 * // Get the current document.
 * console.log(editor.value);
 * ```
 */

// CodeMirror imports.
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { indentUnit } from '@codemirror/language';
import { indentWithTab } from '@codemirror/commands';

// CodeMirror type imports.
import type { ViewUpdate } from '@codemirror/view';
import type { Extension } from '@codemirror/state';

import Emittery from 'emittery';

/**
 * The type for a CodeEditor instance.
 *
 * We need to define it like this because of the way we add Emittery mixins.
 */
type CodeEditor = CodeEditorBase &
  Emittery<{
    // Change event payload.
    change: { value: string };
  }>;

/** Options for initializing a CodeEditor object. */
interface CodeEditorOptions {
  /** The text content to edit. */
  value?: string;
  /** The parent HTML element or query selector. */
  el?: string | HTMLElement;
  /** The name of the language for this editor. */
  language?: string;
}

let definedLanguages: Record<string, Extension> = {};

/** Add to the available languages. */
export const addLanguages = (languages: Record<string, Extension>): void => {
  definedLanguages = { ...definedLanguages, ...languages };
};

/**
 * Convert the CodeMirror update event to a familiar change event.
 *
 * CodeMirror 6 triggers updates all the time, even for a cursor move, so we
 * use Emittery to convert these to a single `change` event when the document
 * has actually changed.
 */
const onEditorUpdate = (editor: CodeEditorBase, update: ViewUpdate): void => {
  if (!update.docChanged) return;
  const value = update.state.doc.toString();
  (editor as CodeEditor).emit('change', { value });
};

/** The base class for a CodeEditor instance. */
class CodeEditorBase {
  editor: EditorView;

  constructor(options: CodeEditorOptions) {
    // The parent DOM element.
    const parent =
      (typeof options.el === 'string'
        ? // Use a query selector if we have a string...
          document.querySelector(options.el)
        : // ...otherwise use the provided element...
          options.el) ||
      // ...or fall back to the body.
      document.body;

    const extensions = [basicSetup];

    if (options.language && definedLanguages[options.language]) {
      extensions.push(definedLanguages[options.language]);
    }
    // Override the default behaviour of tab exiting the editor.
    extensions.push(keymap.of([indentWithTab]));
    // Override the default behaviour of indenting 2 spaces.
    extensions.push(indentUnit.of('    '));
    extensions.push(
      EditorView.updateListener.of((update) => onEditorUpdate(this, update))
    );

    this.editor = new EditorView({
      extensions,
      // The document to edit.
      doc: options.value ?? '',
      // This is the DOM element to insert the editor into.
      parent,
    });
  }

  /** The current value of the document. */
  get value(): string {
    return this.editor.state.doc.toString();
  }
}

/** Create a CodeEditor instance. */
export const createCodeEditor = (options: CodeEditorOptions) => {
  const editor = new CodeEditorBase(options) as unknown;
  new Emittery().bindMethods(editor as Record<string, unknown>);
  return editor as CodeEditor;
};
