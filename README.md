# Isha — Electronic City

-- Build by meditators, for meditators. [Not official] --

A simple, gentle space for Isha meditators and volunteers in Electronic City to stay connected with Sadhana, Seva, and Sangha.

> An unofficial offering by meditators, for meditators.

---

## How It Works

The entire site runs from **4 files**:

| File | Purpose |
|---|---|
| `data.json` | All events and content — **this is the only file you edit** |
| `index.html` | Page structure |
| `style.css` | Styling |
| `app.js` | Renders cards, calendar ribbon, interactions |

---

## Running Locally

```bash
cd isha_electronic_city
python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser.

---

## Hosting on GitHub Pages

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages → Source → main branch**
3. Site will be live at `https://<username>.github.io/<repo-name>`

No build step needed — it works as-is.

---

## Adding / Updating Events

Everything lives in `data.json`. There are two sections:

- `offerings` — upcoming and future events
- `recentHappenings` — past events

### How the site decides what goes where

- Events in `offerings` with dates **in the future** → show under **"What you can join next"** (nearest one) and **"Upcoming"**
- Events in `offerings` with dates **in the past** → automatically move to **"Recent Happenings"**
- Events with `"comingSoon": true` → show under **"On the Horizon"** with a Coming Soon badge
- Events in `recentHappenings` → always show under **"Recent Happenings"**

So you don't need to manually move events around — just add them to `offerings` and they flow naturally over time.

---

## Event Fields Reference

### Minimal event (fewest fields needed)

```json
{
  "id": "my-event",
  "title": "Isha Kriya — Group Practice",
  "startDate": "2026-05-10",
  "time": "6:30 AM – 7:15 AM",
  "tags": ["Sadhana"],
  "location": "Electronic City",
  "description": "A guided group practice of Isha Kriya.",
  "image": "",
  "actions": [
    { "label": "Join", "url": "#" }
  ]
}
```

### Full event (all possible fields)

```json
{
  "id": "surya-kriya-june",
  "title": "Surya Kriya — Hatha Yoga Offerings",
  "startDate": "2026-06-10",
  "endDate": "2026-06-13",
  "time": "6:30 AM – 8:30 AM",
  "tags": ["Sadhana", "Seva"],
  "location": {
    "name": "St. Joseph's Institute, EC Phase-2",
    "mapUrl": "https://maps.app.goo.gl/your-link"
  },
  "description": "A powerful yogic practice to align the system with the sun cycles.",
  "image": "https://example.com/poster.jpg",
  "details": [
    "4 consecutive classes — all days mandatory",
    "No prior yoga experience needed",
    "Wear comfortable clothing"
  ],
  "comingSoon": true,
  "actions": [
    { "label": "Register as Participant", "url": "https://isha.sadhguru.org/..." },
    { "label": "RSVP as Volunteer", "url": "https://forms.gle/..." },
    { "label": "Know More", "url": "#" }
  ]
}
```

---

## Field-by-Field Guide

| Field | Required | Description |
|---|---|---|
| `id` | ✅ | Unique identifier. Use lowercase with hyphens: `surya-kriya-june` |
| `title` | ✅ | Event name as it should appear on the card |
| `startDate` | ✅ | Start date in `YYYY-MM-DD` format |
| `endDate` | ❌ | End date for multi-day events. Skip for single-day events |
| `time` | ✅ | Time range like `"6:30 AM – 8:30 AM"`. Use `""` for all-day events |
| `tags` | ✅ | Array of tags (see below) |
| `location` | ✅ | Plain string OR object with map link (see below) |
| `description` | ✅ | 1–2 line summary shown on the card |
| `image` | ✅ | Poster/image URL. Use `""` for no image |
| `details` | ❌ | Array of extra info lines — shown on tap via "Details" toggle |
| `comingSoon` | ❌ | Set to `true` for unconfirmed events. Shows "Coming Soon" badge |
| `actions` | ✅ | Array of action buttons (see below) |

---

## Tags

