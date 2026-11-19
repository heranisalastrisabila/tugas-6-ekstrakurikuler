// Data ekstrakurikuler: [nama, ikon, kategori, penjelasan, kegiatan]
const KAT = { Olahraga:'#2e9e6b', Seni:'#e2563f', Keagamaan:'#2a7fd4', Organisasi:'#e0a100', Akademik:'#8a55d6' };
const DATA = [
  ['Paskibra','🇮🇩','Organisasi','Pasukan pengibar bendera. Melatih baris-berbaris, disiplin, dan jiwa nasionalisme untuk bertugas di upacara.','Latihan rutin, seleksi fisik'],
  ['Pramuka','🏕️','Organisasi','Pendidikan kepanduan: keterampilan di alam, kepemimpinan, sandi, tali-temali, dan kemandirian.','Latihan mingguan, perkemahan'],
  ['PMR','🩹','Organisasi','Palang Merah Remaja. Belajar pertolongan pertama, kesehatan, dan kepedulian sosial.','Pelatihan P3K, kegiatan sosial'],
  ['Jepun','🎌','Akademik','Mengenal bahasa dan budaya Jepang, mulai dari huruf dasar, kosakata, sampai tradisi dan seninya.','Belajar bahasa, acara budaya'],
  ['Silat','🥋','Olahraga','Bela diri tradisional untuk kebugaran, ketangkasan, dan pengendalian diri. Bisa ikut pertandingan.','Latihan teknik, kejuaraan'],
  ['Foster','💬','Akademik','Klub bahasa Inggris untuk melatih speaking, debat, dan percaya diri berbicara di depan umum.','Diskusi, lomba pidato'],
  ['Voli','🏐','Olahraga','Olahraga tim yang melatih kekompakan, refleks, dan strategi permainan di lapangan.','Latihan tim, turnamen antar sekolah'],
  ['Futsal','⚽','Olahraga','Sepak bola lapangan kecil yang cepat. Cocok untuk melatih kerja sama dan stamina.','Latihan tim, turnamen'],
  ['Jurnalis','📰','Akademik','Belajar menulis berita, wawancara, fotografi, dan mengelola mading atau media sekolah.','Liputan, penerbitan mading'],
  ['MTQ','📖','Keagamaan','Musabaqah Tilawatil Quran: seni membaca Al-Quran dengan tartil dan lagu yang indah.','Latihan tilawah, lomba MTQ'],
  ['Rebana','🥁','Seni','Seni musik islami dengan alat pukul rebana yang dipadukan dengan vokal selawat.','Latihan musik, tampil di acara'],
  ['Rohis','🕌','Keagamaan','Rohani Islam. Kajian keislaman, pembinaan akhlak, dan kegiatan keagamaan di sekolah.','Kajian, peringatan hari besar'],
  ['Padus','🎤','Seni','Paduan suara: melatih teknik vokal, harmonisasi, dan kekompakan bernyanyi bersama.','Latihan vokal, lomba paduan suara'],
  ['Drumband','🎺','Seni','Kelompok musik marching dengan perkusi dan alat tiup, tampil dalam formasi yang megah.','Latihan formasi, parade'],
  ['Tari','💃','Seni','Belajar tari tradisional dan modern untuk melatih ekspresi, keluwesan, dan kepercayaan diri.','Latihan koreografi, pentas seni']
];
const slug = (s) => s.toLowerCase();

const select = document.getElementById('ekskul');
if (select) {
  select.innerHTML = '<option value="">-- Pilih ekskul --</option>' +
    DATA.map((d) => `<option value="${slug(d[0])}">${d[0]}</option>`).join('');
}

/* ===== Halaman 1: index.html ===== */
const formPilih = document.getElementById('formPilih');
if (formPilih) {
  const grid = document.getElementById('daftarEkskul');
  const filters = document.getElementById('filters');
  const tampil = (kat) => {
    grid.innerHTML = DATA.filter((d) => kat === 'Semua' || d[2] === kat).map((d) => `
      <div class="col-sm-6 col-lg-4">
        <article class="eks-card" style="--c:${KAT[d[2]]}">
          <div class="eks-icon">${d[1]}</div>
          <h3>${d[0]}</h3>
          <span class="eks-tag">${d[2]}</span>
          <p>${d[3]}</p>
          <div class="eks-meta">${d[4]}</div>
        </article>
      </div>`).join('');
  };
  ['Semua', ...Object.keys(KAT)].forEach((k, i) => {
    const b = document.createElement('button');
    b.textContent = k;
    if (i === 0) b.classList.add('active');
    b.addEventListener('click', () => {
      filters.querySelectorAll('button').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      tampil(k);
    });
    filters.appendChild(b);
  });
  tampil('Semua');

  formPilih.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!select.value) {
      select.classList.add('is-invalid');
      return;
    }
    window.location.href = 'daftar.html?ekskul=' + encodeURIComponent(select.value);
  });
  select.addEventListener('change', () => select.classList.remove('is-invalid'));
}

/* ===== Halaman 2: daftar.html ===== */
const formDaftar = document.getElementById('formDaftar');
if (formDaftar) {
  const f = {
    nama: document.getElementById('nama'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    konfirmasi: document.getElementById('konfirmasi'),
    ekskul: select,
  };
  const dariUrl = new URLSearchParams(window.location.search).get('ekskul');
  if (dariUrl) select.value = dariUrl;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const rules = {
    nama: () => f.nama.value.trim().length >= 3,
    email: () => emailRegex.test(f.email.value.trim()),
    password: () => f.password.value.length >= 8,
    konfirmasi: () => f.konfirmasi.value !== '' && f.konfirmasi.value === f.password.value,
    ekskul: () => f.ekskul.value !== '',
  };
  const cek = (k) => {
    const valid = rules[k]();
    f[k].classList.toggle('is-valid', valid);
    f[k].classList.toggle('is-invalid', !valid);
    return valid;
  };
  Object.keys(f).forEach((k) => {
    f[k].addEventListener(k === 'ekskul' ? 'change' : 'input', () => {
      cek(k);
      if (k === 'password' && f.konfirmasi.value) cek('konfirmasi');
    });
  });

  formDaftar.addEventListener('submit', (event) => {
    event.preventDefault();
    const hasil = Object.keys(f).map(cek);
    const box = document.getElementById('sukses');
    if (hasil.every(Boolean)) {
      const ek = f.ekskul.options[f.ekskul.selectedIndex].text;
      box.textContent = `Pendaftaran Berhasil! Selamat bergabung di ${ek}, ${f.nama.value.trim()}.`;
      box.style.display = 'block';
      alert('Pendaftaran Berhasil!');
      formDaftar.reset();
      Object.values(f).forEach((el) => el.classList.remove('is-valid', 'is-invalid'));
    } else {
      box.style.display = 'none';
    }
  });
}