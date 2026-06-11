import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, Animated, Easing,
  TextInput, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sentence } from '../../src/components/reader/Sentence';
import { Icons } from '../../src/components/Icons';
import { colors, readerThemes, ReaderThemeKey } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import {
  R2BOOK, R2_BOOK_SUMMARY, ASK_ANSWERS, SIZES, SPACING, snippetFor,
} from '../../src/data/books';

type HL = { id: number; page: number; a: number; b: number; aiText: string | null; note: string | null; snippet: string };
type Sel = { page: number; a: number; b: number };
type Sheet = { open: boolean; kind?: 'ai' | 'note' | 'view' | 'book'; state?: 'loading' | 'loaded'; hl?: HL };

const SEED: HL[] = [{
  id: 1, page: 0, a: 1, b: 1,
  aiText: R2BOOK.pages[0][1].s,
  note: 'The held-breath image — this is exactly how Gran’s house felt.',
  snippet: snippetFor(0, 1, 1),
}];

export default function Reader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const [theme, setTheme] = useState<ReaderThemeKey>('ink');
  const [page, setPage] = useState(0);
  const [chrome, setChrome] = useState(true);
  const [sel, setSel] = useState<Sel | null>(null);
  const [aaOpen, setAaOpen] = useState(false);
  const [sizeI, setSizeI] = useState(1);
  const [spaceI, setSpaceI] = useState(1);
  const [highlights, setHighlights] = useState<HL[]>(SEED);
  const [sheet, setSheet] = useState<Sheet>({ open: false });
  const [drawer, setDrawer] = useState(false);
  const timer = useRef<any>(null);

  const turn = useRef(new Animated.Value(0)).current;
  const pal = readerThemes[theme];
  const pageNo = R2BOOK.startPage + page;
  const prog = pageNo / R2BOOK.totalPages;
  const noteCount = highlights.length;

  const goPage = (dir: number) => {
    const next = page + dir;
    if (next < 0 || next >= R2BOOK.pages.length) return;
    setSel(null); setAaOpen(false);
    Animated.timing(turn, { toValue: dir, duration: 150, useNativeDriver: true }).start(() => {
      setPage(next);
      turn.setValue(-dir);
      Animated.timing(turn, { toValue: 0, duration: 150, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    });
  };

  const hlFor = (p: number, idx: number) => highlights.find((h) => h.page === p && idx >= h.a && idx <= h.b);

  const tapSentence = (idx: number) => {
    const existing = hlFor(page, idx);
    if (existing) { setSheet({ open: true, kind: 'view', state: 'loaded', hl: existing }); setSel(null); return; }
    setSel((s) => (s && s.page === page ? { page, a: Math.min(s.a, idx), b: Math.max(s.b, idx) } : { page, a: idx, b: idx }));
  };

  const explain = () => {
    if (!sel) return;
    const { a, b } = sel;
    const hl: HL = { id: Date.now(), page, a, b, aiText: R2BOOK.pages[page][b].s, note: null, snippet: snippetFor(page, a, b) };
    setHighlights((h) => [...h, hl]);
    setSheet({ open: true, kind: 'ai', state: 'loading', hl });
    setSel(null);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSheet((s) => ({ ...s, state: 'loaded' })), 1300);
  };

  const note = () => {
    if (!sel) return;
    const { a, b } = sel;
    const hl: HL = { id: Date.now(), page, a, b, aiText: null, note: '', snippet: snippetFor(page, a, b) };
    setSheet({ open: true, kind: 'note', state: 'loaded', hl });
    setSel(null);
  };

  const openBook = () => {
    clearTimeout(timer.current);
    setSheet({ open: true, kind: 'book', state: 'loading' });
    timer.current = setTimeout(() => setSheet((s) => ({ ...s, state: 'loaded' })), 1300);
  };

  const saveSheet = (hl: HL, noteText: string) => {
    const next = { ...hl, note: (noteText || '').trim() || hl.note };
    setHighlights((hs) => (hs.some((h) => h.id === hl.id) ? hs.map((h) => (h.id === hl.id ? next : h)) : [...hs, next]));
    setSheet({ open: false });
  };
  const removeHl = (hl: HL) => { setHighlights((hs) => hs.filter((h) => h.id !== hl.id)); setSheet({ open: false }); };
  const jumpTo = (hl: HL) => { setDrawer(false); setPage(hl.page); setSel(null); };

  const fz = SIZES[sizeI];
  const lh = fz * SPACING[spaceI];

  return (
    <View style={[styles.screen, { backgroundColor: pal.bg }]}>
      {/* page */}
      <Pressable style={{ flex: 1 }} onPress={() => { setChrome((c) => !c); setAaOpen(false); setSel(null); }}>
        <ScrollView contentContainerStyle={{ paddingTop: 104, paddingHorizontal: 32, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
          {page === 0 && <Text style={[styles.meta, { color: pal.mut }]}>{R2BOOK.chapter} · p. {pageNo}</Text>}
          <Animated.View style={{ opacity: turn.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 1, 0] }), transform: [{ translateX: turn.interpolate({ inputRange: [-1, 0, 1], outputRange: [16, 0, -16] }) }] }}>
            <Text style={{ lineHeight: lh }}>
              {R2BOOK.pages[page].map((sen, idx) => {
                const hl = hlFor(page, idx);
                const inSel = !!sel && sel.page === page && idx >= sel.a && idx <= sel.b;
                return (
                  <Sentence
                    key={idx}
                    text={sen.t}
                    fontSize={fz}
                    lineHeight={lh}
                    color={pal.fg}
                    active={inSel}
                    saved={!!hl}
                    onPress={() => tapSentence(idx)}
                  />
                );
              })}
            </Text>
          </Animated.View>

          {sel && (
            <View style={styles.selPillWrap} pointerEvents="box-none">
              <View style={styles.selPill}>
                <Pressable style={styles.selBtn} onPress={explain}>
                  <Icons.sparkle size={15} color={colors.amber} />
                  <Text style={styles.selBtnText}>Explain</Text>
                </Pressable>
                <View style={styles.selSep} />
                <Pressable style={styles.selBtn} onPress={note}>
                  <Text style={styles.selBtnText}>✎ Note</Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      </Pressable>

      {/* edge tap strips */}
      <Pressable style={[styles.edge, { left: 0 }]} onPress={() => goPage(-1)} />
      <Pressable style={[styles.edge, { right: 0 }]} onPress={() => goPage(1)} />

      {/* top bar */}
      {chrome && (
        <View style={[styles.topbar, { paddingTop: insets.top + 8 }]}>
          <Pressable style={[styles.iconBtn, { borderColor: pal.mut + '40' }]} onPress={() => router.back()}>
            <Icons.back size={20} color={pal.fg} />
          </Pressable>
          <View style={styles.titleBlock}>
            <Text numberOfLines={1} style={[styles.bTitle, { color: pal.fg }]}>{R2BOOK.title}</Text>
            <Text numberOfLines={1} style={[styles.bChap, { color: pal.mut }]}>{R2BOOK.chapter}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable style={[styles.iconBtn, { borderColor: pal.mut + '40' }]} onPress={() => { setDrawer(true); setAaOpen(false); }}>
              <Icons.bookmark size={18} color={pal.fg} />
              {noteCount > 0 && (
                <View style={styles.count}><Text style={styles.countText}>{noteCount}</Text></View>
              )}
            </Pressable>
            <Pressable style={[styles.iconBtn, { borderColor: pal.mut + '40' }]} onPress={() => setAaOpen((o) => !o)}>
              <Text style={[styles.aa, { color: pal.fg }]}>Aa</Text>
            </Pressable>
            <Pressable style={[styles.iconBtn, { borderColor: pal.mut + '40' }]} onPress={openBook}>
              <Icons.sparkle size={17} color={pal.fg} />
            </Pressable>
          </View>
        </View>
      )}

      {/* Aa popover */}
      {aaOpen && (
        <View style={[styles.aapop, { top: insets.top + 56 }]}>
          <AaRow label="Theme">
            {(['paper', 'sepia', 'ink'] as ReaderThemeKey[]).map((v) => (
              <SegBtn key={v} on={theme === v} onPress={() => setTheme(v)} label={v[0].toUpperCase() + v.slice(1)} />
            ))}
          </AaRow>
          <AaRow label="Size">
            {[0, 1, 2].map((i) => (
              <SegBtn key={i} on={sizeI === i} onPress={() => setSizeI(i)} label="A" fontSize={11 + i * 3} />
            ))}
          </AaRow>
          <AaRow label="Spacing">
            {['Tight', 'Cozy', 'Airy'].map((l, i) => (
              <SegBtn key={l} on={spaceI === i} onPress={() => setSpaceI(i)} label={l} />
            ))}
          </AaRow>
        </View>
      )}

      {/* footer */}
      {chrome && (
        <View style={[styles.foot, { paddingBottom: insets.bottom + 16 }]}>
          <View style={[styles.fProg, { backgroundColor: pal.fg + '1f' }]}>
            <View style={[styles.fProgFill, { width: `${prog * 100}%` as const as any }]} />
          </View>
          <View style={styles.fRow}>
            <Pressable disabled={page === 0} onPress={() => goPage(-1)}>
              <Text style={[styles.fPg, { color: pal.fg, opacity: page === 0 ? 0.22 : 1 }]}>‹</Text>
            </Pressable>
            <Text style={[styles.fMeta, { color: pal.mut }]}>p. {pageNo} of {R2BOOK.totalPages} · {R2BOOK.minutesLeft[page]}</Text>
            <Pressable disabled={page === R2BOOK.pages.length - 1} onPress={() => goPage(1)}>
              <Text style={[styles.fPg, { color: pal.fg, opacity: page === R2BOOK.pages.length - 1 ? 0.22 : 1 }]}>›</Text>
            </Pressable>
          </View>
        </View>
      )}

      <SummarySheet sheet={sheet} height={height} onClose={() => setSheet({ open: false })} onSave={saveSheet} onRemove={removeHl} />
      <Marginalia open={drawer} highlights={highlights} height={height} onClose={() => setDrawer(false)} onJump={jumpTo} />
    </View>
  );
}

function AaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.aaRow}>
      <Text style={styles.aaLabel}>{label.toUpperCase()}</Text>
      <View style={styles.seg}>{children}</View>
    </View>
  );
}
function SegBtn({ on, onPress, label, fontSize = 12 }: { on: boolean; onPress: () => void; label: string; fontSize?: number }) {
  return (
    <Pressable onPress={onPress} style={[styles.segBtn, on && styles.segBtnOn]}>
      <Text style={[styles.segText, on && styles.segTextOn, { fontSize }]}>{label}</Text>
    </Pressable>
  );
}

