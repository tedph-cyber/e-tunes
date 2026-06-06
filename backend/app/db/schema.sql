CREATE TABLE IF NOT EXISTS scales (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    aliases TEXT DEFAULT '[]',
    intervals TEXT NOT NULL,
    pitch_classes TEXT NOT NULL,
    bitmask INTEGER NOT NULL,
    category TEXT NOT NULL,
    cardinality INTEGER NOT NULL,
    difficulty INTEGER DEFAULT 1,
    is_symmetric INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS chords (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    intervals TEXT NOT NULL,
    bitmask INTEGER NOT NULL,
    quality TEXT NOT NULL,
    extensions TEXT DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS scale_chords (
    scale_id TEXT REFERENCES scales(id),
    degree INTEGER,
    chord_id TEXT REFERENCES chords(id),
    root_offset INTEGER,
    quality TEXT,
    PRIMARY KEY (scale_id, degree)
);

CREATE TABLE IF NOT EXISTS chord_scales (
    chord_id TEXT REFERENCES chords(id),
    scale_id TEXT REFERENCES scales(id),
    compatibility REAL,
    PRIMARY KEY (chord_id, scale_id)
);

CREATE TABLE IF NOT EXISTS exercise_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    exercise_type TEXT NOT NULL,
    challenge_id TEXT NOT NULL,
    correct INTEGER NOT NULL,
    answer_id TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
