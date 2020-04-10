// An image file resource helper.
// It preloads an image in the background.
// The returned Promise resolves once the image is downloaded.
export function image(imageSrc: string) {
  return new Promise<string>((resolve, reject) => {
    const file = new Image();
    file.onload = () => {
      resolve(imageSrc);
    };

    file.onerror = reject;

    file.src = imageSrc;
  });
}

// A script resource helper.
// It creates a script tag and injects it into the DOM.
// The returned Promise resolves once the script is loaded.
export function script(scriptSrc: string) {
  return new Promise<string>((resolve, reject) => {
    const file = document.createElement('script');
    file.onload = () => {
      resolve(scriptSrc);
    };

    file.onerror = reject;

    file.src = scriptSrc;

    document.getElementsByTagName('body')[0].appendChild(file);
  });
}
