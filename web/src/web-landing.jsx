// rb-web-landing.jsx — Reading Buddy marketing landing page
const { useState: useWL, useEffect: useWLE, useRef: useWLRef } = React;

// fades in the marker sweep when scrolled into view
function useSweep() {
  const ref = useWLRef(null);
  const [on, setOn] = useWL(false);
  useWLE(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => setOn(true), 450); }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, on];
}

function WLNav({ onLogin, onStart, onGoto }) {
  return (
    <nav className="wl-nav">
      <div className="wl-nav-in">
        <div className="wl-wm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><RBMark size={28} />Reading Buddy</div>
        <div className="wl-links">
          <a onClick={() => onGoto('features')}>How it reads</a>
          <a onClick={() => onGoto('webreader')}>Web reader</a>
          <a onClick={() => onGoto('ios')}>iOS app</a>
          <a onClick={() => onGoto('pricing')}>Pricing</a>
        </div>
        <div className="wl-nav-cta">
          <button className="wl-login" onClick={onLogin}>Log in</button>
          <button className="wl-start" onClick={onStart}>Start free</button>
        </div>
      </div>
    </nav>
  );
}

function WLHero({ onStart, onToast, heroImage }) {
  const [ref, on] = useSweep();
  return (
    <header className="wl-hero">
      <div>
        <div className="wl-eyebrow"><Ic.sparkle /> A reading companion, not a chatbot</div>
        <h1 className="wl-h1">Never read <em>alone.</em></h1>
        <p className="wl-sub">Bring any book, paper or PDF. Highlight a line you don't quite get — Reading Buddy explains it in the margin, like a friend reading over your shoulder.</p>
        <div className="wl-cta-row">
          <button className="w-btn" onClick={onStart}>Start reading free</button>
          <button className="as-badge" onClick={() => onToast('This would open the App Store')}>
            <Ic.apple width="22" height="22" />
            <span className="bt"><span className="t1">Download on the</span><span className="t2">App Store</span></span>
          </button>
        </div>
        <div className="wl-cta-note">Free includes 3 explanations a day · no card required</div>
      </div>

      <div className="wl-stagewrap">
        {heroImage !== false && (
          <div className="wl-heroimg" style={{ background: 'linear-gradient(150deg, #2a2418, #17150F)' }}>
            <img src={(window.__resources && window.__resources.webHero) || "images/web-hero.png"} alt="A reading corner at dusk" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
        )}
        <div className="wl-phone">
          <div className="wl-phone-screen">
            <div className="wl-notch"></div>
            <div className="wl-pscreen">
              <div className="wl-pmeta">Chapter Two · A House That Remembers</div>
              <p className="wl-ptext" ref={ref}>
                The house had been empty for a year, but it did not feel abandoned. It felt, rather, like a held breath — patient, attentive, waiting for someone to come home. <span className={'mk' + (on ? ' on' : '')}>Eleanor set down her case in the hall and listened to the particular silence of rooms that remember.</span> Dust moved in the late light like something deciding whether to settle. She had grown up here, in the long afternoons before the war, and the architecture of those years had arranged itself inside her: which doors stuck, which stairs complained, where the cold gathered.
              </p>
            </div>
            <div className="wl-pprog"><div className="bar"><i></i></div><div className="m">p. 48 of 212 · about 11 min left</div></div>
          </div>
          <div className="wl-note-float">
            <div className="attr"><Ic.sparkle width="12" height="12" /> Reading Buddy</div>
            The phrase “rooms that remember” hands the house a memory of its own — Eleanor is less a visitor than someone being received.
          </div>
        </div>
      </div>
    </header>
  );
}

