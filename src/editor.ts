import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import type { ViewUpdate } from '@codemirror/view';
import { StreamLanguage } from '@codemirror/language';
import { indentWithTab } from '@codemirror/commands';
import { stex } from '@codemirror/legacy-modes/mode/stex';

export interface CodeEditorOptions {
  doc?: string;
  parent?: HTMLElement;
  parentId?: string;
}

const onEditorUpdate = (editor: CodeEditor, update: ViewUpdate) => {
  if (!update.docChanged) return;
  const value = update.state.doc.toString();
  editor.dispatchEvent(
    new CustomEvent('change', { detail: { editor, value } })
  );
};

export class CodeEditor extends EventTarget {
  editor: EditorView;

  constructor(options: CodeEditorOptions) {
    super();
    const parent =
      (options.parentId && document.getElementById(options.parentId)) ||
      options.parent ||
      document.body;
    this.editor = new EditorView({
      extensions: [
        basicSetup,
        StreamLanguage.define(stex),
        EditorView.updateListener.of((update) => onEditorUpdate(this, update)),
        keymap.of([indentWithTab]),
      ],
      doc: options.doc ?? '',
      parent,
    });
  }
}
