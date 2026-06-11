// rb-web-reader.jsx — logged-in web app: library + two-pane reader with margin rail
const { useState: useWR, useEffect: useWRE, useRef: useWRRef } = React;

/* ── Library ── */
function WebLibrary({ onOpen, onToast, onQuota, quotaLeft }) {
  return (
    <div className="grain-w" style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <div className="wa-bar">
        <div className="wa-bar-in">
          <div className="wl-wm"><RBMark size={28} />Reading Buddy</div>
          <div style={{ flex: 1 }}></div>
          <a className="wa-ioslink" onClick={() => onToast('This would open the App Store')}><Ic.apple width="15" height="15" /> Get the iOS app</a>
          <div className="wa-quota" onClick={onQuota}>{quotaLeft} explanations left today</div>
          <div className="wa-av">E</div>
        </div>
      </div>
      <main className="wa-main">
        <h1 className="wa-h1">Library</h1>
        <p className="wa-h1-sub">Welcome back, Eleanor. Salt Roads is still waiting.</p>
        <div className="wa-grid">
          {BOOKS.map((b) => (
            <div className="wa-book" key={b.id} onClick={() => onOpen(b)}>
              <div className="wa-cover" style={{ background: b.cover }}>
                <div className="ct">{b.coverText.split('\n').map((l, k) => <span key={k}>{l}<br /></span>)}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="wa-bt">{b.title}</div>
                <div className="wa-ba">{b.author}</div>
                <div className="wa-prog"><i style={{ width: Math.max(b.progress * 100, 0) + '%' }}></i></div>
                <div className="wa-prog-meta">{b.progress > 0 ? Math.round(b.progress * 100) + '% · ' : ''}{b.last}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="wa-import">
          <button className="w-btn-ghost" onClick={() => onToast('Importing your PDF…')}><Ic.plus /> Import a PDF</button>
        </div>
        <div className="wa-iosbanner">
          <Ic.apple width="26" height="26" />
          <div style={{ flex: 1 }}>
            <div className="tt">Take the chair, not the desk.</div>
            <div className="dd">Your library and margins sync to the iOS app — made for evening reading.</div>
          </div>
          <button className="w-btn-ghost" onClick={() => onToast('This would open the App Store')}>Get the app</button>
        </div>
      </main>
    </div>
  );
}

/* ── Reader ── */
const WR_SIZES = [17.5, 19.5, 21.5];

function WebReader({ onBack, onToast, quotaLeft, useQuota }) {
  const [theme, setTheme] = useWR('paper');
  const [sizeI, setSizeI] = useWR(1);
  const [aaOpen, setAaOpen] = useWR(false);
  const [notes, setNotes] = useWR([
    { id: '0-1', p: 0, i: 1, state: 'done', body: R2BOOK.pages[0][1].s, user: 'The held-breath image — exactly how Gran\u2019s house felt.' },
  ]);
  const [asked, setAsked] = useWR(null); // {q, a, state}
  const [q, setQ] = useWR('');
  const [prog, setProg] = useWR(0.22);
  const askI = useWRRef(0);
  const bodyRef = useWRRef(null);

  useWRE(() => {
    const onScroll = () => {
      const d = document.documentElement;
      const max = d.scrollHeight - window.innerHeight;
      setProg(0.22 + 0.07 * Math.min(1, Math.max(0, window.scrollY / Math.max(max, 1))));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const keyOf = (p, i) => p + '-' + i;
  const noteFor = (p, i) => notes.find((n) => n.id === keyOf(p, i));

  const clickSentence = (p, i) => {
    const existing = noteFor(p, i);
    if (existing) { railFlash(existing.id); return; }
    if (quotaLeft <= 0) { onToast('Out of free explanations today — Plus is unlimited'); return; }
    useQuota();
    const id = keyOf(p, i);
    setNotes((ns) => [...ns, { id, p, i, state: 'thinking', body: '' }].sort((a, b) => a.p - b.p || a.i - b.i));
    setTimeout(() => {
      setNotes((ns) => ns.map((n) => n.id === id ? { ...n, state: 'done', body: R2BOOK.pages[p][i].s } : n));
    }, 950);
  };

  const removeNote = (id, e) => {
    e.stopPropagation();
    setNotes((ns) => ns.filter((n) => n.id !== id));
    onToast('Highlight removed');
  };

  const [flashId, setFlashId] = useWR(null);
  const railFlash = (id) => { setFlashId(id); setTimeout(() => setFlashId(null), 1200); };

  const jumpTo = (n) => {
    const el = document.getElementById('sen-' + n.id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3;
      window.scrollTo({ top: y, behavior: 'smooth' });
      railFlash(n.id);
    }
  };

  const ask = () => {
    const question = q.trim();
    if (!question) return;
    setQ('');
    setAsked({ q: question, a: '', state: 'thinking' });
    const a = ASK_ANSWERS[askI.current % ASK_ANSWERS.length];
    askI.current += 1;
    setTimeout(() => setAsked({ q: question, a, state: 'done' }), 1100);
  };

  return (
    <div className={'wr grain-w ' + (theme === 'ink' ? 'ink-th' : 'paper-th')} data-screen-label="Web reader">
      <div className="wr-bar">
        <div className="wr-bar-in">
          <button className="wr-back" onClick={onBack}><Ic.back width="16" height="16" /> Library</button>
          <div className="wr-bt">
            <div className="t">{R2BOOK.title}</div>
            <div className="c">{R2BOOK.chapter}</div>
          </div>
          <div className="wr-tools">
            <button className="wr-ic" onClick={() => setAaOpen((v) => !v)} title="Type & theme">Aa</button>
          </div>
        </div>
      </div>

      {aaOpen && (
        <div className="wr-aapop">
          <div className="wr-aarow">
            <span className="wr-aalabel">Theme</span>
            <div className="wr-seg">
              <button className={theme === 'paper' ? 'on' : ''} onClick={() => setTheme('paper')}>Paper</button>
              <button className={theme === 'ink' ? 'on' : ''} onClick={() => setTheme('ink')}>Lamplight</button>
            </div>
          </div>
          <div className="wr-aarow">
            <span className="wr-aalabel">Size</span>
            <div className="wr-seg">
              {['A', 'A', 'A'].map((l, k) => (
                <button key={k} className={sizeI === k ? 'on' : ''} style={{ fontSize: 11 + k * 2.5 }} onClick={() => setSizeI(k)}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="wr-layout">
        <article ref={bodyRef}>
          <div className="wr-meta">{R2BOOK.author} · p. 48 of {R2BOOK.totalPages}</div>
          <h1 className="wr-h">{R2BOOK.chapter.replace('Chapter Two — ', '')}</h1>
          <div className="wr-body" style={{ fontSize: WR_SIZES[sizeI] }}>
            {R2BOOK.pages.map((page, p) => (
              <React.Fragment key={p}>
                {p > 0 && <div className="wr-pbreak"><span>· {p + 1} ·</span></div>}
                <p className={p === 0 ? 'wr-drop' : ''} style={{ margin: '0 0 1.4em' }}>
                  {page.map((sen, i) => {
                    const n = noteFor(p, i);
                    const on = n && (n.state === 'done' || n.state === 'thinking');
                    return (
                      <span key={i} id={'sen-' + keyOf(p, i)} className={'s mk' + (on ? ' on' : '')} onClick={() => clickSentence(p, i)}>{sen.t} </span>
                    );
                  })}
                </p>
              </React.Fragment>
            ))}
          </div>
        </article>

        <aside className="wr-rail">
          <div className="wr-rail-sticky">
            <div className="wr-rail-head"><span>Margins</span><span>{notes.length} note{notes.length === 1 ? '' : 's'}</span></div>
            <div className="wr-rail-scroll">
              {notes.length === 0 && <div className="wr-rail-empty">Sweep any sentence and its explanation will appear here, in the margin.</div>}
              {notes.map((n) => (
                <div className="wr-note" key={n.id} onClick={() => jumpTo(n)} style={flashId === n.id ? { borderColor: 'var(--amber)' } : null}>
                  <div className="attr"><Ic.sparkle width="11" height="11" /> Reading Buddy</div>
                  <div className="snip">“{snippetFor(n.p, n.i, n.i)}”</div>
                  {n.state === 'thinking'
                    ? <div className="body thinking">reading closely…</div>
                    : <div className="body">{n.body}</div>}
                  {n.user && <div className="body" style={{ marginTop: 8, fontFamily: 'var(--sans)', fontWeight: 500, fontSize: 13, opacity: 0.75 }}>You: {n.user}</div>}
                  <button className="rm" onClick={(e) => removeNote(n.id, e)}>Remove</button>
                </div>
              ))}
            </div>
            <div className="wr-ask">
              {asked && (
                <div>
                  <p className="wr-ask-q">You asked: {asked.q}</p>
                  {asked.state === 'thinking'
                    ? <p className="wr-ask-a" style={{ opacity: 0.45, fontStyle: 'italic' }}>consulting the chapter…</p>
                    : <p className="wr-ask-a">{asked.a}</p>}
                </div>
              )}
              <div className="wr-ask-row">
                <input className="wr-ask-input" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') ask(); }} placeholder="Ask the book anything…" />
                <button className="wr-send" onClick={ask}>↑</button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="wr-foot">
        <div className="wr-foot-in">
          <div className="bar"><i style={{ width: (prog * 100) + '%' }}></i></div>
          <div className="m">p. {Math.round(prog * R2BOOK.totalPages)} of {R2BOOK.totalPages} · about 11 min left in chapter</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WebLibrary, WebReader });
