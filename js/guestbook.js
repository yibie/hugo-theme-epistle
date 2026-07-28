(function () {
  document.querySelectorAll('[data-guestbook-form]').forEach(function (form) {
    var status = document.getElementById(form.dataset.statusId);
    var submit = form.querySelector('[type="submit"]');

    function setStatus(message, kind) {
      if (!status) return;
      status.textContent = message;
      status.dataset.kind = kind || '';
    }

    function setError(field, message) {
      if (!field.id) return;
      var error = document.getElementById(field.id + '-error');
      if (!error) return;
      error.textContent = message || '';
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
    }

    function setTurnstileError(message) {
      var error = document.getElementById('guestbook-turnstile-error');
      if (error) error.textContent = message || '';
    }

    form.addEventListener('invalid', function (event) {
      event.preventDefault();
      setError(event.target, event.target.validationMessage);
      setStatus('请检查表单中标出的内容。', 'error');
    }, true);

    form.addEventListener('input', function (event) {
      if (event.target.matches('input, textarea')) setError(event.target, '');
    });

    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) return;
      event.preventDefault();

      var data = new FormData(form);
      if (!data.get('cf-turnstile-response')) {
        setTurnstileError('请先完成人机验证。');
        setStatus('请检查表单中标出的内容。', 'error');
        return;
      }

      setTurnstileError('');
      setStatus('正在寄出...', 'pending');
      submit.disabled = true;

      fetch(form.action, {
        method: form.method || 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      }).then(function (response) {
        if (!response.ok) throw new Error('bad status');
        form.reset();
        if (window.turnstile) window.turnstile.reset();
        setStatus('已寄出，等主人拆信。', 'success');
      }).catch(function () {
        if (window.turnstile) window.turnstile.reset();
        setStatus('没寄出，请稍后再试。', 'error');
      }).finally(function () {
        submit.disabled = false;
      });
    });
  });
})();
