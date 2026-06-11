// rb-reader2.jsx — Kindle-class AI reader: pages, themes, persistent highlights, notes
const { useState: useR2, useRef: useR2Ref, useEffect: useR2E } = React;

const R2BOOK = {
  title: 'The Architecture of Quiet Rooms',
  author: 'Marguerite Vale',
  chapter: 'Chapter Two — A House That Remembers',
  startPage: 48, totalPages: 212,
  minutesLeft: ['about 11 min left in chapter', 'about 8 min left in chapter', 'about 5 min left in chapter'],
  pages: [
    [
      { t: 'The house had been empty for a year, but it did not feel abandoned.',
        s: 'A quiet contradiction opens the chapter: a year of emptiness has not produced the decay you would expect. The narrator wants you to feel presence where there should be absence.' },
      { t: 'It felt, rather, like a held breath — patient, attentive, waiting for someone to come home.',
        s: 'The house is framed as patient and almost alive. Its emptiness reads not as neglect but as anticipation — a held breath waiting to be released.' },
      { t: 'Eleanor set down her case in the hall and listened to the particular silence of rooms that remember.',
        s: 'Eleanor arrives. The phrase "rooms that remember" hands the house a memory of its own, making her less a visitor than someone being received.' },
      { t: 'Dust moved in the late light like something deciding whether to settle.',
        s: 'Even the dust is given hesitation and will. The late, low light marks both the end of a day and a threshold the character is about to cross.' },
      { t: 'She had grown up here, in the long afternoons before the war, and the architecture of those years had arranged itself inside her: which doors stuck, which stairs complained, where the cold gathered.',
        s: 'Her childhood home lives in her body as knowledge — a private map of sticking doors and complaining stairs. "Before the war" quietly dates the loss and the distance she has travelled.' },
      { t: 'A house, she thought, is only the shape we give to waiting.',
        s: 'The chapter\'s thesis, stated plainly: a house is architecture built around longing. It reframes everything before it — the patience, the held breath — as forms of waiting made solid.' },
    ],
    [
      { t: 'Upstairs, the nursery door stood open, though she was certain they had closed it the morning they left.',
        s: 'A small impossibility, placed quietly. Either memory or the house is wrong, and the chapter declines to say which — this is how Vale builds unease without ghosts.' },
      { t: 'The wallpaper had faded everywhere except behind the picture frames, leaving bright rectangles like windows into the year they were hung.',
        s: 'The walls hold a record of what was removed. The bright rectangles are absences made visible — grief shown as preserved color, the book\'s central trick.' },
      { t: 'She pressed her palm to the cold plaster and felt, absurdly, that she was taking a pulse.',
        s: 'Eleanor tests whether the house is alive, half-knowing the gesture is irrational. "Absurdly" lets her keep her dignity while doing it anyway.' },
      { t: 'Houses do not grieve, her father used to say; they only hold still while grief passes through.',
        s: 'The father\'s aphorism reframes the chapter: the stillness Eleanor keeps noticing isn\'t mourning but endurance — a house outlasting a feeling.' },
      { t: 'But he had never stood in this hallway in November, listening to a clock no one had wound still keeping its own private time.',
        s: 'The unwound clock quietly overrules the father\'s rationalism. Something in the house keeps time without permission — memory, the chapter suggests.' },
    ],
    [
      { t: 'In the kitchen she found the teapot exactly where her mother had left it, spout to the window, as if interrupted mid-sentence.',
        s: 'Objects hold the poses of the people who left them. The teapot "mid-sentence" makes the kitchen a conversation paused, not ended.' },
      { t: 'She filled it without deciding to; her hands, it seemed, had chosen to stay before the rest of her had.',
        s: 'The decision to stay is made by habit, not will. Vale locates homecoming in the body — the hands remember the house before the heart admits it.' },
      { t: 'Outside, the garden had gone wild in the gentlest way, roses leaning over the path like neighbours with news.',
        s: 'Even the wilderness here is sociable. The simile turns neglect into welcome, preparing the chapter\'s turn from waiting to arrival.' },
      { t: 'By dusk she had opened every window, and the house breathed the cold evening air like a swimmer surfacing.',
        s: 'The held breath from the chapter\'s first page is finally released. The house "surfacing" completes the long metaphor of suspension — the wait is over.' },
      { t: 'Waiting, it turned out, was something you could end simply by arriving.',
        s: 'The chapter\'s quiet thesis, inverted from the opening. If a house is the shape we give to waiting, then coming home is the act that dissolves it.' },
    ],
  ],
};

const R2_BOOK_SUMMARY = 'Across these chapters, Vale builds one argument in images: the spaces we live in are shaped by waiting. The empty house, the remembered war, Eleanor\u2019s return \u2014 each is a held breath. By the close, \u201Chome\u201D has become less a place than a posture of patience.';

