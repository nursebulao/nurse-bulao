const services = [
  {icon:"🩺", title:"Skilled Nursing", text:"Post-surgery care, injections, wound support and clinical monitoring."},
  {icon:"👵", title:"Elder Care", text:"Companionship, mobility support, medication reminders and daily routines."},
  {icon:"🤱", title:"Mother & Baby", text:"New-mom support, newborn routine care and recovery assistance."},
  {icon:"🏠", title:"Caretaker", text:"Reliable daily home assistance for families needing dependable support."},
];

export default function Home(){
  return <main>
    <header className="container nav">
      <a className="brand" href="/"><span className="logo">✚</span> Nurse Bulao</a>
      <nav className="navlinks">
        <a href="#services">Services</a><a href="#how">How it works</a><a href="/nurse/join">Join as Nurse</a>
        <a href="/book" className="btn btn-primary">Book Now</a>
      </nav>
      <a href="/book" className="btn btn-primary">Book Now</a>
    </header>

    <section className="container hero">
      <div className="hero-grid">
        <div>
          <div className="eyebrow">● Premium home healthcare</div>
          <h1>Care that feels <span>personal.</span></h1>
          <p>Book verified nurses and trained caregivers for the exact dates and hours your family needs — with a clear booking flow, real support and WhatsApp access on phone or laptop.</p>
          <div className="actions">
            <a className="btn btn-primary" href="/book">Find care for my family →</a>
            <a className="btn btn-soft" href="#services">Explore services</a>
          </div>
          <div className="trust"><span>✓ <b>Verified professionals</b></span><span>✓ <b>Date-to-date booking</b></span><span>✓ <b>Desktop + mobile</b></span></div>
        </div>
        <div className="hero-art" aria-label="Premium home nursing illustration">
          <div className="float-card fc1"><strong>Same-day support</strong>Flexible booking windows</div>
          <div className="float-card fc2"><strong>7 days a week</strong>Care when your family needs it</div>
          <div className="float-card fc3"><strong>Easy booking</strong>Phone, laptop or WhatsApp</div>
          <div className="person"></div>
        </div>
      </div>
    </section>

    <section id="services" className="container section">
      <div className="section-head"><div><div className="eyebrow">Care, your way</div><h2>Choose the right service</h2></div><p>Select a service first, then choose your start date, till date, time window and care requirements. No confusing multi-step maze.</p></div>
      <div className="services">{services.map(s=><article className="service" key={s.title}><div className="service-img">{s.icon}</div><h3>{s.title}</h3><p>{s.text}</p><a href={`/book?service=${encodeURIComponent(s.title)}`}>Select service →</a></article>)}</div>
    </section>

    <section id="how" className="container section">
      <div className="split">
        <div className="panel"><div className="eyebrow" style={{color:"#a9ddd6"}}>Simple by design</div><h2>Book care without the WhatsApp-only feeling.</h2><p>Your booking is created first. WhatsApp is an optional confirmation/support channel — not the website itself.</p>
          <div className="steps"><div className="step"><span className="num">1</span><span><b>Select service & dates</b><br/>Choose start date, till date and daily timing.</span></div><div className="step"><span className="num">2</span><span><b>Send booking request</b><br/>Your request gets a booking ID and enters the care workflow.</span></div><div className="step"><span className="num">3</span><span><b>Confirm with support</b><br/>Open WhatsApp Web from a laptop or the WhatsApp app on phone.</span></div></div>
        </div>
        <div className="booking-card"><h3>Need care today?</h3><p>Start with the service, dates and location. We’ll keep the booking details structured.</p><a className="btn btn-teal" style={{width:"100%"}} href="/book">Open full booking form</a><div className="notice">💡 WhatsApp works from desktop too when your business number is configured in <b>NEXT_PUBLIC_WHATSAPP_NUMBER</b>.</div></div>
      </div>
    </section>

    <section className="container section">
      <div className="section-head"><div><div className="eyebrow">Professional access</div><h2>Separate portals</h2></div><p>Patients book care; nurses and caretakers have their own onboarding/login flow; admins manage operations.</p></div>
      <div className="auth-grid"><a className="auth-card" href="/nurse"><b>👩‍⚕️ Nurse Login</b><p>Sign in and manage your professional profile.</p></a><a className="auth-card" href="/caretaker"><b>🤝 Caretaker Login</b><p>Join the caregiver network and manage availability.</p></a><a className="auth-card" href="/admin"><b>🔐 Admin Portal</b><p>Operations, verification and booking management.</p></a></div>
    </section>

    <footer className="container footer">© {new Date().getFullYear()} Nurse Bulao · Premium home-care coordination</footer>
  </main>
}
