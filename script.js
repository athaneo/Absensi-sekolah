// 1. GANTI INI dengan URL Web App dari Google Apps Script (Ujungnya harus /exec)
// JANGAN masukkan link Google Drive atau Google Sheets di sini!
const webAppUrl = "https://script.google.com/macros/s/AKfycbzbs2dFO6G4ZqQC13mDvJWMC64QjE59MjTuV9fJMPCD9_9OPFvuka3YVovjwY4FSfU2/exec"; 

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const btnCapture = document.getElementById('btnCapture'); // Pastikan di HTML ada id="btnCapture"
const mainForm = document.getElementById('mainForm');
const locText = document.getElementById('locText');

let photoBase64 = "";
let locationLink = "Lokasi tidak tersedia";

// 2. Akses Kamera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Kamera ditolak:", err);
        alert("Mohon izinkan akses kamera!");
    });

// 3. Fungsi Ambil Foto (Klik tombol Ambil Foto, bukan Submit)
btnCapture.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    photoBase64 = canvas.toDataURL('image/jpeg');
    
    preview.src = photoBase64;
    preview.style.display = 'block';
    video.style.display = 'none';
});

// 4. Ambil Lokasi Otomatis
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(p => {
        locationLink = `https://www.google.com/maps?q=${p.coords.latitude},${p.coords.longitude}`;
        locText.innerText = "Lokasi berhasil dikunci! ✅";
        locText.style.color = "green";
    }, () => {
        locText.innerText = "Gagal akses lokasi. Aktifkan GPS!";
        locText.style.color = "red";
    });
}

// 5. Kirim Data ke Google Sheets (Saat tombol Submit diklik)
mainForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if(!photoBase64) {
        return alert("Ambil foto selfie dulu!");
    }
    
    const btnSubmit = document.getElementById('btnSubmit');
    btnSubmit.innerText = "Sedang Mengirim...";
    btnSubmit.disabled = true;

    const data = {
        nama: document.getElementById('nama').value,
        email: document.getElementById('email').value,
        lokasi: locationLink,
        foto: photoBase64
    };

    try {
        // Mengirim data ke URL /exec Apps Script
        await fetch(webAppUrl, { 
            method: 'POST', 
            mode: 'no-cors', 
            body: JSON.stringify(data) 
        });

        alert("Berhasil! Data Anda telah tersimpan.");
        location.reload(); 
    } catch (err) {
        console.error("Error:", err);
        alert("Terjadi kesalahan sistem.");
        btnSubmit.disabled = false;
        btnSubmit.innerText = "Kirim Data";
    }
});