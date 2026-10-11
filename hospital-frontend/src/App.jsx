import { useEffect, useState } from "react";
import api from "./api";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");

  const [doctors, setDoctors] = useState([]);
const [doctorName, setDoctorName] = useState("");
const [specialization, setSpecialization] = useState("");
const [doctorEmail, setDoctorEmail] = useState("");
const [doctorPhone, setDoctorPhone] = useState("");

const [appointments, setAppointments] = useState([]);
const [selectedPatient, setSelectedPatient] = useState("");
const [selectedDoctor, setSelectedDoctor] = useState("");
const [appointmentDateTime, setAppointmentDateTime] = useState("");
const [reason, setReason] = useState("");

const [bills, setBills] = useState([]);
const [billPatientId, setBillPatientId] = useState("");
const [billAmount, setBillAmount] = useState("");
const [billDescription, setBillDescription] = useState("");
const [billStatus, setBillStatus] = useState("Pending");
const [billDate, setBillDate] = useState(
  new Date().toISOString().split("T")[0]
);
const [billError, setBillError] = useState("");
const [billMessage, setBillMessage] = useState("");



async function loadPatients() {
  setLoading(true);
  setError("");

  try {
    const response = await api.get("/patients");
    setPatients(response.data);
  } catch (err) {
    console.error("Error loading patients:", err);
    setError(
      err.response
        ? `API error: ${err.response.status}`
        : "Cannot connect to the backend."
    );
  } finally {
    setLoading(false);
  }
}

const loadBills = async () => {
  try {
    const response = await api.get("/bills");
    setBills(response.data);
    setBillError("");
  } catch (err) {
    console.error("Error loading bills:", err);
    setBillError("Unable to load bills. Check the backend.");
  }
};

const addBill = async (e) => {
  e.preventDefault();
  setBillError("");
  setBillMessage("");

  if (!billPatientId || !billAmount || Number(billAmount) <= 0) {
    setBillError("Please select a patient and enter a valid amount.");
    return;
  }

  const newBill = {
    patient: {
      id: Number(billPatientId),
    },
    amount: Number(billAmount),
    description: billDescription,
    paymentStatus: billStatus.toUpperCase(),
  };

  try {
    const response = await api.post("/bills", newBill);

    console.log("Bill created:", response.data);

    setBillMessage("Bill created successfully!");
    setBillPatientId("");
    setBillAmount("");
    setBillDescription("");
    setBillStatus("Pending");
    setBillDate(new Date().toISOString().split("T")[0]);

    await loadBills();
  } catch (error) {
    console.error("Bill creation error:", error);
    console.error("Backend response:", error.response?.data);

    setBillError(
      error.response?.data?.message ||
      `Failed to create bill (HTTP ${error.response?.status || "network error"}).`
    );
  }
};


 useEffect(() => {
  if (activeTab === "Patients") {
    loadPatients();
  }

  if (activeTab === "Doctors") {
    loadDoctors();
  }

if (activeTab === "Appointments") {
  loadPatients();
  loadDoctors();
  loadAppointments();
}
if (activeTab === "Billing") {
  loadPatients();
  loadBills();
}
}, [activeTab]);

  async function addPatient(event) {
    event.preventDefault();
    setError("");

    try {
      await api.post("/patients", {
        fullName,
        email,
        phone,
        age: age === "" ? null : Number(age),
      });

      setFullName("");
      setEmail("");
      setPhone("");
      setAge("");

      await loadPatients();
    } catch (err) {
      setError(
        err.response
          ? `Could not add patient. API error: ${err.response.status}`
          : "Cannot connect to the backend."
      );
    }
  }

  const menuItems = [
    "Dashboard",
    "Patients",
    "Doctors",
    "Appointments",
    "Billing",
  ];

  async function loadDoctors() {
  setLoading(true);
  setError("");

  try {
    const response = await api.get("/doctors");
    setDoctors(response.data);
  } catch (err) {
    setError(
      err.response
        ? `API error: ${err.response.status}`
        : "Cannot connect to the backend."
    );
  } finally {
    setLoading(false);
  }
}