const ASK_ANSWERS = [
  'Look at how often stillness is doing something in this chapter — holding, waiting, keeping time. Vale\u2019s houses are never inert; that\u2019s the engine of the whole book.',
  'The war is never named directly. It lives in the faded wallpaper, the unwound clock, the nursery door — absence is the only witness Vale trusts.',
  'I\u2019d sit with the teapot scene. It\u2019s the smallest sentence in the chapter, and it\u2019s the one where Eleanor actually comes home.',
];

const SIZES = [17, 18.5, 20.5];
const SPACING = [1.58, 1.74, 1.92];

function snippetFor(page, a, b) {
  const sens = R2BOOK.pages[page].slice(a, b + 1).map(x => x.t).join(' ');
  return sens.length > 110 ? sens.slice(0, 110).replace(/\s+\S*$/, '') + '\u2026' : sens;
}

function Reader2({ onBack, highlights, setHighlights, onToast, theme, setTheme }) {
  const [page, setPage] = useR2(0);
  const [turn, setTurn] = useR2(''); // '', 'left', 'right' — page-turn animation
  const [chrome, setChrome] = useR2(true);
  const [sel, setSel] = useR2(null); // {page, a, b, px, py}
  const [aaOpen, setAaOpen] = useR2(false);
  const [drawer, setDrawer] = useR2(false);
  const [sizeI, setSizeI] = useR2(1);
  const [spaceI, setSpaceI] = useR2(1);
  const [sheet, setSheet] = useR2({ open: false }); // {open, kind:'ai'|'note'|'view'|'book', state, hl, page,a,b, aiText}
  const [flash, setFlash] = useR2(null); // {page,a,b,on}
  const timer = useR2Ref(null);

  const goPage = (dir) => {
    const next = page + dir;
    if (next < 0 || next >= R2BOOK.pages.length) return;
    setSel(null); setAaOpen(false);
    setTurn(dir > 0 ? 'right' : 'left');
    setTimeout(() => { setPage(next); setTurn(''); }, 180);
  };

  useR2E(() => {
    const key = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') goPage(1);
      if (e.key === 'ArrowLeft') goPage(-1);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });

  // flash-resweep a range after jumping from marginalia
  useR2E(() => {
    if (!flash || flash.on) return;
    const t = setTimeout(() => setFlash(f => f ? { ...f, on: true } : f), 80);
    return () => clearTimeout(t);
  }, [flash]);

  const hlFor = (p, idx) => highlights.find(h => h.page === p && idx >= h.a && idx <= h.b);

  const tapSentence = (e, idx) => {
    e.stopPropagation();
    const existing = hlFor(page, idx);
    if (existing) { openView(existing); setSel(null); return; }
    const el = e.currentTarget;
    const pos = { px: el.offsetLeft + el.offsetWidth / 2, py: el.offsetTop };
    setSel(s => {
      if (s && s.page === page) {
        return { page, a: Math.min(s.a, idx), b: Math.max(s.b, idx), ...pos };
      }
      return { page, a: idx, b: idx, ...pos };
    });
  };

  const explain = () => {
    if (!sel) return;
    const { a, b } = sel;
    const aiText = R2BOOK.pages[page][b].s;
    const hl = { id: Date.now(), page, a, b, aiText, note: null, snippet: snippetFor(page, a, b) };
    setHighlights(hs => [...hs, hl]);
    setSheet({ open: true, kind: 'ai', state: 'loading', hl });
    setSel(null);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSheet(s => ({ ...s, state: 'loaded' })), 1300);
  };

  const note = () => {
    if (!sel) return;
    const { a, b } = sel;
    const hl = { id: Date.now(), page, a, b, aiText: null, note: '', snippet: snippetFor(page, a, b) };
    setSheet({ open: true, kind: 'note', state: 'loaded', hl, fresh: true });
    setSel(null);
  };

  const openView = (hl) => {
    clearTimeout(timer.current);
    setSheet({ open: true, kind: 'view', state: 'loaded', hl });
  };

  const openBook = () => {
    clearTimeout(timer.current);
    setSheet({ open: true, kind: 'book', state: 'loading' });
    timer.current = setTimeout(() => setSheet(s => ({ ...s, state: 'loaded' })), 1300);
  };

  const saveSheet = (hl, noteText) => {
    const next = { ...hl, note: (noteText || '').trim() || hl.note };
    setHighlights(hs => hs.some(h => h.id === hl.id) ? hs.map(h => h.id === hl.id ? next : h) : [...hs, next]);
    setSheet({ open: false });
    onToast('Saved to your marginalia');
  };

  const removeHl = (hl) => {
    setHighlights(hs => hs.filter(h => h.id !== hl.id));
    setSheet({ open: false });
  };

  const jumpTo = (hl) => {
    setDrawer(false); setPage(hl.page); setSel(null);
    setFlash({ page: hl.page, a: hl.a, b: hl.b, on: false });
  };

  const noteCount = highlights.length;
  const pageNo = R2BOOK.startPage + page;
  const prog = pageNo / R2BOOK.totalPages;

  return (
    <div className={'screen grain r2 r2-' + theme}>
      {/* top chrome */}
      <div className={'reader-topbar r2-bar' + (chrome ? '' : ' hide')}>
        <div className="icon-btn r2-ic" onClick={onBack}><Ic.back /></div>
        <div className="r2-titleblock">
          <div className="r2-btitle">{R2BOOK.title}</div>
          <div className="r2-bchap">{R2BOOK.chapter}</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <div className="icon-btn r2-ic" onClick={() => { setDrawer(true); setAaOpen(false); }} title="Marginalia">
            <Ic.bookmark style={{ width: 18, height: 18 }} />
            {noteCount > 0 && <span className="r2-count">{noteCount}</span>}
          </div>
          <div className="icon-btn r2-ic r2-aa" onClick={() => setAaOpen(o => !o)} title="Display">Aa</div>
          <div className="icon-btn r2-ic" onClick={openBook} title="Summarize book"><Ic.sparkle style={{ width: 17, height: 17 }} /></div>
        </div>
      </div>

      {/* Aa popover */}
      {aaOpen && <AaPopover theme={theme} setTheme={setTheme} sizeI={sizeI} setSizeI={setSizeI} spaceI={spaceI} setSpaceI={setSpaceI} onClose={() => setAaOpen(false)} />}

      {/* page */}
      <div className="scroll" onClick={() => { setChrome(c => !c); setAaOpen(false); setSel(null); }}>
        <div className={'r2-page' + (turn ? ' turn-' + turn : '')} style={{ paddingTop: 104 }}>
          {page === 0 && <div className="rp-meta r2-meta">{R2BOOK.chapter} · p. {pageNo}</div>}
          <p className={'rp-body r2-body' + (page === 0 ? ' r2-drop' : '')}
             style={{ fontSize: SIZES[sizeI], lineHeight: SPACING[spaceI] }}>
            {R2BOOK.pages[page].map((sen, idx) => {
              const hl = hlFor(page, idx);
              const inSel = sel && sel.page === page && idx >= sel.a && idx <= sel.b;
              const inFlash = flash && flash.page === page && idx >= flash.a && idx <= flash.b;
              const cls = 's mk' + ((hl && !inFlash) || inSel || (inFlash && flash.on) ? ' on' : '') + (hl ? ' saved' : '');
              return (
                <React.Fragment key={idx}>
                  <span className={cls} onClick={(e) => tapSentence(e, idx)}>{sen.t}</span>
                  {hl && hl.b === idx && hl.note != null && hl.note !== '' && <sup className="r2-notemark" onClick={(e) => { e.stopPropagation(); openView(hl); }}>✎</sup>}
                  {' '}
                </React.Fragment>
              );
            })}
          </p>

          {sel && (
            <div className="sel-pill" style={{ left: Math.min(Math.max(sel.px, 120), 282), top: sel.py - 8 }} onClick={e => e.stopPropagation()}>
              <button onClick={explain}><span className="star"><Ic.sparkle /></span> Explain</button>
              <span className="sep"></span>
              <button onClick={note}>✎ Note</button>
            </div>
          )}
        </div>
      </div>

      {/* edge tap strips */}
      <div className="r2-edge left" onClick={() => goPage(-1)}></div>
      <div className="r2-edge right" onClick={() => goPage(1)}></div>

      {/* footer */}
      <div className={'r2-foot' + (chrome ? '' : ' dim2')}>
        <div className="r2-prog"><i style={{ width: (prog * 100) + '%' }} /></div>
        <div className="r2-foot-row">
          <button className="r2-pg" onClick={() => goPage(-1)} disabled={page === 0}>‹</button>
          <div className="r2-pgmeta">p. {pageNo} of {R2BOOK.totalPages} · <span>{R2BOOK.minutesLeft[page]}</span></div>
          <button className="r2-pg" onClick={() => goPage(1)} disabled={page === R2BOOK.pages.length - 1}>›</button>
        </div>
      </div>

      <div className="reader-vignette r2-vig"></div>

      <SummarySheet2 sheet={sheet} onClose={() => setSheet({ open: false })}
        onSave={saveSheet} onRemove={removeHl}
        onRetry={() => { setSheet(s => ({ ...s, state: 'loading' })); clearTimeout(timer.current); timer.current = setTimeout(() => setSheet(s => ({ ...s, state: 'loaded' })), 1100); }} />

      <Marginalia open={drawer} highlights={highlights} onClose={() => setDrawer(false)} onJump={jumpTo} />
    </div>
  );
}

Object.assign(window, { Reader2, R2BOOK, R2_BOOK_SUMMARY, ASK_ANSWERS, snippetFor });
