import { CodeEditor } from './editor.js';
import { captureSvg, capturePng } from './image-conversion.js';
import { version } from '../package.json';

const setInnerHtml = (id: string, html: string) => {
  const el = document.getElementById(id);
  if (el == null) return;
  el.innerHTML = html;
};

setInnerHtml('version', version);

let lastSource: string;

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
  const newSource = editor.editor.state.doc.toString();
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

const editor = new CodeEditor({
  doc: '\\begin{tikzpicture}\n  \\draw (0,0) circle (4cm);\n\\end{tikzpicture}',
  parentId: 'editor',
  // eslint-disable-next-line
  // @ts-ignore
}).on('change', (ev) => {
  console.log('Updated', ev.value);
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
window.captureSvg = captureSvg;

// eslint-disable-next-line
// @ts-ignore
window.capturePng = capturePng;

enableDownloadButtons(false);
