import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { StreamLanguage } from '@codemirror/language';
import { indentWithTab } from '@codemirror/commands';
import { stex } from '@codemirror/legacy-modes/mode/stex';

let lastSource: string;

const getDownloadFileName = (ext: string): string => {
  return (
    (<HTMLInputElement>document.getElementById('input-filename')).value +
    `.${ext}`
  );
};

const enableDownloadButtons = (enable = true) => {
  if (enable) {
    document.getElementById('btn-png')?.removeAttribute('disabled');
    document.getElementById('btn-svg')?.removeAttribute('disabled');
    // document.getElementById('btn-jpg')?.removeAttribute('disabled');
    return;
  }
  document.getElementById('btn-png')?.setAttribute('disabled', 'disabled');
  document.getElementById('btn-svg')?.setAttribute('disabled', 'disabled');
  // document.getElementById('btn-jpg')?.setAttribute('disabled', 'disabled');
};

// https://spin.atomicobject.com/2014/01/21/convert-svg-to-png/

// const sourceChanged = window.sourceChanged = async () => {
// eslint-disable-next-line
// @ts-ignore
window.sourceChanged = () => {
  // Check the source has actually changed.
  const newSource = editor.state.doc.toString();
  if (lastSource === newSource) return;
  enableDownloadButtons(false);
  lastSource = newSource;
  const scriptEl = document.createElement('script');
  scriptEl.innerHTML = newSource;
  scriptEl.setAttribute('type', 'text/tikz');
  document.getElementById('rendered')?.replaceChildren(scriptEl);
  window.onload && window.onload(new Event('app'));
  enableDownloadButtons();
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

const captureSvgAsDataUri = (): string => {
  const renderedEl = document.getElementById('rendered');
  if (renderedEl == null || renderedEl.firstChild == null) return '';
  const svg = (<HTMLElement>renderedEl.firstChild).innerHTML;
  return (
    'data:image/svg+xml;base64,' +
    window.btoa(
      svg.replace(
        '<svg',
        '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg"'
      )
    )
  );
};

// eslint-disable-next-line
// @ts-ignore
window.captureSvg = () => {
  const dataUri = captureSvgAsDataUri();
  const downloadLink = document.createElement('a');
  downloadLink.href = dataUri;
  downloadLink.download = getDownloadFileName('svg');
  downloadLink.click();
};

// eslint-disable-next-line
// @ts-ignore
window.capturePng = async () => {
  const image = document.createElement('img');
  image.src = captureSvgAsDataUri();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    if (context === null) return;
    context.drawImage(image, 0, 0);

    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.download = getDownloadFileName('png');
    downloadLink.click();
  };
};

/* Jpeg suffers from a black background.
// eslint-disable-next-line
// @ts-ignore
window.captureJpeg = async () => {
  const image = document.createElement('img');
  image.src = captureSvgAsDataUri();
  image.style.backgroundColor = "#ffffff";
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    if (context === null) return;
    context.drawImage(image, 0, 0);

    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL('image/jpeg');
    downloadLink.download = getDownloadFileName('jpg');
    downloadLink.click();
  };
};
*/

enableDownloadButtons(false);
