import React, { useState, useEffect } from "react";
import { 
  Folder, FolderPlus, FileText, Plus, Trash2, Edit3, Download, Copy, Check, 
  Search, Filter, ArrowRight, ChevronRight, PlusCircle, Database, Sparkles, 
  BookOpen, Layers, AlertCircle, Save, X, ExternalLink
} from "lucide-react";

// Standard Types for the Document Bank
export interface BankFolder {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface BankDocument {
  id: string;
  name: string;
  category: 'extracted' | 'kosp' | 'lesson_plan' | 'manual';
  folderId: string;
  content: string;
  size: number; // character count or bytes
  createdAt: string;
}

// Default Folders initialized if none exist
const DEFAULT_FOLDERS: BankFolder[] = [
  { id: "f-extracted", name: "Ekstraksi PDF & Dokumen", description: "Hasil ekstraksi materi/kurikulum dari file PDF", createdAt: new Date().toISOString() },
  { id: "f-kosp", name: "Draf KOSP Merdeka", description: "Rancangan Dokumen Kurikulum Satuan Pendidikan", createdAt: new Date().toISOString() },
  { id: "f-lessons", name: "Perencanaan TP & ATP", description: "Alur Tujuan Pembelajaran & Kriteria Ketercapaian", createdAt: new Date().toISOString() },
  { id: "f-prota-promes", name: "Program Tahunan (PROTA) & Semester (PROMES)", description: "Alokasi Pembagian Pekan Efektif & Jadwal Bulanan", createdAt: new Date().toISOString() },
  { id: "f-cp-ref", name: "Referensi Capaian Pembelajaran (CP)", description: "Naskah CP Resmi BSKAP 046/2025 Guru", createdAt: new Date().toISOString() },
  { id: "f-general", name: "Dokumen Umum Sekolah", description: "Bahan materi ajar, catatan, dan administrasi umum", createdAt: new Date().toISOString() },
];

export const DocumentBank: React.FC = () => {
  // Master states
  const [folders, setFolders] = useState<BankFolder[]>([]);
  const [documents, setDocuments] = useState<BankDocument[]>([]);
  
  // UI filter & layout states
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<BankDocument | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  
  // Modals & Action states
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDesc, setNewFolderDesc] = useState("");
  
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocContent, setNewDocContent] = useState("");
  const [newDocFolderId, setNewDocFolderId] = useState("");
  const [newDocCategory, setNewDocCategory] = useState<'extracted' | 'kosp' | 'lesson_plan' | 'manual'>("manual");

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // Delete verify custom modal states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "document" | "folder"; name?: string; message?: string } | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const handleReload = () => {
      const storedDocs = localStorage.getItem("omega_db_documents");
      if (storedDocs) {
        setDocuments(JSON.parse(storedDocs));
      }
    };
    window.addEventListener("omega-document-bank-updated", handleReload);

    const storedFolders = localStorage.getItem("omega_db_folders");
    const storedDocs = localStorage.getItem("omega_db_documents");
    
    if (storedFolders) {
      setFolders(JSON.parse(storedFolders));
    } else {
      setFolders(DEFAULT_FOLDERS);
      localStorage.setItem("omega_db_folders", JSON.stringify(DEFAULT_FOLDERS));
    }
    
    let loadedDocs: BankDocument[] = [];
    if (storedDocs) {
      loadedDocs = JSON.parse(storedDocs);
      setDocuments(loadedDocs);
    } else {
      // Seed an initial welcoming item
      const seedDoc: BankDocument = {
        id: "doc-welcome",
        name: "Panduan Memulai OMEGA Document Bank",
        category: "manual",
        folderId: "f-general",
        content: `# SELAMAT DATANG DI OMEGA DOCUMENT BANK! 🔐📚\n\nSistem penyimpanan dokumen terintegrasi, aman, dan kebal luring (offline) untuk Guru Kelas 1 s/d 6.\n\n### Mengapa Bank Dokumen Sangat Penting?\n1. **Kekebalan Offline**: Semua dokumen disimpan langsung di peramban (browser) Anda. Data kebal terhadap refresh halaman, restart komputer, lampu padam, bahkan laptop mati.\n2. **Koneksi Lintas Modul**: Dokumen CP/ATP hasil ekstraksi PDF bisa langsung dihubungkan saat merancang KOSP, TP, ATP, KKTP atau Modul Ajar tanpa perlu salin-rekat manual!\n3. **Keamanan Maksimal**: Dokumen Anda tidak pernah diunggah ke server asing mana pun. Privasi guru dan murid 100% luring.\n\n### Cara Kerja Integrasi:\n- **Ekstraksi PDF**: Gunakan menu "AI Extractor", lalu klik "Simpan ke Bank Dokumen".\n- **Kurikulum Merdeka**: Muat draf capaian pembelajaran langsung dari bank ini di modul "Perencana Kurikulum"\n- **Penyusunan KOSP**: Gunakan teks referensi dari bank dokumen sebagai rujukan visi-misi atau landasan hukum.`,
        size: 1092,
        createdAt: new Date().toISOString()
      };
      loadedDocs = [seedDoc];
      setDocuments([seedDoc]);
      localStorage.setItem("omega_db_documents", JSON.stringify([seedDoc]));
    }

    // Auto-open requested document if selected elsewhere
    const lastSelectedDocId = localStorage.getItem("omega_db_selected_doc_id");
    if (lastSelectedDocId) {
      const matched = loadedDocs.find(d => d.id === lastSelectedDocId);
      if (matched) {
        setSelectedDoc(matched);
        setSelectedFolderId(matched.folderId);
      }
      localStorage.removeItem("omega_db_selected_doc_id");
    }

    return () => {
      window.removeEventListener("omega-document-bank-updated", handleReload);
    };
  }, []);

  // Sync state dynamically when other components change the Document Bank
  useEffect(() => {
    const handleSync = () => {
      const storedFolders = localStorage.getItem("omega_db_folders");
      const storedDocs = localStorage.getItem("omega_db_documents");
      if (storedFolders) {
        try {
          setFolders(JSON.parse(storedFolders));
        } catch (e) {
          console.error("Error parsing folders during sync:", e);
        }
      }
      if (storedDocs) {
        try {
          const loadedDocs = JSON.parse(storedDocs);
          setDocuments(loadedDocs);
          // Sync currently viewed document or safely close if deleted
          setSelectedDoc(prev => {
            if (!prev) return null;
            const matched = loadedDocs.find((d: any) => d.id === prev.id);
            return matched || null;
          });
        } catch (e) {
          console.error("Error parsing documents during sync:", e);
        }
      }
    };
    window.addEventListener("omega-state-updated", handleSync);
    return () => {
      window.removeEventListener("omega-state-updated", handleSync);
    };
  }, []);

  // Sync to local storage
  const saveToLocalStorage = (newFolders: BankFolder[], newDocs: BankDocument[]) => {
    localStorage.setItem("omega_db_folders", JSON.stringify(newFolders));
    localStorage.setItem("omega_db_documents", JSON.stringify(newDocs));
    // Broadcast state update across the application
    window.dispatchEvent(new CustomEvent("omega-state-updated"));
  };

  const showNotification = (msg: string) => {
    setSaveNotification(msg);
    setTimeout(() => {
      setSaveNotification(null);
    }, 3000);
  };

  // Create folder handler
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    
    const newFolder: BankFolder = {
      id: "f-" + Date.now(),
      name: newFolderName,
      description: newFolderDesc,
      createdAt: new Date().toISOString()
    };
    
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    saveToLocalStorage(updatedFolders, documents);
    
    setNewFolderName("");
    setNewFolderDesc("");
    setShowAddFolder(false);
    showNotification(`Folder "${newFolder.name}" berhasil dibuat!`);
  };

  // Add document handler
  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocContent.trim() || !newDocFolderId) return;

    const newDoc: BankDocument = {
      id: "doc-" + Date.now(),
      name: newDocName,
      category: newDocCategory,
      folderId: newDocFolderId,
      content: newDocContent,
      size: newDocContent.length,
      createdAt: new Date().toISOString()
    };

    const updatedDocs = [...documents, newDoc];
    setDocuments(updatedDocs);
    saveToLocalStorage(folders, updatedDocs);

    setNewDocName("");
    setNewDocContent("");
    setShowAddDoc(false);
    setSelectedDoc(newDoc); // auto view
    showNotification(`Dokumen "${newDoc.name}" disimpan ke Bank!`);
  };

  // Save changes from editing a document
  const handleSaveEdit = () => {
    if (!selectedDoc) return;
    const updatedDocs = documents.map(doc => {
      if (doc.id === selectedDoc.id) {
        return {
          ...doc,
          name: editedTitle,
          content: editedContent,
          size: editedContent.length
        };
      }
      return doc;
    });

    setDocuments(updatedDocs);
    saveToLocalStorage(folders, updatedDocs);
    setSelectedDoc({
      ...selectedDoc,
      name: editedTitle,
      content: editedContent,
      size: editedContent.length
    });
    setIsEditing(false);
    showNotification("Dokumen berhasil diperbarui!");
  };

  // Delete document handler (Trigger Custom Modal)
  const handleDeleteDocument = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;
    setItemToDelete({
      id: docId,
      type: "document",
      name: doc.name,
      message: `Apakah Anda yakin ingin menghapus berkas dokumen "${doc.name}" secara permanen dari Bank Dokumen lokal Anda? Tindakan ini tidak dapat dibatalkan.`
    });
    setDeleteConfirmOpen(true);
  };

  // Delete folder handler (Trigger Custom Modal)
  const handleDeleteFolder = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;

    const isDefault = DEFAULT_FOLDERS.some(f => f.id === folderId);
    if (isDefault) {
      showNotification("Folder bawaan sistem tidak boleh dihapus demi fungsionalitas asisten.");
      return;
    }

    const folderDocsCount = documents.filter(doc => doc.folderId === folderId).length;
    let message = `Apakah Anda yakin ingin menghapus folder "${folder.name}" secara permanen?`;
    if (folderDocsCount > 0) {
      message += ` Semua ${folderDocsCount} berkas dokumen di dalamnya akan dipindahkan secara otomatis ke folder "Dokumen Umum Sekolah" agar tidak hilang.`;
    } else {
      message += ` Folder kosong ini akan dihapus dari repositori luring.`;
    }

    setItemToDelete({
      id: folderId,
      type: "folder",
      name: folder.name,
      message
    });
    setDeleteConfirmOpen(true);
  };

  // Execution routine when user confirms deletion in custom modal
  const executeDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === "document") {
      const updatedDocs = documents.filter(doc => doc.id !== itemToDelete.id);
      setDocuments(updatedDocs);
      saveToLocalStorage(folders, updatedDocs);
      if (selectedDoc?.id === itemToDelete.id) {
        setSelectedDoc(null);
      }
      showNotification("Dokumen berhasil dihapus!");
    } else if (itemToDelete.type === "folder") {
      const folderId = itemToDelete.id;
      const updatedDocs = documents.map(doc => {
        if (doc.folderId === folderId) {
          return { ...doc, folderId: "f-general" }; // Move orphans to general
        }
        return doc;
      });

      const updatedFolders = folders.filter(f => f.id !== folderId);
      setFolders(updatedFolders);
      setDocuments(updatedDocs);
      saveToLocalStorage(updatedFolders, updatedDocs);
      if (selectedFolderId === folderId) {
        setSelectedFolderId(null);
      }
      showNotification("Folder dihapus dan dokumen dipindahkan.");
    }

    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  // Copy document function
  const handleCopy = (doc: BankDocument) => {
    navigator.clipboard.writeText(doc.content);
    setCopiedDocId(doc.id);
    setTimeout(() => {
      setCopiedDocId(null);
    }, 2000);
  };

  // Download document function
  const handleDownload = (doc: BankDocument) => {
    const element = document.createElement("a");
    const file = new Blob([doc.content], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.name}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Document filtration logic
  const filteredDocs = documents.filter(doc => {
    const matchesFolder = selectedFolderId ? doc.folderId === selectedFolderId : true;
    const matchesCategory = categoryFilter === "ALL" ? true : doc.category === categoryFilter.toLowerCase();
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesCategory && matchesSearch;
  });

  const getDocCountInFolder = (folderId: string) => {
    return documents.filter(doc => doc.folderId === folderId).length;
  };

  return (
    <div className="space-y-6">
      
      {/* FLOATING SUCCESS NOTIFICATION */}
      {saveNotification && (
        <div className="fixed bottom-6 right-6 z-55 bg-emerald-555 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-mono text-xs font-bold py-3 px-5 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-400/30 animate-bounce">
          <Check className="w-4 h-4 shrink-0" />
          <span>{saveNotification}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="rounded-2xl border border-zinc-900 bg-[#0c0c11]/80 p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[150px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 font-mono text-[10px] mb-3 border border-amber-500/20">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              omega_secure_offline_vault_active
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white font-display flex items-center gap-3">
              BANK DOKUMEN PREMIUM
            </h2>
            <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed font-sans max-w-xl">
              Gudang naskah lokal yang mengunci data evaluasi guru, KOSP, Capaian Pembelajaran, draf TP/ATP secara permanen di komputer Anda. Data 100% privat, aman, & terintegrasi langsung dengan mesin AI.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setNewDocFolderId(selectedFolderId || folders[0]?.id || "");
                setShowAddDoc(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:scale-[1.02] transform transition-all text-zinc-950 font-bold font-sans text-xs flex items-center gap-1.5 shadow-[0_4px_12px_rgba(245,158,11,0.2)] border-t border-white/20 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Tulis Draf Dokumen
            </button>
            <button
              onClick={() => setShowAddFolder(true)}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white font-semibold font-sans text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-zinc-400" />
              Folder Baru
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari nama dokumen atau isi naskah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a0a0e] border border-zinc-900 rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition font-sans"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 hover:text-zinc-300 font-bold"
            >
              CLEAR
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-zinc-500 ml-1 shrink-0" />
          <div className="flex gap-1.5 shrink-0">
            {["ALL", "KOSP", "LESSON_PLAN", "EXTRACTED", "MANUAL"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold transition-all uppercase ${
                  categoryFilter === cat
                    ? 'bg-amber-400/20 text-amber-300 border-amber-500/40'
                    : 'bg-[#08080c] border-zinc-900 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {cat === "ALL" ? "Semua tipe" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE (BROWSER & READER PANE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: FOLDER LIST & FILE LIST (12 columns split: 4 for directory tree, 8 for file content, or inline) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* FOLDERS SLIDER / SELECTION */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center justify-between">
              <span>🗂️ PILIH FOLDER</span>
              {selectedFolderId && (
                <button 
                  onClick={() => setSelectedFolderId(null)} 
                  className="text-amber-500 hover:underline hover:text-amber-400"
                >
                  Tampilkan Semua Folder
                </button>
              )}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {folders.map((folder) => {
                const isSelected = selectedFolderId === folder.id;
                const docCount = getDocCountInFolder(folder.id);
                return (
                  <div
                    key={folder.id}
                    onClick={() => {
                      setSelectedFolderId(isSelected ? null : folder.id);
                      setSelectedDoc(null);
                    }}
                    className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-gradient-to-br from-[#12100e] to-[#08080c] border-amber-500/60 shadow-[0_4px_16px_rgba(245,158,11,0.1)] text-amber-200"
                        : "bg-[#09090d] border-zinc-900 text-zinc-300 hover:border-zinc-800 hover:bg-[#0b0c10]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <Folder className={`w-5 h-5 ${isSelected ? 'text-amber-400 animate-pulse' : 'text-zinc-400 group-hover:text-amber-500'} transition-colors shrink-0`} />
                      <span className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded-md ${
                        isSelected ? 'bg-amber-400/20 text-amber-300' : 'bg-zinc-950 text-zinc-500'
                      }`}>
                        {docCount} File
                      </span>
                    </div>
                    
                    <div className="mt-3.5">
                      <h4 className="text-[11.5px] font-bold truncate tracking-wide">{folder.name}</h4>
                      <p className="text-[9.5px] text-zinc-500 mt-1 line-clamp-1 group-hover:text-zinc-400 font-sans">
                        {folder.description || "Tidak ada deskripsi"}
                      </p>
                    </div>

                    {/* Small delete icon on hover for custom folders */}
                    {!DEFAULT_FOLDERS.some(f => f.id === folder.id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder.id);
                        }}
                        className="absolute top-2 right-12 p-1 text-zinc-600 hover:text-red-400 transition"
                        title="Hapus Folder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* DOCUMENTS LIST */}
          <div className="rounded-xl border border-zinc-900 bg-[#08080b] p-4.5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-amber-500 inline-block rounded" />
                BERKAS DOKUMEN ({filteredDocs.length})
              </h3>
              <span className="text-[9px] text-zinc-600 font-mono">
                Sisa kuota: Luring (Tak Terbatas)
              </span>
            </div>

            {filteredDocs.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-zinc-900 rounded-xl space-y-2">
                <FileText className="w-8 h-8 text-zinc-700 mx-auto stroke-1" />
                <p className="text-xs text-zinc-500 font-sans">Tidak ada dokumen yang ditemukan.</p>
                {selectedFolderId && (
                  <p className="text-[10px] text-zinc-600 font-sans">Cobalah untuk membuat draf dokumen baru di folder ini.</p>
                )}
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredDocs.map((doc) => {
                  const isSelected = selectedDoc?.id === doc.id;
                  const folder = folders.find(f => f.id === doc.folderId);
                  
                  return (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setSelectedDoc(doc);
                        setIsEditing(false);
                      }}
                      className={`group p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-amber-400/5 border-amber-500/30 text-white"
                          : "bg-zinc-950/60 border-zinc-900 hover:border-zinc-800 text-zinc-300 hover:bg-[#09090d]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className={`p-1.5 rounded-md ${
                          isSelected ? 'bg-amber-500/25 text-amber-400' : 'bg-zinc-900 text-zinc-500'
                        }`}>
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[11.5px] font-semibold truncate tracking-wide">{doc.name}</h4>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[8.5px] font-mono text-zinc-500">
                            <span className="uppercase text-amber-500 font-bold">{doc.category}</span>
                            <span>•</span>
                            <span>{Math.round(doc.size / 100) / 10} KB</span>
                            {folder && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[80px]">{folder.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(doc);
                          }}
                          className="p-1 hover:text-amber-400 transition"
                          title="Salin Teks"
                        >
                          {copiedDocId === doc.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDocument(doc.id);
                          }}
                          className="p-1 hover:text-red-400 transition"
                          title="Hapus Dokumen"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: READ & EDIT WRITING PANE */}
        <div className="lg:col-span-7">
          {selectedDoc ? (
            <div className="rounded-xl border border-zinc-950 bg-[#08080c] relative overflow-hidden flex flex-col h-full min-h-[460px]">
              
              {/* Header Actions for selected Document */}
              <div className="p-4 bg-zinc-950/80 border-b border-zinc-900 flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  {isEditing ? (
                    <input
                      type="text"
                      className="bg-black/40 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold w-full sm:w-64 max-w-full"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                  ) : (
                    <h3 className="text-xs font-bold text-white tracking-wide truncate flex items-center gap-2">
                       {selectedDoc.name}
                    </h3>
                  )}
                  
                  <p className="text-[9px] font-mono text-zinc-500 mt-1">
                    Disimpan luring: {new Date(selectedDoc.createdAt).toLocaleString('id-ID')} ({selectedDoc.content.length} karakter)
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold flex items-center gap-1 transition"
                      >
                        <Save className="w-3 h-3" />
                        SIMPAN
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="py-1 px-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 font-mono text-[10px] flex items-center gap-1 transition"
                      >
                        BATAL
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setEditedTitle(selectedDoc.name);
                          setEditedContent(selectedDoc.content);
                        }}
                        className="py-1 px-2 border border-zinc-900 hover:border-zinc-800 rounded bg-[#0a0a0f] hover:bg-zinc-900 text-zinc-300 font-mono text-[10px] flex items-center gap-1 transition"
                      >
                        <Edit3 className="w-3 h-3 text-amber-400" />
                        Edit Teks
                      </button>
                      <button
                        onClick={() => handleCopy(selectedDoc)}
                        className="py-1 px-2 border border-zinc-900 hover:border-zinc-800 rounded bg-[#0a0a0f] hover:bg-zinc-900 text-zinc-300 font-mono text-[10px] flex items-center gap-1 transition"
                      >
                        {copiedDocId === selectedDoc.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            Copy: OK
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Salin
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDownload(selectedDoc)}
                        className="py-1 px-2 border border-zinc-900 hover:border-zinc-800 rounded bg-[#0a0a0f] hover:bg-zinc-900 text-zinc-300 font-mono text-[10px] flex items-center gap-1 transition"
                      >
                        <Download className="w-3 h-3" />
                        Unduh
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(selectedDoc.id)}
                        className="py-1 px-1.5 border border-transparent hover:border-red-950/40 rounded bg-[#0a0a0f] hover:bg-red-950/20 text-red-500 font-mono text-[10px] transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Content Reading Area */}
              <div className="p-5 flex-1 overflow-y-auto max-h-[500px]">
                {isEditing ? (
                  <textarea
                    className="w-full h-[360px] bg-black/50 border border-zinc-900 rounded-xl p-4 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50 font-mono leading-relaxed"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                ) : (
                  <div className="prose prose-invert prose-xs max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-xs text-zinc-350 leading-relaxed bg-[#050508] p-4 rounded-xl border border-zinc-900/40 max-h-[440px] overflow-y-auto">
                      {selectedDoc.content}
                    </pre>
                  </div>
                )}
              </div>

              {/* Connected Modules Footer Info banner */}
              <div className="p-3 bg-amber-500/5 border-t border-zinc-900 text-[9.5px] font-sans text-amber-500 font-black flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Naskah ini siap dikoneksikan ke menu "KOSP Merdeka" & "Perencana Kurikulum" luring.
                </span>
                <span className="text-zinc-600 font-mono">ID: {selectedDoc.id}</span>
              </div>

            </div>
          ) : (
            <div className="rounded-xl border border-zinc-900 bg-[#08080c]/60 p-10 text-center flex flex-col items-center justify-center h-full min-h-[460px] space-y-4">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-amber-500/10 blur opacity-60 animate-pulse" />
                <div className="relative w-14 h-14 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center text-amber-400">
                  <Database className="w-6 h-6 stroke-1.5" />
                </div>
              </div>
              <div className="max-w-xs space-y-1.5">
                <h4 className="text-[13px] font-bold text-white tracking-wide uppercase">Draf Viewport Kosong</h4>
                <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                  Pilih dokumen dari menu berkas disamping untuk membaca naskah, mengedit transkripsi, menyalin, atau mengunduhnya.
                </p>
                <div className="pt-2 text-[10px] text-amber-550 underline hover:text-amber-400 font-mono font-bold cursor-pointer flex items-center justify-center gap-1" onClick={() => setSelectedDoc(documents[0])}>
                  <ExternalLink className="w-3.5 h-3.5" /> Buka Panduan Memulai
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* POPUP MODAL: CREATE FLUID FOLDER */}
      {showAddFolder && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border border-zinc-900 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-fade-in relative">
            <button 
              onClick={() => setShowAddFolder(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xs font-mono font-bold tracking-tight text-white uppercase flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-amber-400" />
                BUAT FOLDER BARU
              </h3>
              <p className="text-[10px] text-zinc-500 font-sans">Kategorisasikan transkrip dokumen guru demi kemudahan akses.</p>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-bold text-zinc-500 block uppercase">NAMA FOLDER *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Capaian Pembelajaran Mapel"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full bg-[#050508] border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono font-bold text-zinc-500 block uppercase">DESKRIPSI (OPSIONAL)</label>
                <textarea
                  placeholder="Keterangan isi dokumen guru..."
                  value={newFolderDesc}
                  onChange={(e) => setNewFolderDesc(e.target.value)}
                  className="w-full bg-[#050508] border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-amber-500 h-16 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs mt-2 hover:scale-[1.01] transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Buat Folder Baru
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: WRITE FRESH DOC DRAFT */}
      {showAddDoc && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border border-zinc-900 rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl animate-fade-in relative">
            <button 
              onClick={() => setShowAddDoc(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xs font-mono font-bold tracking-tight text-white uppercase flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-400" />
                TULIS DRAF DOKUMEN BARU
              </h3>
              <p className="text-[10px] text-zinc-500 font-sans">Simpan teks referensi kurikulum, draf materi, atau CP luring di bank data.</p>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-zinc-500 block uppercase">NAMA DOKUMEN *</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: CP Matematika Fase B 2025"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    className="w-full bg-[#050508] border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-zinc-500 block uppercase">SIMPAN DI FOLDER *</label>
                  <select
                    value={newDocFolderId}
                    onChange={(e) => setNewDocFolderId(e.target.value)}
                    required
                    className="w-full bg-[#050508] border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 selection:bg-zinc-900"
                  >
                    <option value="" disabled>-- Pilih Folder --</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-zinc-500 block uppercase">KATEGORI SUMBER</label>
                  <select
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value as any)}
                    className="w-full bg-[#050508] border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="manual">Manual Draft / Paste</option>
                    <option value="extracted">Ekstraksi berkas</option>
                    <option value="kosp">KOSP kurikulum</option>
                    <option value="lesson_plan">Perencanaan Akademik</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono font-bold text-zinc-500 block uppercase font-mono">KONTEN / ISI NASKAH DOKUMEN *</label>
                <textarea
                  required
                  placeholder="Silakan ketik atau salin-rekat (paste) naskah dokumen lengkap di sini..."
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  className="w-full bg-[#050508] border border-zinc-900 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-amber-500 h-44 resize-y font-mono leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs mt-2 hover:scale-[1.01] transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Simpan Dokumen Ke Bank
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: CUSTOM SECURE DELETE VERIFICATION (iframe safety) */}
      {deleteConfirmOpen && itemToDelete && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-[0_0_30px_rgba(239,68,68,0.25)] animate-fade-in relative">
            <div className="flex items-center gap-3 text-red-500">
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold tracking-tight uppercase">
                  KONFIRMASI HAPUS
                </h3>
                <p className="text-[9px] text-zinc-500 font-mono">omega_secure_vault_delete</p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-sans bg-zinc-950/60 p-4 rounded-xl border border-zinc-900/60">
              {itemToDelete.message}
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={executeDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-650 text-white font-bold text-xs hover:scale-[1.01] transition-transform flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-red-950/20"
                style={{ backgroundColor: "#dc2626" }} // Inline absolute fallback color to bypass custom Tailwind compilation
              >
                <Trash2 className="w-4 h-4" />
                Hapus
              </button>
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setItemToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
