/* ============================================================
   OPENING SCREEN — Curtain open + reveal main content
============================================================ */
document.getElementById('openCard').addEventListener('click', function () {
  const curtainL = document.querySelector('.opening__curtain--left');
  const curtainR = document.querySelector('.opening__curtain--right');
  const opening  = document.getElementById('opening');
  const main     = document.getElementById('main');

  // 1. Open curtains
  curtainL.classList.add('open');
  curtainR.classList.add('open');

  // 2. Fade out opening screen
  setTimeout(function () {
    opening.style.transition = 'opacity 0.5s ease';
    opening.style.opacity    = '0';
  }, 950);

  // 3. Show main content and boot everything
  setTimeout(function () {
    opening.style.display = 'none';
    main.classList.remove('hidden');

    AOS.init({
      duration : 900,
      once     : true,
      offset   : 55,
      easing   : 'ease-out-cubic',
    });

    startCountdown();
    createPetals();
  }, 1450);
});

/* ============================================================
   FALLING PETALS
============================================================ */
function createPetals() {
  const container = document.getElementById('petals');
  const symbols   = ['🌸', '🌺', '🌼', '🌷', '✿', '❀'];
  const count     = 20;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.classList.add('petal');
    el.setAttribute('aria-hidden', 'true');
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    el.style.left              = (Math.random() * 100) + 'vw';
    el.style.fontSize          = (0.75 + Math.random() * 0.85) + 'rem';
    el.style.opacity           = (0.35 + Math.random() * 0.45).toFixed(2);
    el.style.animationDuration = (7 + Math.random() * 10) + 's';
    el.style.animationDelay    = (Math.random() * 10) + 's';

    container.appendChild(el);
  }
}

/* ============================================================
   COUNTDOWN — target: 14 November 2026, 09:09:00
============================================================ */
function startCountdown() {
  const TARGET = new Date('2026-11-14T09:09:00');

  const elDays  = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins  = document.getElementById('cd-mins');
  const elSecs  = document.getElementById('cd-secs');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function flashTick(el) {
    el.classList.add('tick');
    setTimeout(function () { el.classList.remove('tick'); }, 180);
  }

  function update() {
    const diff = TARGET - Date.now();

    if (diff <= 0) {
      elDays.textContent = elHours.textContent = elMins.textContent = elSecs.textContent = '00';
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    const newDays  = pad(days);
    const newHours = pad(hours);
    const newMins  = pad(mins);
    const newSecs  = pad(secs);

    if (elDays.textContent  !== newDays)  { elDays.textContent  = newDays;  flashTick(elDays);  }
    if (elHours.textContent !== newHours) { elHours.textContent = newHours; flashTick(elHours); }
    if (elMins.textContent  !== newMins)  { elMins.textContent  = newMins;  flashTick(elMins);  }
    if (elSecs.textContent  !== newSecs)  { elSecs.textContent  = newSecs;  flashTick(elSecs);  }
  }

  update();
  setInterval(update, 1000);
}

/* ============================================================
   RSVP FORM SUBMIT — SweetAlert2
============================================================ */
function submitRSVP(e) {
  e.preventDefault();

  const form    = document.getElementById('rsvpForm');
  const name    = document.getElementById('rsvp-name').value.trim();
  const attend  = document.getElementById('rsvp-attend').value;
  const guests  = document.getElementById('rsvp-guests').value;
  const message = document.getElementById('rsvp-msg').value.trim();

  if (!name || !attend) return;

  const isAttending = attend === 'yes';

  Swal.fire({
    title: isAttending ? '🎉 ขอบคุณมากเลย!' : '💌 ขอบคุณที่แจ้งให้ทราบ',
    html: isAttending
      ? [
          '<p style="font-family:\'Sarabun\',sans-serif;font-size:0.92rem;color:#6b5244;line-height:1.9">',
            '<strong style="color:#4a3728">', name, '</strong><br/>',
            'ยืนยันร่วมงาน <strong style="color:#c9a96e">', guests, ' ท่าน</strong><br/>',
            'เราดีใจที่จะได้พบคุณในงาน ✨',
            message ? '<br/><br/><em style="color:#9a7a45;font-family:\'Cormorant Garamond\',serif;font-size:1rem">"' + message + '"</em>' : '',
          '</p>',
        ].join('')
      : [
          '<p style="font-family:\'Sarabun\',sans-serif;font-size:0.92rem;color:#6b5244;line-height:1.9">',
            '<strong style="color:#4a3728">', name, '</strong><br/>',
            'ขอบคุณที่แจ้งให้ทราบ เราเข้าใจนะคะ/ครับ 🙏<br/>',
            'หวังว่าจะมีโอกาสพบกันในโอกาสอื่น',
          '</p>',
        ].join(''),

    confirmButtonText  : 'ขอบคุณ 🙏',
    confirmButtonColor : '#4a3728',
    background         : '#fdf6ec',
    showCloseButton    : true,
    width              : '340px',
    customClass: {
      popup         : 'swal-wedding',
      title         : 'swal-wedding-title',
      confirmButton : 'swal-wedding-btn',
    },
  }).then(function () {
    form.reset();
  });
}

/* ============================================================
   QR CODE POPUP — SweetAlert2
============================================================ */
function showQRCode() {
  Swal.fire({
    title: '💌 ร่วมแสดงความยินดี',
    html: [
      '<p style="',
        'font-family:\'Sarabun\',sans-serif;',
        'font-size:0.88rem;',
        'color:#8a7a6e;',
        'line-height:1.8;',
        'margin-bottom:1.1rem;',
      '">',
        'สแกน QR Code เพื่อส่งของขวัญ<br/>หรือแสดงความยินดีกับเจ้าบ่าวเจ้าสาว',
      '</p>',
      '<div style="',
        'border:1px solid #e8d5b0;',
        'padding:1rem;',
        'display:inline-block;',
        'background:#fff;',
        'line-height:0;',
      '">',
        '<img src="./images/qr-code.png" alt="QR Code" style="',
          'width:200px;',
          'height:200px;',
          'object-fit:contain;',
          'display:block;',
        '" />',
      '</div>',
      '<p style="',
        'font-family:\'Cormorant Garamond\',serif;',
        'font-style:italic;',
        'font-size:0.9rem;',
        'color:#c9a96e;',
        'margin-top:1.1rem;',
        'letter-spacing:0.05em;',
      '">',
        'สำเริง ลำเจียก &amp; ชวัลลักษณ์ อยู่แย้ม',
      '</p>',
    ].join(''),

    showConfirmButton  : true,
    confirmButtonText  : 'ขอบคุณ 🙏',
    confirmButtonColor : '#4a3728',
    background         : '#fdf6ec',
    showCloseButton    : true,
    width              : '340px',

    customClass: {
      popup  : 'swal-wedding',
      title  : 'swal-wedding-title',
      confirmButton: 'swal-wedding-btn',
    },
  });
}
