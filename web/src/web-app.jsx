// rb-web-app.jsx — web app root: landing ⇄ logged-in views, quota, toast, tweaks
const { useState: useWApp, useEffect: useWAppE, useRef: useWAppRef } = React;

const WEB_ACCENTS = {
  '#E0A23B': { soft: 'rgba(224,162,59,0.30)', ink: '#8a5e16' },
  '#D2823A': { soft: 'rgba(210,130,58,0.30)', ink: '#834717' },
  '#C97B53': { soft: 'rgba(201,123,83,0.32)', ink: '#8a4a28' },
};

const WEB_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#E0A23B",
  "grain": true,
  "heroImage": true
}/*EDITMODE-END*/;

function WebApp() {
  const [t, setTweak] = useTweaks(WEB_TWEAK_DEFAULTS);
  const [view, setView] = useWApp('landing'); // landing | library | reader
  const [quotaLeft, setQuotaLeft] = useWApp(3);
  const [toast, setToast] = useWApp(null);
  const timer = useWAppRef(null);

  const showToast = (msg) => {
    clearTimeout(timer.current);
    setToast(msg);
    timer.current = setTimeout(() => setToast(null), 2100);
  };

  useWAppE(() => {
    const a = WEB_ACCENTS[t.accent] || WEB_ACCENTS['#E0A23B'];
    const r = document.documentElement.style;
    r.setProperty('--amber', t.accent);
    r.setProperty('--amber-soft', a.soft);
    r.setProperty('--amber-ink', a.ink);
    document.body.classList.toggle('no-grain', !t.grain);
  }, [t.accent, t.grain]);

  useWAppE(() => { window.scrollTo(0, 0); }, [view]);

  const go = (v) => setView(v);

  return (
    <div>
      {view === 'landing' && (
        <div data-screen-label="Landing page">
          <Landing onLogin={() => go('library')} onStart={() => go('library')} onToast={showToast} heroImage={t.heroImage} />
        </div>
      )}
      {view === 'library' && (
        <div data-screen-label="Web library">
          <WebLibrary onOpen={() => go('reader')} onToast={showToast} onQuota={() => showToast('Plus is unlimited — $6.99/mo')} quotaLeft={quotaLeft} />
        </div>
      )}
      {view === 'reader' && (
        <WebReader onBack={() => go('library')} onToast={showToast} quotaLeft={quotaLeft} useQuota={() => setQuotaLeft((n) => Math.max(0, n - 1))} />
      )}

      <div className="flow-pill">
        {[['landing', 'Landing'], ['library', 'Library'], ['reader', 'Reader']].map(([v, label]) => (
          <button key={v} className={view === v ? 'active' : ''} onClick={() => go(v)}>{label}</button>
        ))}
      </div>

      <div className={'w-toast' + (toast ? ' show' : '')}>{toast && <Ic.sparkle width="14" height="14" style={{ color: 'var(--amber)' }} />}{toast}</div>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Brand">
          <TweakColor label="Accent" value={t.accent} options={Object.keys(WEB_ACCENTS)} onChange={(v) => setTweak('accent', v)} />
        </TweakSection>
        <TweakSection title="Texture">
          <TweakToggle label="Paper grain" value={t.grain} onChange={(v) => setTweak('grain', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<WebApp />);
