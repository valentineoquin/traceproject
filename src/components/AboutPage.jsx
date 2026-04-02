import { useState, useEffect } from 'react';
import './AboutPage.css';

const cards = [
  {
    id: 1,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    tag: '01 — Qui sommes-nous ?',
    title: 'Le Projet Trace',
    body: 'Trace est un projet indépendant visant à lier la mode et le numérique via un site interactif où l\'on peut visualiser des vêtements en 3D. Une expérience immersive à la croisée du style et de la technologie.',
    accent: '#F56E00',
  },
  {
    id: 2,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    tag: '02 — Technologie QR',
    title: 'Scanner & Visualiser',
    body: 'Chaque vêtement de la collection est associé à un QR code unique. Il suffit de le scanner pour accéder instantanément à sa visualisation 3D interactive directement depuis votre smartphone.',
    accent: '#0A1AB5',
    qrCode: true,
  },
  {
    id: 3,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a4 4 0 0 0-8 0v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <circle cx="12" cy="12" r="1"/>
      </svg>
    ),
    tag: '03 — Impression Connectée',
    title: 'Broder vos Motifs',
    body: 'Notre imprimante connectée permet de broder directement vos motifs personnalisés sur vos vêtements. Du digital au textile, Trace transforme chaque design numérique en création tangible et unique.',
    accent: '#F56E00',
  },
  {
    id: 4,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    tag: '04 — L\'Équipe',
    title: '2 Étudiants, 2 Passions',
    body: 'Derrière Trace, deux étudiants animés par deux passions complémentaires : la 3D et la mode. Ensemble, ils fusionnent leurs univers pour réinventer l\'expérience de la mode à l\'ère numérique.',
    accent: '#0A1AB5',
  },
];

export default function AboutPage({ onClose }) {
  const [visible, setVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 400);
  };

  return (
    <div className={`about-overlay ${visible ? 'about-overlay--visible' : ''}`}>
      {/* Background blur layer */}
      <div className="about-bg" onClick={handleClose} />

      <div className={`about-panel ${visible ? 'about-panel--visible' : ''}`}>
        {/* Header */}
        <div className="about-header">
          <div className="about-header__brand">
            <span className="about-header__logo">TRACE</span>
            <span className="about-header__divider" />
            <span className="about-header__subtitle">À propos</span>
          </div>
          <button className="about-close" onClick={handleClose} aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Hero text */}
        <div className="about-hero">
          <p className="about-hero__eyebrow">Mode × Numérique</p>
          <h1 className="about-hero__title">
            L'avenir de la mode<br />
            <span className="about-hero__accent">commence ici.</span>
          </h1>
        </div>

        {/* Cards grid */}
        <div className="about-grid">
          {cards.map((card, i) => (
            <div
              key={card.id}
              className={`about-card ${activeCard === card.id ? 'about-card--active' : ''}`}
              style={{ '--card-accent': card.accent, '--delay': `${i * 80}ms` }}
              onMouseEnter={() => setActiveCard(card.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="about-card__top">
                <div className="about-card__icon">{card.icon}</div>
                <span className="about-card__tag">{card.tag}</span>
              </div>

              {card.qrCode && (
                <div className="about-card__qr">
                  <QRCodeSVG />
                </div>
              )}

              <h2 className="about-card__title">{card.title}</h2>
              <p className="about-card__body">{card.body}</p>

              <div className="about-card__bar" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="about-footer">
          <span>© 2025 Trace Project — Tous droits réservés</span>
        </div>
      </div>
    </div>
  );
}

// Inline SVG QR code (stylised placeholder that looks like a real QR)
function QRCodeSVG() {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="about-qr-svg"
    >
      {/* Top-left finder pattern */}
      <rect x="5" y="5" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="3"/>
      <rect x="12" y="12" width="16" height="16" rx="1" fill="currentColor"/>
      {/* Top-right finder pattern */}
      <rect x="65" y="5" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="3"/>
      <rect x="72" y="12" width="16" height="16" rx="1" fill="currentColor"/>
      {/* Bottom-left finder pattern */}
      <rect x="5" y="65" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="3"/>
      <rect x="12" y="72" width="16" height="16" rx="1" fill="currentColor"/>
      {/* Timing dots top */}
      <rect x="40" y="7" width="4" height="4" fill="currentColor"/>
      <rect x="50" y="7" width="4" height="4" fill="currentColor"/>
      <rect x="60" y="7" width="4" height="4" fill="currentColor"/>
      {/* Timing dots left */}
      <rect x="7" y="40" width="4" height="4" fill="currentColor"/>
      <rect x="7" y="50" width="4" height="4" fill="currentColor"/>
      <rect x="7" y="60" width="4" height="4" fill="currentColor"/>
      {/* Data modules */}
      <rect x="40" y="40" width="8" height="8" rx="1" fill="currentColor"/>
      <rect x="52" y="40" width="8" height="8" rx="1" fill="currentColor"/>
      <rect x="64" y="40" width="8" height="8" rx="1" fill="currentColor"/>
      <rect x="76" y="40" width="8" height="8" rx="1" fill="currentColor"/>
      <rect x="88" y="40" width="7" height="8" rx="1" fill="currentColor"/>
      <rect x="40" y="52" width="8" height="8" rx="1" fill="currentColor"/>
      <rect x="64" y="52" width="8" height="8" rx="1" fill="currentColor"/>
      <rect x="76" y="52" width="8" height="8" rx="1" fill="currentColor"/>
      <rect x="40" y="64" width="8" height="8" rx="1" fill="currentColor"/>
      <rect x="52" y="64" width="8" height="8" rx="1" fill="currentColor"/>
      <rect x="88" y="52" width="7" height="8" rx="1" fill="currentColor"/>
      <rect x="76" y="64" width="8" height="8" rx="1" fill="currentColor"/>
      <rect x="88" y="64" width="7" height="8" rx="1" fill="currentColor"/>
      <rect x="52" y="76" width="8" height="8" rx="1" fill="currentColor"/>
      <rect x="64" y="76" width="8" height="8" rx="1" fill="currentColor"/>
      <rect x="88" y="76" width="7" height="8" rx="1" fill="currentColor"/>
      <rect x="40" y="88" width="8" height="7" rx="1" fill="currentColor"/>
      <rect x="64" y="88" width="8" height="7" rx="1" fill="currentColor"/>
      <rect x="76" y="88" width="8" height="7" rx="1" fill="currentColor"/>
    </svg>
  );
}
