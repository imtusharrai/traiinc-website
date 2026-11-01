/**
 * js/cms-content.js
 * 
 * TRAI Inc Lightweight Progressive CMS Hydration
 * - Non-blocking: executes during idle periods (requestIdleCallback)
 * - Resilient: 3000ms timeout via AbortController, silent fallback on any failure
 * - Non-destructive: preserves existing DOM layout, scripts, event listeners, and styles
 * - Targeted: only mutates explicitly bound [data-cms-bind] and [data-cms-section] elements
 */
(function() {
  'use strict';

  if (window.__TRAI_CMS_HYDRATED__) return;
  window.__TRAI_CMS_HYDRATED__ = true;

  function runWhenIdle(fn) {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(fn, { timeout: 2000 });
    } else {
      setTimeout(fn, 60);
    }
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderBlocks(blocks) {
    if (!Array.isArray(blocks)) return '';
    return blocks.map(function(block) {
      if (!block || !block.text) return '';
      if (block.type === 'heading') {
        return '<h2>' + escapeHtml(block.text) + '</h2>';
      }
      if (block.type === 'subheading') {
        return '<h3>' + escapeHtml(block.text) + '</h3>';
      }
      return '<p>' + escapeHtml(block.text) + '</p>';
    }).join('');
  }

  function renderSections(sections) {
    if (!Array.isArray(sections)) return '';
    return sections.map(function(sec) {
      if (!sec) return '';
      var html = '';
      if (sec.heading && sec.heading !== 'Introduction') {
        html += '<h2>' + escapeHtml(sec.heading) + '</h2>';
      }
      if (sec.body) {
        var paras = String(sec.body).split(/\n\n+/);
        for (var i = 0; i < paras.length; i++) {
          var p = paras[i].trim();
          if (p) html += '<p>' + escapeHtml(p) + '</p>';
        }
      }
      return html;
    }).join('');
  }

  runWhenIdle(async function hydrateCms() {
    try {
      var slug = document.body ? document.body.getAttribute('data-page') : null;
      if (!slug) return;

      var apiBase = window.__CMS_API_BASE__ ||
        (document.querySelector('meta[name="cms-api-base"]') ? document.querySelector('meta[name="cms-api-base"]').getAttribute('content') : '') ||
        'https://api.traiinc.com';

      var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timeoutId = null;
      if (controller) {
        timeoutId = setTimeout(function() { controller.abort(); }, 3000);
      }

      var fetchUrl = apiBase.replace(/\/+$/, '') + '/api/public/v1/content?slug=' + encodeURIComponent(slug);
      var response = await fetch(fetchUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller ? controller.signal : undefined
      });

      if (timeoutId) clearTimeout(timeoutId);
      if (!response.ok) return;

      var payload = await response.json();
      if (!payload || !payload.item || payload.item.status !== 'published') return;

      var item = payload.item;
      var data = item.data || {};
      var meta = data.meta || {};

      // 1. Hydrate text and attribute bindings [data-cms-bind]
      var bindElements = document.querySelectorAll('[data-cms-bind]');
      for (var b = 0; b < bindElements.length; b++) {
        var el = bindElements[b];
        var key = el.getAttribute('data-cms-bind');
        if (!key) continue;

        if (key === 'title') {
          var titleVal = item.title || meta.title;
          if (titleVal && el.textContent !== titleVal) {
            el.textContent = titleVal;
          }
        } else if (key === 'author') {
          var authorVal = meta.author || data.author;
          if (authorVal && el.textContent !== authorVal) {
            el.textContent = authorVal;
          }
        } else if (key === 'date') {
          var dateVal = meta.date || data.date;
          if (dateVal && el.textContent !== dateVal) {
            el.textContent = dateVal;
          }
        } else if (key === 'read_time') {
          var readVal = meta.read_time || data.read_time;
          if (readVal && el.textContent !== readVal) {
            el.textContent = readVal;
          }
        } else if (key === 'tag') {
          var tagVal = meta.tag || data.tag;
          if (tagVal && el.textContent !== tagVal) {
            el.textContent = tagVal;
          }
        } else if (key === 'image' && el.tagName === 'IMG') {
          var imgVal = meta.image || data.image;
          if (imgVal && el.getAttribute('src') !== imgVal) {
            el.setAttribute('src', imgVal);
          }
        } else if (key === 'takeaways' && (el.tagName === 'UL' || el.tagName === 'OL')) {
          var takeaways = data.takeaways;
          if (Array.isArray(takeaways) && takeaways.length > 0) {
            el.innerHTML = takeaways.map(function(t) {
              return '<li>' + escapeHtml(t) + '</li>';
            }).join('');
          }
        }
      }

      // 2. Hydrate content sections [data-cms-section]
      var contentSection = document.querySelector('[data-cms-section="blog-content"]');
      if (contentSection) {
        var newContentHtml = '';
        if (Array.isArray(data.content) && data.content.length > 0) {
          newContentHtml = renderBlocks(data.content);
        } else if (Array.isArray(data.sections) && data.sections.length > 0) {
          newContentHtml = renderSections(data.sections);
        }

        if (newContentHtml && contentSection.innerHTML.trim() !== newContentHtml.trim()) {
          contentSection.innerHTML = newContentHtml;
        }
      }

      document.body.setAttribute('data-cms-hydrated', 'true');
    } catch (e) {
      if (window.__CMS_DEBUG__) {
        console.debug('CMS progressive hydration skipped:', e.message);
      }
    }
  });
})();
