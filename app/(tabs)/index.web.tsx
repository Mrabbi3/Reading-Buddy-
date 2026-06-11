import React, { useRef } from 'react';
import { useRouter } from 'expo-router';
import { Ic, BOOKS, RBMark } from '../../src/components/web/icons';
import { useBook } from '../../src/providers/BookProvider';
import { useAuth } from '../../src/providers/AuthProvider';

export default function WebLibrary() {
  const router = useRouter();
  const { setPdfBase64, setCurrentPdfUri } = useBook();
  const { session } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onOpen = (book: any) => {
    router.push(`/pdf-reader/${book.id}`);
  };

  const onToast = (msg: string) => alert(msg);
  const onQuota = () => alert('Plus is unlimited — $6.99/mo');
  const quotaLeft = 3;

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      // remove the data:application/pdf;base64, prefix
      const base64 = result.split(',')[1];
      setCurrentPdfUri(file.name);
      setPdfBase64(base64);
      router.push('/pdf-reader/current');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grain-w" style={{ background: 'var(--paper)', minHeight: '100vh', width: '100%' }}>
      <div className="wa-bar">
        <div className="wa-bar-in">
          <div className="wl-wm"><RBMark size={28} />Reading Buddy</div>
          <div style={{ flex: 1 }}></div>
          <a className="wa-ioslink" onClick={() => onToast('This would open the App Store')}><Ic.apple width="15" height="15" /> Get the iOS app</a>
          <div className="wa-quota" onClick={onQuota}>{quotaLeft} explanations left today</div>
          <div className="wa-av">{session?.user?.email?.charAt(0).toUpperCase() || 'E'}</div>
        </div>
      </div>
      <main className="wa-main">
        <h1 className="wa-h1">Library</h1>
        <p className="wa-h1-sub">Welcome back. Your books are waiting.</p>
        <div className="wa-grid">
          {BOOKS.map((b: any) => (
            <div className="wa-book" key={b.id} onClick={() => onOpen(b)}>
              <div className="wa-cover" style={{ background: b.cover }}>
                <div className="ct">{b.coverText.split('\n').map((l: string, k: number) => <span key={k}>{l}<br /></span>)}</div>
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
          <input 
            type="file" 
            accept="application/pdf" 
            ref={fileInputRef} 
            onChange={handleImport} 
            style={{ display: 'none' }} 
          />
          <button className="w-btn-ghost" onClick={() => fileInputRef.current?.click()}>
            <Ic.plus /> Import a PDF
          </button>
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
