const navToggle = document.querySelector('.menu-toggle');
const navLinks = document.getElementById('nav-links');
const closeMenu = () => {
  if (!navToggle || !navLinks) return;
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation');
  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
};
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navLinks.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });
  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', (event) => {
    if (!navToggle.contains(event.target) && !navLinks.contains(event.target)) closeMenu();
  });
  window.matchMedia('(min-width: 681px)').addEventListener('change', closeMenu);
}
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

const form = document.getElementById('inquiry-form');
if (form) {
  const submit = form.querySelector('button[type="submit"]');
  const feedback = form.querySelector('.form-feedback');
  const setFeedback = (message, error = false) => {
    feedback.textContent = message;
    feedback.classList.toggle('error', error);
  };
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFeedback('');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.website) return;
    if (window.location.hostname.toLowerCase().endsWith('.github.io')) {
      const subject = 'Zerah Labs enquiry — ' + data.company;
      const body = [
        'Name: ' + data.name,
        'Company: ' + data.company,
        'Email: ' + data.email,
        'Workflow: ' + data.workflow,
        '',
        'Details:',
        data.message || '(not provided)'
      ].join('\n');
      const mailto = 'mailto:hello@zerahlab.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      setFeedback('Your email app will open with a prepared message. Press Send there to complete your enquiry.');
      window.location.href = mailto;
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Sending your enquiry…';
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      let result = {};
      try { result = await response.json(); } catch (_) {}
      if (!response.ok) throw new Error(result.error || 'Could not send your enquiry. Please try again later.');
      form.reset();
      setFeedback('Thanks for reaching out. Your enquiry has been sent to the Zerah Labs team.');
    } catch (error) {
      setFeedback(error.message || 'We could not send your enquiry. Please try again later.', true);
    } finally {
      submit.disabled = false;
      submit.innerHTML = 'Request a conversation <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 15 15 4M6 4h9v9" /></svg>';
    }
  });
}
