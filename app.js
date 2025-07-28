// 🔧 Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🌐 Relay switch control
const relaySwitch = document.getElementById("relaySwitch");
relaySwitch.addEventListener("change", () => {
  const state = relaySwitch.checked ? "on" : "off";
  db.ref("/relay").set(state);
});

// 🔍 QR Scanner
const qrBtn = document.getElementById("scanQR");
const status = document.getElementById("status");
const videoElem = document.getElementById("qr-video");

qrBtn.addEventListener("click", () => {
  status.textContent = "Scanning QR Code...";
  const qrScanner = new Html5Qrcode("qr-video");
  videoElem.hidden = false;

  qrScanner.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: 250
    },
    (decodedText, decodedResult) => {
      qrScanner.stop().then(() => {
        videoElem.hidden = true;
        status.textContent = "QR Code scanned: " + decodedText;

        // Example: Only allow specific QR text
        if (decodedText === "UMBRA123") {
          db.ref("/relay").set("on");
          status.textContent = "Umbrella Unlocked!";
        } else {
          status.textContent = "Invalid QR!";
        }
      });
    },
    (errorMsg) => {
      console.warn("QR Scan Error:", errorMsg);
    }
  );
});
