const API_URL = "http://localhost:5000/api/patients";

const list = document.getElementById("patientsList");
const searchInput = document.getElementById("searchInput");
const refreshBtn = document.getElementById("refreshBtn");

/* =========================
   PRELOADED DEMO PATIENTS
   ========================= */
let patients = [
  {
    name: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    active: true
  },
  {
    name: "Anita Verma",
    email: "anita.verma@gmail.com",
    active: true
  },
  {
    name: "Suresh Patil",
    email: "suresh.patil@gmail.com",
    active: false
  },
  {
    name: "Priya Iyer",
    email: "priya.iyer@gmail.com",
    active: true
  },
  {
    name: "Amit Kulkarni",
    email: "amit.kulkarni@gmail.com",
    active: false
  }
];

/* =========================
   AUTH GUARD
   ========================= */
if (!localStorage.getItem("token")) {
  window.location.href = "signin.html";
}

/* =========================
   RENDER PATIENTS
   ========================= */
function renderPatients(data) {
  list.innerHTML = "";

  data.forEach((p, index) => {
    const row = document.createElement("div");
    row.className = "patient-row";
    row.style.animationDelay = `${index * 0.08}s`;

    row.innerHTML = `
      <div class="patient-name">
        <div class="avatar">${p.name.charAt(0)}</div>
        ${p.name}
      </div>
      <div class="patient-email">${p.email}</div>
      <div class="status ${p.active ? "active" : "inactive"}">
        ${p.active ? "Active" : "Inactive"}
      </div>
    `;

    row.onclick = () => {
      alert(
        `Patient Details\n\nName: ${p.name}\nEmail: ${p.email}\nStatus: ${
          p.active ? "Active" : "Inactive"
        }`
      );
    };

    list.appendChild(row);
  });
}

/* =========================
   FETCH FROM BACKEND (OPTIONAL)
   ========================= */
async function fetchPatients() {
  try {
    const res = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (!res.ok) throw new Error("Backend not available");

    patients = await res.json();
    renderPatients(patients);

  } catch (err) {
    console.warn("Using demo patient data");
    renderPatients(patients);
  }
}

/* =========================
   SEARCH
   ========================= */
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(value) ||
    p.email.toLowerCase().includes(value)
  );
  renderPatients(filtered);
});

/* =========================
   REFRESH
   ========================= */
refreshBtn.onclick = fetchPatients;

/* =========================
   INIT
   ========================= */
renderPatients(patients);
fetchPatients();
