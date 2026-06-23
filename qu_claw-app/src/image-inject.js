/**
 * image-inject.js — injected into OpenClaw Control UI.
 *
 * Intercepts paste / drag-drop / file-upload for images,
 * calls the vision model via Electron IPC, and inserts the
 * resulting text description into the chat input.
 *
 * Depends on window.uclaw (exposed by preload.js).
 */
(function () {
  if (window.__uclawImageInject) return;
  window.__uclawImageInject = true;

  /* ── Style ── */
  const style = document.createElement('style');
  style.textContent = `
    .uclaw-img-preview {
      position: fixed; bottom: 80px; right: 20px; z-index: 99999;
      max-width: 240px; max-height: 180px; border-radius: 8px;
      border: 2px solid #ff6b35; box-shadow: 0 4px 16px rgba(0,0,0,.4);
      background: #111;
    }
    .uclaw-img-status {
      position: fixed; bottom: 40px; right: 20px; z-index: 99999;
      background: #ff6b35; color: #fff; padding: 4px 12px; border-radius: 12px;
      font-size: 13px; font-family: sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,.3);
    }
    .uclaw-upload-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 36px; height: 36px; border: none; border-radius: 8px;
      background: transparent; color: #888; cursor: pointer;
      font-size: 20px; transition: all .15s;
      margin-right: 4px; flex-shrink: 0;
    }
    .uclaw-upload-btn:hover { background: #222; color: #ff6b35; }
    .uclaw-drop-overlay {
      position: fixed; inset: 0; z-index: 99998;
      background: rgba(255,107,53,.12); border: 3px dashed #ff6b35;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; color: #ff6b35; font-family: sans-serif;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  /* ── Helpers ── */
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        const commaIdx = result.indexOf(',');
        resolve({
          base64: commaIdx >= 0 ? result.slice(commaIdx + 1) : result,
          mimeType: file.type || 'image/png',
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function showPreview(dataUrl) {
    cleanup();
    const img = document.createElement('img');
    img.className = 'uclaw-img-preview';
    img.src = dataUrl;
    document.body.appendChild(img);

    const status = document.createElement('div');
    status.className = 'uclaw-img-status';
    status.textContent = '识别中...';
    document.body.appendChild(status);

    return status;
  }

  function cleanup() {
    document.querySelectorAll('.uclaw-img-preview, .uclaw-img-status').forEach((el) => el.remove());
  }

  function showDropOverlay() {
    if (document.querySelector('.uclaw-drop-overlay')) return;
    const el = document.createElement('div');
    el.className = 'uclaw-drop-overlay';
    el.textContent = '松开鼠标以识别图片';
    document.body.appendChild(el);
  }

  function hideDropOverlay() {
    document.querySelectorAll('.uclaw-drop-overlay').forEach((el) => el.remove());
  }

  /** Find the chat text input / textarea in the OpenClaw Control UI. */
  function findChatInput() {
    // Try common selectors for chat input areas
    const selectors = [
      'textarea',
      '[contenteditable="true"]',
      'input[type="text"]',
      '.chat-input textarea',
      '.chat-input input',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.offsetParent !== null) return el; // visible
    }
    return null;
  }

  function insertTextIntoInput(text) {
    const input = findChatInput();
    if (!input) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text).catch(() => {});
      alert('已复制图片识别结果到剪贴板，请粘贴到聊天框。');
      return;
    }

    if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, 'value',
      )?.set || Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value',
      )?.set;
      if (nativeSetter) {
        nativeSetter.call(input, (input.value || '') + text);
      } else {
        input.value = (input.value || '') + text;
      }
      input.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (input.contentEditable === 'true') {
      input.focus();
      document.execCommand('insertText', false, text);
    }
    input.focus();
  }

  /* ── Core: process an image ── */
  async function processImage(base64, mimeType, dataUrl) {
    const statusEl = showPreview(dataUrl);

    try {
      const result = await window.uclaw.analyzeImage(base64, mimeType);

      cleanup();

      if (result.ok) {
        const text = `[图片识别结果] ${result.description}`;
        insertTextIntoInput(text);
      } else {
        alert('图片识别失败: ' + (result.error || '未知错误'));
      }
    } catch (e) {
      cleanup();
      alert('图片识别异常: ' + e.message);
    }
  }

  /* ── Paste handler ── */
  document.addEventListener('paste', async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) return;
        const { base64, mimeType } = await fileToBase64(file);
        const dataUrl = `data:${mimeType};base64,${base64}`;
        processImage(base64, mimeType, dataUrl);
        return;
      }
    }
  }, true);

  /* ── Drag & Drop handlers ── */
  let dragCounter = 0;

  document.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragCounter++;
    if (e.dataTransfer?.types?.includes('Files')) {
      showDropOverlay();
    }
  });

  document.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragCounter--;
    if (dragCounter <= 0) {
      dragCounter = 0;
      hideDropOverlay();
    }
  });

  document.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  document.addEventListener('drop', async (e) => {
    e.preventDefault();
    dragCounter = 0;
    hideDropOverlay();

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const { base64, mimeType } = await fileToBase64(file);
        const dataUrl = `data:${mimeType};base64,${base64}`;
        processImage(base64, mimeType, dataUrl);
        return; // process first image only
      }
    }
  });

  /* ── Upload button ── */
  function injectUploadButton() {
    if (document.querySelector('.uclaw-upload-btn')) return;

    // Try to find the chat input container
    const input = findChatInput();
    if (!input) return;

    const container = input.closest('form') || input.parentElement;
    if (!container) return;

    const btn = document.createElement('button');
    btn.className = 'uclaw-upload-btn';
    btn.title = '上传图片进行识别';
    btn.innerHTML = '📎';
    btn.type = 'button';

    btn.addEventListener('click', async () => {
      if (window.uclaw?.selectImageFile) {
        const result = await window.uclaw.selectImageFile();
        if (result && result.base64) {
          processImage(result.base64, result.mimeType, result.dataUrl);
        }
      }
    });

    // Insert before the input area
    if (container.style) {
      container.style.display = container.style.display || '';
      if (!container.style.display || container.style.display === 'block') {
        container.style.display = 'flex';
        container.style.alignItems = container.style.alignItems || 'flex-end';
      }
    }
    container.insertBefore(btn, container.firstChild);
  }

  // Try injecting the button after UI settles
  const observer = new MutationObserver(() => {
    injectUploadButton();
  });

  function startObserving() {
    injectUploadButton();
    observer.observe(document.body, { childList: true, subtree: true });

    // Also retry periodically for the first 10 seconds
    let retries = 10;
    const retry = setInterval(() => {
      injectUploadButton();
      if (--retries <= 0 || document.querySelector('.uclaw-upload-btn')) {
        clearInterval(retry);
      }
    }, 1000);
  }

  if (document.readyState === 'complete') {
    startObserving();
  } else {
    window.addEventListener('load', startObserving);
  }
})();
