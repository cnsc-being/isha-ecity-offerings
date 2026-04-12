document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(r => r.json())
    .then(render)
    .catch(() => {
      document.getElementById('next-card').innerHTML = '<p class="empty-state">Unable to load offerings.</p>';
    });
});

function render({ offerings, recentHappenings }) {
  const today = todayStr();

  const confirmed = offerings.filter(o => !o.comingSoon);
  const comingSoon = offerings.filter(o => o.comingSoon);

  const upcoming = confirmed
    .filter(o => (o.endDate || o.startDate) >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  const pastOfferings = confirmed.filter(o => (o.endDate || o.startDate) < today);
  const allRecent = [...recentHappenings, ...pastOfferings]
    .sort((a, b) => b.startDate.localeCompare(a.startDate));

  // Only confirmed items on the calendar
  const allItems = [...confirmed, ...recentHappenings];

  // Hero
  const hero = upcoming[0];
  document.getElementById('next-card').innerHTML = hero
    ? cardHTML(hero, true)
    : '<p class="empty-state">No upcoming offerings at the moment.</p>';

  // Upcoming + coming soon appended
  const rest = upcoming.slice(1);
  const upcomingHTML = rest.map(o => cardHTML(o)).join('');
  const comingSoonHTML = comingSoon.map(o => cardHTML(o)).join('');
  document.getElementById('upcoming-cards').innerHTML =
    (upcomingHTML || '<p class="empty-state">More offerings coming soon.</p>')
    + (comingSoonHTML ? `<div class="coming-soon-divider">On the Horizon</div>${comingSoonHTML}` : '');

  // Recent
  document.getElementById('recent-cards').innerHTML = allRecent.length
    ? allRecent.map(o => cardHTML(o)).join('')
    : '<p class="empty-state">Nothing here yet.</p>';

  // Expand/collapse details
  document.querySelectorAll('.card-details-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const details = btn.nextElementSibling;
      const open = details.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });
  });

  buildRibbon(allItems);
}

// ── Card ──

function cardHTML(item, isHero = false) {
  const isSoon = item.comingSoon;
  const dateDisplay = isSoon ? 'Dates to be announced' : fmtDateRange(item.startDate, item.endDate);
  const timeDisplay = isSoon ? '' : (item.time ? item.time : 'All Day');
  const dayCount = isSoon ? 0 : getDayCount(item.startDate, item.endDate);

  const tags = item.tags.map(t =>
    `<span class="tag tag-${t.toLowerCase()}">${t}</span>`
  ).join('');

  const actions = (item.actions || []).map(a =>
    `<a class="card-action" href="${a.url}" target="_blank" rel="noopener">${a.label}</a>`
  ).join('');

  const soonBadge = isSoon ? '<span class="card-badge card-badge-soon">Coming Soon</span>' : '';
  const dayBadge = dayCount ? `<span class="card-badge">${dayCount} Days</span>` : '';

  const hasImg = item.image && item.image.trim();
  const poster = hasImg
    ? `<div class="card-poster">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <div class="card-tags">${tags}</div>
        ${soonBadge || dayBadge}
      </div>`
    : '';

  const bodyTags = hasImg ? '' : `<div class="card-tags">${tags}</div>`;
  const bodyBadge = !hasImg
    ? (isSoon ? '<span class="card-badge-inline card-badge-soon">Coming Soon</span>'
      : (dayCount ? `<span class="card-badge-inline">${dayCount} Days</span>` : ''))
    : '';

  // Details section
  let detailsHTML = '';
  if (item.details && item.details.length) {
    detailsHTML = `
      <button class="card-details-toggle" aria-expanded="false">
        <span class="toggle-label">Details</span>
        <span class="toggle-icon">﹀</span>
      </button>
      <div class="card-details">
        <ul>${item.details.map(d => `<li>${d}</li>`).join('')}</ul>
      </div>`;
  }

  return `
    <article class="card${isHero ? ' card-hero' : ''}" id="card-${item.id}">
      ${poster}
      <div class="card-body">
        ${bodyTags}
        <h3 class="card-title">${item.title} ${bodyBadge}</h3>
        <div class="card-meta">
          <span>📅 ${dateDisplay}</span>
          ${timeDisplay ? `<span>🕐 ${timeDisplay}</span>` : ''}
          <span>📍 ${fmtLocation(item.location)}</span>
        </div>
        <p class="card-desc">${item.description}</p>
        ${detailsHTML}
        ${actions ? `<div class="card-actions">${actions}</div>` : ''}
      </div>
    </article>`;
}

