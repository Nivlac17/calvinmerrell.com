const COLUMN_COUNT = 80;
const ROW_COUNT = 57;
const CELL_COUNT = COLUMN_COUNT * ROW_COUNT;
const PAPER_INDEX = 9;

const LEGACY_COLORS = [
  'yellow', 'blue', 'red', 'green', 'pink', 'purple', 'grey', 'orange', 'black', 'whitesmoke',
];
const COLOR_INDEX = new Map(LEGACY_COLORS.map((color, index) => [color, index]));
COLOR_INDEX.set('gray', 6);

function pixelValues(source) {
  if (Array.isArray(source)) return source;
  if (source && typeof source === 'object') {
    return pixelValues(source.artCsv ?? source.pixels ?? source.colors ?? source.data);
  }
  if (typeof source !== 'string') return [];

  const trimmed = source.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      return pixelValues(JSON.parse(trimmed));
    } catch {
      // Fall through to the delimiter-based legacy format.
    }
  }

  return trimmed.split(/[,;|\s]+/);
}

function paletteIndex(value) {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < LEGACY_COLORS.length) {
    return value;
  }

  const token = String(value ?? '').trim().toLowerCase();
  if (/^\d+$/.test(token)) {
    const index = Number(token);
    return index < LEGACY_COLORS.length ? index : PAPER_INDEX;
  }
  return COLOR_INDEX.get(token) ?? PAPER_INDEX;
}

export function normalizeArtCells(source) {
  const values = pixelValues(source).slice(0, CELL_COUNT).map(paletteIndex);
  while (values.length < CELL_COUNT) values.push(PAPER_INDEX);
  return values;
}

export function normalizeArtCsv(source) {
  return normalizeArtCells(source).join(',');
}

export function normalizeArtRecord(record) {
  if (!record || typeof record !== 'object') return null;
  const legacyArt = record.artCsv ?? record.art ?? record.artwork ?? record.pixels ?? record.colors ?? record.data;
  const mongoId = record._id?.$oid ?? record._id?.toString?.();
  return {
    ...record,
    id: record.id ?? mongoId,
    title: typeof record.title === 'string' && record.title.trim() ? record.title : 'Untitled art',
    artCsv: normalizeArtCsv(legacyArt),
  };
}
