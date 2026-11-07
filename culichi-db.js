/*
 * Conexión a Firebase (Firestore) compartida por menu.html, index.html y admin.html.
 *
 * Estructura en Firestore:
 *   contenido/sitio   -> logo, fondo, enlaces, teléfonos, promo, formato del carrusel
 *   contenido/menu    -> { sections: [...] }  (secciones, platillos, precios, portadas, fotos)
 *   imagenes/{id}     -> { data: "data:image/webp;base64,..." }  (fotos subidas desde el admin)
 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
    initializeFirestore, getFirestore, persistentLocalCache, persistentMultipleTabManager,
    connectFirestoreEmulator, doc, getDoc, getDocFromCache, getDocFromServer, setDoc, addDoc,
    deleteDoc, collection, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

export const firebaseConfig = {
    apiKey: 'AIzaSyBIBcXkHPYIJqJ4LkMcaAm0918Z-hUEVjc',
    authDomain: 'culichi-ee5de.firebaseapp.com',
    projectId: 'culichi-ee5de',
    storageBucket: 'culichi-ee5de.firebasestorage.app',
    messagingSenderId: '472361171668',
    appId: '1:472361171668:web:af09e4b29a535f45499941',
    measurementId: 'G-6TCLN15G21'
};

/* Usuario del admin: en el login se escribe "culichi"; en Firebase Auth es este correo. */
export const ADMIN_EMAIL = 'culichi@camaronculichi.app';

/* Modo de pruebas local (emulador). Solo funciona en localhost con ?emu=1 */
const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
try {
    if (isLocal && new URLSearchParams(location.search).has('emu')) sessionStorage.setItem('culichi_emu', '1');
} catch (e) { /* sin sessionStorage */ }
let emu = false;
try { emu = isLocal && sessionStorage.getItem('culichi_emu') === '1'; } catch (e) { emu = false; }
export const USING_EMULATOR = emu;

export const app = initializeApp(emu ? { ...firebaseConfig, projectId: 'demo-culichi' } : firebaseConfig);

let _db;
try {
    _db = initializeFirestore(app, {
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
    });
} catch (e) {
    _db = getFirestore(app);
}
export const db = _db;
if (emu) connectFirestoreEmulator(db, '127.0.0.1', 8085);

const D = () => window.CULICHI_DEFAULTS;
const clone = (o) => JSON.parse(JSON.stringify(o));

function withTimeout(promise, ms) {
    return Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
}

/** Lee configuración del sitio (mezclada con los valores por defecto). */
export async function loadSite({ fromServer = false, timeout = 6000 } = {}) {
    try {
        const ref = doc(db, 'contenido', 'sitio');
        const snap = await withTimeout(fromServer ? getDocFromServer(ref) : getDoc(ref), timeout);
        if (snap.exists()) {
            const data = snap.data();
            delete data.actualizado;
            return { ...clone(D().site), ...data, _fromDb: true };
        }
    } catch (e) {
        if (fromServer) throw e;
        console.warn('No se pudo leer la configuración, se usan valores por defecto', e);
    }
    return { ...clone(D().site), _fromDb: false };
}

/** Lee el menú (secciones). */
export async function loadMenu({ fromServer = false, timeout = 6000 } = {}) {
    try {
        const ref = doc(db, 'contenido', 'menu');
        const snap = await withTimeout(fromServer ? getDocFromServer(ref) : getDoc(ref), timeout);
        if (snap.exists() && Array.isArray(snap.data().sections)) {
            return { sections: snap.data().sections, _fromDb: true };
        }
    } catch (e) {
        if (fromServer) throw e;
        console.warn('No se pudo leer el menú, se usa el menú por defecto', e);
    }
    return { ...clone(D().menu), _fromDb: false };
}

export async function saveSite(site) {
    const data = { ...site };
    delete data._fromDb;
    data.actualizado = serverTimestamp();
    await setDoc(doc(db, 'contenido', 'sitio'), data);
}

export async function saveMenu(menu) {
    await setDoc(doc(db, 'contenido', 'menu'), { sections: menu.sections, actualizado: serverTimestamp() });
}

/* ---------- Imágenes ---------- */
const imgCache = new Map();

export const isDbImage = (ref) => typeof ref === 'string' && ref.startsWith('img:');

/** Convierte una referencia ("archivo.webp" o "img:ID") en algo que se puede poner en <img src>. */
export function resolveImage(ref) {
    if (!ref) return Promise.resolve('');
    if (!isDbImage(ref)) return Promise.resolve(ref);
    if (imgCache.has(ref)) return imgCache.get(ref);
    const id = ref.slice(4);
    const ref2 = doc(db, 'imagenes', id);
    // Las imágenes nunca cambian (cada foto nueva tiene otro ID), así que primero se usa la copia local.
    const p = getDocFromCache(ref2)
        .catch(() => getDoc(ref2))
        .then((snap) => (snap.exists() ? snap.data().data : ''))
        .catch((e) => { console.warn('No se pudo cargar la imagen', ref, e); imgCache.delete(ref); return ''; });
    imgCache.set(ref, p);
    return p;
}

/** Sube una imagen (dataURL ya comprimida). Devuelve la referencia "img:ID". */
export async function uploadImage(dataUrl, meta = {}) {
    const docRef = await addDoc(collection(db, 'imagenes'), { data: dataUrl, ...meta, creado: serverTimestamp() });
    const ref = 'img:' + docRef.id;
    imgCache.set(ref, Promise.resolve(dataUrl));
    return ref;
}

export async function deleteImage(ref) {
    if (!isDbImage(ref)) return;
    await deleteDoc(doc(db, 'imagenes', ref.slice(4)));
    imgCache.delete(ref);
}

/** Convierte "4/5" en número (0.8) para el CSS del carrusel. */
export function ratioNumber(r) {
    const [w, h] = String(r || '4/5').split('/').map(Number);
    return w > 0 && h > 0 ? w / h : 0.8;
}
