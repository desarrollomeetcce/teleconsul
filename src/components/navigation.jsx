export const Navigation = (props) => {
  return (

    <header id="header" class="fixed-top d-flex align-items-center">
    <div class="container d-flex align-items-center">

      <div class="logo mr-auto">
        <h1><a href="index.html">Teleconsul</a></h1>
      
      </div>

      <nav class="nav-menu d-none d-lg-block">
        <ul>
          <li class="active"><a href="#">Inicio</a></li>
          <li><a href="#about">Nosotros</a></li>
          <li><a href="#services">Doctores</a></li>
          <li><a href="#questions">Preguntas frecuentes</a></li>


        </ul>
      </nav>


    </div>
  </header>
  )
}
