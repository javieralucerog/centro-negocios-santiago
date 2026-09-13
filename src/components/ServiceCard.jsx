function ServiceCard({ service, onSelect }) {
    return (
      <article className="service-card">
        <img
          className="service-image"
          src={service.image}
          alt=""
          width="900"
          height="600"
          loading="lazy"
          decoding="async"
        />
  
        <div className="service-card-content">
          <p className="section-label">SERVICIO DEL CENTRO</p>
  
          <h3>{service.title}</h3>
  
          <p className="service-description">
            {service.description}
          </p>
  
          <a
            className="primary-link"
            href="#contacto"
            onClick={() => onSelect(service.id)}
          >
            Contáctanos
            <span className="visually-hidden">
              {' '}sobre {service.title}
            </span>
            <span aria-hidden="true"> →</span>
          </a>
        </div>
      </article>
    )
  }
  
  export default ServiceCard