// ── Date helpers ──

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function fmtDateRange(start, end) {
  const s = new Date(start + 'T00:00:00');
  if (!end || end === start) {
    return s.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  }
  const e = new Date(end + 'T00:00:00');
  const sameMonth = s.getMonth() === e.getMonth();
  if (sameMonth) {
    return `${s.getDate()} – ${e.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
  }
  return `${s.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${e.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
}

function fmtLocation(loc) {
  if (typeof loc === 'object' && loc.mapUrl) {
    return `<a class="card-location-link" href="${loc.mapUrl}" target="_blank" rel="noopener">${loc.name}</a>`;
  }
  return loc;
}

function getDayCount(start, end) {
  if (!end || end === start) return 0;
  const ms = new Date(end) - new Date(start);
  return Math.round(ms / 86400000) + 1;
}

// Get all dates between start and end (inclusive)
function getDateRange(start, end) {
  const dates = [];
  const s = new Date(start + 'T00:00:00');
  const e = end ? new Date(end + 'T00:00:00') : s;
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

// ── Calendar Ribbon ──

function buildRibbon(allItems) {
  const datesEl = document.getElementById('cal-dates');
  const headEl = document.getElementById('cal-head');
  const today = todayStr();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Build date → items map (expand multi-day ranges)
  const map = {};
  allItems.forEach(item => {
    const range = getDateRange(item.startDate, item.endDate);
    range.forEach(ds => {
      (map[ds] = map[ds] || []).push(item);
    });
  });

  const start = new Date(today + 'T00:00:00');
  start.setDate(start.getDate() - 7);

  let html = '';
  let prevMonth = -1;

  for (let i = 0; i < 52; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const ds = d.toISOString().split('T')[0];
    const m = d.getMonth();

    if (m !== prevMonth) {
      html += `<span class="cal-month-sep" data-m="${m}" data-y="${d.getFullYear()}">${d.toLocaleDateString('en-IN', { month: 'short' })}</span>`;
      prevMonth = m;
    }

    const items = map[ds];
    let cls = 'cal-cell';
    if (ds === today) cls += ' today';

    if (items) {
      const tags = [...new Set(items.flatMap(x => x.tags.map(t => t.toLowerCase())))];
      cls += ' has-event';
      cls += tags.length > 1 ? ' has-multi' : ` has-${tags[0]}`;

      // Check if this date is start, middle, or end of a range
      const rangeItem = items.find(x => x.endDate && x.endDate !== x.startDate);
      if (rangeItem) {
        if (ds === rangeItem.startDate) cls += ' range-start';
        else if (ds === rangeItem.endDate) cls += ' range-end';
        else cls += ' range-mid';
      }

      html += `<button class="${cls}" data-scroll="card-${items[0].id}" data-m="${m}" data-y="${d.getFullYear()}">
        <span class="cal-cell-day">${days[d.getDay()]}</span>
        <span class="cal-cell-num">${d.getDate()}</span>
        <span class="cal-cell-dot"></span>
      </button>`;
    } else {
      html += `<span class="${cls}" data-m="${m}" data-y="${d.getFullYear()}">
        <span class="cal-cell-day">${days[d.getDay()]}</span>
        <span class="cal-cell-num">${d.getDate()}</span>
      </span>`;
    }
  }

  datesEl.innerHTML = html;

  const now = new Date(today + 'T00:00:00');
  setHead(headEl, now.getMonth(), now.getFullYear());

  // Scroll to today
  const todayCell = datesEl.querySelector('.today');
  if (todayCell) todayCell.scrollIntoView({ inline: 'center', behavior: 'instant' });

  // Update header on scroll
  let ticking = false;
  datesEl.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = datesEl.getBoundingClientRect();
      const mid = rect.left + rect.width / 2;
      for (const el of datesEl.querySelectorAll('[data-m]')) {
        const r = el.getBoundingClientRect();
        if (r.left <= mid && r.right >= mid) {
          setHead(headEl, +el.dataset.m, +el.dataset.y);
          break;
        }
      }
      ticking = false;
    });
  });

  // Tap → scroll to card
  datesEl.querySelectorAll('[data-scroll]').forEach(el => {
    el.addEventListener('click', () => {
      const card = document.getElementById(el.dataset.scroll);
      if (!card) return;
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('highlight');
      setTimeout(() => card.classList.remove('highlight'), 1500);
    });
  });
}

function setHead(el, month, year) {
  const name = new Date(year, month).toLocaleDateString('en-IN', { month: 'short' });
  el.innerHTML = `<span class="cal-head-month">${name}</span><span class="cal-head-year">${year}</span>`;
}
