// App.jsx
export default function App() {
  return (
    <div className="font-inter bg-[#F8FAFC] text-[#1E293B]">
      {/* =============================== */}
      {/* NAVBAR */}
      {/* =============================== */}
      <nav className="w-full bg-white shadow-sm py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0E6FFF]">
          Swasthya Connect
        </h1>

        <div className="flex gap-8 text-[#1E293B] font-medium">
          <a href="#features" className="hover:text-[#0E6FFF]">Features</a>
          <a href="#how" className="hover:text-[#0E6FFF]">How It Works</a>
          <a href="#doctors" className="hover:text-[#0E6FFF]">Doctors</a>
          <a href="#pharmacy" className="hover:text-[#0E6FFF]">Pharmacy</a>
        </div>

        <button className="px-6 py-2 bg-[#0E6FFF] text-white rounded-lg shadow hover:bg-[#0D5CDA] transition">
          Login
        </button>
      </nav>

      {/* =============================== */}
      {/* HERO SECTION */}
      {/* =============================== */}
      <section className="px-8 py-24 bg-[#EAF4FF] flex flex-col md:flex-row items-center">
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-[#1E293B] mb-6">
            Healthcare, Delivered  
            <span className="text-[#0E6FFF]"> Anytime. Anywhere.</span>
          </h2>

          <p className="text-lg text-[#475569] max-w-lg mb-8">
            Book appointments with verified doctors, get medicines delivered  
            to your home, and access secure telemedicine — all in one place.
          </p>

          <div className="flex gap-4">
            <button className="px-8 py-3 bg-[#0E6FFF] text-white rounded-xl shadow hover:bg-[#0D5CDA]">
              Book Appointment
            </button>

            <button className="px-8 py-3 bg-white border border-[#0E6FFF] text-[#0E6FFF] rounded-xl hover:bg-[#E0ECFF]">
              Order Medicines
            </button>
          </div>
        </div>

        <div className="flex-1 flex justify-center mt-12 md:mt-0">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966485.png"
            alt="Telemedicine"
            className="w-80 h-80"
          />
        </div>
      </section>

      {/* =============================== */}
      {/* FEATURES */}
      {/* =============================== */}
      <section id="features" className="px-8 py-24">
        <h3 className="text-3xl font-bold text-center mb-12">
          Why Choose Swasthya Connect?
        </h3>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-md transition">
            <h4 className="text-xl font-semibold text-[#0E6FFF] mb-3">
              Verified Doctors
            </h4>
            <p className="text-[#475569]">
              Consult only licensed and trusted medical professionals.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-md transition">
            <h4 className="text-xl font-semibold text-[#0F9DAF] mb-3">
              Secure Video Calls
            </h4>
            <p className="text-[#475569]">
              Encrypted consultations for safe & private medical sessions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-md transition">
            <h4 className="text-xl font-semibold text-[#22C55E] mb-3">
              Medicine Delivery
            </h4>
            <p className="text-[#475569]">
              Order your prescriptions and get them delivered to your door.
            </p>
          </div>
        </div>
      </section>

      {/* =============================== */}
      {/* HOW IT WORKS */}
      {/* =============================== */}
      <section id="how" className="px-8 py-24 bg-white">
        <h3 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h3>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-[#0E6FFF] text-white flex items-center justify-center rounded-full text-3xl font-bold mb-4">
              1
            </div>
            <h4 className="text-xl font-semibold mb-2">Sign Up</h4>
            <p className="text-[#475569]">
              Create your patient or doctor account securely.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-[#0F9DAF] text-white flex items-center justify-center rounded-full text-3xl font-bold mb-4">
              2
            </div>
            <h4 className="text-xl font-semibold mb-2">Book or Accept Appointments</h4>
            <p className="text-[#475569]">
              Patients choose doctors, and doctors manage their schedules.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-[#22C55E] text-white flex items-center justify-center rounded-full text-3xl font-bold mb-4">
              3
            </div>
            <h4 className="text-xl font-semibold mb-2">Consult Online</h4>
            <p className="text-[#475569]">
              Join a secure video call and receive prescriptions instantly.
            </p>
          </div>
        </div>
      </section>

      {/* =============================== */}
      {/* DOCTOR CTA */}
      {/* =============================== */}
      <section id="doctors" className="px-8 py-24 bg-[#EAF4FF]">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Are You a Doctor?</h3>
          <p className="text-[#475569] mb-8">
            Join Swasthya Connect and provide online consultations to thousands.
          </p>

          <button className="px-10 py-3 bg-[#0F9DAF] text-white rounded-xl shadow hover:bg-[#0C7E8B]">
            Register as Doctor
          </button>
        </div>
      </section>

      {/* =============================== */}
      {/* PHARMACY CTA */}
      {/* =============================== */}
      <section id="pharmacy" className="px-8 py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Own a Pharmacy?</h3>
          <p className="text-[#475569] mb-8">
            Partner with us and fulfill verified digital prescriptions.
          </p>

          <button className="px-10 py-3 bg-[#22C55E] text-white rounded-xl shadow hover:bg-[#1CA34F]">
            Join as Pharmacy
          </button>
        </div>
      </section>

      {/* =============================== */}
      {/* FOOTER */}
      {/* =============================== */}
      <footer className="bg-[#0F172A] text-gray-300 px-8 py-10 mt-12">
        <div className="text-center">
          <p className="text-sm">© 2025 Swasthya Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