Three tags are supported, each with its own color:

| Tag | Color | Use for |
|---|---|---|
| `Sadhana` | 🟢 Green | Yoga programs, practices, meditations, Hatha Yoga offerings |
| `Seva` | 🟤 Brown | Volunteering, service opportunities, walkathons |
| `Sangha` | 🔵 Blue | Gatherings, satsangs, meetups, trips together |

You can use **one or more** tags per event:

```json
"tags": ["Sadhana"]
"tags": ["Seva", "Sadhana"]
"tags": ["Sadhana", "Seva", "Sangha"]
```

---

## Location

**Plain text** — no link:
```json
"location": "Electronic City"
```

**With clickable map link:**
```json
"location": {
  "name": "St. Joseph's Institute, EC Phase-2",
  "mapUrl": "https://maps.app.goo.gl/your-link"
}
```

---

## Actions

Each action is a button on the card. Common labels:

| Label | When to use |
|---|---|
| `Join` | Open gatherings, satsangs |
| `Register` | Programs with registration |
| `Register as Participant` | Hatha Yoga programs |
| `RSVP as Volunteer` | Volunteer/refresher slots |
| `Offer Seva` | Seva opportunities |
| `Know More` | Link to more info |
| `Show Interest` | Coming soon events |
| `View Moments` | Past events with photos/videos |
| `Join WhatsApp Group` | Group coordination links |

Use `"#"` as the URL if the link isn't ready yet:
```json
{ "label": "Register", "url": "#" }
```

---

## Common Scenarios

### Single-day event
```json
"startDate": "2026-05-10",
"time": "5:30 PM – 7:00 PM"
```

### Multi-day program (e.g., Hatha Yoga)
```json
"startDate": "2026-05-10",
"endDate": "2026-05-13",
"time": "6:30 AM – 8:30 AM"
```
Shows as "10 – 13 May" with a "4 Days" badge.

### All-day event (e.g., trip)
```json
"startDate": "2026-05-10",
"endDate": "2026-05-11",
"time": ""
```
Shows as "10 – 11 May" with "All Day".

### Coming soon (dates not confirmed)
```json
"startDate": "2026-05-15",
"time": "",
"comingSoon": true
```
Shows "Coming Soon" badge and "Dates to be announced".

### Event with poster image
```json
"image": "https://static.sadhguru.org/d/46272/image.jpg"
```
Image shows at the top of the card. Tags overlay on the image.

### Event without image
```json
"image": ""
```
Tags show inside the card body. No empty space.

### Event with extra details
```json
"details": [
  "4 consecutive classes — all days mandatory",
  "Wear comfortable clothing",
  "Light stomach recommended"
]
```
Shows a "Details" toggle — tap to expand.

---

## Moving Events to Recent

You don't need to do anything. Once an event's date passes, it automatically appears under "Recent Happenings".

If you want to add extra context to a past event (like participant count), add it directly to `recentHappenings`:

```json
{
  "id": "ie-march",
  "title": "Inner Engineering Completion",
  "startDate": "2026-03-28",
  "endDate": "2026-03-29",
  "tags": ["Sadhana", "Seva"],
  "location": "Electronic City",
  "description": "71 participants initiated. 40 volunteers supported.",
  "image": "",
  "actions": []
}
```

---

## Calendar Ribbon

The sticky ribbon at the top automatically:
- Shows dates from 7 days ago to 45 days ahead
- Highlights dates with events (color-coded by tag)
- Shows connected strips for multi-day events
- Scrolls to today on page load
- Tapping a date scrolls to that event card

No configuration needed — it reads from the same `data.json`.

---

## Tips

- Always validate your JSON after editing — use [jsonlint.com](https://jsonlint.com) if unsure
- Keep `id` values unique across all events
- Use `YYYY-MM-DD` format for all dates
- Don't use line breaks inside JSON strings — keep each detail as a single line
- Emojis work fine in `details` strings: `"🚌 Free bus service arranged"`
- Images load lazily — large posters won't slow down the page
