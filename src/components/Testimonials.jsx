import { useState } from 'react'

const testimonials = [
  {
    id: 'ejemplo-1',
    name: 'Emprendimiento de alimentos',
    quote:
      'Tener un plan de trabajo me ayudaría a organizar mis prioridades y definir los próximos pasos de mi negocio.',
  },
  {
    id: 'ejemplo-2',
    name: 'Comercio de barrio',
    quote:
      'Me gustaría fortalecer mis conocimientos para mejorar la gestión y dar a conocer mis productos.',
  },
  {
    id: 'ejemplo-3',
    name: 'Servicios profesionales',
    quote:
      'Conectar con otros emprendedores sería una oportunidad para aprender y explorar colaboraciones.',
  },
]

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const testimonial = testimonials[activeIndex]

  function showPrevious() {
    setActiveIndex((current) =>
      (current - 1 + testimonials.length) % testimonials.length
    )
  }

  function showNext() {
    setActiveIndex((current) =>
      (current + 1) % testimonials.length
    )
  }

  return (
    <section
      id="testimonios"
      className="testimonials-section"
      aria-labelledby="testimonials-title"
      aria-roledescription="carrusel"
    >
      <div className="container">
        <p className="section-label">TESTIMONIOS</p>
        <h2 id="testimonials-title">
          Experiencias que nos conectan
        </h2>

        <p className="testimonials-disclaimer">
          Contenido ficticio para demostrar el carrusel.
          No representa testimonios reales del centro.
        </p>

        <div className="testimonial-card">
          <div
            aria-live="polite"
            aria-atomic="true"
          >
            <figure
              className="testimonial-content"
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${activeIndex + 1} de ${testimonials.length}`}
            >
              <blockquote>
                <p>“{testimonial.quote}”</p>
              </blockquote>

              <figcaption>
                {testimonial.name}
                <span>Ejemplo ficticio</span>
              </figcaption>
            </figure>
          </div>

          <div className="testimonial-controls">
            <button
              type="button"
              className="testimonial-button"
              onClick={showPrevious}
              aria-label="Ver testimonio anterior"
            >
              <span aria-hidden="true">←</span>
            </button>

            <span className="testimonial-counter">
              {activeIndex + 1} / {testimonials.length}
            </span>

            <button
              type="button"
              className="testimonial-button"
              onClick={showNext}
              aria-label="Ver siguiente testimonio"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials