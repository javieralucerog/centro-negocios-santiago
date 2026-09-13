import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import Testimonials from './components/Testimonials.jsx'
import FAQ from './components/FAQ.jsx'
import ContactForm from './components/ContactForm.jsx'
import { getServices } from './services/api.js'

function App() {
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadServices() {
      setLoading(true)
      setError('')

      try {
        const data = await getServices(controller.signal)

        if (!controller.signal.aborted) {
          setServices(data)
        }
      } catch {
        if (!controller.signal.aborted) {
          setError(
            'No pudimos cargar los servicios. Inténtalo nuevamente.'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadServices()

    return () => controller.abort()
  }, [attempt])

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>

      <div id="inicio">
        <Navbar />

        <main id="contenido" tabIndex={-1}>
          <Hero />

          <About />

          {loading ? (
            <section id="servicios" className="services-section">
              <div className="container">
                <h2>Servicios</h2>
                <p role="status">Cargando servicios…</p>
              </div>
            </section>
          ) : error ? (
            <section id="servicios" className="services-section">
              <div className="container">
                <h2>Servicios</h2>
                <p role="alert">{error}</p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setAttempt((current) => current + 1)}
                >
                  Reintentar
                </button>
              </div>
            </section>
          ) : services.length === 0 ? (
            <section id="servicios" className="services-section">
              <div className="container">
                <h2>Servicios</h2>
                <p role="status">
                  No hay servicios disponibles por el momento.
                </p>
              </div>
            </section>
          ) : (
            <Services
              services={services}
              onSelect={setSelectedService}
            />
          )}

          <Testimonials />

          <FAQ />

          <ContactForm
            services={services}
            selectedService={selectedService}
            onServiceChange={setSelectedService}
          />
        </main>

        <footer className="site-footer">
          <div className="container">
            <p>
              Proyecto académico · Propuesta de rediseño.
              No corresponde al sitio oficial de Sercotec.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App