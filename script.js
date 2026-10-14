/* ==========================================================================
   İLETİŞİM AYARLARI — iletişim bilgilerini YALNIZCA bu alandan düzenleyin.
   Boş bırakılan ("") alanlar sitede hiç gösterilmez; hepsi boşsa iletişim
   bölümünde yalnızca "yakında" notu görünür, çalışmayan buton oluşmaz.
   ========================================================================== */
const GENORA_CONTACT = {
  email: "alp.soner@bilgiedu.net",
  phone: "",        // Örnek biçim: "+90 5xx xxx xx xx"
  whatsapp: "",     // Ülke koduyla, yalnızca rakam: "905xxxxxxxxx"
  address: "",      // Açık adres, tek satır
  mapUrl: "",       // İsteğe bağlı harita bağlantısı (https://...)
  hours: "",        // Örnek: "Hafta içi 09.00–18.00"
  instagram: "",    // Tam bağlantı: "https://www.instagram.com/..."
  linkedin: ""      // Tam bağlantı: "https://www.linkedin.com/company/..."
};

/* E-posta butonunda konu satırı olarak kullanılır. */
const GENORA_MAIL_SUBJECT = "Genora hakkında";

/* ========================================================================== */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Yardımcılar ---------- */
  const clean = (value) => (typeof value === "string" ? value.trim() : "");
  const isEmail = (value) => /^[^\s@<>()"']+@[^\s@<>()"']+\.[^\s@<>()"']{2,}$/.test(value);
  const isHttps = (value) => {
    try { return new URL(value).protocol === "https:"; } catch (e) { return false; }
  };
  const prettyUrl = (value) => value.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "");

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, val]) => {
      if (val === null || val === undefined || val === false) return;
      if (key === "text") node.textContent = val;
      else if (key === "html") node.innerHTML = val; // yalnızca sabit SVG için kullanılır
      else node.setAttribute(key, val === true ? "" : val);
    });
    (children || []).forEach((child) => child && node.appendChild(child));
    return node;
  }

  const COPY_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect x="5" y="5" width="8.5" height="8.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M10.5 3.2V3a1.5 1.5 0 0 0-1.5-1.5H3.5A1.5 1.5 0 0 0 2 3v5.5A1.5 1.5 0 0 0 3.5 10h.3" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
  const ARROW_ICON = '<svg class="btn-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4 10h12m0 0-5-5m5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---------- İletişim bilgilerini yerleştir ---------- */
  function renderContact() {
    const list = document.querySelector("[data-contact-list]");
    const actions = document.querySelector("[data-contact-actions]");
    const empty = document.querySelector("[data-contact-empty]");
    const footer = document.querySelector("[data-contact-footer]");
    if (!list || !actions || !empty) return;

    const c = {};
    Object.keys(GENORA_CONTACT).forEach((key) => { c[key] = clean(GENORA_CONTACT[key]); });

    const items = [];
    const buttons = [];

    if (isEmail(c.email)) {
      const mailto = "mailto:" + c.email + "?subject=" + encodeURIComponent(GENORA_MAIL_SUBJECT);
      items.push({ label: "E-posta", text: c.email, href: "mailto:" + c.email, copy: c.email, copyLabel: "E-posta adresini kopyala" });
      buttons.push({ text: "E-posta gönder", href: mailto, cls: "btn btn-light" });
    }

    const tel = c.phone.replace(/[^\d+]/g, "");
    if (tel.replace(/\D/g, "").length >= 7) {
      items.push({ label: "Telefon", text: c.phone, href: "tel:" + tel, copy: c.phone, copyLabel: "Telefon numarasını kopyala" });
      buttons.push({ text: "Ara", href: "tel:" + tel, cls: "btn btn-outline-light" });
    }

    const wa = c.whatsapp.replace(/\D/g, "");
    if (wa.length >= 8) {
      items.push({ label: "WhatsApp", text: "+" + wa, href: "https://wa.me/" + wa, external: true });
      buttons.push({ text: "WhatsApp’tan yaz", href: "https://wa.me/" + wa, cls: "btn btn-outline-light", external: true });
    }

    if (c.address) {
      items.push({ label: "Adres", text: c.address, href: isHttps(c.mapUrl) ? c.mapUrl : null, external: true });
    }

    if (c.hours) items.push({ label: "Çalışma saatleri", text: c.hours });

    if (isHttps(c.instagram)) items.push({ label: "Instagram", text: prettyUrl(c.instagram), href: c.instagram, external: true });
    if (isHttps(c.linkedin)) items.push({ label: "LinkedIn", text: prettyUrl(c.linkedin), href: c.linkedin, external: true });

    if (!items.length) {
      empty.hidden = false;
      return;
    }

    items.forEach((item) => {
      const value = item.href
        ? el("a", {
            href: item.href,
            text: item.text,
            target: item.external ? "_blank" : null,
            rel: item.external ? "noopener" : null
          })
        : el("span", { text: item.text });

      if (item.external && item.href) {
        value.appendChild(el("span", { class: "visually-hidden", text: " (yeni sekmede açılır)" }));
      }

      const copyBtn = item.copy
        ? el("button", { type: "button", class: "copy-btn", "data-copy": item.copy, "aria-label": item.copyLabel, html: COPY_ICON }, [el("span", { text: "Kopyala", "aria-hidden": "true" })])
        : null;

      list.appendChild(el("div", { class: "contact-item" }, [
        el("dt", { text: item.label }),
        el("dd", {}, [value, copyBtn])
      ]));
    });
    list.hidden = false;

    buttons.forEach((b) => {
      const link = el("a", { class: b.cls, href: b.href, target: b.external ? "_blank" : null, rel: b.external ? "noopener" : null, text: b.text });
      if (b.external) link.appendChild(el("span", { class: "visually-hidden", text: " (yeni sekmede açılır)" }));
      link.insertAdjacentHTML("beforeend", ARROW_ICON);
      actions.appendChild(link);
    });
    actions.hidden = buttons.length === 0;

    if (footer && isEmail(c.email)) {
      footer.appendChild(el("a", { href: "mailto:" + c.email, text: c.email }));
      footer.hidden = false;
    }
  }

  /* ---------- Panoya kopyalama ---------- */
  function initCopy() {
    const status = document.querySelector("[data-copy-status]");

    function fallbackCopy(text) {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(area);
      return ok;
    }

    document.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-copy]");
      if (!btn) return;
      const text = btn.getAttribute("data-copy");
      const label = btn.querySelector("span");

      const done = (ok) => {
        const message = ok ? "Kopyalandı" : "Kopyalanamadı";
        if (label) label.textContent = message;
        if (status) status.textContent = ok ? text + " panoya kopyalandı." : "Kopyalama başarısız oldu.";
        window.clearTimeout(btn._timer);
        btn._timer = window.setTimeout(() => { if (label) label.textContent = "Kopyala"; }, 2200);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => done(true), () => done(fallbackCopy(text)));
      } else {
        done(fallbackCopy(text));
      }
    });
  }

  /* ---------- Mobil menü ---------- */
  function initNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-nav]");
    const label = document.querySelector("[data-nav-label]");
    if (!toggle || !nav) return;

    const mobile = window.matchMedia("(max-width: 859px)");

    const setOpen = (open, returnFocus) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      if (label) label.textContent = open ? "Kapat" : "Menü";
      if (!open && returnFocus) toggle.focus();
    };

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(open, false);
      if (open) {
        const first = nav.querySelector("a");
        if (first) first.focus();
      }
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a") && mobile.matches) setOpen(false, false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setOpen(false, true);
    });

    document.addEventListener("click", (event) => {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (!nav.contains(event.target) && !toggle.contains(event.target)) setOpen(false, false);
    });

    nav.addEventListener("focusout", (event) => {
      if (!mobile.matches || toggle.getAttribute("aria-expanded") !== "true") return;
      const next = event.relatedTarget;
      if (next && !nav.contains(next) && next !== toggle) setOpen(false, false);
    });

    const onChange = () => { if (!mobile.matches) setOpen(false, false); };
    if (mobile.addEventListener) mobile.addEventListener("change", onChange);
    else if (mobile.addListener) mobile.addListener(onChange);
  }

  /* ---------- Üst menü gölgesi ve etkin bölüm ---------- */
  function initHeader() {
    const header = document.querySelector("[data-header]");
    if (header) {
      const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
      update();
      window.addEventListener("scroll", update, { passive: true });
    }

    const links = Array.from(document.querySelectorAll(".nav-list a[href^='#']"));
    const sections = links
      .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
      .filter(Boolean);
    if (!("IntersectionObserver" in window) || !sections.length) return;

    const setCurrent = (id) => {
      links.forEach((link) => {
        if (link.getAttribute("href") === "#" + id) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setCurrent(entry.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((section) => observer.observe(section));

    const hero = document.getElementById("ana-sayfa");
    if (hero) {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) setCurrent(""); });
      }, { rootMargin: "-45% 0px -50% 0px" }).observe(hero);
    }
  }

  /* ---------- SSS akordeonu ---------- */
  function initAccordion() {
    document.querySelectorAll("[data-accordion]").forEach((accordion) => {
      const triggers = Array.from(accordion.querySelectorAll("[data-accordion-trigger]"));

      const setState = (trigger, open) => {
        const panel = document.getElementById(trigger.getAttribute("aria-controls"));
        trigger.setAttribute("aria-expanded", String(open));
        if (panel) panel.classList.toggle("is-open", open);
      };

      triggers.forEach((trigger, index) => {
        setState(trigger, trigger.hasAttribute("data-open"));

        trigger.addEventListener("click", () => {
          setState(trigger, trigger.getAttribute("aria-expanded") !== "true");
        });

        trigger.addEventListener("keydown", (event) => {
          let target = null;
          if (event.key === "ArrowDown") target = triggers[(index + 1) % triggers.length];
          else if (event.key === "ArrowUp") target = triggers[(index - 1 + triggers.length) % triggers.length];
          else if (event.key === "Home") target = triggers[0];
          else if (event.key === "End") target = triggers[triggers.length - 1];
          if (target) {
            event.preventDefault();
            target.focus();
          }
        });
      });
    });
  }

  /* ---------- Görünme animasyonu ---------- */
  function initReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach((item) => observer.observe(item));
  }

  /* ---------- Yıl ---------- */
  function initYear() {
    const year = document.querySelector("[data-year]");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function init() {
    renderContact();
    initCopy();
    initNav();
    initHeader();
    initAccordion();
    initReveal();
    initYear();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
