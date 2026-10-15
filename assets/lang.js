/*
 * EN / ES switch for the ChatAssistant website.
 *
 * Every translatable element carries BOTH versions next to each other (data-en / data-es), so editing one
 * language always has the other in front of you and the two can never drift apart. The text inside the element
 * is the English version, which is what visitors without JavaScript (and crawlers) see.
 *
 * English is the default. ?lang=es or ?lang=en selects a language, and the choice is remembered in
 * localStorage (wrapped in try/catch: private mode or blocked storage must never leave the page broken).
 * The browser language is deliberately NOT guessed: a shared link must show the same page to everyone.
 *
 * RULE: never put an <svg> or any other markup that is not part of the translation INSIDE an element with
 * data-en: innerHTML replaces it the first time someone switches language. Put it next to the element instead.
 */
;(function () {
  var KEY = 'chatassistant-lang'
  var LANGS = ['en', 'es']

  function fromUrl() {
    try {
      var match = /[?&]lang=(en|es)(?:&|$)/i.exec(window.location.search)
      return match ? match[1].toLowerCase() : null
    } catch (e) {
      return null
    }
  }

  function stored() {
    try {
      var value = window.localStorage.getItem(KEY)
      return LANGS.indexOf(value) >= 0 ? value : null
    } catch (e) {
      return null
    }
  }

  function remember(lang) {
    try {
      window.localStorage.setItem(KEY, lang)
    } catch (e) {
      /* storage blocked: the ?lang= parameter on internal links still carries the choice */
    }
  }

  function apply(lang) {
    document.documentElement.lang = lang

    var nodes = document.querySelectorAll('[data-en]')
    for (var i = 0; i < nodes.length; i++) {
      var text = nodes[i].getAttribute('data-' + lang)
      // innerHTML (not textContent) because some sentences contain <b> or <a>. The content comes from these
      // same files, never from visitors.
      if (text !== null) nodes[i].innerHTML = text
    }

    var labelled = document.querySelectorAll('[data-label-en]')
    for (var j = 0; j < labelled.length; j++) {
      var label = labelled[j].getAttribute('data-label-' + lang)
      if (label !== null) labelled[j].setAttribute('aria-label', label)
    }

    // Internal links keep the language even when localStorage is not available.
    var links = document.querySelectorAll('a[data-internal]')
    for (var k = 0; k < links.length; k++) {
      var base = links[k].getAttribute('data-internal')
      var hash = ''
      var at = base.indexOf('#')
      if (at >= 0) {
        hash = base.slice(at)
        base = base.slice(0, at)
      }
      links[k].setAttribute('href', base + (lang === 'es' ? '?lang=es' : '') + hash)
    }

    var buttons = document.querySelectorAll('.lang button')
    for (var b = 0; b < buttons.length; b++) {
      buttons[b].setAttribute('aria-pressed', String(buttons[b].getAttribute('data-lang') === lang))
    }
  }

  function syncUrl(lang) {
    // Only rewrite the address when it already names a language, so it keeps telling the truth when shared.
    try {
      if (!fromUrl() || !window.history || !window.history.replaceState) return
      var search = window.location.search.replace(/([?&])lang=(en|es)/i, '$1lang=' + lang)
      window.history.replaceState(null, '', window.location.pathname + search + window.location.hash)
    } catch (e) {
      /* file:// previews or sandboxed frames: nothing to do */
    }
  }

  function start() {
    var initial = fromUrl() || stored() || 'en'
    if (fromUrl()) remember(initial)
    apply(initial)

    var buttons = document.querySelectorAll('.lang button')
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        var lang = this.getAttribute('data-lang')
        if (LANGS.indexOf(lang) < 0) return
        remember(lang)
        apply(lang)
        syncUrl(lang)
      })
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start)
  } else {
    start()
  }
})()
