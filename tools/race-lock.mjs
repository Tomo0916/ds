// Lock a race result with a password (the race pages show it only to whoever types the password).
//   node tools/race-lock.mjs <practice/dir> <password> '<json: {"r":[a,b,c],"pay":{…}}>'
// Writes window.RACE_LOCK into <dir>/lock.js. AES-GCM, key from PBKDF2-SHA256 (ITER rounds) of the password.
import { webcrypto as C } from 'node:crypto';
import { writeFileSync } from 'node:fs';
const [dir, pw, json] = process.argv.slice(2);
if (!dir || !pw || !json) { console.error('usage: node tools/race-lock.mjs <dir> <password> <json>'); process.exit(1); }
JSON.parse(json);
const ITER = 400000, enc = new TextEncoder(), b64 = u => Buffer.from(u).toString('base64');
const salt = C.getRandomValues(new Uint8Array(16)), iv = C.getRandomValues(new Uint8Array(12));
const base = await C.subtle.importKey('raw', enc.encode(pw.normalize('NFKC').toLowerCase()), 'PBKDF2', false, ['deriveKey']);
const key = await C.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const ct = new Uint8Array(await C.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(json)));
writeFileSync(`${dir}/lock.js`, `/* The result, locked with the teacher's password (made by tools/race-lock.mjs). */\nwindow.RACE_LOCK = ${JSON.stringify({ it: ITER, s: b64(salt), iv: b64(iv), ct: b64(ct) })};\n`);
console.log('locked', dir);
