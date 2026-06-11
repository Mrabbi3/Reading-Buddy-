// rb-icons.jsx — minimal stroked icons + book data, exported to window

const Ic = {
  back: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  sparkle: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" fill="currentColor"/></svg>),
  book: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 5.5A1.5 1.5 0 015.5 4H11v15H5.5A1.5 1.5 0 014 17.5v-12z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M20 5.5A1.5 1.5 0 0018.5 4H13v15h5.5a1.5 1.5 0 001.5-1.5v-12z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>),
  plus: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>),
  list: (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  check: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  apple: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M17.05 12.8c-.03-2.5 2.04-3.7 2.13-3.76-1.16-1.7-2.97-1.93-3.62-1.96-1.54-.16-3 .9-3.78.9-.78 0-1.98-.88-3.25-.86-1.67.03-3.21.97-4.07 2.47-1.74 3.02-.44 7.48 1.24 9.93.82 1.2 1.8 2.54 3.08 2.49 1.24-.05 1.7-.8 3.2-.8 1.49 0 1.91.8 3.21.77 1.33-.02 2.17-1.22 2.98-2.42.94-1.38 1.33-2.72 1.35-2.79-.03-.01-2.59-.99-2.62-3.94zM14.6 5.1c.68-.83 1.14-1.98.02-3.1-.99.12-2.18.66-2.88 1.46-.63.7-1.18 1.86-.18 3 .98.04 2.06-.49 3.04-1.36z"/></svg>),
  follow: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>),
  bookmark: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M6 4h12v16l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>),
  sun: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>),
  refresh: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M3 12a9 9 0 0115.5-6.2M21 4v4h-4M21 12a9 9 0 01-15.5 6.2M3 20v-4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
};

// Library books. covers use warm gradients. Summaries keyed by sentence index in reader.
const BOOKS = [
  {
    id: 'quiet-rooms',
    title: 'The Architecture of Quiet Rooms',
    author: 'Marguerite Vale',
    cover: 'linear-gradient(155deg, #7d6b50 0%, #463b2c 100%)',
    coverText: 'The\nArchitecture\nof Quiet\nRooms',
    progress: 0.62, last: 'last read 2 days ago',
  },
  {
    id: 'shortness',
    title: 'On the Shortness of Life',
    author: 'Seneca · trans. Hale',
    cover: 'linear-gradient(155deg, #9a7b4f 0%, #5f4a2e 100%)',
    coverText: 'On the\nShortness\nof Life',
    progress: 0.18, last: 'last read today',
  },
  {
    id: 'salt-roads',
    title: 'Salt Roads',
    author: 'Idris Okonkwo',
    cover: 'linear-gradient(155deg, #5e6b6a 0%, #2f3937 100%)',
    coverText: 'Salt\nRoads',
    progress: 0.0, last: 'not started',
  },
];

/* ── Reading Buddy logo mark: a reading lamp glowing over an open book.
   Book uses currentColor so it adapts to light/dark surfaces; lamp stays amber. ── */
function RBMark({ size = 26, ...p }) {
  return (
    <img src="images/logo.png" width={size} height={size} alt="Reading Buddy Logo" style={{ borderRadius: 6 }} {...p} />
  );
}

Object.assign(window, { Ic, BOOKS, RBMark });
