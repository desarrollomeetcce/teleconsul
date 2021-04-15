export const Header = (props) => {
  return (
    <section id="hero" className="d-flex flex-column justify-content-center align-items-center">
    <div className="container text-center text-md-left" data-aos="fade-up">
      <h1>{props.data.title}</h1>
      <h2>{props.data.paragraph}</h2>
      <div className="buttons">
        <button  onClick={()=>{props.redirecciona("#services")}} className="btn-get-started btn mr-2">Soy paciente</button>
        <button onClick={()=>{props.redirecciona("login")}} className="btn-get-started btn">Soy doctor</button>
      </div>
      
    </div>
    
  </section>
  )
}