function WLFeatures() {
  const [ref, on] = useSweep();
  return (
    <section className="ink-sec grain-w" id="wl-features">
      <div className="wl-feat">
        <div className="wl-sec-eyebrow">How it reads</div>
        <h2 className="wl-h2">Highlight anything. Understand everything.</h2>
        <p className="wl-h2-sub">No tabs, no copy-pasting into a chatbot. The help lives inside the page, where your eyes already are.</p>
        <div className="wl-feat-grid">
          <div className="wl-fcard">
            <div className="demo">
              <p className="wl-demo-text" ref={ref}>She pressed her palm to the cold plaster and felt, <span className={'mk' + (on ? ' on' : '')}>absurdly, that she was taking a pulse.</span></p>
            </div>
            <h3 className="wl-fname">Sweep a sentence</h3>
            <p className="wl-fdesc">Select any passage the way you'd run a marker across a page. That's the whole gesture.</p>
          </div>
          <div className="wl-fcard">
            <div className="demo">
              <div className="wl-demo-note">
                <div className="attr"><Ic.sparkle width="12" height="12" /> In the margin</div>
                Eleanor tests whether the house is alive, half-knowing the gesture is irrational. “Absurdly” lets her keep her dignity while doing it anyway.
              </div>
            </div>
            <h3 className="wl-fname">Get a margin note</h3>
            <p className="wl-fdesc">A short, faithful explanation appears beside the text — and stays there, saved with your highlights.</p>
          </div>
          <div className="wl-fcard">
            <div className="demo">
              <div className="wl-demo-ask">
                <div className="wl-demo-q">What is the war doing in this chapter?</div>
                <div className="wl-demo-a">The war is never named directly. It lives in the faded wallpaper, the unwound clock, the nursery door — absence is the only witness Vale trusts.</div>
              </div>
            </div>
            <h3 className="wl-fname">Ask the book</h3>
            <p className="wl-fdesc">Questions are answered from the pages you've actually read. No spoilers ahead of you.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WLWebReader({ onStart }) {
  return (
    <section className="paper-sec" id="wl-webreader">
      <div className="wl-web">
        <div>
          <div className="wl-sec-eyebrow" style={{ color: 'var(--amber-ink)' }}>The web reader</div>
          <h2 className="wl-h2">Your library, in any browser.</h2>
          <p className="wl-h2-sub" style={{ marginBottom: 30 }}>The same books, highlights and margin notes — synced between your phone and the wide, quiet page of your desk.</p>
          <button className="w-btn" onClick={onStart}>Open the web reader</button>
        </div>
        <div className="wl-browser">
          <div className="wl-browser-bar"><i></i><i></i><i></i><div className="wl-browser-url">app.readingbuddy.com/quiet-rooms</div></div>
          <div className="wl-browser-body">
            <div className="wl-bb-text">
              In the kitchen she found the teapot exactly where her mother had left it, spout to the window, as if interrupted mid-sentence. <span className="mk on">She filled it without deciding to; her hands, it seemed, had chosen to stay before the rest of her had.</span> Outside, the garden had gone wild in the gentlest way, roses leaning over the path like neighbours with news. By dusk she had opened every window, and the house breathed the cold evening air like a swimmer surfacing.
            </div>
            <div className="wl-bb-side">
              <div className="lbl">Margins</div>
              <div className="wl-bb-note"><span className="a">Reading Buddy</span>The decision to stay is made by habit, not will — the hands remember the house first.</div>
              <div className="wl-bb-note"><span className="a">Your note</span>Gran's kitchen. Exactly this.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WLiOS({ onToast }) {
  return (
    <section className="ink-sec grain-w" id="wl-ios">
      <div className="wl-ios">
        <div className="wl-ios-img" style={{ background: 'linear-gradient(150deg, #2a2418, #17150F)' }}>
            <img src={(window.__resources && window.__resources.iosPromo) || "images/ios-promo.png"} alt="Reading by lamplight with the Reading Buddy iOS app" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
        <div>
          <div className="wl-sec-eyebrow">The iOS app</div>
          <h2 className="wl-h2">Made for the reading chair.</h2>
          <p className="wl-h2-sub" style={{ marginBottom: 26 }}>The full Reading Buddy experience — built for the place you actually read.</p>
          <ul className="wl-ios-points">
            <li><span className="ck"><Ic.check /></span>Import PDFs straight from Files, Mail or Safari</li>
            <li><span className="ck"><Ic.check /></span>Paper, sepia and lamplight themes for night reading</li>
            <li><span className="ck"><Ic.check /></span>Your marginalia, synced and searchable</li>
            <li><span className="ck"><Ic.check /></span>Reads offline — explanations queue for later</li>
          </ul>
          <button className="as-badge" onClick={() => onToast('This would open the App Store')}>
            <Ic.apple width="24" height="24" />
            <span className="bt"><span className="t1">Download on the</span><span className="t2">App Store</span></span>
          </button>
        </div>
      </div>
    </section>
  );
}

function WLPricing({ onStart, onToast }) {
  return (
    <section className="paper-sec" id="wl-pricing">
      <div className="wl-pricing">
        <div className="wl-sec-eyebrow" style={{ color: 'var(--amber-ink)' }}>Pricing</div>
        <h2 className="wl-h2">Start free. Stay curious.</h2>
        <p className="wl-h2-sub" style={{ margin: '0 auto', maxWidth: '42ch' }}>One plan across iOS and web. Your books and margins follow you.</p>
        <div className="wl-plans">
          <div className="wl-plan">
            <div className="wl-plan-name">Reader</div>
            <div className="wl-plan-price">$0</div>
            <div className="wl-plan-cycle">forever</div>
            <ul>
              <li><span className="ck"><Ic.check /></span>Unlimited books &amp; PDFs</li>
              <li><span className="ck"><Ic.check /></span>3 margin explanations a day</li>
              <li><span className="ck"><Ic.check /></span>Highlights &amp; your own notes</li>
              <li><span className="ck"><Ic.check /></span>iOS + web reader</li>
            </ul>
            <div className="foot"><button className="w-btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={onStart}>Start reading</button></div>
          </div>
          <div className="wl-plan feat">
            <div className="wl-plan-name">Plus <span className="wl-plan-tag">7-day free trial</span></div>
            <div className="wl-plan-price">$6.99 <span>/ month, or $49.99 / year</span></div>
            <div className="wl-plan-cycle">cancel anytime</div>
            <ul>
              <li><span className="ck"><Ic.check /></span>Unlimited explanations</li>
              <li><span className="ck"><Ic.check /></span>Ask the book — chapter-aware answers</li>
              <li><span className="ck"><Ic.check /></span>Chapter &amp; book summaries</li>
              <li><span className="ck"><Ic.check /></span>Everything in Reader</li>
            </ul>
            <div className="foot"><button className="w-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onToast('This would start the Plus trial')}>Try Plus free</button></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WLFooter({ onToast, onGoto }) {
  return (
    <footer className="ink-sec wl-footer">
      <div className="wl-footer-in">
        <div className="fcol" style={{ maxWidth: 260 }}>
          <div className="wl-wm" style={{ color: 'var(--d-text)' }}><RBMark size={28} />Reading Buddy</div>
          <div className="wl-fine" style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14 }}>Never read alone.</div>
          <div className="wl-fine" style={{ marginTop: 18 }}>© 2026 Reading Buddy</div>
        </div>
        <div className="fcol">
          <div className="fhead">Product</div>
          <a onClick={() => onGoto('features')}>How it reads</a>
          <a onClick={() => onGoto('webreader')}>Web reader</a>
          <a onClick={() => onGoto('pricing')}>Pricing</a>
        </div>
        <div className="fcol">
          <div className="fhead">Apps</div>
          <a onClick={() => onToast('This would open the App Store')}>iOS — App Store</a>
          <a onClick={() => onToast('Android is on the roadmap')}>Android — soon</a>
        </div>
        <div className="fcol">
          <div className="fhead">Company</div>
          <a onClick={() => onToast('Prototype link')}>About</a>
          <a onClick={() => onToast('Prototype link')}>Privacy</a>
          <a onClick={() => onToast('Prototype link')}>Terms</a>
        </div>
      </div>
    </footer>
  );
}

function Landing({ onLogin, onStart, onToast, heroImage }) {
  const goto = (id) => {
    const el = document.getElementById('wl-' + id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' });
  };
  return (
    <div className="grain-w" style={{ background: 'var(--paper)' }}>
      <WLNav onLogin={onLogin} onStart={onStart} onGoto={goto} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <WLHero onStart={onStart} onToast={onToast} heroImage={heroImage} />
        <div className="wl-claim" id="wl-top">“Like having the smartest member of your book club on call.”</div>
        <WLFeatures />
        <WLWebReader onStart={onStart} />
        <WLiOS onToast={onToast} />
        <WLPricing onStart={onStart} onToast={onToast} />
        <WLFooter onToast={onToast} onGoto={goto} />
      </div>
    </div>
  );
}

Object.assign(window, { Landing });
