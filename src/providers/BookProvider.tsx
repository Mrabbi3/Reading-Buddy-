import React, { createContext, useContext, useState } from 'react';

type BookContextType = {
  currentPdfUri: string | null;
  setCurrentPdfUri: (uri: string | null) => void;
  pdfBase64: string | null;
  setPdfBase64: (base64: string | null) => void;
};

const BookContext = createContext<BookContextType>({
  currentPdfUri: null,
  setCurrentPdfUri: () => {},
  pdfBase64: null,
  setPdfBase64: () => {},
});

export const BookProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPdfUri, setCurrentPdfUri] = useState<string | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);

  return (
    <BookContext.Provider value={{ currentPdfUri, setCurrentPdfUri, pdfBase64, setPdfBase64 }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBook = () => useContext(BookContext);
