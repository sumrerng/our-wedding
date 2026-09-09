import { useEffect, useRef, useState } from 'react'
import './App.css'

const uploadedPhotoEntries = import.meta.glob('./assets/optimized/*.{jpg,JPG}', { eager: true, query: '?url', import: 'default' })
const uploadedPhotos = Object.values(uploadedPhotoEntries)
const photo = (name) => uploadedPhotoEntries[`./assets/optimized/${name}`]
const welcomeCard = photo('S__87326728.jpg')
const invitationCard = photo('S__23683088.jpg')
const pageOnePhoto = photo('DSC01031.jpg')
const pageTwoPhoto = photo('DSC01104.jpg')
const pageFourPhoto = photo('DSC01005 (1).jpg')
const rsvpEndpoint = import.meta.env.VITE_GOOGLE_SHEETS_URL

function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())
  const [rsvpSent, setRsvpSent] = useState(false)
  const [rsvpOpen, setRsvpOpen] = useState(false)
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false)
  const [rsvpError, setRsvpError] = useState('')
  const [musicOn, setMusicOn] = useState(false)
  const galleryRef = useRef(null)
  const musicRef = useRef(null)

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const scrollToDetails = () => {
    document.querySelector('#details')?.scrollIntoView({ behavior: 'smooth' })
    startAmbientMusic()
  }

  const startAmbientMusic = () => {
    if (musicRef.current) return
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const context = new AudioContext()
    const master = context.createGain()
    master.gain.setValueAtTime(0, context.currentTime)
    master.gain.linearRampToValueAtTime(0.055, context.currentTime + 1.8)
    master.connect(context.destination)
    const notes = [261.63, 329.63, 392, 523.25, 392, 329.63]
    let step = 0
    const playNote = () => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = notes[step % notes.length]
      gain.gain.setValueAtTime(0, context.currentTime)
      gain.gain.linearRampToValueAtTime(0.16, context.currentTime + 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 2.8)
      oscillator.connect(gain)
      gain.connect(master)
      oscillator.start()
      oscillator.stop(context.currentTime + 3)
      step += 1
    }
    playNote()
    const interval = window.setInterval(playNote, 1500)
    musicRef.current = { context, master, interval }
    setMusicOn(true)
  }

  const toggleMusic = () => {
    if (!musicRef.current) {
      startAmbientMusic()
      return
    }
    const { context, master } = musicRef.current
    if (musicOn) {
      master.gain.setTargetAtTime(0, context.currentTime, 0.2)
      setMusicOn(false)
    } else {
      context.resume()
      master.gain.setTargetAtTime(0.055, context.currentTime, 0.2)
      setMusicOn(true)
    }
  }

  const moveGallery = (direction) => {
    galleryRef.current?.scrollBy({ left: direction * 300, behavior: 'smooth' })
  }

  const submitRsvp = async (event) => {
    event.preventDefault()
    setRsvpError('')
    if (!rsvpEndpoint) {
      setRsvpError('ยังไม่ได้ตั้งค่าปลายทาง Google Sheets')
      return
    }

    const formData = new FormData(event.currentTarget)
    const payload = Object.fromEntries(formData.entries())
    setRsvpSubmitting(true)
    try {
      const response = await fetch(rsvpEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString() }),
      })
      if (response.type !== 'opaque' && !response.ok) throw new Error('Request failed')
      setRsvpSent(true)
      setRsvpOpen(false)
    } catch {
      setRsvpError('ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setRsvpSubmitting(false)
    }
  }

  return (
    <main className="invitation">
      <header className="masthead"><a className="brand" href="#top">C <span>&amp;</span> S</a><span className="masthead-note">Some<br />people<br />meet<br />by chance</span><div className="rule" /><p>The theory of us <i>—</i> Chawanlak &amp; Sumrerng</p><div className="rule" /><nav><a href="#details">กำหนดการ</a><a href="#details">สถานที่</a><a href="#rsvp">ตอบรับ <b>→</b></a></nav></header>
      <button className={`music-toggle ${musicOn ? 'is-on' : ''}`} type="button" onClick={toggleMusic} aria-label={musicOn ? 'ปิดเพลง' : 'เปิดเพลง'}>{musicOn ? '♫' : '♪'} <span>{musicOn ? 'sound on' : 'sound off'}</span></button>
      <section className="panel-grid" aria-label="Wedding invitation">
        <article className="panel panel-intro" id="top"><div className="fine-arc arc-top" /><div className="orbit-orbit" aria-hidden="true"><span className="orbit-dot orbit-dot-one" /><span className="orbit-dot orbit-dot-two" /></div><p className="eyebrow">A beautiful<br />journey together</p><div className="intro-copy"><p className="desktop-kicker">The theory of us</p><h1 className="mobile-title">The theory of us</h1><h1 className="desktop-title">Chawanlak<br /><span>&amp;</span><br />Sumrerng</h1><span className="mini-rule" /><p>Every moment led to you</p><p className="desktop-thai">ชวนลักษณ์ &amp; สำเริง</p></div><img className="portrait portrait-full" src={pageOnePhoto || welcomeCard} alt="Chawanlak and Sumrerng together" /><footer className="panel-footer"><p>Chawanlak <span>&amp;</span> Sumrerng</p><strong>14 · 11 · 2026</strong><button type="button" onClick={scrollToDetails}>เปิดการ์ดเชิญ <b>→</b></button></footer><p className="desktop-invite">ขอเชิญร่วมเป็นส่วนหนึ่งในวันสำคัญของเรา</p></article>
        <article className="panel panel-countdown"><p className="script-line">A moment, forever.</p><img className="portrait portrait-close" src={pageTwoPhoto || uploadedPhotos[0]} alt="Chawanlak and Sumrerng in a close-up portrait" /><div className="countdown-copy"><p>Counting down to our day</p><div className="countdown" aria-label="Countdown to wedding day">{Object.entries(timeLeft).map(([label, value]) => <div className="countdown-item" key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div></div><div className="fine-arc arc-bottom" /></article>
        <article className="panel panel-details" id="details"><div className="fine-arc arc-left" /><p className="eyebrow right">Good<br />people<br />bright<br />days</p><div className="details-copy"><h2>Our<br /><em>wedding day</em></h2><span className="mini-rule" /><strong className="date">14 November 2026</strong><div className="timeline"><div><span className="timeline-icon">○</span><strong>15:00</strong><p>พิธีสู่ขอ &amp; พิธีรับไหว้</p></div><div><span className="timeline-icon">♧</span><strong>18:00</strong><p>ฉลองมงคลสมรส</p></div></div><p className="venue">สยามอเมซอนคาเฟ่ ชั้น 2<br /><small>Siam Charoennakorn, 2nd floor</small></p><a className="outline-button" href="https://maps.google.com/?q=Siam+Charoennakorn" target="_blank" rel="noreferrer">ดูแผนที่ <b>→</b></a><p className="dress-code">No dress code.<br />Wear what makes you happy.</p></div></article>
        <article className="panel panel-gallery" id="gallery"><div className="gallery-heading"><p>Our story</p><h2>Us, <em>together.</em></h2><div className="gallery-controls"><button type="button" aria-label="Previous photos" onClick={() => moveGallery(-1)}>‹</button><button type="button" aria-label="Next photos" onClick={() => moveGallery(1)}>›</button></div></div><div className="gallery-track" ref={galleryRef}>{uploadedPhotos.slice(0, 8).map((photoUrl, index) => <figure key={photoUrl}><img src={photoUrl} alt={`Wedding gallery ${index + 1}`} /></figure>)}</div></article>
        <article className={`panel panel-rsvp${rsvpOpen ? ' is-form-open' : ''}`} id="rsvp"><div className="portrait-stage"><img className="portrait portrait-standing" src={pageFourPhoto || uploadedPhotos[1]} alt="The groom seated beside the bride" /></div><div className="rsvp-copy"><p className="eyebrow">Different paths<br />same destination</p>{rsvpSent ? <div className="rsvp-success"><h2>See you<br /><em>at our wedding</em></h2><span className="mini-rule" /><p>ขอบคุณสำหรับการตอบรับ<br />แล้วพบกันในวันสำคัญของเรา</p></div> : rsvpOpen ? <form className="rsvp-form" onSubmit={submitRsvp}><h2>ตอบรับ<br /><em>ร่วมงาน</em></h2><label>ชื่อ - นามสกุล<input name="guestName" required placeholder="กรอกชื่อของคุณ" /></label><label>จำนวนผู้เข้าร่วม<select name="guests" defaultValue="1"><option value="1">1 คน</option><option value="2">2 คน</option><option value="3">3 คน</option><option value="4">4 คน</option></select></label><label>เบอร์โทรหรือช่องทางติดต่อ<input name="contact" required placeholder="โทรศัพท์ / Line" /></label><label>ข้อความเพิ่มเติม<textarea name="note" rows="2" placeholder="ฝากข้อความถึงบ่าวสาว (ถ้ามี)" /></label>{rsvpError && <p className="rsvp-error" role="alert">{rsvpError}</p>}<div className="form-actions"><button type="button" className="form-cancel" onClick={() => setRsvpOpen(false)}>กลับ</button><button type="submit" className="light-button" disabled={rsvpSubmitting}>{rsvpSubmitting ? 'กำลังส่ง...' : 'ส่งการตอบรับ'} <b>→</b></button></div></form> : <div className="rsvp-invite"><h2>See you<br /><em>at our wedding</em></h2><span className="mini-rule" /><p className="names">Chawanlak &amp; Sumrerng</p><button type="button" className="light-button" onClick={() => setRsvpOpen(true)}>ตอบรับร่วมงาน <b>→</b></button></div>}</div><div className="rsvp-curve" /></article>
      </section>
      <section className="photo-story" aria-label="Wedding photo gallery"><div className="story-heading"><p className="eyebrow-static">Our story in photographs</p><h2>Every moment<br /><em>led to you</em></h2><p>Chawanlak &amp; Sumrerng · 14.11.2026</p></div><div className="photo-grid">{uploadedPhotos.map((photo, index) => <figure key={photo}><img src={photo} alt={`Wedding memory ${index + 1}`} /><figcaption>{String(index + 1).padStart(2, '0')}</figcaption></figure>)}</div><img className="invitation-card" src={invitationCard} alt="Wedding invitation card" /></section>
      <footer className="page-footer"><span>Love lives in the everyday</span><span>14 · 11 · 2026</span></footer>
    </main>
  )
}

function getTimeLeft() {
  const difference = new Date('2026-11-14T15:00:00+07:00') - new Date()
  if (difference <= 0) return { DAYS: 0, HOURS: 0, MINUTES: 0, SECONDS: 0 }
  return { DAYS: Math.floor(difference / 86400000), HOURS: Math.floor((difference / 3600000) % 24), MINUTES: Math.floor((difference / 60000) % 60), SECONDS: Math.floor((difference / 1000) % 60) }
}

export default App
