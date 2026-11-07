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

  function sanitizeText(str) {
    if (str == null) return '';
    return String(str)
      .replace(/[\r\n\t]+/g, ' ')
      .trim();
  }

  function isSafeUrl(urlStr) {
    if (!urlStr || typeof urlStr !== 'string') return false;
    var trimmed = urlStr.trim();
    if (/[\r\n\t<>"'`\\]/.test(trimmed)) return false;
    if (/^(javascript|data|vbscript|file|about|blob):/i.test(trimmed)) return false;
    if (trimmed.startsWith('//')) return false;
    if (trimmed.startsWith('/')) return true;
    try {
      var parsed = new URL(trimmed);
      if (parsed.protocol !== 'https:') return false;
      var host = parsed.hostname.toLowerCase();
      if (host === 'traiinc.com' || host.endsWith('.traiinc.com')) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  function setOrUpdateMeta(attrName, attrValue, content) {
    if (!content) return;
    var el = document.querySelector('meta[' + attrName + '="' + attrValue + '"]');
    if (el) {
      if (el.getAttribute('content') !== content) {
        el.setAttribute('content', content);
      }
    } else {
      var newMeta = document.createElement('meta');
      newMeta.setAttribute(attrName, attrValue);
      newMeta.setAttribute('content', content);
      document.head.appendChild(newMeta);
    }
  }

  function setOrUpdateLink(rel, href) {
    if (!href) return;
    var el = document.querySelector('link[rel="' + rel + '"]');
    if (el) {
      if (el.getAttribute('href') !== href) {
        el.setAttribute('href', href);
      }
    } else {
      var newLink = document.createElement('link');
      newLink.setAttribute('rel', rel);
      newLink.setAttribute('href', href);
      document.head.appendChild(newLink);
    }
  }

  function hydrateSeoMetadata(item) {
    if (!item) return;
    var seo = item.seo;
    if (!seo || typeof seo !== 'object') return;

    var data = item.data || {};
    var meta = data.meta || {};

    // 1. Document title: primary seo.meta_title -> fallback item.title -> fallback meta.title
    var rawTitle = seo.meta_title || item.title || meta.title;
    var titleVal = sanitizeText(rawTitle);
    if (titleVal && document.title !== titleVal) {
      document.title = titleVal;
    }

    // 2. Meta description: primary seo.meta_description -> fallback meta.description -> fallback data.description
    var rawDesc = seo.meta_description || meta.description || data.description;
    var descVal = sanitizeText(rawDesc);
    if (descVal) {
      setOrUpdateMeta('name', 'description', descVal);
    }

    // 3. OpenGraph Title & Description
    if (titleVal) {
      setOrUpdateMeta('property', 'og:title', titleVal);
    }
    if (descVal) {
      setOrUpdateMeta('property', 'og:description', descVal);
    }

    // 4. OpenGraph Image & Twitter Image
    var rawImg = seo.og_image || meta.image || data.image;
    if (rawImg && isSafeUrl(rawImg)) {
      var safeImg = rawImg.trim();
      setOrUpdateMeta('property', 'og:image', safeImg);
      setOrUpdateMeta('name', 'twitter:image', safeImg);
      setOrUpdateMeta('name', 'twitter:card', 'summary_large_image');
    }

    // 5. Canonical Link
    var rawCanonical = seo.canonical_url;
    if (rawCanonical && isSafeUrl(rawCanonical)) {
      setOrUpdateLink('canonical', rawCanonical.trim());
    }

    // 6. Twitter Metadata
    if (titleVal) {
      setOrUpdateMeta('name', 'twitter:title', titleVal);
    }
    if (descVal) {
      setOrUpdateMeta('name', 'twitter:description', descVal);
    }

    // 7. Robots Search Engine Indexing (noindex, nofollow control)
    if (typeof seo.noindex === 'boolean') {
      setOrUpdateMeta('name', 'robots', seo.noindex ? 'noindex, nofollow' : 'index, follow');
    }

    // 8. Keywords
    var rawKeywords = seo.keywords || (data.meta && data.meta.keywords);
    if (rawKeywords) {
      setOrUpdateMeta('name', 'keywords', sanitizeText(rawKeywords));
    }
  }

  function hydrateStructuredData(item) {
    if (!item || !document.head) return;
    var data = item.data || {};
    var seo = item.seo || {};
    var type = item.content_type;
    var schemas = [];

    var orgRef = {
      "@type": "Organization",
      "name": "Trai Inc",
      "url": "https://traiinc.com",
      "logo": "https://traiinc.com/img/brand-logo.png"
    };

    if (type === 'blog') {
      var blogSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": sanitizeText(item.title),
        "description": sanitizeText(seo.meta_description || item.summary || (data.meta && data.meta.description)),
        "author": {
          "@type": "Person",
          "name": sanitizeText((data.meta && data.meta.author) || data.author || "Trai Inc Engineering")
        },
        "publisher": orgRef,
        "datePublished": (data.meta && data.meta.date) || item.published_at || item.created_at,
        "dateModified": item.updated_at || item.published_at
      };
      if (seo.og_image && isSafeUrl(seo.og_image)) {
        blogSchema.image = [seo.og_image];
      }
      schemas.push(blogSchema);
    } else if (type === 'service') {
      var serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": sanitizeText(item.title),
        "description": sanitizeText(seo.meta_description || item.summary),
        "provider": orgRef
      };
      schemas.push(serviceSchema);
    }

    // AEO: FAQ Schema Extraction (for Google AI Overviews and Answer Engines)
    var faqItems = [];
    if (data.faq && Array.isArray(data.faq.items)) {
      faqItems = data.faq.items;
    } else if (Array.isArray(data.faqs)) {
      faqItems = data.faqs;
    }

    if (faqItems.length > 0) {
      var faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(function(f) {
          return {
            "@type": "Question",
            "name": sanitizeText(f.q || f.question),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": sanitizeText(f.a || f.answer)
            }
          };
        }).filter(function(q) { return q.name && q.acceptedAnswer.text; })
      };
      if (faqSchema.mainEntity.length > 0) {
        schemas.push(faqSchema);
      }
    }

    if (schemas.length > 0) {
      var existingLd = document.getElementById('cms-structured-data');
      if (!existingLd) {
        existingLd = document.createElement('script');
        existingLd.id = 'cms-structured-data';
        existingLd.type = 'application/ld+json';
        document.head.appendChild(existingLd);
      }
      existingLd.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : { "@context": "https://schema.org", "@graph": schemas });
    }
  }

  function hydrateGlobalSettings(settings) {
    if (!settings || typeof settings !== 'object') return;

    // 1. Promotional / Announcement Campaign Banner
    var bannerText = settings.announcement_text;
    var bannerActive = settings.announcement_active;
    var bannerLink = settings.announcement_link;

    if (bannerActive && bannerText) {
      var existingBanner = document.getElementById('cmsAnnouncementBanner');
      if (!existingBanner) {
        var bannerEl = document.createElement('div');
        bannerEl.id = 'cmsAnnouncementBanner';
        bannerEl.className = 'cms-announcement-banner';
        bannerEl.setAttribute('style', 'background:var(--brand-gradient);color:#ffffff;text-align:center;padding:10px 16px;font-size:13px;font-weight:600;position:relative;z-index:99999;box-shadow:0 2px 8px rgba(0,0,0,0.1);');
        var msg = escapeHtml(bannerText);
        if (bannerLink && isSafeUrl(bannerLink)) {
          bannerEl.innerHTML = '<a href="' + escapeHtml(bannerLink) + '" style="color:#ffffff;text-decoration:underline;display:inline-flex;align-items:center;gap:6px;">' + msg + ' →</a>';
        } else {
          bannerEl.textContent = bannerText;
        }
        document.body.insertBefore(bannerEl, document.body.firstChild);
      }
    }

    // 2. WhatsApp Floating Marketing Widget
    if (settings.whatsapp_active && settings.whatsapp_number) {
      var cleanPhone = String(settings.whatsapp_number).replace(/[^\d]/g, '');
      if (cleanPhone && !document.getElementById('cmsWhatsAppWidget')) {
        var waWidget = document.createElement('a');
        waWidget.id = 'cmsWhatsAppWidget';
        var waText = encodeURIComponent(settings.whatsapp_message || 'Hi Trai Inc, I would like to consult on a project.');
        waWidget.href = 'https://wa.me/' + cleanPhone + '?text=' + waText;
        waWidget.target = '_blank';
        waWidget.rel = 'noopener noreferrer';
        waWidget.setAttribute('aria-label', 'Chat on WhatsApp');
        waWidget.setAttribute('style', 'position:fixed;bottom:24px;right:24px;z-index:9999;width:56px;height:56px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,0.2);transition:transform 0.2s ease;');
        waWidget.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="#ffffff"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/></svg>';
        document.body.appendChild(waWidget);
      }
    }

    // 3. Digital Marketing Analytics Integration (GA4)
    if (settings.ga4_id && !window.__TRAI_GA4_LOADED__) {
      window.__TRAI_GA4_LOADED__ = true;
      var gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(settings.ga4_id);
      document.head.appendChild(gaScript);
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', settings.ga4_id);
    }

    // 4. Fallback Default SEO Branding
    if (settings.site_title && !document.title) {
      document.title = sanitizeText(settings.site_title);
    }
  }

  runWhenIdle(async function hydrateCms() {
    try {
      var slug = document.body ? document.body.getAttribute('data-page') : null;
      if (!slug) return;

      var apiBase = window.__CMS_API_BASE__ ||
        (document.querySelector('meta[name="cms-api-base"]') ? document.querySelector('meta[name="cms-api-base"]').getAttribute('content') : '') ||
        ((typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) ? 'http://localhost:8787' : 'https://api.traiinc.com');

      var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timeoutId = null;
      if (controller) {
        timeoutId = setTimeout(function() { controller.abort(); }, 3000);
      }

      var fetchUrl = apiBase.replace(/\/+$/, '') + '/api/public/v1/content?slug=' + encodeURIComponent(slug);
      var settingsUrl = apiBase.replace(/\/+$/, '') + '/api/public/v1/settings';

      var contentReq = fetch(fetchUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller ? controller.signal : undefined
      }).then(function(res) { return res.ok ? res.json() : null; }).catch(function() { return null; });

      var settingsReq = fetch(settingsUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller ? controller.signal : undefined
      }).then(function(res) { return res.ok ? res.json() : null; }).catch(function() { return null; });

      var results = await Promise.all([contentReq, settingsReq]);
      var payload = results[0];
      var settingsPayload = results[1];

      if (timeoutId) clearTimeout(timeoutId);

      // Hydrate Global Settings (announcement campaign banner, WhatsApp widget, analytics, brand defaults)
      if (settingsPayload && settingsPayload.settings) {
        hydrateGlobalSettings(settingsPayload.settings);
      }

      if (!payload || !payload.item) return;
      if (payload.item.status && payload.item.status !== 'published') return;

      var item = payload.item;
      var data = item.data || {};
      var meta = data.meta || {};

      // 1. Hydrate dynamic SEO metadata in document head
      hydrateSeoMetadata(item);

      // 2. Hydrate dynamic Schema.org JSON-LD Structured Data for AEO
      hydrateStructuredData(item);

    // 2. Hydrate text and attribute bindings [data-cms-bind]
    var bindElements = document.querySelectorAll('[data-cms-bind]');
    for (var b = 0; b < bindElements.length; b++) {
      var el = bindElements[b];
      var key = el.getAttribute('data-cms-bind');
      if (!key) continue;

      if (key === 'title') {
        var titleVal = item.title || meta.title || data.title;
        if (titleVal && el.textContent !== titleVal) {
          el.textContent = titleVal;
        }
      } else if (key === 'subtitle' || key === 'summary') {
        var subVal = item.summary || data.subtitle || data.desc || data.hero_desc || meta.description;
        if (subVal && el.textContent !== subVal) {
          el.textContent = subVal;
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
      } else if (key === 'phone') {
        var phoneVal = (data.contact && data.contact.phone) || data.primary_phone || data.phone;
        if (phoneVal) {
          if (el.tagName === 'A') el.setAttribute('href', 'tel:' + phoneVal.replace(/[^\d+]/g, ''));
          el.textContent = '📞 ' + phoneVal;
        }
      } else if (key === 'email') {
        var emailVal = (data.contact && (data.contact.email_hello || data.contact.email_support)) || data.primary_email || data.email;
        if (emailVal) {
          if (el.tagName === 'A') el.setAttribute('href', 'mailto:' + emailVal);
          el.textContent = '✉️ ' + emailVal;
        }
      } else if (key === 'brand_tagline') {
        var tagLineVal = data.brand_tagline || data.tagline;
        if (tagLineVal && el.textContent !== tagLineVal) {
          el.textContent = tagLineVal;
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

    // 3. Hydrate content sections [data-cms-section]
    var contentSection = document.querySelector('[data-cms-section="blog-content"], [data-cms-section="legal-sections"]');
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

    // 4. Template Re-renderer for non-blog models if client renderer is available
    if (window.__TRAI_RENDERERS__ && typeof window.__TRAI_RENDERERS__[slug] === 'function' && item.content_type !== 'blog') {
      try {
        var dynamicContainer = document.getElementById('content') || document.getElementById('dynamic-content');
        if (dynamicContainer) {
          var updatedHtml = window.__TRAI_RENDERERS__[slug](data, slug);
          if (updatedHtml && dynamicContainer.innerHTML.trim() !== updatedHtml.trim()) {
            dynamicContainer.innerHTML = updatedHtml;
            if (typeof window.__TRAI_REINIT_INTERACTIVE__ === 'function') {
              window.__TRAI_REINIT_INTERACTIVE__();
            }
          }
        }
      } catch (renderErr) {
        if (window.__CMS_DEBUG__) console.debug('Template re-render fallback to static DOM:', renderErr.message);
      }
    }

    // 5. Global Announcement Banner check
    if (data.announcement_banner && data.announcement_banner.active && data.announcement_banner.message) {
      var existingBanner = document.getElementById('cmsAnnouncementBanner');
      if (!existingBanner) {
        var bannerEl = document.createElement('div');
        bannerEl.id = 'cmsAnnouncementBanner';
        bannerEl.className = 'cms-announcement-banner';
        bannerEl.setAttribute('style', 'background:var(--brand-gradient);color:#ffffff;text-align:center;padding:10px 16px;font-size:13px;font-weight:600;position:relative;z-index:99999;box-shadow:0 2px 8px rgba(0,0,0,0.1);');
        var msgHtml = escapeHtml(data.announcement_banner.message);
        if (data.announcement_banner.link && isSafeUrl(data.announcement_banner.link)) {
          bannerEl.innerHTML = '<a href="' + escapeHtml(data.announcement_banner.link) + '" style="color:#ffffff;text-decoration:underline;display:inline-flex;align-items:center;gap:6px;">' + msgHtml + ' →</a>';
        } else {
          bannerEl.textContent = data.announcement_banner.message;
        }
        document.body.insertBefore(bannerEl, document.body.firstChild);
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
