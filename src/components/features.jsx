export const Features = (props) => {

  return (
    <section id="services" class="team">
      <div class="container">

        <div class="section-title">
          <h2>Doctores</h2>
          <p></p>
        </div>
        {props.data
            ? props.data.map((d, i) => (
              <div key={i} class="row">
                <div class="col-lg-4 col-md-6 d-flex align-items-stretch">
                  <div class="member">
                    <img src="assets/img/avatar.jpeg" alt=""></img>
                    <h4>{d.doctor.name}</h4>
                    <span>Doctor</span>
                    <p>
                     Descripción
                    </p>
                    <div><button className="btn btn-primary" onClick={()=>{props.openModal(); props.selectCita(d);}}>Agendar</button></div>
                  </div>
                </div>
              </div>
            
              ))
            : 'Loading...'}


      </div>
    </section>
  
  )
}
