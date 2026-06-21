import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, doc, collection, setDoc, getDoc, getDocs, 
  deleteDoc, updateDoc, query, where, onSnapshot, orderBy 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWT2vWjE8oVqaUXbz--Mr7WuoJYH9XxqM",
  authDomain: "omega-teacher-engine.firebaseapp.com",
  projectId: "omega-teacher-engine",
  storageBucket: "omega-teacher-engine.firebasestorage.app",
  messagingSenderId: "956305928254",
  appId: "1:956305928254:web:945b0f2edab6528691a16f",
  measurementId: "G-K904EJQRWB"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Collection helper methods

// 1. Activation Requests
export const getActivationRequests = async () => {
  try {
    const q = query(collection(db, "activation_requests"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Gagal mengambil data permohonan dari Firebase:", err);
    return [];
  }
};

export const saveActivationRequest = async (requestData: any) => {
  try {
    const docRef = doc(db, "activation_requests", requestData.id || requestData.requestCode);
    await setDoc(docRef, requestData);
    return true;
  } catch (err) {
    console.error("Gagal menyimpan data permohonan ke Firebase:", err);
    throw err;
  }
};

export const updateRequestStatusInFirebase = async (id: string, status: string, additionalFields: any = {}) => {
  try {
    const docRef = doc(db, "activation_requests", id);
    await updateDoc(docRef, { status, ...additionalFields });
    return true;
  } catch (err) {
    console.error("Gagal memperbarui status permohonan di Firebase:", err);
    throw err;
  }
};

export const deleteRequestFromFirebase = async (id: string) => {
  try {
    const docRef = doc(db, "activation_requests", id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error("Gagal menghapus permohonan dari Firebase:", err);
    throw err;
  }
};

// 2. Chat/Support messages (Obrolan Super Chat)
export const saveSupportMessageToFirebase = async (msg: any) => {
  try {
    const docRef = doc(db, "support_messages", msg.id);
    await setDoc(docRef, msg);
    return true;
  } catch (err) {
    console.error("Gagal menyimpan pesan chat ke Firebase:", err);
    throw err;
  }
};

export const deleteSupportMessageFromFirebase = async (msgId: string) => {
  try {
    const docRef = doc(db, "support_messages", msgId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error("Gagal menghapus pesan chat dari Firebase:", err);
    throw err;
  }
};

export const clearSupportChatFromFirebase = async (requestCode: string) => {
  try {
    const q = query(collection(db, "support_messages"), where("requestId", "==", requestCode));
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, "support_messages", d.id)));
    await Promise.all(deletePromises);
    return true;
  } catch (err) {
    console.error("Gagal mengosongkan obrolan dari Firebase:", err);
    throw err;
  }
};

// 3. Admin/Licensed User Profile & Documents Sync (dari profil sekolah & dokumen)
export const saveLicensedUserProfileToFirebase = async (code: string, profileData: any) => {
  if (!code) return;
  try {
    const docRef = doc(db, "licensed_users", code);
    await setDoc(docRef, {
      code,
      updatedAt: new Date().toISOString(),
      ...profileData
    }, { merge: true });
    return true;
  } catch (err) {
    console.error("Gagal menyimpan profil lisensi ke Firebase:", err);
  }
};

export const fetchLicensedUserProfileFromFirebase = async (code: string) => {
  if (!code) return null;
  try {
    const docRef = doc(db, "licensed_users", code);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (err) {
    console.error("Gagal mengambil data profil lisensi ke Firebase:", err);
  }
  return null;
};

// 4. Permanent Activated Codes Register (Even if request messages/archives are deleted, actual licenses remain active)
export const saveRegisteredCodeToFirebase = async (codeData: any) => {
  try {
    const docRef = doc(db, "registered_codes", codeData.activationCode);
    await setDoc(docRef, {
      ...codeData,
      status: "ACTIVE",
      permanentlyRegisteredAt: new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.error("Gagal menyimpan data kode terdaftar permanen ke Firebase:", err);
    throw err;
  }
};

