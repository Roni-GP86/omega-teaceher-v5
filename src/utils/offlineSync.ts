/**
 * ⚡ OMEGA TEACHER ENGINE - OFFLINE SYNCHRONIZATION MANAGER
 * Dedicated IndexedDB-backed Sync Queue for Client-Side documents.
 * 
 * This utility registers a transaction queue inside IndexedDB when the application is luring (offline)
 * and automatically uploads/commits the changes to local storage (penyimpanan lokal) once connectivity returns.
 */

export interface SyncTask {
  id?: number;
  timestamp: string;
  documentId: string;
  documentName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any; // The document object
}

const DB_NAME = 'OmegaOfflineSyncDB';
const STORE_NAME = 'sync_queue';
const DB_VERSION = 1;

/**
 * Initialize IndexedDB Database and return the DB instance
 */
export function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('Browser Anda tidak mendukung IndexedDB untuk sinkronisasi luring.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Gagal membuka basis data IndexedDB.'));
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

/**
 * Enqueue a document change into the IndexedDB Sync Queue
 */
export async function enqueueSyncTask(
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  documentId: string,
  documentName: string,
  payload: any
): Promise<void> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const task: SyncTask = {
        timestamp: new Date().toISOString(),
        documentId,
        documentName,
        action,
        payload,
      };

      const request = store.add(task);

      request.onsuccess = () => {
        // Dispatch event so layout can instantly read the updated pending count
        window.dispatchEvent(new CustomEvent('omega-sync-queue-updated'));
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Gagal memasukkan pemutakhiran ke dalam antrean.'));
      };
    });
  } catch (err) {
    console.error('IndexedDB Enqueue Error:', err);
    // Fallback to memory or localStorage directly if IndexedDB blocks
  }
}

/**
 * Fetch all pending sync tasks from IndexedDB
 */
export async function getPendingSyncTasks(): Promise<SyncTask[]> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result as SyncTask[]);
      };

      request.onerror = () => {
        reject(new Error('Gagal membaca antrean pemulihan dari IndexedDB.'));
      };
    });
  } catch (err) {
    console.error('getPendingSyncTasks Error:', err);
    return [];
  }
}

/**
 * Remove a finalized task from the queue
 */
export async function removeSyncTask(id: number): Promise<void> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        window.dispatchEvent(new CustomEvent('omega-sync-queue-updated'));
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Gagal melepaskan tugas antrean ID: ' + id));
      };
    });
  } catch (err) {
    console.error('removeSyncTask Error:', err);
  }
}

/**
 * Push all offline accumulated changes back into the LocalStorage document store
 */
export async function processSyncQueue(): Promise<number> {
  const pendingTasks = await getPendingSyncTasks();
  if (pendingTasks.length === 0) return 0;

  try {
    // 1. Dapatkan daftar dokumen lokal saat ini
    const storedStr = localStorage.getItem('omega_db_documents');
    let currentDocs = storedStr ? JSON.parse(storedStr) : [];
    if (!Array.isArray(currentDocs)) currentDocs = [];

    // 2. Iterasi dan modifikasi basis data dokumen lokal berdasarkan tugas antrean luring
    for (const task of pendingTasks) {
      if (task.action === 'CREATE') {
        // Hindari duplikasi jika id dokumen sama
        const exists = currentDocs.some((d: any) => d.id === task.documentId);
        if (!exists) {
          currentDocs.unshift(task.payload);
        } else {
          // Jika sudah ada, anggap sebagai update terakhir
          currentDocs = currentDocs.map((d: any) => d.id === task.documentId ? { ...d, ...task.payload } : d);
        }
      } else if (task.action === 'UPDATE') {
        currentDocs = currentDocs.map((d: any) => d.id === task.documentId ? { ...d, ...task.payload } : d);
      } else if (task.action === 'DELETE') {
        currentDocs = currentDocs.filter((d: any) => d.id !== task.documentId);
      }

      // Bersihkan tugas dari IndexedDB setelah diproses
      if (task.id !== undefined) {
        await removeSyncTask(task.id);
      }
    }

    // 3. Simpan state hasil gabungan ke penyimpanan lokal (localStorage)
    localStorage.setItem('omega_db_documents', JSON.stringify(currentDocs));

    // 4. Trigger peristiwa kustom agar visual komponen di refresh secara instan
    window.dispatchEvent(new CustomEvent('omega-document-bank-updated'));
    window.dispatchEvent(new CustomEvent('omega-sync-queue-updated'));

    return pendingTasks.length;
  } catch (err) {
    console.error('Gagal memproses merger antrean sinkronisasi:', err);
    throw err;
  }
}

/**
 * Interceptor Helper: Saves a document update securely.
 * Automatically checks online/offline state.
 * - If ONLINE: Saves directly to LocalStorage (local persistence) and ensures database is in sync.
 * - If OFFLINE: Queues changes in IndexedDB Sync Queue, then saves it to LocalStorage to ensure active session keeps working.
 */
export async function saveDocumentSafely(
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  docId: string,
  docName: string,
  updatedDocPayload: any
): Promise<void> {
  const isOnline = navigator.onLine;

  if (!isOnline) {
    // Luring: Antrekan perubahan ke IndexedDB agar tidak hilang jika browser ditutup/ganti perangkat luring
    await enqueueSyncTask(action, docId, docName, updatedDocPayload);
    
    // Simpan juga ke localStorage agar sesi aktif tetap melacak state dokumen sementara
    const storedStr = localStorage.getItem('omega_db_documents');
    let currentDocs = storedStr ? JSON.parse(storedStr) : [];
    if (action === 'CREATE') {
      currentDocs.unshift(updatedDocPayload);
    } else if (action === 'UPDATE') {
      currentDocs = currentDocs.map((d: any) => d.id === docId ? { ...d, ...updatedDocPayload } : d);
    } else if (action === 'DELETE') {
      currentDocs = currentDocs.filter((d: any) => d.id !== docId);
    }
    localStorage.setItem('omega_db_documents', JSON.stringify(currentDocs));
    window.dispatchEvent(new CustomEvent('omega-document-bank-updated'));
  } else {
    // Online: Langsung simpan ke penyimpanan lokal
    const storedStr = localStorage.getItem('omega_db_documents');
    let currentDocs = storedStr ? JSON.parse(storedStr) : [];
    if (action === 'CREATE') {
      currentDocs.unshift(updatedDocPayload);
    } else if (action === 'UPDATE') {
      currentDocs = currentDocs.map((d: any) => d.id === docId ? { ...d, ...updatedDocPayload } : d);
    } else if (action === 'DELETE') {
      currentDocs = currentDocs.filter((d: any) => d.id !== docId);
    }
    localStorage.setItem('omega_db_documents', JSON.stringify(currentDocs));
    window.dispatchEvent(new CustomEvent('omega-document-bank-updated'));
  }
}
