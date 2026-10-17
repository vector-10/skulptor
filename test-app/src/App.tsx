import './App.css'

type Piece = {
  index: string
  name: string
  price: string
}

const pieces: Piece[] = [
  { index: '01', name: 'Adire Wrap Dress', price: '₦185,000' },
  { index: '02', name: 'Aso-oke Structured Jacket', price: '₦240,000' },
  { index: '03', name: 'Indigo Wide Trousers', price: '₦120,000' },
  { index: '04', name: 'Tie-dye Silk Shirt', price: '₦95,000' },
  { index: '05', name: 'Woven Evening Skirt', price: '₦160,000' },
  { index: '06', name: 'Indigo Head Wrap', price: '₦25,000' },
]

const facts = [
  { label: 'the cloth', text: 'Hand-dyed adire and aso-oke.' },
  { label: 'the cut', text: 'Every piece cut to order in the studio.' },
  { label: 'the wait', text: 'Made to measure, ready in three weeks.' },
]

const channels = [
  {
    name: 'WhatsApp',
    label: '+234 803 555 0142',
    href: 'https://wa.me/2348035550142',
  },
  {
    name: 'Email',
    label: 'hello@odastudio.ng',
    href: 'mailto:hello@odastudio.ng',
  },
  {
    name: 'Instagram',
    label: '@odastudio',
    href: 'https://www.instagram.com/odastudio',
  },
]

// The adire resist rings, drawn once and referenced by every patterned surface.
function AdireDefs() {
  return (
    <svg className="svg-defs" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="adire" width="120" height="120" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="30" cy="30" r="16" />
            <circle cx="90" cy="30" r="7" />
            <circle cx="90" cy="90" r="10" />
            <circle cx="0" cy="60" r="7" />
            <circle cx="120" cy="60" r="7" />
            <path d="M25 90h10M30 85v10" />
          </g>
          <g fill="currentColor">
            <circle cx="30" cy="30" r="2.6" />
            <circle cx="90" cy="30" r="2" />
            <circle cx="90" cy="90" r="2.2" />
            <circle cx="60" cy="60" r="1.6" />
            <circle cx="24" cy="104" r="1.6" />
            <circle cx="36" cy="104" r="1.6" />
          </g>
        </pattern>
      </defs>
    </svg>
  )
}

function Pattern({ className }: { className?: string }) {
  return (
    <svg className={className ? `pat ${className}` : 'pat'} aria-hidden="true">
      <rect width="100%" height="100%" fill="url(#adire)" />
    </svg>
  )
}

function App() {
  return (
    <>
      <AdireDefs />

      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <a className="logo" href="#top">
          Ọ̀dà Studio
        </a>
        <nav className="site-nav" aria-label="Sections">
          <a href="#collection">Collection</a>
          <a href="#studio">Studio</a>
          <a href="#visit">Visit</a>
        </nav>
        <a className="btn btn-small" href="#visit">
          Book a fitting
        </a>
      </header>

      <main id="main">
        <section className="hero">
          <Pattern className="pat-hero" />
          <div className="hero-main">
            <div className="weave" aria-hidden="true">
              <Pattern />
            </div>
            <h1 className="wordmark">
              Ọ̀dà <em>Studio</em>
            </h1>
          </div>
          <div className="hero-foot">
            <div>
              <p className="lede">
                Hand-dyed adire and aso-oke, cut to order in Lagos since 2018.
              </p>
              <div className="cta-row">
                <a className="btn" href="#visit">
                  Book a fitting
                </a>
                <a className="text-link" href="#collection">
                  See the collection
                </a>
              </div>
            </div>
            <p className="hero-note">
              The current collection<span>Indigo Hours</span>
            </p>
          </div>
        </section>

        <section className="collection" id="collection">
          <div className="wrap collection-grid">
            <div className="rail">
              <p className="eyebrow">the current collection</p>
              <h2>Indigo Hours</h2>
              <p className="rail-note">
                Twelve pieces — six shown here. Each one cut to your measure.
              </p>
              <div className="swatch" aria-hidden="true">
                <Pattern />
              </div>
              <p className="swatch-cap">hand-dyed adire</p>
            </div>
            <ol className="pieces">
              {pieces.map((piece) => (
                <li className="piece" key={piece.index}>
                  <span className="ring">{piece.index}</span>
                  <h3 className="piece-name">{piece.name}</h3>
                  <p className="price">{piece.price}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="studio" id="studio">
          <Pattern />
          <div className="wrap">
            <div className="studio-head">
              <div>
                <p className="eyebrow">the studio</p>
                <h2>Made for you, not off a rack.</h2>
              </div>
              <p className="studio-para">
                Since 2018, Adaeze Okafor has cut every Ọ̀dà Studio piece to order
                from hand-dyed adire and aso-oke — made to your measure and ready in
                three weeks.
              </p>
            </div>
            <div className="facts">
              {facts.map((fact) => (
                <div className="fact" key={fact.label}>
                  <p className="fact-label">{fact.label}</p>
                  <p>{fact.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="visit" id="visit">
          <div className="wrap visit-grid">
            <div className="visit-lead">
              <p className="eyebrow">the fitting</p>
              <h2>Book a fitting.</h2>
              <p>Fittings are by appointment at the studio in Ikoyi.</p>
              <a
                className="btn"
                href="https://wa.me/2348035550142"
                target="_blank"
                rel="noopener"
              >
                Book on WhatsApp
              </a>
            </div>
            <div className="visit-rows">
              <div className="vrow">
                <p className="vlabel">the address</p>
                <p className="vval">9 Awolowo Road, Ikoyi, Lagos</p>
              </div>
              <div className="vrow">
                <p className="vlabel">the hours</p>
                <p className="vval">
                  Tuesday to Saturday
                  <br />
                  10am to 6pm
                </p>
              </div>
              <div className="vrow">
                <p className="vlabel">reach the studio</p>
                <ul className="vlinks">
                  {channels.map((channel) => (
                    <li key={channel.name}>
                      <span className="chan">{channel.name}</span>
                      <a
                        href={channel.href}
                        {...(channel.href.startsWith('http')
                          ? { target: '_blank', rel: 'noopener' }
                          : {})}
                      >
                        {channel.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <footer className="site-foot">
            <div className="wrap foot-inner">
              <p>© 2026 Ọ̀dà Studio</p>
              <a href="#top">Back to top</a>
            </div>
          </footer>
        </section>
      </main>
    </>
  )
}

export default App
