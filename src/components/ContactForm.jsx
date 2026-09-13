import { useRef, useState } from 'react'

const CONTACT_URL =
  'http://127.0.0.1:8888/centro-negocios-api/contacto.php'

function ContactForm({ services, selectedService, onServiceChange }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const [feedback, setFeedback] = useState('')
  const [sending, setSending] = useState(false)
  const sendingRef = useRef(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (sendingRef.current) return

    const form = event.currentTarget

    if (name.trim().length < 2) {
      setFeedback('Ingresa un nombre con al menos 2 caracteres.')
      form.elements.namedItem('name')?.focus()
      return
    }

    if (message.trim().length < 10) {
      setFeedback('Escribe un mensaje con al menos 10 caracteres.')
      form.elements.namedItem('message')?.focus()
      return
    }

    if (!services.some((service) => service.id === selectedService)) {
      setFeedback('Selecciona un servicio disponible.')
      form.elements.namedItem('service')?.focus()
      return
    }

    sendingRef.current = true
    setSending(true)
    setFeedback('Guardando tu consulta…')

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch(CONTACT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          service: selectedService,
          message: message.trim(),
          website,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const fields = data?.fields

        const firstField = ['name', 'email', 'service', 'message'].find(
          (field) => typeof fields?.[field] === 'string'
        )

        setFeedback(
          firstField
            ? fields[firstField]
            : typeof data?.error === 'string'
              ? data.error
              : 'No se pudo guardar la consulta.'
        )

        if (firstField) {
          form.elements.namedItem(firstField)?.focus()
        }

        return
      }

      setName('')
      setEmail('')
      setMessage('')
      setWebsite('')
      onServiceChange('')

      setFeedback(
        'Consulta guardada en esta demostración local. ' +
        'No se ha enviado al centro real.'
      )
    } catch (error) {
      setFeedback(
        error.name === 'AbortError'
          ? 'La solicitud tardó demasiado. Revisa la tabla consultas ' +
            'antes de reenviarla para evitar duplicados.'
          : 'No se pudo confirmar el guardado. Comprueba que MAMP ' +
            'esté activo y revisa la tabla consultas antes de reenviar.'
      )
    } finally {
      clearTimeout(timeout)
      sendingRef.current = false
      setSending(false)
    }
  }

  return (
    <section
      id="contacto"
      className="contact-section"
      aria-labelledby="contact-title"
    >
      <div className="container">
        <p className="section-label">CONTACTO</p>
        <h2 id="contact-title">Cuéntanos qué necesitas</h2>
        <p>
          Completa tus datos y selecciona el servicio que te interesa.
        </p>

        <form
          className="contact-form"
          onSubmit={handleSubmit}
          onChange={() => {
            if (!sendingRef.current) setFeedback('')
          }}
          aria-describedby="contact-note"
          aria-busy={sending}
        >
          <p id="contact-note" className="contact-demo-note">
            Formulario de demostración: utiliza datos ficticios.
            Las consultas se guardan localmente y no se envían al
            centro real. Todos los campos visibles son obligatorios.
          </p>

          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clipPath: 'inset(50%)',
              whiteSpace: 'nowrap',
            }}
          >
            <label htmlFor="contact-website">
              Deja este campo vacío
            </label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <label htmlFor="contact-name" className="form-label">
                Nombre
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                className="form-control"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                readOnly={sending}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="contact-email" className="form-label">
                Correo electrónico
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                className="form-control"
                autoComplete="email"
                required
                maxLength={120}
                readOnly={sending}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="col-12">
              <label htmlFor="service" className="form-label">
                Servicio de interés
              </label>
              <select
                id="service"
                name="service"
                className="form-select"
                required
                disabled={sending}
                value={selectedService}
                onChange={(event) =>
                  onServiceChange(event.target.value)
                }
              >
                <option value="">Selecciona un servicio</option>

                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label htmlFor="contact-message" className="form-label">
                Mensaje
              </label>
              <textarea
                id="contact-message"
                name="message"
                className="form-control"
                rows={5}
                required
                minLength={10}
                maxLength={1000}
                readOnly={sending}
                aria-describedby="message-help"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
              <p id="message-help" className="form-text">
                Entre 10 y 1.000 caracteres.
              </p>
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="primary-link"
                disabled={sending || services.length === 0}
              >
                {sending ? 'Guardando…' : 'Enviar consulta de prueba'}
              </button>
            </div>
          </div>

          <p
            className="form-feedback"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {feedback}
          </p>
        </form>
      </div>
    </section>
  )
}

export default ContactForm