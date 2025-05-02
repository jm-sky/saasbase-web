// debug-tools.ts
(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const isDebug = urlParams.get('debug') === '1';
  if (!isDebug) return;

  const logDiv = document.createElement('div');
  logDiv.id = 'debug-log';
  logDiv.style.whiteSpace = 'pre-wrap';
  logDiv.style.fontSize = '12px';
  logDiv.style.background = '#f0f0f0';
  logDiv.style.padding = '10px';
  logDiv.style.borderTop = '2px solid #ccc';
  logDiv.style.maxHeight = '300px';
  logDiv.style.overflowY = 'auto';
  document.body.appendChild(logDiv);

  const appendToDOM = (type: string, args: any[]) => {
    const entry = `[${type.toUpperCase()}] ${args.map(a => {
      try {
        return typeof a === 'string' ? a : JSON.stringify(a, null, 2);
      } catch {
        return '[Unserializable]';
      }
    }).join(' ')}\n`;
    logDiv.textContent += entry;
  };

  ['log', 'warn', 'error'].forEach(type => {
    const original = console[type as keyof Console];
    console[type as keyof Console] = (...args: any[]) => {
      original.apply(console, args);
      appendToDOM(type, args);
    };
  });

  window.addEventListener('error', (e) => {
    appendToDOM('error', [e.message]);
  });

  window.addEventListener('unhandledrejection', (e) => {
    appendToDOM('error', [e.reason]);
  });
})();
