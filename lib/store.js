import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = process.env.DATA_DIR || path.join(here, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

fs.mkdirSync(DATA_DIR, { recursive: true });

const empty = () => ({
  users: [], clients: [], visits: [], plans: [], recipes: [],
  appointments: [], todos: [], templates: [], customFoods: [],
  diary: [], messages: [],
});

export const db = empty();
try {
  const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  Object.assign(db, empty(), parsed);
  for (const k of Object.keys(empty())) if (!Array.isArray(db[k])) db[k] = [];
} catch { /* first run */ }

export function save() {
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db));
  fs.renameSync(tmp, DB_FILE);
}

export function uid() {
  return crypto.randomBytes(9).toString('base64url');
}

export function owned(list, ownerId) {
  return list.filter(x => x.ownerId === ownerId);
}

export function findOwned(list, ownerId, id) {
  return list.find(x => x.id === id && x.ownerId === ownerId) || null;
}
