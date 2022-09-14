// https://spin.atomicobject.com/2014/01/21/convert-svg-to-png/

const getDownloadFileName = (ext: string): string => {
  return (
    (<HTMLInputElement>document.getElementById('input-filename')).value +
    `.${ext}`
  );
};

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

export const captureSvg = () => {
  const dataUri = captureSvgAsDataUri();
  const downloadLink = document.createElement('a');
  downloadLink.href = dataUri;
  downloadLink.download = getDownloadFileName('svg');
  downloadLink.click();
};

export const capturePng = async () => {
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

// Jpeg suffers from a black background.
export const captureJpeg = async () => {
  const image = document.createElement('img');
  image.src = captureSvgAsDataUri();
  image.style.backgroundColor = '#ffffff';
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
