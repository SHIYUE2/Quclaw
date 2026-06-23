/**
 * branding-inject.js — injected into OpenClaw Control UI.
 *
 * Rebrands the dashboard from "OpenClaw" to "Qu_Claw" without
 * modifying upstream source files.
 */
(function () {
  if (window.__quclawBranding) return;
  window.__quclawBranding = true;

  const BRAND = 'Qu_Claw';
  const ACCENT = '#ff6b35';

  /* ── 1. Page title ── */
  document.title = BRAND;

  /* ── 2. Favicon ── */
  // 缓存破坏版本号（每次构建/图标更新时 bump）
  const ICON_V = '20260621';

  // 移除上游自带的 favicon link（避免与我们的并存）
  document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach(el => el.remove());

  // SVG 图标（现代浏览器优先）
  const svgLink = document.createElement('link');
  svgLink.rel = 'icon';
  svgLink.type = 'image/svg+xml';
  svgLink.href = './favicon.svg?v=' + ICON_V;
  document.head.appendChild(svgLink);

  // 32px PNG 透明底（Chromium 回退 + Windows 任务栏）
  const pngLink = document.createElement('link');
  pngLink.rel = 'icon';
  pngLink.type = 'image/png';
  pngLink.sizes = '32x32';
  pngLink.href = './favicon-32.png?v=' + ICON_V;
  document.head.appendChild(pngLink);

  // Apple touch
  const appleLink = document.createElement('link');
  appleLink.rel = 'apple-touch-icon';
  appleLink.sizes = '180x180';
  appleLink.href = './apple-touch-icon.png?v=' + ICON_V;
  document.head.appendChild(appleLink);

  /* ── 3. Custom CSS overrides ── */
  const style = document.createElement('style');
  style.textContent = `
    /* Accent color override */
    :root {
      --accent: ${ACCENT} !important;
      --accent-hover: #ff8f65 !important;
    }

    /* Brand title styling */
    .brand-title {
      font-size: 0 !important;
      position: relative;
    }
    .brand-title::after {
      content: '${BRAND}';
      font-size: 14px;
      font-weight: 600;
      color: ${ACCENT};
    }
  `;
  document.head.appendChild(style);

  /* ── 4. Text replacement via MutationObserver ── */
  function replaceText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.includes('OpenClaw')) {
        node.textContent = node.textContent.replace(/OpenClaw/g, BRAND);
      }
      if (node.textContent.includes('openclaw')) {
        node.textContent = node.textContent.replace(/openclaw/g, 'qu_claw');
      }
    }
  }

  function walkAndReplace(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
      replaceText(node);
    }
  }

  // Replace in main document
  walkAndReplace(document.body);

  // Watch for new content (SPA navigation)
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          walkAndReplace(node);
        } else if (node.nodeType === Node.TEXT_NODE) {
          replaceText(node);
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Also try to pierce shadow DOMs (OpenClaw uses web components)
  function pierceShadow(root) {
    const all = root.querySelectorAll('*');
    for (const el of all) {
      if (el.shadowRoot) {
        walkAndReplace(el.shadowRoot);
        pierceShadow(el.shadowRoot);
        // Watch shadow root for changes
        const shadowObs = new MutationObserver((mutations) => {
          for (const m of mutations) {
            for (const node of m.addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                walkAndReplace(node);
              }
            }
          }
        });
        shadowObs.observe(el.shadowRoot, { childList: true, subtree: true });
      }
    }
  }

  // Run shadow DOM piercing periodically for the first 10 seconds
  let pierceRetries = 10;
  const pierceInterval = setInterval(() => {
    pierceShadow(document.body);
    if (--pierceRetries <= 0) clearInterval(pierceInterval);
  }, 1000);

  // Also update title on navigation
  const titleObserver = new MutationObserver(() => {
    if (document.title !== BRAND) {
      document.title = BRAND;
    }
  });
  const titleEl = document.querySelector('title');
  if (titleEl) {
    titleObserver.observe(titleEl, { childList: true, characterData: true, subtree: true });
  }
})();
