const menuButton = document.querySelector('.menu-toggle');
const menu = document.getElementById('nav-links');

function closeMenu() {
  if (!menuButton || !menu) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  menu.classList.remove('open');
  document.body.classList.remove('menu-open');
}

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => {
    if (!menuButton.contains(event.target) && !menu.contains(event.target)) closeMenu();
  });
  window.matchMedia('(min-width: 741px)').addEventListener('change', closeMenu);
}

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

const inquiry = document.getElementById('inquiry-form');
if (inquiry) {
  const submit = inquiry.querySelector('button[type="submit"]');
  const feedback = inquiry.querySelector('.form-feedback');
  const defaultButtonMarkup = submit.innerHTML;
  const setFeedback = (message, error = false) => {
    feedback.textContent = message;
    feedback.classList.toggle('error', error);
  };

  inquiry.addEventListener('submit', async event => {
    event.preventDefault();
    setFeedback('');
    if (!inquiry.checkValidity()) {
      inquiry.reportValidity();
      return;
    }
    const data = Object.fromEntries(new FormData(inquiry).entries());
    if (data.website) return;

    const isGitHubPages = window.location.hostname.endsWith('.github.io');
    if (isGitHubPages) {
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
      const url = 'mailto:hello@zerahlab.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      setFeedback('Your email application should open a prepared message. Press Send there to finish.');
      window.location.href = url;
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Sending…';
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      });
      let result = {};
      try { result = await response.json(); } catch (_) {}
      if (!response.ok) throw new Error(result.error || 'Unable to send your enquiry at the moment.');
      inquiry.reset();
      setFeedback('Thanks. Your enquiry has been sent to Zerah Labs.');
    } catch (error) {
      setFeedback(error.message || 'Something went wrong. Please use the email link instead.', true);
    } finally {
      submit.disabled = false;
      submit.innerHTML = defaultButtonMarkup;
    }
  });
}
