export const Features = (props) => {

  return (
    <section id="services" className="team">
      <div className="container">

        <div className="section-title">
          <h2>Doctores</h2>
          <p></p>
        </div>
        <div className="row">
        {props.data
            ? props.data.map((d, i) => (
             
                <div  key={i} className="col-lg-4 col-md-6 d-flex align-items-stretch">
                  <div className="member">
                    <img src="assets/img/avatar.jpeg" alt=""></img>
                    <h4>Dr(a) {d.doctor.name} {d.doctor.lastname}</h4>
                    <span></span>
                    <p>
                    {d.doctor.speciality_name}
                    </p>
                    <div><button className="btn btn-primary" onClick={()=>{props.openModal(); props.selectCita(d);}}>Agendar</button></div>
                  </div>
                </div>
              
            
              ))
            : 'Loading...'}
            </div>


      </div>
    </section>
  
  )
}
