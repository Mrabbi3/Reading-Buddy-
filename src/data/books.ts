// Library + reader sample content, ported from the design (rb-icons.jsx / rb-reader2.jsx).

export type Book = {
  id: string;
  title: string;
  author: string;
  cover: [string, string]; // gradient stops
  coverText: string;
  progress: number;
  last: string;
};

export const BOOKS: Book[] = [
  {
    id: 'quiet-rooms',
    title: 'The Architecture of Quiet Rooms',
    author: 'Marguerite Vale',
    cover: ['#7d6b50', '#463b2c'],
    coverText: 'The\nArchitecture\nof Quiet\nRooms',
    progress: 0.62,
    last: 'last read 2 days ago',
  },
  {
    id: 'shortness',
    title: 'On the Shortness of Life',
    author: 'Seneca · trans. Hale',
    cover: ['#9a7b4f', '#5f4a2e'],
    coverText: 'On the\nShortness\nof Life',
    progress: 0.18,
    last: 'last read today',
  },
  {
    id: 'salt-roads',
    title: 'Salt Roads',
    author: 'Idris Okonkwo',
    cover: ['#5e6b6a', '#2f3937'],
    coverText: 'Salt\nRoads',
    progress: 0.0,
    last: 'not started',
  },
];

export type Sentence = { t: string; s: string };

export const R2BOOK = {
  title: 'The Architecture of Quiet Rooms',
  author: 'Marguerite Vale',
  chapter: 'Chapter Two — A House That Remembers',
  startPage: 48,
  totalPages: 212,
  minutesLeft: [
    'about 11 min left in chapter',
    'about 8 min left in chapter',
    'about 5 min left in chapter',
  ],
  pages: [
    [
      { t: 'The house had been empty for a year, but it did not feel abandoned.', s: 'A quiet contradiction opens the chapter: a year of emptiness has not produced the decay you would expect. The narrator wants you to feel presence where there should be absence.' },
      { t: 'It felt, rather, like a held breath — patient, attentive, waiting for someone to come home.', s: 'The house is framed as patient and almost alive. Its emptiness reads not as neglect but as anticipation — a held breath waiting to be released.' },
      { t: 'Eleanor set down her case in the hall and listened to the particular silence of rooms that remember.', s: 'Eleanor arrives. The phrase "rooms that remember" hands the house a memory of its own, making her less a visitor than someone being received.' },
      { t: 'Dust moved in the late light like something deciding whether to settle.', s: 'Even the dust is given hesitation and will. The late, low light marks both the end of a day and a threshold the character is about to cross.' },
      { t: 'She had grown up here, in the long afternoons before the war, and the architecture of those years had arranged itself inside her: which doors stuck, which stairs complained, where the cold gathered.', s: 'Her childhood home lives in her body as knowledge — a private map of sticking doors and complaining stairs. "Before the war" quietly dates the loss and the distance she has travelled.' },
      { t: 'A house, she thought, is only the shape we give to waiting.', s: "The chapter's thesis, stated plainly: a house is architecture built around longing. It reframes everything before it — the patience, the held breath — as forms of waiting made solid." },
    ],
    [
      { t: 'Upstairs, the nursery door stood open, though she was certain they had closed it the morning they left.', s: 'A small impossibility, placed quietly. Either memory or the house is wrong, and the chapter declines to say which — this is how Vale builds unease without ghosts.' },
      { t: 'The wallpaper had faded everywhere except behind the picture frames, leaving bright rectangles like windows into the year they were hung.', s: "The walls hold a record of what was removed. The bright rectangles are absences made visible — grief shown as preserved color, the book's central trick." },
      { t: 'She pressed her palm to the cold plaster and felt, absurdly, that she was taking a pulse.', s: 'Eleanor tests whether the house is alive, half-knowing the gesture is irrational. "Absurdly" lets her keep her dignity while doing it anyway.' },
      { t: 'Houses do not grieve, her father used to say; they only hold still while grief passes through.', s: "The father's aphorism reframes the chapter: the stillness Eleanor keeps noticing isn't mourning but endurance — a house outlasting a feeling." },
      { t: 'But he had never stood in this hallway in November, listening to a clock no one had wound still keeping its own private time.', s: "The unwound clock quietly overrules the father's rationalism. Something in the house keeps time without permission — memory, the chapter suggests." },
    ],
    [
      { t: 'In the kitchen she found the teapot exactly where her mother had left it, spout to the window, as if interrupted mid-sentence.', s: 'Objects hold the poses of the people who left them. The teapot "mid-sentence" makes the kitchen a conversation paused, not ended.' },
      { t: 'She filled it without deciding to; her hands, it seemed, had chosen to stay before the rest of her had.', s: 'The decision to stay is made by habit, not will. Vale locates homecoming in the body — the hands remember the house before the heart admits it.' },
      { t: 'Outside, the garden had gone wild in the gentlest way, roses leaning over the path like neighbours with news.', s: "Even the wilderness here is sociable. The simile turns neglect into welcome, preparing the chapter's turn from waiting to arrival." },
      { t: 'By dusk she had opened every window, and the house breathed the cold evening air like a swimmer surfacing.', s: 'The held breath from the chapter\'s first page is finally released. The house "surfacing" completes the long metaphor of suspension — the wait is over.' },
      { t: 'Waiting, it turned out, was something you could end simply by arriving.', s: 'The chapter\'s quiet thesis, inverted from the opening. If a house is the shape we give to waiting, then coming home is the act that dissolves it.' },
    ],
  ] as Sentence[][],
};

export const R2_BOOK_SUMMARY = 'Across these chapters, Vale builds one argument in images: the spaces we live in are shaped by waiting. The empty house, the remembered war, Eleanor’s return — each is a held breath. By the close, “home” has become less a place than a posture of patience.';

export const ASK_ANSWERS = [
  'Look at how often stillness is doing something in this chapter — holding, waiting, keeping time. Vale’s houses are never inert; that’s the engine of the whole book.',
  'The war is never named directly. It lives in the faded wallpaper, the unwound clock, the nursery door — absence is the only witness Vale trusts.',
  'I’d sit with the teapot scene. It’s the smallest sentence in the chapter, and it’s the one where Eleanor actually comes home.',
];

export const SIZES = [17, 18.5, 20.5];
export const SPACING = [1.58, 1.74, 1.92];

export function snippetFor(page: number, a: number, b: number): string {
  const sens = R2BOOK.pages[page].slice(a, b + 1).map((x) => x.t).join(' ');
  return sens.length > 110 ? sens.slice(0, 110).replace(/\s+\S*$/, '') + '…' : sens;
}
