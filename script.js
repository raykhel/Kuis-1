// login
let loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let email = document.getElementById("loginEmail").value.trim();
    let pass = document.getElementById("loginPassword").value.trim();

    if (!email || !pass) {
      alert("Email dan password harus diisi.");
      return;
    }
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    let user = users.find((u) => u.email === email && u.password === pass);

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      alert("Login berhasil!");
      window.location.href = "index.html";
    } else {
      alert("Email atau password salah.");
    }
  });
}

// signup
let signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let email = document.getElementById("signupEmail").value.trim();
    let pass = document.getElementById("signupPassword").value.trim();
    let confirm = document.getElementById("signupConfirm").value.trim();
    let nama = document.getElementById("signupName").value.trim();
    let hp = document.getElementById("signupPhone").value.trim();

    if (!email || !pass || !confirm || !nama || !hp) {
      alert("Semua field wajib diisi.");
      return;
    }
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Format email tidak valid.");
      return;
    }
    if (pass.length < 8) {
      alert("Password minimal 8 karakter.");
      return;
    }
    if (pass !== confirm) {
      alert("Konfirmasi password tidak sesuai.");
      return;
    }
    if (nama.length < 3 || nama.length > 32 || /\d/.test(nama)) {
      alert("Nama lengkap tidak valid.");
      return;
    }
    if (!/^08\d{8,14}$/.test(hp)) {
      alert("Nomor HP tidak valid.");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.email === email)) {
      alert("Email sudah terdaftar.");
      return;
    }

    users.push({ email, password: pass, nama, hp });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registrasi berhasil. Silakan login.");
    window.location.href = "login.html";
  });
}

// logout
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// beli mobil
let mobilForm = document.getElementById("mobilForm");
if (mobilForm) {
  mobilForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let harga = parseFloat(document.getElementById("hargaMobil").value);
    let tahun = parseInt(document.getElementById("tahunMobil").value);
    let umur = new Date().getFullYear() - tahun;
    let premi = 0;

    if (umur <= 3) premi = 0.025 * harga;
    else if (umur <= 5 && harga < 200000000) premi = 0.04 * harga;
    else if (umur <= 5 && harga >= 200000000) premi = 0.03 * harga;
    else premi = 0.05 * harga;

    document.getElementById("hasilMobil").innerText =
      "Premi per tahun: Rp" + premi.toLocaleString();

    localStorage.setItem(
      "tempCheckout",
      JSON.stringify({
        produk: "Asuransi Mobil",
        premi,
        tanggal: new Date().toLocaleDateString(),
      })
    );
  });
}

// beli kesehatan
let kesehatanForm = document.getElementById("kesehatanForm");
if (kesehatanForm) {
  kesehatanForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let lahir = new Date(document.getElementById("lahirKesehatan").value);
    let umur = new Date().getFullYear() - lahir.getFullYear();
    let merokok = document.getElementById("merokok").value === "ya" ? 1 : 0;
    let hipertensi = document.getElementById("hipertensi").value === "ya" ? 1 : 0;
    let diabetes = document.getElementById("diabetes").value === "ya" ? 1 : 0;

    let P = 2000000;
    let m = 0;
    if (umur <= 20) m = 0.1;
    else if (umur <= 35) m = 0.2;
    else if (umur <= 50) m = 0.25;
    else m = 0.4;

    let premi =
      P + m * P + merokok * 0.5 * P + hipertensi * 0.4 * P + diabetes * 0.5 * P;

    document.getElementById("hasilKesehatan").innerText =
      "Premi per tahun: Rp" + premi.toLocaleString();

    localStorage.setItem(
      "tempCheckout",
      JSON.stringify({
        produk: "Asuransi Kesehatan",
        premi,
        tanggal: new Date().toLocaleDateString(),
      })
    );
  });
}

// beli jiwa
let jiwaForm = document.getElementById("jiwaForm");
if (jiwaForm) {
  jiwaForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let lahir = new Date(document.getElementById("lahirJiwa").value);
    let umur = new Date().getFullYear() - lahir.getFullYear();
    let pertanggungan = parseInt(document.getElementById("pertanggungan").value);

    let m = 0;
    if (umur <= 30) m = 0.002;
    else if (umur <= 50) m = 0.004;
    else m = 0.01;

    let premi = m * pertanggungan;
    document.getElementById("hasilJiwa").innerText =
      "Premi per bulan: Rp" + premi.toLocaleString();

    localStorage.setItem(
      "tempCheckout",
      JSON.stringify({
        produk: "Asuransi Jiwa",
        premi,
        tanggal: new Date().toLocaleDateString(),
      })
    );
  });
}

// checkout
let checkoutForm = document.getElementById("checkoutForm");
let checkoutInfo = document.getElementById("checkoutInfo");

if (checkoutForm && checkoutInfo) {
  let data = JSON.parse(localStorage.getItem("tempCheckout"));

  if (data) {
    checkoutInfo.innerHTML = `
      <p><strong>Produk:</strong> ${data.produk}</p>
      <p><strong>Premi:</strong> Rp${data.premi.toLocaleString()}</p>
      <p><strong>Tanggal:</strong> ${data.tanggal}</p>
      <p><strong>Metode Pembayaran:</strong> Transfer Bank / E-Wallet</p>
    `;

    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let history = JSON.parse(localStorage.getItem("history") || "[]");
      history.push({
        produk: data.produk,
        tanggal: data.tanggal,
        harga: data.premi,
        status: "Lunas",
      });
      localStorage.setItem("history", JSON.stringify(history));
      localStorage.removeItem("tempCheckout");

      alert("Pembayaran berhasil!");
      window.location.href = "history.html";
    });
  } else {
    checkoutInfo.innerHTML = `<p>Tidak ada data checkout. Silakan pilih produk dulu.</p>`;
  }
}

// history
let historyTable = document.querySelector("#historyTable tbody");
if (historyTable) {
  let history = JSON.parse(localStorage.getItem("history") || "[]");
  if (history.length === 0) {
    historyTable.innerHTML =
      "<tr><td colspan='4'>Belum ada histori pembelian.</td></tr>";
  } else {
    history.forEach((h) => {
      let row = `<tr>
        <td>${h.tanggal}</td>
        <td>${h.produk}</td>
        <td>Rp${h.harga.toLocaleString()}</td>
        <td>${h.status}</td>
      </tr>`;
      historyTable.innerHTML += row;
    });
  }
}