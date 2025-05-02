import type { App } from 'vue';

export default {
  install(app: App) {
    const urlParams = new URLSearchParams(window.location.search);
    const isDebug = urlParams.get('debug') === '1';
    if (!isDebug) return;

    const logDiv = document.createElement('div');
    logDiv.id = 'debug-log';

    logDiv.className = [
      'fixed', 'bottom-0', 'left-0', 'w-full', 'max-h-64', 'overflow-y-auto',
      'bg-gray-900', 'text-white', 'text-xs', 'p-2', 'z-50', 'font-mono',
      'whitespace-pre-wrap', 'border-t', 'border-gray-700'
    ].join(' ');

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
      logDiv.scrollTop = logDiv.scrollHeight;
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
  }
};
