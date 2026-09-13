import { useEffect, useState } from 'react'
import { getQuestions } from '../services/api.js'

function FAQ() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadQuestions() {
      setLoading(true)
      setError('')

      try {
        const data = await getQuestions(controller.signal)

        if (!controller.signal.aborted) {
          setQuestions(data)
        }
      } catch {
        if (!controller.signal.aborted) {
          setError(
            'No pudimos cargar las preguntas. Inténtalo nuevamente.'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadQuestions()

    return () => controller.abort()
  }, [attempt])

  return (
    <section
      id="preguntas"
      className="faq-section"
      aria-labelledby="faq-title"
    >
      <div className="container">
        <p className="section-label">PREGUNTAS FRECUENTES</p>
        <h2 id="faq-title">Resuelve tus dudas</h2>

        {loading ? (
          <p role="status">Cargando preguntas…</p>
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
        ) : questions.length === 0 ? (
          <p role="status">
            No hay preguntas disponibles por el momento.
          </p>
        ) : (
          <div className="faq-list">
            {questions.map((item) => (
              <details className="faq-item" key={item.id}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default FAQ