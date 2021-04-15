export const NavigationDoctor = (props) => {

  
  return (

    <header id="header" className="fixed-top d-flex align-items-center">
    <div className="container d-flex align-items-center">

      <div className="logo mr-auto">
        <h1><a href="index.html">Teleconsul</a></h1>
      
      </div>

      <nav className="nav-menu d-none d-lg-block">
        <ul>
          <li className=""><a href="panelPrincipal#citas">Inicio</a></li>
          <li><a href="panelPrincipal#horarios">Horarios</a></li>
          <li><a href="pacientes#pacientes">Pacientes</a></li>
          <li className="drop-down"><a>{props.name}</a>
            <ul>
              <li><a href="/perfil">Perfil</a></li>
              <li><a href="/login">Salir</a></li>
            </ul>
          </li>
        
         


        </ul>
      </nav>


    </div>
  </header>
  )
}
