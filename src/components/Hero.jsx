function Hero() {
    return (
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-8">
              <p className="section-label">
                CENTRO DE NEGOCIOS SANTIAGO
              </p>
  
              <h1 id="hero-title">
                Tu próximo paso,
                <span> un negocio más fuerte.</span>
              </h1>
  
              <p className="hero-description">
                Un espacio de orientación y acompañamiento para
                emprendedores y pequeñas empresas que buscan desarrollar
                su negocio.
              </p>
  
              <a className="primary-link" href="#nosotros">
                Conoce el centro
                <span aria-hidden="true"> →</span>
              </a>
            </div>
  
            <div className="col-lg-4">
              <aside className="hero-note" aria-labelledby="note-title">
                <span className="note-line" aria-hidden="true"></span>
                <p className="section-label">EMPRENDER CON APOYO</p>
                <h2 id="note-title">
                  Cada negocio tiene un siguiente paso.
                </h2>
                <p>
                  Conoce el centro y descubre cómo puede acompañarte
                  en el desarrollo de tu emprendimiento.
                </p>
              </aside>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  export default Hero