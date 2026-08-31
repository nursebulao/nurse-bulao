"use client";
import {FormEvent,useEffect,useMemo,useState} from "react";
import {useSearchParams} from "next/navigation";

const services=["Skilled Nursing","Elder Care","Mother & Baby","Caretaker","Post-Surgery Care","Physiotherapy Support","Medication Support","Companion Care"];
const waNumber=(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||"").replace(/\D/g,"");

export default function Book(){
  const search=useSearchParams();
  const [msg,setMsg]=useState("");
  const [busy,setBusy]=useState(false);
  const [bookingId,setBookingId]=useState("");
  const [startDate,setStartDate]=useState("");
  const [endDate,setEndDate]=useState("");
  const [service,setService]=useState(search.get("service")||"Skilled Nursing");

  const minDate=useMemo(()=>new Date().toISOString().slice(0,10),[]);
  useEffect(()=>{const s=search.get("service");if(s&&services.includes(s))setService(s)},[search]);

  function whatsapp(text:string){
    if(!waNumber){setMsg("WhatsApp is not configured yet. Add NEXT_PUBLIC_WHATSAPP_NUMBER in Netlify environment variables.");return;}
    const url=`https://web.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(text)}`;
    window.open(url,"_blank","noopener,noreferrer");
  }

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy(true);setMsg("");setBookingId("");
    const f=new FormData(e.currentTarget);
    const start=`${f.get("startDate")}T${f.get("startTime")}:00`;
    const end=`${f.get("endDate")}T${f.get("endTime")}:00`;
    const body={fullName:f.get("fullName"),phone:f.get("phone"),city:f.get("city"),address:f.get("address"),serviceType:service,startAt:start,endAt:end,requirement:f.get("requirement")};
    try{
      const api=process.env.NEXT_PUBLIC_API_URL;
      if(!api) throw new Error("API not configured");
      const r=await fetch(`${api}/v1/bookings`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
      const data=await r.json().catch(()=>({}));
      if(!r.ok) throw new Error(data.error||"Booking failed");
      setBookingId(data.publicId||"");
      setMsg("Booking request created successfully.");
      whatsapp(`Hello Nurse Bulao, I have a booking request ${data.publicId||""}. Service: ${service}. Dates: ${startDate} to ${endDate}. Time: ${f.get("startTime")} to ${f.get("endTime")}. Name: ${f.get("fullName")}. City: ${f.get("city")}.`);
    }catch(err:any){
      setMsg(err.message==="API not configured" ? "The booking form is ready, but the live API is not connected. Set NEXT_PUBLIC_API_URL in Netlify, then redeploy." : err.message);
    }finally{setBusy(false)}
  }

  return <main>
    <header className="container nav"><a className="brand" href="/"><span className="logo">✚</span> Nurse Bulao</a><a href="/" className="btn btn-soft">← Back home</a></header>
    <section className="container section" style={{paddingTop:20}}>
      <div className="section-head"><div><div className="eyebrow">Book care</div><h2>Tell us when care is needed</h2></div><p>Choose a start date and a till date. The form keeps the complete schedule together instead of pushing everything into WhatsApp.</p></div>
      <div className="booking-card">
        <form onSubmit={submit}>
          <div className="field"><label>Service</label><select value={service} onChange={e=>setService(e.target.value)}>{services.map(s=><option key={s}>{s}</option>)}</select></div>
          <div className="grid2">
            <div className="field"><label>Start date</label><input required name="startDate" type="date" min={minDate} value={startDate} onChange={e=>{setStartDate(e.target.value);if(endDate&&e.target.value>endDate)setEndDate(e.target.value)}} /></div>
            <div className="field"><label>Till date</label><input required name="endDate" type="date" min={startDate||minDate} value={endDate} onChange={e=>setEndDate(e.target.value)} /></div>
            <div className="field"><label>Daily start time</label><input required name="startTime" type="time" defaultValue="09:00"/></div>
            <div className="field"><label>Daily end time</label><input required name="endTime" type="time" defaultValue="18:00"/></div>
          </div>
          <div className="grid2">
            <div className="field"><label>Full name</label><input required name="fullName" placeholder="Patient / family name"/></div>
            <div className="field"><label>Phone</label><input required name="phone" type="tel" placeholder="+91XXXXXXXXXX"/></div>
            <div className="field"><label>City</label><input required name="city" placeholder="Mumbai"/></div>
            <div className="field"><label>Address</label><input required name="address" placeholder="Complete care address"/></div>
          </div>
          <div className="field"><label>Care requirements</label><textarea required name="requirement" rows={5} placeholder="Tell us about mobility, recovery, routine support or other requirements." /></div>
          <div className="notice">🔒 Your booking is submitted to the care system first. WhatsApp is only an optional support/confirmation channel.</div>
          <button className="btn btn-primary" style={{width:"100%"}} disabled={busy}>{busy?"Creating booking…":"Create booking request →"}</button>
        </form>
        {msg&&<div className="notice" style={{marginTop:18}} aria-live="polite"><b>{msg}</b>{bookingId&&<><br/>Booking ID: {bookingId}<br/><button type="button" className="btn btn-soft" style={{marginTop:10}} onClick={()=>whatsapp(`Hello Nurse Bulao, please help me with booking ${bookingId}.`)}>Open WhatsApp Web</button></>}</div>}
      </div>
    </section>
    <footer className="container footer">Need help? Use the support channel configured by the Nurse Bulao team.</footer>
  </main>
}
