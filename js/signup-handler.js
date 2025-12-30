/**
 * Sign-up Handler Module
 * Extracted from inline script in sign-up.html for better maintainability
 *
 * @version 2025-12-30.signup.pro.v9.modularized
 */
(function(){
  'use strict';
  /* ===================== VERSION + ANTI-DOUBLE GUARD ===================== */
  var VERSION   = '2025-12-30.signup.pro.v9.sticky-errors.redirect-logs.modularized';
  var GUARD_KEY = '__SP_SIGNUP_BOOTED__';
  /* ===================== DEBUG SIGNATURE ===================== */
  function getDebugFlag(){
    var qs = null;
    try { qs = new URLSearchParams(location.search); } catch(e){}
    function qp(key){
      if (!qs) return false;
      var v = qs.get(key);
      if (!v) return false;
      v = String(v).toLowerCase().trim();
      return (v === '1' || v === 'true' || v === 'yes' || v === 'on');
    }
    function qoff(key){
      if (!qs) return false;
      var v = qs.get(key);
      if (v == null) return false;
      v = String(v).toLowerCase().trim();
      return (v === '0' || v === 'false' || v === 'no' || v === 'off');
    }
    if (qp('debug') || qp('sp_debug') || qp('spdebug')) return true;
    if (qoff('debug') || qoff('sp_debug') || qoff('spdebug')) return false;
    try{
      if (localStorage.getItem('sp_debug') === '1') return true;
      if (localStorage.getItem('sp_signup_debug') === '1') return true;
      if (localStorage.getItem('sp_login_debug') === '1') return true;
    }catch(e){}
    return false;
  }
  /* ===================== LOGS (DISABLED) ===================== */
  var ENABLE_CONSOLE = false; // lasa pe false ca sa NU mai apara loguri
  var DEBUG = getDebugFlag();
  function dlog(){  if (ENABLE_CONSOLE) console.log.apply(console,  ['[Sign-up]'].concat([].slice.call(arguments))); }
  function dwarn(){ if (ENABLE_CONSOLE) console.warn.apply(console, ['[Sign-up]'].concat([].slice.call(arguments))); }
  function derr(){  if (ENABLE_CONSOLE) console.error.apply(console,['[Sign-up]'].concat([].slice.call(arguments))); }
  try{
    window.__SP_SIGNUP_VERSION = VERSION;
    window.__SP_SIGNUP_DEBUG   = !!DEBUG;
  }catch(e){}
  try{
    if (window[GUARD_KEY]) {
      dwarn('Script duplicat detectat. Oprire a doua instanta.', 'Curent:', VERSION, 'Existent:', window[GUARD_KEY]);
      return;
    }
    window[GUARD_KEY] = VERSION;
  }catch(e){}
  /* ===================== BOOT (Webflow-safe) ===================== */
  function boot(fn){
    if (window.Webflow && typeof Webflow.push === 'function') { Webflow.push(fn); return; }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  boot(function(){
    dlog('BOOT ok. VERSION =', VERSION, 'DEBUG =', DEBUG, 'PATH=', location.pathname);
    try{
      var snap = null;
      try { snap = localStorage.getItem('sp_auth_snapshot_v1'); } catch(_){}
      dlog('Global snapshot sp_auth_snapshot_v1:', snap ? ('present (' + snap.length + ' chars)') : 'missing');
      dlog('Global guard marker:', (window.__SP_AUTH_GUARD_VERSION || window.__SP_GLOBAL_AUTH_GUARD_VERSION || window.__SP_GLOBAL_GUARD_VERSION || '(none found)'));
    }catch(_e){}
    /* ===================== CONFIG ===================== */
    var REDIRECT_AFTER = '/';
    var VERIFY_PAGE    = '/verifica-email';
    var MIN_PASS_LEN   = 8;
    var TERMS_VERSION  = 'v1-2025-01';
    var REQUIRE_TERMS_ON_SIGNUP = true;
    var TXT = {
      fillAll: 'Completeaza toate campurile!',
      weakPass: 'Parola trebuie sa aiba cel putin ' + MIN_PASS_LEN + ' caractere.',
      invalidEmail: 'Adresa de email nu este valida.',
      emailInUse: 'Exista deja un cont asociat cu acest email.',
      tooMany: 'Prea multe incercari. Incearca mai tarziu.',
      needTerms: 'Trebuie sa accepti termenii si conditiile.',
      unauthorizedDomain: 'Domeniul nu este autorizat in Firebase (Authentication → Settings → Authorized domains).',
      popupClosed: 'Fereastra de autentificare a fost inchisa.',
      popupBlocked: 'Popup blocat de browser. Permite pop-up-uri pentru acest site.',
      otherMethod: 'Exista deja un cont cu acest email, dar cu alta metoda. Autentifica-te clasic.',
      googleError: 'Eroare Google: ',
      saveProfileFail: 'Cont creat, dar nu am putut salva profilul in baza de date. Reincarca pagina si incearca din nou.'
    };
    var AUTH_HINT_KEY      = 'sp_auth_hint_verify_email_v1';
    var GOOGLE_CONSENT_KEY = 'sp_signup_google_consent_v1';
    function setVerifyEmailHint(){
      try { sessionStorage.setItem(AUTH_HINT_KEY, '1'); } catch(e) {}
    }
    /* ===================== SAFETY ===================== */
    if (!window.firebase || !firebase.auth || !firebase.firestore) {
      derr('Firebase nu este initializat. Verifica Global.html (firebase-app + auth + firestore compat).');
      return;
    }
    var auth = firebase.auth();
    var db   = firebase.firestore();
    var SVT  = firebase.firestore.FieldValue.serverTimestamp;
    /* ===================== PERSISTENCE ===================== */
    var _persistReady = false;
    async function ensurePersistence() {
      if (_persistReady) return;
      try {
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        dlog('ensurePersistence: LOCAL');
      } catch (e1) {
        try {
          await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
          dlog('ensurePersistence: SESSION (fallback)');
        } catch (e2) {
          dwarn('ensurePersistence: nu pot seta persistence', e2);
        }
      }
      _persistReady = true;
    }
    ensurePersistence();
    /* ===================== DEVICE HEURISTICS (Google redirect) ===================== */
    var UA = navigator.userAgent || '';
    var isIOS    = /iP(hone|ad|od)/i.test(UA);
    var isSafari = /^((?!chrome|android).)*safari/i.test(UA) || (isIOS && /Safari/i.test(UA));
    var isInApp  = /(FBAN|FBAV|Instagram|Line\/|Pinterest|Twitter|LinkedInApp|Snapchat)/i.test(UA);
    var shouldUseRedirect = isIOS || isSafari || isInApp;
    dlog('UA flags:', { isIOS:isIOS, isSafari:isSafari, isInApp:isInApp, shouldUseRedirect:shouldUseRedirect });
    function isTouchLike(){
      try{
        if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return true;
      }catch(_){}
      return /Android|iP(hone|ad|od)/i.test(UA);
    }
    /* ===================== HELPERS ===================== */
    function getCheckboxByAttr(wrapper, selector){
      var host = wrapper.querySelector(selector);
      if (!host) return null;
      if (host.tagName === 'INPUT' && host.type === 'checkbox') return host;
      if (typeof host.querySelector === 'function') {
        var inner = host.querySelector('input[type="checkbox"]');
        if (inner) return inner;
      }
      return null;
    }
    function mapSignupError(err){
      var c = (err && err.code) || '';
      if (c === 'auth/email-already-in-use') return TXT.emailInUse;
      if (c === 'auth/invalid-email')       return TXT.invalidEmail;
      if (c === 'auth/weak-password' || c === 'auth/password-does-not-meet-requirements') return TXT.weakPass;
      if (c === 'auth/too-many-requests')   return TXT.tooMany;
      if (c === 'auth/unauthorized-domain') return TXT.unauthorizedDomain;
      return 'Eroare: ' + ((err && err.message) ? err.message : 'necunoscuta');
    }
    function mapGoogleError(err){
      var c = (err && err.code) || '';
      if (c === 'auth/popup-closed-by-user')                     return TXT.popupClosed;
      if (c === 'auth/popup-blocked')                            return TXT.popupBlocked;
      if (c === 'auth/cancelled-popup-request')                  return TXT.popupClosed;
      if (c === 'auth/account-exists-with-different-credential') return TXT.otherMethod;
      if (c === 'auth/unauthorized-domain')                      return TXT.unauthorizedDomain;
      return TXT.googleError + ((err && err.message) ? err.message : 'necunoscuta');
    }
    function getEls(wrapper){
      var pfw    = wrapper.querySelector('.password-full-wrapper');
      var passEl = pfw ? pfw.querySelector('input') : wrapper.querySelector('input[type="password"]');
      var emailEl =
        wrapper.querySelector('input[type="email"]') ||
        wrapper.querySelector('input[autocomplete="email"]') ||
        wrapper.querySelector('input[name="email"], input[name="Email"]');
      var termsEl =
        getCheckboxByAttr(wrapper, '[data-ms-member="consent"]') ||
        wrapper.querySelector('input[type="checkbox"][name*="terms" i]');
      var subscribeEl =
        getCheckboxByAttr(wrapper, '[data-ms-member="subscribe"]') ||
        wrapper.querySelector('input[type="checkbox"][name*="subscribe" i]');
      var wForm = wrapper.closest('.w-form') || wrapper.querySelector('.w-form') || null;
      var wDone = (wForm ? wForm.querySelector('.w-form-done') : null) || wrapper.querySelector('.w-form-done');
      var wFail = (wForm ? wForm.querySelector('.w-form-fail') : null) || wrapper.querySelector('.w-form-fail');
      var errorEl =
        (wFail && wFail.querySelector('[data-error]')) ||
        wrapper.querySelector('[data-error]') ||
        null;
      var submitBtn = wrapper.querySelector('button[type="submit"], input[type="submit"], [data-submit]');
      var googleBtn = wrapper.querySelector('[data-google-btn]');
      return {
        wrapper: wrapper,
        formEl:  (wrapper.tagName === 'FORM') ? wrapper : wrapper.querySelector('form'),
        emailEl: emailEl,
        passEl:  passEl,
        termsEl: termsEl,
        subscribeEl: subscribeEl,
        errorEl: errorEl,
        wDone: wDone,
        wFail: wFail,
        submitBtn: submitBtn,
        googleBtn: googleBtn,
        showPwIcon: wrapper.querySelector('.password-full-wrapper .show-password-icon, .show-password-icon'),
        hidePwIcon: wrapper.querySelector('.password-full-wrapper .hide-password-icon, .hide-password-icon')
      };
    }
    function disableNativeValidation(wrapper){
      var els = getEls(wrapper);
      if (els.formEl) els.formEl.setAttribute('novalidate','true');
      wrapper.querySelectorAll('[required]').forEach(function(el){
        el.removeAttribute('required');
        el.setAttribute('aria-required','true');
      });
    }
    function applyInputHints(wrapper){
      var els = getEls(wrapper);
      if (els.emailEl){
        els.emailEl.setAttribute('autocomplete','email');
        els.emailEl.setAttribute('inputmode','email');
        els.emailEl.setAttribute('autocapitalize','none');
        els.emailEl.setAttribute('autocorrect','off');
        els.emailEl.setAttribute('spellcheck','false');
      }
      if (els.passEl){
        els.passEl.setAttribute('autocomplete','new-password');
        els.passEl.setAttribute('autocapitalize','none');
        els.passEl.setAttribute('autocorrect','off');
        els.passEl.setAttribute('spellcheck','false');
      }
    }
    function clearFieldErrors(wrapper){
      wrapper.querySelectorAll('.ms-invalid,.ms-label-invalid,.ms-checkbox-invalid,[data-invalid]')
        .forEach(function(el){
          el.classList.remove('ms-invalid','ms-label-invalid','ms-checkbox-invalid');
          el.removeAttribute('aria-invalid');
          el.removeAttribute('data-invalid');
        });
    }
    function markInputInvalid(input){
      if (!input) return;
      input.classList.add('ms-invalid');
      input.setAttribute('aria-invalid','true');
      input.setAttribute('data-invalid','1');
    }
    /* ===================== Error Manager (FIXED: sticky error on mobile) ===================== */
    var UI_MAP = new WeakMap();
    function getUI(wrapper){
      var existing = UI_MAP.get(wrapper);
      if (existing) return existing;
      var lastMsg = '';
      function ensureAria(el){
        if (!el) return;
        el.setAttribute('role','alert');
        el.setAttribute('aria-live','polite');
        el.setAttribute('aria-atomic','true');
      }
      function setGlobalError(msg){
        var els = getEls(wrapper);
        lastMsg = String(msg || '');
        if (!els.errorEl) return;
        ensureAria(els.errorEl);
        try{
          if (els.wDone) els.wDone.style.display = 'none';
          if (els.wFail) els.wFail.style.display = 'block';
        }catch(_){}
        els.errorEl.style.display = 'block';
        els.errorEl.textContent = lastMsg;
        try{ els.errorEl.scrollIntoView({behavior:'smooth', block:'center'}); }catch(_){}
        dlog('setGlobalError:', lastMsg);
      }
      function clearGlobalError(reason){
        var els = getEls(wrapper);
        if (!els.errorEl) return;
        els.errorEl.style.display = 'none';
        els.errorEl.textContent = '';
        try{ if (els.wFail) els.wFail.style.display = 'none'; }catch(_){}
        lastMsg = '';
        if (DEBUG && reason) dlog('clearGlobalError:', reason);
      }
      function focusFirstInvalid(){
        var bad = wrapper.querySelector('[data-invalid]');
        if (!bad) return;
        if (isTouchLike()) {
          dlog('focusFirstInvalid: touch-like -> skip focus');
          return;
        }
        try{
          if (typeof bad.focus === 'function') bad.focus({ preventScroll: true });
        }catch(_){
          try{ if (typeof bad.focus === 'function') bad.focus(); }catch(__){}
        }
        try{ bad.scrollIntoView({behavior:'smooth', block:'center'}); }catch(_){}
      }
      wrapper.addEventListener('input', function(){
        if (!lastMsg) return;
        clearGlobalError('user input');
      }, true);
      wrapper.addEventListener('change', function(){
        if (!lastMsg) return;
        clearGlobalError('user change');
      }, true);
      var api = { setGlobalError:setGlobalError, clearGlobalError:clearGlobalError, focusFirstInvalid:focusFirstInvalid };
      UI_MAP.set(wrapper, api);
      return api;
    }
    /* ===================== Lock helper (spinner) ===================== */
    function lock(btn, state){
      if (!btn) return;
      var isInput = btn.tagName === 'INPUT';
      var isButtonLike = (btn.tagName === 'BUTTON' || (isInput && /submit|button/i.test(btn.type)));
      var color =
        getComputedStyle(document.documentElement)
          .getPropertyValue('--ms-spinner-color')
          .trim() || '#050505';
      if (state){
        if (!btn.dataset._w) btn.dataset._w = btn.offsetWidth;
        btn.style.minWidth = btn.dataset._w + 'px';
        if (!isInput){
          if (!btn.dataset._pos) btn.dataset._pos = btn.style.position || '';
          if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
          if (!btn.dataset._origColor) btn.dataset._origColor = btn.style.color || '';
          btn.style.color = 'transparent';
          var toHide = btn.querySelectorAll('.ms-social-image, .social-button-icon, .social-button-text');
          toHide.forEach(function(el){
            if (el && el.dataset._vis === undefined) {
              el.dataset._vis = el.style.visibility || '';
              el.style.visibility = 'hidden';
            }
          });
          var inner = document.createElement('span');
          inner.className = 'ms-btn-in';
          inner.style.color = color;
          inner.innerHTML = '<span class="ms-spinner" aria-hidden="true"></span>';
          btn.appendChild(inner);
          btn.__msInner = inner;
        } else {
          if (btn.dataset._val === undefined) btn.dataset._val = btn.value;
          btn.value = '';
          var parent = btn.parentElement;
          if (parent){
            if (!btn.dataset._parentPos) btn.dataset._parentPos = parent.style.position || '';
            if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
            var rect = { left: btn.offsetLeft, top: btn.offsetTop, w: btn.offsetWidth, h: btn.offsetHeight };
            var ov = document.createElement('span');
            ov.className = 'ms-btn-overlay';
            ov.style.left   = rect.left + 'px';
            ov.style.top    = rect.top  + 'px';
            ov.style.width  = rect.w    + 'px';
            ov.style.height = rect.h    + 'px';
            ov.style.color  = color;
            ov.innerHTML = '<span class="ms-spinner" aria-hidden="true"></span>';
            parent.appendChild(ov);
            btn.__msOverlay = ov;
          }
        }
        btn.classList.add('ms-btn-loading','is-loading');
        btn.setAttribute('aria-busy','true');
        if (isButtonLike) btn.disabled = true;
        else {
          btn.dataset._pe = btn.style.pointerEvents;
          btn.style.pointerEvents = 'none';
          btn.setAttribute('aria-disabled','true');
        }
      } else {
        btn.classList.remove('ms-btn-loading','is-loading');
        btn.removeAttribute('aria-busy');
        if (!isInput){
          if (btn.__msInner && btn.__msInner.parentNode) btn.__msInner.parentNode.removeChild(btn.__msInner);
          delete btn.__msInner;
          if (btn.dataset._origColor !== undefined) btn.style.color = btn.dataset._origColor;
          if (btn.dataset._pos !== undefined) btn.style.position = btn.dataset._pos;
          var toShow = btn.querySelectorAll('.ms-social-image, .social-button-icon, .social-button-text');
          toShow.forEach(function(el){
            if (el && el.dataset._vis !== undefined){
              el.style.visibility = el.dataset._vis;
              delete el.dataset._vis;
            }
          });
        } else {
          if (btn.dataset._val !== undefined) btn.value = btn.dataset._val;
          if (btn.__msOverlay && btn.__msOverlay.parentNode){
            btn.__msOverlay.parentNode.removeChild(btn.__msOverlay);
            delete btn.__msOverlay;
          }
          var parent2 = btn.parentElement;
          if (parent2 && btn.dataset._parentPos !== undefined){
            parent2.style.position = btn.dataset._parentPos;
          }
        }
        btn.style.minWidth = '';
        if (isButtonLike) btn.disabled = false;
        else {
          btn.style.pointerEvents = btn.dataset._pe || '';
          btn.removeAttribute('aria-disabled');
        }
      }
    }
    function initPasswordToggle(wrapper){
      var els = getEls(wrapper);
      if (!els.passEl || (!els.showPwIcon && !els.hidePwIcon)) return;
      function syncIcons(){
        var visible = els.passEl.type === 'text';
        if (els.showPwIcon) els.showPwIcon.style.display = visible ? 'none' : 'flex';
        if (els.hidePwIcon) els.hidePwIcon.style.display = visible ? 'flex' : 'none';
      }
      function togglePassword(ev){
        if (ev) ev.preventDefault();
        els.passEl.type = (els.passEl.type === 'password') ? 'text' : 'password';
        syncIcons();
      }
      els.passEl.type = 'password';
      syncIcons();
      [els.showPwIcon, els.hidePwIcon].forEach(function(icon){
        if (!icon) return;
        icon.addEventListener('click', togglePassword);
      });
    }
    function normalizeButtonTypes(wrapper){
      var els = getEls(wrapper);
      if (els.googleBtn && els.googleBtn.tagName === 'BUTTON') {
        els.googleBtn.setAttribute('type','button');
      }
    }
    function buildConsentFromEls(els){
      return {
        acceptedTerms: !!(els.termsEl && els.termsEl.checked),
        marketingOptIn: !!(els.subscribeEl && els.subscribeEl.checked)
      };
    }
    /* ===================== afterAuth (NO READ) ===================== */
    async function afterAuth(user, isNew, extra){
      extra = extra || {};
      var ref = db.collection('users').doc(user.uid);
      var payload = {
        email: user.email || null,
        lastLogin: SVT()
      };
      if (isNew) {
        payload.createdAt = SVT();
        payload.plan = 'free';
        payload.questionsAnswered = 0;
        payload.aiQuestions = 0;
        var acceptedTerms =
          (typeof extra.acceptedTerms === 'boolean')
            ? extra.acceptedTerms
            : !!REQUIRE_TERMS_ON_SIGNUP;
        payload.acceptTerms = !!acceptedTerms;
        if (payload.acceptTerms) {
          payload.acceptTermsAt = SVT();
          payload.termsVersion  = TERMS_VERSION;
        }
        var marketingOptIn =
          (typeof extra.marketingOptIn === 'boolean')
            ? extra.marketingOptIn
            : false;
        payload.marketingOptIn = !!marketingOptIn;
        if (payload.marketingOptIn) {
          payload.marketingOptInAt = SVT();
        }
      }
      await ref.set(payload, { merge:true });
    }
    async function refreshUserState(user){
      if (!user) return;
      try { await user.reload(); } catch(_e){}
      try { await user.getIdToken(true); } catch(_e2){}
    }
    /* ===================== GOOGLE REDIRECT CONSENT (optional) ===================== */
    var redirectConsent = null;
    try {
      var raw = sessionStorage.getItem(GOOGLE_CONSENT_KEY);
      if (raw) redirectConsent = JSON.parse(raw);
      sessionStorage.removeItem(GOOGLE_CONSENT_KEY);
    } catch(e) {}
    /* ===================== REDIRECT GATE (logs) ===================== */
    var redirectHandling = true;
    var redirectHandled  = false;
    var pendingAutoUser  = null;
    dlog('getRedirectResult: start');
    auth.getRedirectResult().then(async function(res){
      if (res && res.user) {
        redirectHandled = true;
        dlog('getRedirectResult: user ok', { uid: res.user.uid, emailVerified: !!res.user.emailVerified });
        var isNew = !!(res.additionalUserInfo && res.additionalUserInfo.isNewUser);
        var extra = (isNew && redirectConsent) ? redirectConsent : {};
        try{
          await afterAuth(res.user, isNew, extra);
        }catch(err){
          dwarn('afterAuth redirect failed:', err);
          return;
        }
        await refreshUserState(res.user);
        if (res.user && !res.user.emailVerified) setVerifyEmailHint();
        var target = ((res.user && res.user.emailVerified) ? REDIRECT_AFTER : VERIFY_PAGE);
        dlog('redirect (getRedirectResult) ->', target);
        location.replace(target);
      } else {
        dlog('getRedirectResult: no user');
      }
    }).catch(function(err){
      if (DEBUG && err) dwarn('getRedirectResult error:', err.code || err, err);
    }).finally(function(){
      redirectHandling = false;
      dlog('getRedirectResult: finally', { redirectHandled: redirectHandled, pendingAutoUser: pendingAutoUser ? pendingAutoUser.uid : null });
      if (pendingAutoUser && !redirectHandled) {
        (async function(){
          dlog('post-redirectResult: pendingAutoUser redirect');
          await refreshUserState(pendingAutoUser);
          var target2 = (pendingAutoUser.emailVerified ? REDIRECT_AFTER : VERIFY_PAGE);
          dlog('redirect (pendingAutoUser) ->', target2);
          location.replace(target2);
        })();
      }
    });
    /* ===================== ONE-TIME AUTO-REDIRECT (logs) ===================== */
    (function oneTimeAutoRedirect(){
      var p = (location.pathname || '').toLowerCase();
      var isAuthPage = (p.includes('/sign-up') || p.includes('/signup'));
      if (!isAuthPage) return;
      var unsub = auth.onAuthStateChanged(function(user){
        try { unsub && unsub(); } catch(e){}
        dlog('onAuthStateChanged:', { uid: user ? user.uid : null, emailVerified: user ? !!user.emailVerified : null, redirectHandling: redirectHandling });
        if (!user) return;
        if (redirectHandling) {
          pendingAutoUser = user;
          dlog('onAuthStateChanged: defer -> pendingAutoUser set');
          return;
        }
        (async function(){
          await refreshUserState(user);
          var target = (user.emailVerified ? REDIRECT_AFTER : VERIFY_PAGE);
          dlog('redirect (already logged in) ->', target);
          location.replace(target);
        })();
      });
    })();
    /* ===================== INIT PER WRAPPER ===================== */
    var wrappers = Array.from(document.querySelectorAll('[data-ms-form]'));
    if (!wrappers.length) {
      if (DEBUG) dwarn('Nu gasesc [data-ms-form] pe pagina.');
      return;
    }
    wrappers.forEach(function(wrapper){
      disableNativeValidation(wrapper);
      applyInputHints(wrapper);
      initPasswordToggle(wrapper);
      normalizeButtonTypes(wrapper);
      var ui = getUI(wrapper);
      ui.clearGlobalError('init');
    });
    /* ===================== GOOGLE CLICK (capturing) ===================== */
    document.addEventListener('click', async function(e){
      var btn = e.target && e.target.closest ? e.target.closest('[data-google-btn]') : null;
      if (!btn) return;
      var wrapper = btn.closest('[data-ms-form]');
      if (!wrapper) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      var ui  = getUI(wrapper);
      var els = getEls(wrapper);
      if (btn.tagName === 'BUTTON') btn.setAttribute('type','button');
      ui.clearGlobalError('google click');
      clearFieldErrors(wrapper);
      if (els.termsEl && !els.termsEl.checked) {
        markInputInvalid(els.termsEl);
        ui.setGlobalError(TXT.needTerms);
        if (!isTouchLike()){
          try{ els.termsEl.focus({ preventScroll:true }); }catch(_){ try{ els.termsEl.focus(); }catch(__){} }
        }
        return;
      }
      if (btn.dataset.msBusy === '1') return;
      btn.dataset.msBusy = '1';
      lock(btn, true);
      var consentPayload = buildConsentFromEls(els);
      if (!_persistReady) ensurePersistence();
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      if (shouldUseRedirect) {
        try { sessionStorage.setItem(GOOGLE_CONSENT_KEY, JSON.stringify(consentPayload)); } catch(_){}
        try{
          dlog('Google: redirect...');
          await auth.signInWithRedirect(provider);
          return;
        }catch(err){
          lock(btn, false);
          btn.dataset.msBusy = '';
          try { sessionStorage.removeItem(GOOGLE_CONSENT_KEY); } catch(_){}
          ui.setGlobalError(mapGoogleError(err));
          if (DEBUG && err) dwarn('Google redirect error:', err.code, err);
          return;
        }
      }
      var willNavigate = false;
      try{
        dlog('Google: popup...');
        var cred = await auth.signInWithPopup(provider);
        var isNew = !!(cred.additionalUserInfo && cred.additionalUserInfo.isNewUser);
        try{
          await afterAuth(cred.user, isNew, consentPayload);
        }catch(err2){
          dwarn('afterAuth popup failed:', err2);
          ui.setGlobalError(TXT.saveProfileFail);
          return;
        }
        await refreshUserState(cred.user);
        if (cred.user && !cred.user.emailVerified) {
          setVerifyEmailHint();
          willNavigate = true;
          dlog('redirect (google popup) ->', VERIFY_PAGE);
          location.href = VERIFY_PAGE;
          return;
        }
        willNavigate = true;
        dlog('redirect (google popup) ->', REDIRECT_AFTER);
        location.href = REDIRECT_AFTER;
      }catch(err){
        ui.setGlobalError(mapGoogleError(err));
        if (DEBUG && err) dwarn('Google popup error:', err.code, err);
      }finally{
        if (!willNavigate) lock(btn, false);
        btn.dataset.msBusy = '';
      }
    }, true);
    /* ===================== SUBMIT SIGNUP (capturing) ===================== */
    document.addEventListener('submit', async function(e){
      var form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      var wrapper = form.closest('[data-ms-form]');
      if (!wrapper) return;
      var ui  = getUI(wrapper);
      var els = getEls(wrapper);
      disableNativeValidation(wrapper);
      applyInputHints(wrapper);
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      ui.clearGlobalError('submit start');
      clearFieldErrors(wrapper);
      if (!els.emailEl || !els.passEl){
        ui.setGlobalError('Lipsesc campurile din formular.');
        return;
      }
      var email = (els.emailEl.value || '').trim();
      var pass  = (els.passEl.value  || '').trim();
      var hasClientError = false;
      if (!email){ markInputInvalid(els.emailEl); hasClientError = true; }
      if (!pass){  markInputInvalid(els.passEl);  hasClientError = true; }
      var termsMissing = (els.termsEl && !els.termsEl.checked);
      if (termsMissing) {
        markInputInvalid(els.termsEl);
        hasClientError = true;
      }
      if (pass && pass.length < MIN_PASS_LEN) {
        markInputInvalid(els.passEl);
        ui.setGlobalError(TXT.weakPass);
        ui.focusFirstInvalid();
        return;
      }
      if (hasClientError){
        var onlyTerms = termsMissing && !!email && !!pass;
        ui.setGlobalError(onlyTerms ? TXT.needTerms : TXT.fillAll);
        ui.focusFirstInvalid();
        return;
      }
      var consentPayload = buildConsentFromEls(els);
      lock(els.submitBtn, true);
      var unlockNeeded = true;
      try{
        await ensurePersistence();
        dlog('submit: createUserWithEmailAndPassword...');
        var cred = await auth.createUserWithEmailAndPassword(email, pass);
        try{
          await afterAuth(cred.user, true, consentPayload);
        }catch(err2){
          dwarn('afterAuth email/pass failed:', err2);
          ui.setGlobalError(TXT.saveProfileFail);
          ui.focusFirstInvalid();
          return;
        }
        setVerifyEmailHint();
        unlockNeeded = false;
        dlog('redirect (email/pass) ->', VERIFY_PAGE);
        location.href = VERIFY_PAGE;
      }catch(err){
        var code = (err && err.code) || '';
        if (DEBUG && err) dwarn('submit error:', code, err);
        if (code === 'auth/invalid-email' || code === 'auth/email-already-in-use') {
          markInputInvalid(els.emailEl);
        }
        if (code === 'auth/weak-password' || code === 'auth/password-does-not-meet-requirements') {
          markInputInvalid(els.passEl);
        }
        ui.setGlobalError(mapSignupError(err));
        ui.focusFirstInvalid();
      }finally{
        if (unlockNeeded) lock(els.submitBtn, false);
      }
    }, true);
  }); // boot()
})();
