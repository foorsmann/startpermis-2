/**
 * Login Handler
 * Start Permis - Driving School Platform
 *
 * Handles user login with email/password and Google OAuth
 * Extracted from inline script for better maintainability and caching
 */

(function(){
  'use strict';
  /* ===================== VERSION + ANTI-DOUBLE GUARD ===================== */
  var VERSION = '2025-12-30.login.pro.v6.modularized';
  var GUARD_KEY = '__SP_LOGIN_BOOTED__';
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
    if (qp('debug') || qp('sp_debug') || qp('spdebug')) return true;
    try{
      if (localStorage.getItem('sp_debug') === '1') return true;
      if (localStorage.getItem('sp_login_debug') === '1') return true;
    }catch(e){}
    return false;
  }
  var DEBUG = getDebugFlag();
  /* ===================== LOGS (DISABLED IN PRODUCTION) ===================== */
  var ENABLE_CONSOLE = DEBUG; // Only enable in debug mode
  function dlog(){ if (ENABLE_CONSOLE) console.log.apply(console, ['[Login]'].concat([].slice.call(arguments))); }
  function dwarn(){ if (ENABLE_CONSOLE) console.warn.apply(console, ['[Login]'].concat([].slice.call(arguments))); }
  function derr(){ if (ENABLE_CONSOLE) console.error.apply(console, ['[Login]'].concat([].slice.call(arguments))); }
  try{ window.__SP_LOGIN_VERSION = VERSION; }catch(e){}
  try{
    if (window[GUARD_KEY]) {
      dwarn('Script duplicat detectat. Oprire a doua instanta. Versiune curenta:', VERSION, 'Existent:', window[GUARD_KEY]);
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
    dlog('BOOT ok. VERSION =', VERSION, 'PATH=', location.pathname);
    try{
      var snap = null;
      try { snap = localStorage.getItem('sp_auth_snapshot_v1'); } catch(_){}
      dlog('Global snapshot sp_auth_snapshot_v1:', snap ? ('present (' + snap.length + ' chars)') : 'missing');
      dlog('Global guard marker:', (window.__SP_AUTH_GUARD_VERSION || window.__SP_GLOBAL_AUTH_GUARD_VERSION || window.__SP_GLOBAL_GUARD_VERSION || '(none found)'));
    }catch(_e){}
    /* ===================== CONFIG ===================== */
    var REDIRECT_AFTER = '/';
    var VERIFY_PAGE    = '/verifica-email';
    var TERMS_VERSION  = 'v1-2025-01';
    var TXT = {
      fillAll: 'Completeaza toate campurile!',
      invalidEmail: 'Adresa de email nu este valida.',
      noUser: 'Nu exista niciun cont cu acest email.',
      wrongCred: 'Email sau parola incorecte.',
      tooMany: 'Prea multe incercari. Incearca mai tarziu.',
      unauthorizedDomain: 'Domeniul nu este autorizat in Firebase (Authentication → Settings → Authorized domains).',
      popupClosed: 'Fereastra de autentificare a fost inchisa.',
      popupBlocked: 'Popup blocat de browser. Permite pop-up-uri pentru acest site.',
      otherMethod: 'Exista deja un cont cu acest email, dar cu alta metoda. Autentifica-te clasic.',
      googleError: 'Eroare Google: ',
      resetNeedEmail: 'Introdu adresa de email pentru a reseta parola!',
      resetOk: 'Ti-am trimis email pentru resetare (verifica si Spam).'
    };
    var AUTH_HINT_KEY = 'sp_auth_hint_verify_email_v1';
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
    async function ensurePersistence(){
      if (_persistReady) return;
      try{
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        dlog('ensurePersistence: LOCAL');
      }catch(e1){
        try{
          await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
          dlog('ensurePersistence: SESSION (fallback)');
        }catch(e2){
          dwarn('ensurePersistence: nu pot seta persistence', e2);
        }
      }
      _persistReady = true;
    }
    ensurePersistence();
    /* ===================== DEVICE HEURISTICS (Google redirect) ===================== */
    var UA = navigator.userAgent || '';
    var isIOS = /iP(hone|ad|od)/i.test(UA);
    var isSafari = /^((?!chrome|android).)*safari/i.test(UA) || (isIOS && /Safari/i.test(UA));
    var isInApp = /(FBAN|FBAV|Instagram|Line\/|Pinterest|Twitter|LinkedInApp|Snapchat)/i.test(UA);
    var shouldUseRedirect = isIOS || isSafari || isInApp;
    dlog('UA flags:', { isIOS:isIOS, isSafari:isSafari, isInApp:isInApp, shouldUseRedirect:shouldUseRedirect });
    function isTouchLike(){
      try{
        if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return true;
      }catch(_){}
      return /Android|iP(hone|ad|od)/i.test(UA);
    }
    /* ===================== FIRESTORE USER PROFILE (NO READ) ===================== */
    async function afterAuth(user, isNew){
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
        payload.acceptTerms   = true;
        payload.acceptTermsAt = SVT();
        payload.termsVersion  = TERMS_VERSION;
        payload.marketingOptIn = false;
      }
      await ref.set(payload, { merge:true });
    }
    async function refreshUserState(user){
      if (!user) return;
      try { await user.reload(); } catch(_e){}
      try { await user.getIdToken(true); } catch(_e2){}
    }
    /* ===================== ERROR MAPPERS ===================== */
    function mapAuthError(e){
      var c = (e && e.code) || '';
      if (c === 'auth/invalid-email') return TXT.invalidEmail;
      if (c === 'auth/user-not-found') return TXT.noUser;
      if (c === 'auth/wrong-password' || c === 'auth/invalid-credential') return TXT.wrongCred;
      if (c === 'auth/too-many-requests') return TXT.tooMany;
      if (c === 'auth/unauthorized-domain') return TXT.unauthorizedDomain;
      return 'Eroare: ' + ((e && e.message) ? e.message : 'necunoscuta');
    }
    function mapGoogleError(e){
      var c = (e && e.code) || '';
      if (c === 'auth/popup-closed-by-user') return TXT.popupClosed;
      if (c === 'auth/popup-blocked') return TXT.popupBlocked;
      if (c === 'auth/cancelled-popup-request') return TXT.popupClosed;
      if (c === 'auth/account-exists-with-different-credential') return TXT.otherMethod;
      if (c === 'auth/unauthorized-domain') return TXT.unauthorizedDomain;
      return TXT.googleError + ((e && e.message) ? e.message : 'necunoscuta');
    }
    /* ===================== DOM HELPERS ===================== */
    function getEls(wrapper){
      var formEl = (wrapper.tagName === 'FORM') ? wrapper : wrapper.querySelector('form');
      var emailEl =
        wrapper.querySelector('input[type="email"]') ||
        wrapper.querySelector('input[autocomplete="username"]') ||
        wrapper.querySelector('input[autocomplete="email"]') ||
        wrapper.querySelector('#login-email') ||
        wrapper.querySelector('input[name="email"], input[name="Email"]') ||
        wrapper.querySelector('input:not([type="password"]):not([type="checkbox"]):not([type="submit"]):not([type="button"])');
      var passSelector =
        'input[name="Password"], input[name="password"], input[name*="parola" i], input[type="password"]';
      var wForm = wrapper.closest('.w-form') || wrapper.querySelector('.w-form') || null;
      var wDone = (wForm ? wForm.querySelector('.w-form-done') : null) || wrapper.querySelector('.w-form-done');
      var wFail = (wForm ? wForm.querySelector('.w-form-fail') : null) || wrapper.querySelector('.w-form-fail');
      var errorEl =
        (wFail && wFail.querySelector('[data-error]')) ||
        wrapper.querySelector('[data-error]') ||
        null;
      return {
        wrapper: wrapper,
        formEl: formEl,
        emailEl: emailEl,
        passEl: wrapper.querySelector(passSelector),
        errorEl: errorEl,
        wDone: wDone,
        wFail: wFail,
        forgotLink: wrapper.querySelector('[data-forgot-link]'),
        forgotMsg:  wrapper.querySelector('[data-forgot-message]'),
        submitBtn:  wrapper.querySelector('button[type="submit"], input[type="submit"], [data-submit]'),
        googleBtn:  wrapper.querySelector('[data-google-btn]'),
        showPwIcon: wrapper.querySelector('.show-password-icon'),
        hidePwIcon: wrapper.querySelector('.hide-password-icon')
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
        if (!els.emailEl.getAttribute('autocomplete')) els.emailEl.setAttribute('autocomplete','username');
        if (!els.emailEl.getAttribute('inputmode')) els.emailEl.setAttribute('inputmode','email');
        if (!els.emailEl.getAttribute('autocapitalize')) els.emailEl.setAttribute('autocapitalize','none');
        if (!els.emailEl.getAttribute('autocorrect')) els.emailEl.setAttribute('autocorrect','off');
        if (!els.emailEl.getAttribute('spellcheck')) els.emailEl.setAttribute('spellcheck','false');
      }
      if (els.passEl){
        if (!els.passEl.getAttribute('autocomplete')) els.passEl.setAttribute('autocomplete','current-password');
        if (!els.passEl.getAttribute('autocapitalize')) els.passEl.setAttribute('autocapitalize','none');
        if (!els.passEl.getAttribute('autocorrect')) els.passEl.setAttribute('autocorrect','off');
        if (!els.passEl.getAttribute('spellcheck')) els.passEl.setAttribute('spellcheck','false');
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
    /* ===================== UI (FIXED: sticky error on mobile) ===================== */
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
      function clearForgotMsg(){
        var els = getEls(wrapper);
        if (!els.forgotMsg) return;
        els.forgotMsg.style.display = 'none';
        els.forgotMsg.textContent = '';
        els.forgotMsg.style.color = '';
      }
      function setForgotMsg(msg, color){
        var els = getEls(wrapper);
        if (!els.forgotMsg) return;
        els.forgotMsg.style.display = 'block';
        els.forgotMsg.textContent = String(msg || '');
        if (color) els.forgotMsg.style.color = color;
        dlog('forgotMsg:', msg);
      }
      wrapper.addEventListener('input', function(){
        if (!lastMsg) return;
        clearGlobalError('user input');
      }, true);
      wrapper.addEventListener('change', function(){
        if (!lastMsg) return;
        clearGlobalError('user change');
      }, true);
      var api = {
        setGlobalError: setGlobalError,
        clearGlobalError: clearGlobalError,
        focusFirstInvalid: focusFirstInvalid,
        clearForgotMsg: clearForgotMsg,
        setForgotMsg: setForgotMsg
      };
      UI_MAP.set(wrapper, api);
      return api;
    }
    /* ===================== BUTTON LOCK (spinner) ===================== */
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
        await afterAuth(res.user, isNew);
        await refreshUserState(res.user);
        if (res.user && !res.user.emailVerified) setVerifyEmailHint();
        var target = ((res.user && res.user.emailVerified) ? REDIRECT_AFTER : VERIFY_PAGE);
        dlog('redirect (getRedirectResult) ->', target);
        location.replace(target);
      } else {
        dlog('getRedirectResult: no user');
      }
    }).catch(function(e){
      if (DEBUG && e) dwarn('getRedirectResult error:', e.code || e, e);
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
    /* ===================== ONE-TIME AUTO-REDIRECT ===================== */
    (function oneTimeAutoRedirect(){
      var p = (location.pathname || '').toLowerCase();
      var isAuthPage = (p.includes('/login') || p.includes('/sign-up') || p.includes('/signup'));
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
      var ui  = getUI(wrapper);
      var els = getEls(wrapper);
      ui.clearGlobalError('init');
      ui.clearForgotMsg();
      if (els.passEl && (els.showPwIcon || els.hidePwIcon)) {
        function syncPwIcons() {
          var isVisible = els.passEl.type === 'text';
          if (els.showPwIcon) els.showPwIcon.style.display = isVisible ? 'none' : 'flex';
          if (els.hidePwIcon) els.hidePwIcon.style.display = isVisible ? 'flex' : 'none';
        }
        function togglePw(ev){
          if (ev) ev.preventDefault();
          els.passEl.type = (els.passEl.type === 'password') ? 'text' : 'password';
          syncPwIcons();
        }
        els.passEl.type = 'password';
        syncPwIcons();
        [els.showPwIcon, els.hidePwIcon].forEach(function(icon){
          if (!icon) return;
          icon.addEventListener('click', togglePw);
        });
      }
      /* RESET PAROLA */
      if (els.forgotLink){
        els.forgotLink.addEventListener('click', async function(e){
          e.preventDefault();
          ui.clearForgotMsg();
          var email = (els.emailEl && els.emailEl.value.trim()) || '';
          if (!email) {
            ui.setForgotMsg(TXT.resetNeedEmail, 'red');
            return;
          }
          try{
            await auth.sendPasswordResetEmail(email);
            ui.setForgotMsg(TXT.resetOk, 'green');
          }catch(er){
            var msg =
              (er && er.code === 'auth/user-not-found') ? TXT.noUser :
              (er && er.code === 'auth/invalid-email') ? TXT.invalidEmail :
              ('Eroare: ' + ((er && er.message) ? er.message : 'necunoscuta'));
            ui.setForgotMsg(msg, 'red');
            if (DEBUG) dwarn('reset error:', er && er.code, er);
          }
        });
      }
      /* GOOGLE */
      if (els.googleBtn){
        if (els.googleBtn.tagName === 'BUTTON') els.googleBtn.setAttribute('type','button');
        els.googleBtn.addEventListener('click', async function(e){
          e.preventDefault();
          ui.clearGlobalError('google click');
          ui.clearForgotMsg();
          clearFieldErrors(wrapper);
          if (els.googleBtn.dataset.msBusy === '1') return;
          els.googleBtn.dataset.msBusy = '1';
          var provider = new firebase.auth.GoogleAuthProvider();
          provider.setCustomParameters({ prompt: 'select_account' });
          await ensurePersistence();
          if (shouldUseRedirect) {
            lock(els.googleBtn, true);
            try{
              dlog('Google: redirect...');
              await auth.signInWithRedirect(provider);
              return;
            }catch(er){
              lock(els.googleBtn, false);
              els.googleBtn.dataset.msBusy = '';
              ui.setGlobalError(mapGoogleError(er));
              if (DEBUG) dwarn('Google redirect error:', er && er.code, er);
              return;
            }
          }
          lock(els.googleBtn, true);
          var willNavigate = false;
          try{
            dlog('Google: popup...');
            var cred = await auth.signInWithPopup(provider);
            var isNew = !!(cred.additionalUserInfo && cred.additionalUserInfo.isNewUser);
            await afterAuth(cred.user, isNew);
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
          }catch(er){
            ui.setGlobalError(mapGoogleError(er));
            if (DEBUG) dwarn('Google popup error:', er && er.code, er);
          }finally{
            if (!willNavigate) lock(els.googleBtn, false);
            els.googleBtn.dataset.msBusy = '';
          }
        });
      }
    });
    /* ===================== SUBMIT LOGIN (capturing) ===================== */
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
      ui.clearForgotMsg();
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
      if (hasClientError){
        ui.setGlobalError(TXT.fillAll);
        ui.focusFirstInvalid();
        return;
      }
      lock(els.submitBtn, true);
      var unlockNeeded = true;
      try{
        await ensurePersistence();
        dlog('submit: signInWithEmailAndPassword...');
        var cred = await auth.signInWithEmailAndPassword(email, pass);
        await afterAuth(cred.user, false);
        await refreshUserState(cred.user);
        if (cred.user && !cred.user.emailVerified) {
          setVerifyEmailHint();
          unlockNeeded = false;
          dlog('redirect (email/pass) ->', VERIFY_PAGE);
          location.href = VERIFY_PAGE;
          return;
        }
        unlockNeeded = false;
        dlog('redirect (email/pass) ->', REDIRECT_AFTER);
        location.href = REDIRECT_AFTER;
      }catch(er){
        var code = (er && er.code) || '';
        if (DEBUG) dwarn('submit error:', code, er);
        if (code === 'auth/invalid-email' || code === 'auth/user-not-found') markInputInvalid(els.emailEl);
        if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') markInputInvalid(els.passEl);
        ui.setGlobalError(mapAuthError(er));
        ui.focusFirstInvalid();
      }finally{
        if (unlockNeeded) lock(els.submitBtn, false);
      }
    }, true);
  }); // boot()
})();
