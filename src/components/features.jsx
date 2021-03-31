export const Features = (props) => {

  return (
    <div id='features' className='text-center'>
      <div className='container'>
        <div className='col-md-12 col-md-offset-1 section-title'>
          <h2>Doctores</h2>
        </div>
        <div className='row'>
          {props.data
            ? props.data.map((d, i) => (
                <div key={i} className='col-xs-6 col-md-4'>
                <h3>{d.doctor.name}</h3>
                  <i className="fa fa-group"></i>
                  
                  <div><button className="btn btn-primary" onClick={()=>{props.openModal(); props.selectCita(d);}}>Agendar</button></div>
                  <br></br>
                </div>
              ))
            : 'Loading...'}
        </div>
      </div>
    </div>
  )
}