async function addDoctor(event) {
  event.preventDefault();
  setError("");

  try {
    await api.post("/doctors", {
      fullName: doctorName,
      specialization,
      email: doctorEmail,
      phone: doctorPhone,
    });

    setDoctorName("");
    setSpecialization("");
    setDoctorEmail("");
    setDoctorPhone("");

    await loadDoctors();
  } catch (err) {
    setError(
      err.response
        ? `Could not add doctor. API error: ${err.response.status}`
        : "Cannot connect to the backend."
    );
  }
}

async function loadAppointments() {
  setLoading(true);
  setError("");

  try {
    const response = await api.get("/appointments");
    setAppointments(response.data);
  } catch (err) {
    setError(
      err.response
        ? `API error: ${err.response.status}`
        : "Cannot connect to the backend."
    );
  } finally {
    setLoading(false);
  }
}

async function addAppointment(event) {
  event.preventDefault();
  setError("");

  try {
    await api.post("/appointments", {
      patient: { id: Number(selectedPatient) },
      doctor: { id: Number(selectedDoctor) },
      appointmentDateTime,
      reason,
    });

    setSelectedPatient("");
    setSelectedDoctor("");
    setAppointmentDateTime("");
    setReason("");

    await loadAppointments();
  } catch (err) {
    setError(
      err.response
        ? `Could not book appointment. API error: ${err.response.status}`
        : "Cannot connect to the backend."
    );
  }
}

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Hospital HMS</h2>
        <nav>
          {menuItems.map((item) => (
            <button
              key={item}
              className={activeTab === item ? "active" : ""}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header>
          <div>
            <h1>{activeTab}</h1>
            <p>Hospital Management System</p>
          </div>
          <span className="admin">Admin</span>
        </header>

        {activeTab === "Dashboard" && (
          <section className="welcome">
            <h2>Welcome to Hospital HMS</h2>
            <p>
              Manage patients, doctors, appointments and bills
              from the sidebar.
            </p>
            <button onClick={() => setActiveTab("Patients")}>
              Open Patients
            </button>
          </section>
        )}

        {activeTab === "Patients" && (
          <>
            <section className="welcome">
              <h2>Add Patient</h2>

              <form className="patient-form" onSubmit={addPatient}>
                <input
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Age"
                  min="0"
                  max="130"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />

                <button type="submit">Save Patient</button>
              </form>
            </section>

            <section className="welcome">
              <h2>Patient Records</h2>

              <button onClick={loadPatients}>Refresh</button>

              {loading && <p>Loading patients...</p>}
              {error && <p className="error">{error}</p>}

              {!loading && !error && patients.length === 0 && (
                <p>No patients found.</p>
              )}

              {patients.length > 0 && (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Age</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.id}>
                          <td>{patient.id}</td>
                          <td>{patient.fullName}</td>
                          <td>{patient.email || "-"}</td>
                          <td>{patient.phone || "-"}</td>
                          <td>{patient.age ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === "Doctors" && (
  <>
    <section className="welcome">
      <h2>Add Doctor</h2>

      <form className="patient-form" onSubmit={addDoctor}>
        <input
          placeholder="Doctor full name"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          required
        />

        <input
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={doctorEmail}
          onChange={(e) => setDoctorEmail(e.target.value)}
        />

        <input
          placeholder="Phone"
          value={doctorPhone}
          onChange={(e) => setDoctorPhone(e.target.value)}
        />

        <button type="submit">Save Doctor</button>
      </form>
    </section>

    <section className="welcome">
      <h2>Doctor Records</h2>

      <button onClick={loadDoctors}>Refresh</button>

      {loading && <p>Loading doctors...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && doctors.length === 0 && (
        <p>No doctors found.</p>
      )}

      {doctors.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.id}</td>
                  <td>{doctor.fullName}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.email || "-"}</td>
                  <td>{doctor.phone || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  </>
)}

  {activeTab === "Appointments" && (
  <>
    <section className="welcome">
      <h2>Book Appointment</h2>

      <form className="patient-form" onSubmit={addAppointment}>
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          required
        >
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.fullName} (ID: {patient.id})
            </option>
          ))}
        </select>

        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.fullName} - {doctor.specialization}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={appointmentDateTime}
          onChange={(e) => setAppointmentDateTime(e.target.value)}
          required
        />

        <input
          placeholder="Reason for visit"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button type="submit">Book Appointment</button>
      </form>
    </section>

    <section className="welcome">
      <h2>Appointment Records</h2>

      <button onClick={loadAppointments}>Refresh</button>

      {loading && <p>Loading appointments...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && appointments.length === 0 && (
        <p>No appointments found.</p>
      )}

      {appointments.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.patient?.fullName || `ID ${appointment.patient?.id}`}</td>
                  <td>{appointment.doctor?.fullName || `ID ${appointment.doctor?.id}`}</td>
                  <td>{appointment.appointmentDateTime}</td>
                  <td>{appointment.reason || "-"}</td>
                  <td>{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  </>
)}

{activeTab === "Billing" && (
  <section className="billing-page">
    <h2>Billing Management</h2>
    <p>Create bills and track patient payments.</p>

    {billError && (
      <p style={{ color: "red" }}>{billError}</p>
    )}

    {billMessage && (
      <p style={{ color: "green" }}>{billMessage}</p>
    )}

    <form onSubmit={addBill} className="patient-form">
      <h3>Create New Bill</h3>

      <label>Patient</label>
      <select
        value={billPatientId}
        onChange={(e) => setBillPatientId(e.target.value)}
        required
      >
        <option value="">Select Patient</option>
        {patients.map((patient) => (
          <option key={patient.id} value={patient.id}>
            {patient.fullName}
          </option>
        ))}
      </select>

      <label>Bill Amount (₹)</label>
      <input
        type="number"
        min="0.01"
        step="0.01"
        placeholder="Enter amount"
        value={billAmount}
        onChange={(e) => setBillAmount(e.target.value)}
        required
      />

      <label>Description</label>
      <input
        type="text"
        placeholder="Consultation, tests, medicines..."
        value={billDescription}
        onChange={(e) => setBillDescription(e.target.value)}
        required
      />

      <label>Bill Date</label>
      <input
        type="date"
        value={billDate}
        onChange={(e) => setBillDate(e.target.value)}
        required
      />

      <label>Payment Status</label>
      <select
        value={billStatus}
        onChange={(e) => setBillStatus(e.target.value)}
      >
        <option value="Pending">Pending</option>
        <option value="Paid">Paid</option>
      </select>

      <button type="submit">Generate Bill</button>
    </form>

    <h3>All Bills</h3>

    <button type="button" onClick={loadBills}>
      Refresh Bills
    </button>

    <div style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th>Bill ID</th>
            <th>Patient</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {bills.length === 0 ? (
            <tr>
              <td colSpan="6">No bills available.</td>
            </tr>
          ) : (
            bills.map((bill) => (
              
<tr key={bill.id}>
  <td>{bill.id}</td>
  <td>
    {bill.patient?.fullName || `ID ${bill.patient?.id ?? "—"}`}
  </td>
  <td>{bill.description || "—"}</td>
  <td>₹{Number(bill.amount || 0).toFixed(2)}</td>
  <td>
    {bill.createdAt
      ? new Date(bill.createdAt).toLocaleString()
      : "—"}
  </td>
  <td>{bill.paymentStatus || "PENDING"}</td>
</tr>

            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
)}


      </main>
    </div>
  );
}

export default App;