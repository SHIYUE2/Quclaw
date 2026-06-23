/**
 * Image Analyzer — calls Qwen-VL to describe images.
 *
 * Uses the DashScope OpenAI-compatible endpoint so the same code
 * works with any OpenAI-compatible vision provider.
 */

const https = require('https');
const http = require('http');

const DEFAULT_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
const DEFAULT_MODEL = 'qwen-vl-max';

/**
 * Analyze an image and return a text description.
 *
 * @param {string} base64   - base64-encoded image data (no data: prefix)
 * @param {string} mimeType - e.g. "image/png"
 * @param {object} opts     - { apiKey, baseUrl, model }
 * @returns {Promise<{ok: boolean, description?: string, error?: string}>}
 */
async function analyzeImage(base64, mimeType = 'image/png', opts = {}) {
  const apiKey = opts.apiKey;
  if (!apiKey) {
    return { ok: false, error: '未配置图片识别 API Key，请在配置助手中设置。' };
  }

  const baseUrl = (opts.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');
  const model = opts.model || DEFAULT_MODEL;
  const url = `${baseUrl}/chat/completions`;

  const body = JSON.stringify({
    model,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${base64}` },
          },
          {
            type: 'text',
            text:
              '请用中文详细描述这张图片的内容，包括主要元素、场景、文字（如有）、' +
              '以及可能的意图。描述尽量详细但简洁，控制在 500 字以内。' +
              '如果图片包含代码、报错信息、或技术相关内容，请完整转录。',
          },
        ],
      },
    ],
    max_tokens: 1024,
  });

  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const transport = parsed.protocol === 'https:' ? https : http;

      const req = transport.request(
        parsed,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          timeout: 30000,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              if (res.statusCode !== 200) {
                resolve({
                  ok: false,
                  error: `视觉模型返回 ${res.statusCode}: ${data.slice(0, 200)}`,
                });
                return;
              }
              const json = JSON.parse(data);
              const description =
                json.choices?.[0]?.message?.content || '(无法获取描述)';
              resolve({ ok: true, description });
            } catch (e) {
              resolve({ ok: false, error: `解析响应失败: ${e.message}` });
            }
          });
        },
      );

      req.on('error', (e) =>
        resolve({ ok: false, error: `请求失败: ${e.message}` }),
      );
      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, error: '请求超时（30秒）' });
      });

      req.write(body);
      req.end();
    } catch (e) {
      resolve({ ok: false, error: `请求异常: ${e.message}` });
    }
  });
}

module.exports = { analyzeImage };
