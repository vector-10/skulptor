import breadHero from './assets/bread-hero.jpg'
import croissants from './assets/croissants.jpg'
import loaves from './assets/loaves.jpg'
import './App.css'

type MenuItem = {
  name: string
  description: string
  price: string
}

const menu: MenuItem[] = [
  {
    name: 'Country Sourdough',
    description: '36-hour ferment, blistered crust, open crumb.',
    price: '$8.50',
  },
  {
    name: 'Butter Croissant',
    description: 'Seventy-two layers of cultured butter, folded by hand.',
    price: '$4.25',
  },
  {
    name: 'Seeded Rye',
    description: 'Dark rye rolled in sunflower, sesame and flax.',
    price: '$9.00',
  },
  {
    name: 'Cinnamon Knot',
    description: 'Cardamom sugar, knotted dough, pulled warm from the oven.',
    price: '$4.75',
  },
  {
    name: 'Almond Danish',
    description: 'Frangipane, toasted flakes, a squeeze of lemon.',
    price: '$5.25',
  },
  {
    name: 'Morning Bun',
    description: 'Cinnamon and orange zest with a caramelised bottom.',
    price: '$4.50',
  },
]

const hours = [
  { days: 'Monday – Friday', time: '7am – 6pm' },
  { days: 'Saturday', time: '8am – 4pm' },
  { days: 'Sunday', time: 'Closed' },
]

const contact = [
  {
    label: '+1 (555) 201-8890',
    href: 'tel:+15552018890',
    icon: 'phone' as const,
  },
  {
    label: 'hello@crumbandco.com',
    href: 'mailto:hello@crumbandco.com',
    icon: 'mail' as const,
  },
]

function Icon({ name }: { name: 'phone' | 'mail' }) {
  const paths: Record<typeof name, string> = {
    phone:
      'M5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.7 1.5A16.5 16.5 0 0 1 3.5 5.2 1.5 1.5 0 0 1 5 3.5Z',
    mail: 'M3.5 6.5h17v11h-17z M3.5 7l8.5 6 8.5-6',
  }

  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  )
}

function Stamp() {
  return (
    <svg
      className="stamp"
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <path
          id="stamp-arc"
          d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
        />
      </defs>
      <circle cx="60" cy="60" r="59" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <text className="stamp__text">
        <textPath href="#stamp-arc" startOffset="0">
          baked before sunrise · est. 2009 · baked before sunrise · est. 2009 ·
        </textPath>
      </text>
      <path
        d="M60 42l3.4 12.6L76 58l-12.6 3.4L60 74l-3.4-12.6L44 58l12.6-3.4Z"
        fill="currentColor"
      />
    </svg>
  )
}

function App() {
  return (
    <>
      <header className="topbar">
        <a className="wordmark" href="#top">
          Crumb<span>&nbsp;&amp;&nbsp;</span>Co
        </a>
        <nav className="nav" aria-label="Sections">
          <a href="#menu">Menu</a>
          <a href="#hours">Hours</a>
          <a href="#visit">Visit</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__copy">
            <p className="eyebrow">Neighborhood bakery</p>
            <h1 id="hero-title">
              Crumb <em>&amp;</em> Co
            </h1>
            <p className="hero__line">Fresh bread every morning since 2009</p>
            <a className="button" href="#menu">
              See the menu
            </a>
          </div>
          <figure className="hero__media">
            <img
              src={breadHero}
              alt="A dark sourdough loaf, sliced on a wooden board"
              width="1400"
              height="933"
            />
            <figcaption className="hero__stamp">
              <Stamp />
            </figcaption>
          </figure>
        </section>

        <section className="menu" id="menu" aria-labelledby="menu-title">
          <div className="section-head">
            <h2 id="menu-title">Menu</h2>
            <p className="note">
              Everything is baked before sunrise. Croissants usually sell out by
              10am.
            </p>
          </div>

          <div className="menu__body">
            <figure className="menu__media">
              <img
                src={croissants}
                alt="Fresh croissants on a slate board, dusted with sugar"
                width="1400"
                height="1050"
              />
            </figure>

            <ul className="menu__list">
              {menu.map((item) => (
                <li className="item" key={item.name}>
                  <div className="item__row">
                    <h3 className="item__name">{item.name}</h3>
                    <span className="item__leader" aria-hidden="true" />
                    <span className="item__price">{item.price}</span>
                  </div>
                  <p className="item__desc">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="hours" id="hours" aria-labelledby="hours-title">
          <div className="section-head">
            <h2 id="hours-title">Opening hours</h2>
          </div>
          <ul className="hours__list">
            {hours.map((row) => (
              <li
                className={`hours__row${row.time === 'Closed' ? ' hours__row--closed' : ''}`}
                key={row.days}
              >
                <span className="hours__days">{row.days}</span>
                <span className="hours__leader" aria-hidden="true" />
                <span className="hours__time">{row.time}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="visit" id="visit" aria-labelledby="visit-title">
          <div className="visit__copy">
            <div className="section-head">
              <h2 id="visit-title">Visit us</h2>
            </div>
            <address className="visit__address">
              <span className="visit__street">14 Mill Street</span>
            </address>            <ul className="contact">
              {contact.map((entry) => (
                <li key={entry.label}>
                  <a className="contact__link" href={entry.href}>
                    <Icon name={entry.icon} />
                    <span>{entry.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <figure className="visit__media">
            <img
              src={loaves}
              alt="Three seeded loaves of bread with a sheaf of wheat"
              width="1400"
              height="933"
            />
          </figure>
        </section>
      </main>

      <footer className="footer">
        <p className="footer__mark">Crumb &amp; Co</p>
        <a className="footer__top" href="#top">
          Back to top
        </a>
      </footer>
    </>
  )
}

export default App
