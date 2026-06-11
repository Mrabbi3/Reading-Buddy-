import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Ic } from '../../src/components/web/icons';
import { R2BOOK, snippetFor } from '../../src/data/books';
import { askGemini } from '../../src/lib/gemini';

const WR_SIZES = [17.5, 19.5, 21.5];

export default function WebReader() {
  const router = useRouter();
  const [theme, setTheme] = useState('paper');
  const [sizeI, setSizeI] = useState(1);
  const [aaOpen, setAaOpen] = useState(false);
  const [notes, setNotes] = useState<any[]>([
    { id: '0-1', p: 0, i: 1, state: 'done', body: R2BOOK.pages[0][1].s, user: 'The held-breath image — exactly how Gran\u2019s house felt.' },
  ]);
  const [asked, setAsked] = useState<any>(null); // {q, a, state}
  const [q, setQ] = useState('');
  const [prog, setProg] = useState(0.22);
  const bodyRef = useRef<HTMLElement>(null);
  const quotaLeft = 3;

  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement;
      const max = d.scrollHeight - window.innerHeight;
      setProg(0.22 + 0.07 * Math.min(1, Math.max(0, window.scrollY / Math.max(max, 1))));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const keyOf = (p: number, i: number) => p + '-' + i;
  const noteFor = (p: number, i: number) => notes.find((n) => n.id === keyOf(p, i));

  const clickSentence = async (p: number, i: number) => {
    const existing = noteFor(p, i);
    if (existing) { railFlash(existing.id); return; }
    
    const id = keyOf(p, i);
    const sentenceText = R2BOOK.pages[p][i].t;
    
    setNotes((ns) => [...ns, { id, p, i, state: 'thinking', body: '' }].sort((a, b) => a.p - b.p || a.i - b.i));
    
    try {
      const explanation = await askGemini(`Please explain this sentence in the context of reading a book. Be concise (2-3 sentences max). Sentence: "${sentenceText}"`);
      setNotes((ns) => ns.map((n) => n.id === id ? { ...n, state: 'done', body: explanation } : n));
    } catch (e) {
      setNotes((ns) => ns.map((n) => n.id === id ? { ...n, state: 'done', body: "Sorry, I couldn't explain that right now." } : n));
    }
  };

  const removeNote = (id: string, e: any) => {
    e.stopPropagation();
    setNotes((ns) => ns.filter((n) => n.id !== id));
  };

  const [flashId, setFlashId] = useState<string | null>(null);
  const railFlash = (id: string) => { setFlashId(id); setTimeout(() => setFlashId(null), 1200); };

  const jumpTo = (n: any) => {
    const el = document.getElementById('sen-' + n.id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3;
      window.scrollTo({ top: y, behavior: 'smooth' });
      railFlash(n.id);
    }
  };

  const ask = async () => {
    const question = q.trim();
    if (!question) return;
    setQ('');
    setAsked({ q: question, a: '', state: 'thinking' });
    
    try {
      const answer = await askGemini(`Answer this question about the book "${R2BOOK.title}". Question: ${question}. Be concise (2-3 sentences max).`);
      setAsked({ q: question, a: answer, state: 'done' });
    } catch (e) {
      setAsked({ q: question, a: "Sorry, I'm having trouble thinking right now.", state: 'done' });
    }
  };

  return (
    <div className={'wr grain-w ' + (theme === 'ink' ? 'ink-th' : 'paper-th')} data-screen-label="Web reader">
      <div className="wr-bar">
        <div className="wr-bar-in">
          <button className="wr-back" onClick={() => router.push('/(tabs)')}><Ic.back width="16" height="16" /> Library</button>
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
                  {page.map((sen: any, i: number) => {
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
                <div className="wr-note" key={n.id} onClick={() => jumpTo(n)} style={flashId === n.id ? { borderColor: 'var(--amber)' } : {}}>
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
