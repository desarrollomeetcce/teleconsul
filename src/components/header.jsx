export const Header = (props) => {
  return (
    <section id="hero" class="d-flex flex-column justify-content-center align-items-center">
    <div class="container text-center text-md-left" data-aos="fade-up">
      <h1>{props.data.title}</h1>
      <h2>{props.data.paragraph}</h2>
      <div class="buttons">
        <button class="btn-get-started btn mr-2">Soy paciente</button>
        <button href="#about" class="btn-get-started btn">Soy doctor</button>
      </div>
      
    </div>
    
  </section>
  )
}