function SummarySheet({ sheet, height, onClose, onSave, onRemove }: {
  sheet: Sheet; height: number; onClose: () => void; onSave: (h: HL, n: string) => void; onRemove: (h: HL) => void;
}) {
  const y = useRef(new Animated.Value(height)).current;
  const dim = useRef(new Animated.Value(0)).current;
  const [draft, setDraft] = useState('');
  const [asks, setAsks] = useState<{ q: string; a: string | null }[]>([]);
  const [askDraft, setAskDraft] = useState('');
  const askTimer = useRef<any>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (sheet.open) { setDraft(sheet.hl?.note || ''); setAsks([]); setAskDraft(''); }
    Animated.parallel([
      Animated.timing(y, { toValue: sheet.open ? 0 : height, duration: 420, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }),
      Animated.timing(dim, { toValue: sheet.open ? 1 : 0, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [sheet.open, sheet.hl?.id]);

  const send = () => {
    const q = askDraft.trim();
    if (!q) return;
    setAskDraft('');
    setAsks((a) => [...a, { q, a: null }]);
    clearTimeout(askTimer.current);
    askTimer.current = setTimeout(() => {
      setAsks((a) => a.map((m, i) => (i === a.length - 1 ? { ...m, a: ASK_ANSWERS[(a.length - 1) % ASK_ANSWERS.length] } : m)));
    }, 1400);
  };

  const k = sheet.kind, hl = sheet.hl;
  return (
    <>
      <Animated.View pointerEvents={sheet.open ? 'auto' : 'none'} style={[styles.dim, { opacity: dim }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.sheet, { maxHeight: '80%', paddingBottom: insets.bottom + 30, transform: [{ translateY: y }] }]}>
        <View style={styles.grab} />
        {k === 'book' && (
          <View style={[styles.attr, { marginBottom: 18 }]}>
            <Icons.book size={13} color={colors.amber} />
            <Text style={styles.attrText}>WHOLE-BOOK SUMMARY</Text>
          </View>
        )}
        {hl && k !== 'book' && <Text style={styles.snip}>"{hl.snippet}"</Text>}
        {k !== 'book' && k !== 'note' && (
          <View style={styles.attr}>
            <Icons.sparkle size={12} color={colors.amber} />
            <Text style={styles.attrText}>READING BUDDY</Text>
          </View>
        )}

        {sheet.state === 'loading' && (
          <View style={{ marginBottom: 22 }}>
            {(['94%', '88%', '64%'] as const).map((w) => <View key={w} style={[styles.pulse, { width: w }]} />)}
          </View>
        )}

        {sheet.state === 'loaded' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {k === 'book' && <Text style={styles.body}>{R2_BOOK_SUMMARY}</Text>}
            {(k === 'ai' || k === 'view') && hl?.aiText && <Text style={styles.body}>{hl.aiText}</Text>}

            {k !== 'book' && (
              <View style={styles.notebox}>
                <Text style={styles.noteLabel}>✎ YOUR NOTE</Text>
                <TextInput
                  style={styles.noteInput}
                  placeholder="Add your thought…"
                  placeholderTextColor="rgba(154,144,130,0.6)"
                  value={draft}
                  onChangeText={setDraft}
                  multiline
                />
              </View>
            )}

            {k === 'book' && (
              <View style={{ marginBottom: 20 }}>
                <Text style={[styles.noteLabel, { marginBottom: 10 }]}>✦ ASK THIS BOOK</Text>
                {asks.map((m, i) => (
                  <View key={i} style={styles.askMsg}>
                    <Text style={styles.askQ}>{m.q}</Text>
                    {m.a ? <Text style={styles.askA}>{m.a}</Text> : <View style={[styles.pulse, { width: '70%', marginTop: 10 }]} />}
                  </View>
                ))}
                <View style={styles.askRow}>
                  <TextInput
                    style={styles.askInput}
                    placeholder="Why does the house feel alive?"
                    placeholderTextColor="rgba(154,144,130,0.55)"
                    value={askDraft}
                    onChangeText={setAskDraft}
                    onSubmitEditing={send}
                  />
                  <Pressable style={styles.send} onPress={send}>
                    <Text style={styles.sendText}>↑</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {sheet.state === 'loaded' && k !== 'book' && hl && (
          <View style={styles.actions}>
            <Pressable style={styles.sa} onPress={() => onSave(hl, draft)}>
              <Icons.bookmark size={16} color={colors.dText} />
              <Text style={styles.saText}>Save</Text>
            </Pressable>
            <Pressable style={[styles.sa, styles.saQuiet]} onPress={() => onRemove(hl)}>
              <Text style={styles.saText}>Remove</Text>
            </Pressable>
          </View>
        )}
        {sheet.state === 'loaded' && k === 'book' && (
          <View style={styles.actions}>
            <Pressable style={styles.sa} onPress={onClose}><Text style={styles.saText}>Done</Text></Pressable>
          </View>
        )}
      </Animated.View>
    </>
  );
}

function Marginalia({ open, highlights, height, onClose, onJump }: {
  open: boolean; highlights: HL[]; height: number; onClose: () => void; onJump: (h: HL) => void;
}) {
  const y = useRef(new Animated.Value(height)).current;
  const dim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  useEffect(() => {
    Animated.parallel([
      Animated.timing(y, { toValue: open ? 0 : height, duration: 420, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }),
      Animated.timing(dim, { toValue: open ? 1 : 0, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [open]);
  const sorted = [...highlights].sort((x, y2) => x.page - y2.page || x.a - y2.a);
  return (
    <>
      <Animated.View pointerEvents={open ? 'auto' : 'none'} style={[styles.dim, { opacity: dim }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.sheet, { height: '78%', paddingBottom: insets.bottom + 30, transform: [{ translateY: y }] }]}>
        <View style={styles.grab} />
        <View style={styles.drawHead}>
          <Text style={styles.drawTitle}>Marginalia</Text>
          <Text style={styles.drawCount}>{sorted.length} {sorted.length === 1 ? 'mark' : 'marks'}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {sorted.length === 0 && (
            <Text style={styles.drawEmpty}>Highlight anything — your marks and notes collect here, like pencil in a margin.</Text>
          )}
          {sorted.map((h) => (
            <Pressable key={h.id} style={styles.entry} onPress={() => onJump(h)}>
              <Text style={styles.ePage}>P. {R2BOOK.startPage + h.page}</Text>
              <Text style={styles.eSnip}>"{h.snippet}"</Text>
              {h.aiText && <Text style={styles.eAi}>✦ {h.aiText}</Text>}
              {h.note && <Text style={styles.eNote}>✎ {h.note}</Text>}
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  meta: { fontFamily: typography.sans, fontSize: 11, letterSpacing: 1.5, marginBottom: 22 },

  selPillWrap: { alignItems: 'center', marginTop: 18 },
  selPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2a2622', borderRadius: 999, padding: 5,
    shadowColor: '#000', shadowOpacity: 0.6, shadowRadius: 20, shadowOffset: { width: 0, height: 12 }, elevation: 8 },
  selBtn: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 999 },
  selBtnText: { fontFamily: typography.sansSemibold, fontSize: 14, color: '#f6f0e6' },
  selSep: { width: 1, height: 18, backgroundColor: 'rgba(255,255,255,0.18)' },

  edge: { position: 'absolute', top: 130, bottom: 100, width: 30, zIndex: 4 },

  topbar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 18, paddingBottom: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 999, borderWidth: 1, backgroundColor: 'rgba(237,231,220,0.06)',
    alignItems: 'center', justifyContent: 'center' },
  aa: { fontFamily: typography.sansSemibold, fontSize: 15 },
  count: { position: 'absolute', top: -4, right: -4, minWidth: 17, height: 17, borderRadius: 999, backgroundColor: colors.amber,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  countText: { fontFamily: typography.sansBold, fontSize: 10.5, color: '#2b1d05' },
  titleBlock: { flex: 1, paddingHorizontal: 8, alignItems: 'center' },
  bTitle: { fontFamily: typography.serif, fontSize: 14, opacity: 0.9 },
  bChap: { fontFamily: typography.sansSemibold, fontSize: 9, letterSpacing: 1.1, marginTop: 3 },

  aapop: { position: 'absolute', right: 16, zIndex: 35, backgroundColor: '#2a2622', borderRadius: 16, padding: 16, gap: 14,
    shadowColor: '#000', shadowOpacity: 0.6, shadowRadius: 30, shadowOffset: { width: 0, height: 18 }, elevation: 12 },
  aaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 22 },
  aaLabel: { fontFamily: typography.sansSemibold, fontSize: 11, letterSpacing: 1.2, color: 'rgba(246,240,230,0.55)' },
  seg: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 9, padding: 2 },
  segBtn: { paddingVertical: 7, paddingHorizontal: 13, borderRadius: 7 },
  segBtnOn: { backgroundColor: 'rgba(246,240,230,0.92)' },
  segText: { fontFamily: typography.sansSemibold, color: 'rgba(246,240,230,0.6)' },
  segTextOn: { color: '#221E1A' },

  foot: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 8, paddingHorizontal: 20, paddingTop: 12 },
  fProg: { height: 2, borderRadius: 2, overflow: 'hidden' },
  fProgFill: { height: '100%', backgroundColor: colors.amber, borderRadius: 2 },
  fRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 7 },
  fPg: { fontFamily: typography.serif, fontSize: 24 },
  fMeta: { fontFamily: typography.sans, fontSize: 11.5 },

  dim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11,10,7,0.5)', zIndex: 40 },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 41, backgroundColor: colors.dSurface,
    borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingHorizontal: 26, paddingTop: 10 },
  grab: { width: 38, height: 5, borderRadius: 999, backgroundColor: 'rgba(237,231,220,0.22)', alignSelf: 'center', marginTop: 4, marginBottom: 18 },
  snip: { fontFamily: typography.serifItalic, fontSize: 16, lineHeight: 24, color: colors.dMuted, paddingLeft: 14, borderLeftWidth: 2, borderLeftColor: colors.amber, marginBottom: 22 },
  attr: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  attrText: { fontFamily: typography.sansSemibold, fontSize: 11, letterSpacing: 1.2, color: colors.amber },
  body: { fontFamily: typography.serif, fontSize: 21, lineHeight: 33, color: colors.dText, marginBottom: 26 },
  pulse: { height: 12, borderRadius: 999, backgroundColor: 'rgba(224,162,59,0.22)', marginBottom: 12 },

  notebox: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(237,231,220,0.18)', borderRadius: 14, padding: 14, marginBottom: 22 },
  noteLabel: { fontFamily: typography.sansSemibold, fontSize: 10.5, letterSpacing: 1.2, color: colors.dMuted, marginBottom: 7 },
  noteInput: { fontFamily: typography.serif, fontSize: 17, lineHeight: 24, color: colors.dText, padding: 0, minHeight: 44 },

  askMsg: { marginBottom: 16, alignItems: 'flex-end' },
  askQ: { fontFamily: typography.sansSemibold, fontSize: 14, color: '#f6f0e6', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, borderBottomRightRadius: 4, paddingVertical: 10, paddingHorizontal: 14, maxWidth: '85%' },
  askA: { fontFamily: typography.serif, fontSize: 18, lineHeight: 27, color: colors.dText, marginTop: 10, alignSelf: 'flex-start' },
  askRow: { flexDirection: 'row', gap: 9, alignItems: 'center', marginTop: 4 },
  askInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: colors.dHairline, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 17, fontFamily: typography.sans, fontSize: 14.5, color: colors.dText },
  send: { width: 42, height: 42, borderRadius: 999, backgroundColor: colors.amber, alignItems: 'center', justifyContent: 'center' },
  sendText: { fontSize: 19, color: '#2b1d05', fontFamily: typography.sansBold },

  actions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  sa: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 999, borderWidth: 1, borderColor: colors.dHairline },
  saQuiet: { flex: 0, borderWidth: 0, opacity: 0.55, paddingHorizontal: 18 },
  saText: { fontFamily: typography.sansSemibold, fontSize: 15, color: colors.dText },

  drawHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 },
  drawTitle: { fontFamily: typography.serifLight, fontSize: 27, color: colors.dText, letterSpacing: -0.3 },
  drawCount: { fontFamily: typography.sansSemibold, fontSize: 12, color: colors.dMuted },
  drawEmpty: { fontFamily: typography.serifItalic, fontSize: 17, lineHeight: 26, color: colors.dMuted, padding: 26, textAlign: 'center' },
  entry: { paddingVertical: 17, borderBottomWidth: 1, borderBottomColor: colors.dHairline },
  ePage: { fontFamily: typography.sansSemibold, fontSize: 10, letterSpacing: 1.4, color: colors.amber, marginBottom: 7 },
  eSnip: { fontFamily: typography.serifItalic, fontSize: 15, lineHeight: 22, color: colors.dMuted },
  eAi: { fontFamily: typography.serif, fontSize: 16.5, lineHeight: 24, color: colors.dText, marginTop: 8 },
  eNote: { fontFamily: typography.sansMedium, fontSize: 14, lineHeight: 21, color: '#cfc5b2', marginTop: 8 },
});
