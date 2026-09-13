import ServiceCard from './ServiceCard.jsx'

function Services({ services, onSelect }) {
  return (
    <section
      id="servicios"
      className="services-section"
      aria-labelledby="services-title"
    >
      <div className="container">
        <p className="section-label">NUESTROS SERVICIOS</p>
        <h2 id="services-title">Apoyo para avanzar con tu negocio</h2>
        <p className="services-intro">
          Explora las alternativas de acompañamiento y selecciona
          el servicio sobre el que quieres consultar.
        </p>

        <div className="row g-4">
          {services.map((service) => (
            <div className="col-md-6 col-lg-4" key={service.id}>
              <ServiceCard service={service} onSelect={onSelect} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services