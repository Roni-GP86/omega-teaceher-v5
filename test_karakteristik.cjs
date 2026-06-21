async function test() {
  const payload = {
    materi: ["Mengenal Bendera Merah Putih"],
    mapel: "Pendidikan Pancasila",
    elemen: "Pancasila",
    topik_utama: "Bendera dan Lagu Kebangsaan",
    fase_kelas: "Fase A / Kelas 1",
    sekolah: "SD Harapan Bangsa",
    lingkungan_fisik: ["Ruang Lingkungan Alam"],
    budaya_belajar: ["Disiplin dan gotong royong"]
  };

  try {
    const res = await fetch('http://localhost:3000/api/generate-karakteristik', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('STATUS:', res.status);
    const data = await res.json();
    console.log('RESPONSE:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('ERROR CALLING ROUTE:', err);
  }
}

test();
