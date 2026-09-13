import { useEffect, useState } from 'react'
import { getAbout } from '../services/api.js'

function About() {
  const [about, setAbout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadAbout() {
      setLoading(true)
      setError('')

      try {
        const data = await getAbout(controller.signal)

        if (!controller.signal.aborted) {
          setAbout(data)
        }
      } catch {
        if (!controller.signal.aborted) {
          setError(
            'No pudimos cargar la información del centro. Inténtalo nuevamente.'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadAbout()

    return () => controller.abort()
  }, [attempt])

  return (
    <section
      id="nosotros"
      className="about-section"
      aria-labelledby="about-title"
    >
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <p className="section-label">NOSOTROS</p>
            <h2 id="about-title">
              {about?.title ?? 'Conoce el centro'}
            </h2>
          </div>

          <div className="col-lg-8">
            {loading ? (
              <p role="status">Cargando información del centro…</p>
            ) : error ? (
              <>
                <p role="alert">{error}</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setAttempt((current) => current + 1)}
                >
                  Reintentar
                </button>
              </>
            ) : about ? (
              <>
                <p className="about-description">
                  {about.description}
                </p>
                <p>{about.detail}</p>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About