export const Navigation = (props) => {
  return (

    <header id="header" className="fixed-top d-flex align-items-center">
    <div className="container d-flex align-items-center">

      <div className="logo mr-auto">
        <h1><a href="#"><img src="assets/img/teleconsullogo.jpg"></img></a></h1>
      
      </div>

      <nav className="nav-menu d-none d-lg-block">
        <ul>
          <li className="active"><a href="/#">Inicio</a></li>
          <li><a href="/#about">Nosotros</a></li>
          <li><a href="/#services">Doctores</a></li>
          <li><a href="/#questions">Preguntas frecuentes</a></li>


        </ul>
      </nav>


    </div>
  </header>
  )
}
