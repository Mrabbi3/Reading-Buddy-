import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import Svg, { Path } from 'react-native-svg';
import { PaperScreen } from '../../src/components/PaperScreen';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Icons } from '../../src/components/Icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { useBook } from '../../src/providers/BookProvider';
import { BOOKS, Book } from '../../src/data/books';

function BookRow({ book, onOpen }: { book: Book; onOpen: () => void }) {
  return (
    <Pressable style={styles.bookRow} onPress={onOpen}>
      <LinearGradient
        colors={book.cover}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.cover}>
        <View style={styles.coverSpine} />
        <Text style={styles.coverText}>{book.coverText}</Text>
      </LinearGradient>
      <View style={styles.bookMain}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookAuthor}>{book.author}</Text>
        <View style={styles.prog}>
          <View style={[styles.progFill, { width: `${Math.max(book.progress * 100, 0)}%` as any }]} />
        </View>
        <Text style={styles.progMeta}>
          {book.progress > 0 ? `${Math.round(book.progress * 100)}% · ` : ''}
          {book.last}
        </Text>
      </View>
    </Pressable>
  );
}

export default function LibraryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setCurrentPdfUri, setPdfBase64 } = useBook();
  const [empty, setEmpty] = useState(false);

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.length) {
        const uri = result.assets[0].uri;
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
        setCurrentPdfUri(uri);
        setPdfBase64(base64);
        router.push('/pdf-reader/current');
      }
    } catch (e) {
      console.error('Error picking document:', e);
    }
  };

  const openBook = () => router.push('/pdf-reader/quiet-rooms');

  if (empty) {
    return (
      <PaperScreen>
        <View style={[styles.emptyWrap, { paddingTop: insets.top }]}>
          <Svg width={120} height={92} viewBox="0 0 120 92" fill="none" style={{ marginBottom: 28 }}>
            <Path d="M60 22C48 13 30 12 14 16v58c16-4 34-3 46 6 12-9 30-10 46-6V16c-16-4-34-3-46 6z" fill="#FFFDF8" stroke="#D8CDB8" strokeWidth={1.5} strokeLinejoin="round" />
            <Path d="M60 22v58" stroke="#D8CDB8" strokeWidth={1.5} />
            <Path d="M22 30c8-1.6 18-1.6 26 1M22 42c8-1.6 18-1.6 26 1M72 31c8-2.6 18-2.6 26-1M72 43c8-2.6 18-2.6 26-1" stroke="#E0A23B" strokeOpacity={0.55} strokeWidth={1.5} strokeLinecap="round" />
          </Svg>
          <Text style={styles.emptyTitle}>Drop in a PDF to get started.</Text>
          <Text style={styles.emptySub}>
            Your books, articles and papers live here. Highlight anything — I'll explain it.
          </Text>
          <PrimaryButton
            title="Import a PDF"
            onPress={handleImport}
            left={<Icons.plus size={18} color="#2b1d05" />}
            style={{ paddingHorizontal: 30 }}
          />
        </View>
      </PaperScreen>
    );
  }

  return (
    <PaperScreen>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.libHead}>
          <View style={styles.libTop}>
            <Pressable style={styles.avatar} onPress={() => router.push('/(tabs)/settings')}>
              <Text style={styles.avatarText}>E</Text>
            </Pressable>
            <Pressable style={styles.quota} onPress={() => router.push('/subscription')}>
              <Text style={styles.quotaText}>3 summaries left today</Text>
            </Pressable>
          </View>
          <Text style={styles.libTitle}>Reading Buddy</Text>
        </View>

        <View style={styles.libList}>
          {BOOKS.map((b) => (
            <BookRow key={b.id} book={b} onOpen={openBook} />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.importBar, { paddingBottom: insets.bottom + 20 }]}>
        <PrimaryButton
          title="Import a PDF"
          onPress={handleImport}
          left={<Icons.plus size={18} color="#2b1d05" />}
        />
      </View>
    </PaperScreen>
  );
}

const styles = StyleSheet.create({
  libHead: { paddingHorizontal: 24, paddingTop: 4, paddingBottom: 12 },
  libTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  avatar: {
    width: 36, height: 36, borderRadius: 999, backgroundColor: '#2b271f',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: typography.serif, fontSize: 16, color: colors.paper },
  quota: {
    backgroundColor: 'rgba(224,162,59,0.14)', borderWidth: 1, borderColor: 'rgba(224,162,59,0.3)',
    paddingVertical: 7, paddingHorizontal: 13, borderRadius: 999,
  },
  quotaText: { fontFamily: typography.sansSemibold, fontSize: 12, color: colors.amberInk },
  libTitle: { fontFamily: typography.serifLight, fontSize: 38, color: colors.ink, letterSpacing: -0.8 },

  libList: { paddingHorizontal: 24, paddingTop: 6 },
  bookRow: {
    flexDirection: 'row', gap: 16, alignItems: 'center', paddingVertical: 18,
    borderBottomWidth: 1, borderBottomColor: colors.hairline,
  },
  cover: { width: 52, height: 70, borderRadius: 5, overflow: 'hidden', justifyContent: 'center', paddingLeft: 12, paddingRight: 7,
    shadowColor: '#000', shadowOpacity: 0.45, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  coverSpine: { position: 'absolute', left: 5, top: 0, bottom: 0, width: 1.5, backgroundColor: 'rgba(0,0,0,0.22)' },
  coverText: { fontFamily: typography.serif, fontSize: 9.5, lineHeight: 11.5, color: 'rgba(255,255,255,0.92)' },
  bookMain: { flex: 1, minWidth: 0 },
  bookTitle: { fontFamily: typography.serifMedium, fontSize: 20, lineHeight: 24, color: colors.ink, marginBottom: 4 },
  bookAuthor: { fontFamily: typography.sans, fontSize: 12.5, color: colors.muted, marginBottom: 11 },
  prog: { height: 2, backgroundColor: colors.hairline, borderRadius: 2, overflow: 'hidden' },
  progFill: { height: '100%', backgroundColor: colors.amber, borderRadius: 2 },
  progMeta: { fontFamily: typography.sans, fontSize: 11.5, color: colors.muted, marginTop: 7 },

  importBar: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 24, paddingTop: 14, backgroundColor: colors.paper },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 44 },
  emptyTitle: { fontFamily: typography.serifLight, fontSize: 28, color: colors.ink, textAlign: 'center', marginBottom: 10, letterSpacing: -0.3 },
  emptySub: { fontFamily: typography.serifItalic, fontSize: 17, lineHeight: 25, color: colors.muted, textAlign: 'center', maxWidth: 280, marginBottom: 30 },
});
