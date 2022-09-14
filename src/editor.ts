import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import type { ViewUpdate } from '@codemirror/view';
import { StreamLanguage } from '@codemirror/language';
import { indentWithTab } from '@codemirror/commands';
import { stex } from '@codemirror/legacy-modes/mode/stex';

import Emittery from 'emittery';

export interface CodeEditorOptions {
  doc?: string;
  parent?: HTMLElement;
  parentId?: string;
  onChange?: CodeEditorEventHandler;
}

const onEditorUpdate = (editor: CodeEditor, update: ViewUpdate) => {
  if (!update.docChanged) return;
  const value = update.state.doc.toString();
  // eslint-disable-next-line
  // @ts-ignore
  editor.emit('change', { value });
};

interface CodeEditorEvent {
  value: string;
}

type CodeEditorEventHandler = (ev: CodeEditorEvent) => void;

@Emittery.mixin('emittery')
export class CodeEditor {
  editor: EditorView;

  constructor(options: CodeEditorOptions) {
    // The parent DOM element.
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

    // eslint-disable-next-line
    // @ts-ignore
    if (options.onChange) this.on('change', options.onChange);
  }
}
