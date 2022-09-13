import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { StreamLanguage } from '@codemirror/language';
import { indentWithTab } from '@codemirror/commands';
import { stex } from '@codemirror/legacy-modes/mode/stex';

let lastSource: string;

// const sourceChanged = window.sourceChanged = async () => {
// eslint-disable-next-line
// @ts-ignore
window.sourceChanged = () => {
  // Check the source has actually changed.
  const newSource = editor.state.doc.toString();
  console.log('woo', newSource, lastSource);
  if (lastSource === newSource) return;
  lastSource = newSource;
  const scriptEl = document.createElement('script');
  scriptEl.innerHTML = newSource;
  scriptEl.setAttribute('type', 'text/tikz');
  document.getElementById('rendered')?.replaceChildren(scriptEl);
  window.onload && window.onload(new Event('app'));
};

const editor = new EditorView({
  extensions: [
    basicSetup,
    StreamLanguage.define(stex),
    // Auto-update is disabled to prevent spamming the tikzjax server.
    // EditorView.updateListener.of(debounce(sourceChanged)),
    keymap.of([indentWithTab]),
  ],
  doc: '\\begin{tikzpicture}\n  \\draw (0,0) circle (4cm);\n\\end{tikzpicture}',
  parent: document.getElementById('editor') ?? document.body,
});

/*
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
*/

// eslint-disable-next-line
// @ts-ignore
window.captureSvg = () => {
  const renderedEl = document.getElementById('rendered');
  if (renderedEl == null || renderedEl.firstChild == null) return;
  const svg = (<HTMLElement>renderedEl.firstChild).innerHTML;
  const base64 =
    'data:image/svg+xml;base64,' +
    btoa(
      svg.replace(
        '<svg',
        '<?xml version="1.0" encoding="UTF-8" ?>\n<svg xmlns="http://www.w3.org/2000/svg"'
      )
    );
  const downloadLink = document.createElement('a');
  downloadLink.href = base64;
  downloadLink.download = 'tikz.svg';
  downloadLink.click();
};
