# Isha · Electronic City Sector — Events Page

A single, self-contained web page that lists all the sector's programs and
offerings. Visitors can filter by date, category, and center, and open any event
for full details, venue map links, and registration links.

The page reads its events **live from a Google Sheet**, so volunteers keep it up
to date by editing a spreadsheet — no code changes, no redeploy.

---

## Quick start

1. **Deploy it** — follow [DEPLOY.md](DEPLOY.md). In short: put your published
   Google Sheet CSV link into `index.html`, then upload `index.html` to GitHub
   Pages.
2. **Update events** — edit the Google Sheet. Changes appear on the page within a
   few minutes (Google caches published sheets briefly).

That's it. Everything below is reference.

---

## Files

| File | What it is | Do you upload it? |
|---|---|---|
| **`index.html`** | The complete, **self-contained** page — all styles, fonts, and scripts are inlined into this one file. | **Yes — this is the only file the live site needs.** |
| `events-template.csv` | A starter spreadsheet with the correct column headers and the current events as sample rows. Import it into Google Sheets to get going. | Optional (handy for reference). |
| `DEPLOY.md` | Step-by-step deploy + sheet-setup guide. | Optional. |
| `README.md` | This file. | Optional. |
| `Isha EC Events.dc.html` | The **editable design source** (human-readable). It references `support.js` and the `_ds/` folder. Used only if you want to change the layout/design. | No. |
| `support.js`, `_ds/` | Supporting files for the design source. | No. |

> **"Bundled" explained:** `index.html` is the compiled output of
> `Isha EC Events.dc.html`. The build step packed everything into that single
> file so it works on its own — it does **not** load `support.js`, `_ds/`, or the
> `.dc.html` source at runtime.

---

## How the data works

- The page fetches your published CSV on load and renders those events.
- **One row per venue.** An event held at several venues = several rows that share
  the same `event_id`; the page groups them into one event card with multiple
  locations.
- If the sheet is ever unreachable, the page falls back to a copy of the events
  baked into `index.html`, so it never shows up empty. A small indicator under the
  header tells you whether it's showing **live** or the **saved** list.

### Columns

See the full table in [DEPLOY.md](DEPLOY.md#1-set-up-the-google-sheet). Highlights:

- `event_id`, `title`, `category`, `venue_name`, `center` — required.
- `category` — one of `Sadhana`, `Program`, `Seva`, `Sangha`.
- `center` — one of `Singasandra`, `Electronic City`, `Chandapura`, `Begur`,
  `Sadhguru Sannidhi`, `IYC Coimbatore`, `Online`. Drives the "Where" filter.
- `date` / `end_date` — accept both `YYYY-MM-DD` and the day-first `DD/MM/YYYY`
  that Google Sheets uses by default. Leave blank + set `ongoing` = `yes` for
  always-open offerings.
- `register_link` — full URL; leave blank to show "Details will be shared soon".
- `map_link` — **optional.** Leave blank and the page auto-builds a Google Maps
  search from the venue name + area. Paste a precise pin only to override.

> **Tip — commas in text:** if a `description` (or any field) contains a comma,
> that's fine when you type it directly into a Google Sheets cell. Only watch out
> when *importing* a raw CSV — wrap comma-containing fields in double quotes
> (the starter template already does this).

---

## Venue map links

Each venue name in the event detail popup is a clickable link (with a 📍 pin) that
opens Google Maps:

- **Default:** built automatically from the venue's name + area + center — works
  with no extra effort.
- **Override:** put a specific Google Maps URL in the `map_link` column for that
  row (e.g. a `maps.app.goo.gl/…` share link, or a
  `https://www.google.com/maps/search/?api=1&query=…` link) and the page uses it
  instead.

---

## Editing the design (advanced)

The look and layout live in `Isha EC Events.dc.html` (plus `support.js` and
`_ds/`). If you change the design there, you must **re-bundle** it back into
`index.html` for the live site to reflect the change — editing the `.dc.html`
alone does not update `index.html`.

For simple content changes (events), you never touch these files — just edit the
Google Sheet.
