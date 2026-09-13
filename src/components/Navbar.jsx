import { useRef, useState } from 'react'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const menuButtonRef = useRef(null)

  function closeMenu() {
    setIsOpen(false)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  return (
    <header className="site-header">
      <nav
        className="container site-nav"
        aria-label="Navegación principal"
        onKeyDown={handleKeyDown}
      >
        <a className="site-brand" href="#inicio" onClick={closeMenu}>
          <span className="brand-name">SERCOTEC</span>
          <span className="brand-description">
            Centro de Negocios Santiago
          </span>
        </a>

        <button
          ref={menuButtonRef}
          type="button"
          className="menu-toggle"
          aria-expanded={isOpen}
          aria-controls="main-navigation"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span aria-hidden="true">{isOpen ? '×' : '☰'}</span>
          {isOpen ? 'Cerrar' : 'Menú'}
        </button>

        <div
          id="main-navigation"
          className={`nav-links${isOpen ? ' is-open' : ''}`}
        >
          <a href="#inicio" onClick={closeMenu}>Inicio</a>
          <a href="#nosotros" onClick={closeMenu}>Nosotros</a>
          <a href="#servicios" onClick={closeMenu}>Servicios</a>
          <a href="#testimonios" onClick={closeMenu}>Testimonios</a>
          <a href="#preguntas" onClick={closeMenu}>
            Preguntas frecuentes
          </a>
          <a href="#contacto" onClick={closeMenu}>Contacto</a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar