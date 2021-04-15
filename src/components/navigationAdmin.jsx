export const NavigationAdmin = (props) => {

  
  return (

    <header id="header" className="fixed-top d-flex align-items-center">
    <div className="container d-flex align-items-center">

      <div className="logo mr-auto">
        <h1><a href="index.html">Teleconsul</a></h1>
      
      </div>

      <nav className="nav-menu d-none d-lg-block">
        <ul>
          <li className=""><a href="/adminPanel">Inicio</a></li>
          <li className=""><a href="/adduser">Agregar Usuario</a></li>
          <li className=""><a href="/doctorUser">Agregar Doctor</a></li>
          <li className=""><a href="/admincitas">Citas</a></li>
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
