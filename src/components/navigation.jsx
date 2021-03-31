export const Navigation = (props) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm bg-light fixed-top">
    <div className="container"> <a className="navbar-brand d-flex align-items-center" href="#">
    
 
  
    <span className="ml-3 font-weight-bold">TELECONSUL</span>
    </a> <button className="navbar-toggler navbar-toggler-right border-0" type="button" data-toggle="collapse" data-target="#navbar4">
    <span className="navbar-toggler-icon"></span>
    </button>
    
    
    <div className="collapse navbar-collapse" id="navbar4">
   
    <ul className="navbar-nav ml-auto mt-3 mt-lg-0">
    <li className="nav-item px-lg-2 active"> <a className="nav-link" href="#"> <span className="d-inline-block d-lg-none icon-width"><i className="fas fa-home"></i></span>inicio</a> </li>
    <li className="nav-item px-lg-2"> <a className="nav-link" href="#about"><span className="d-inline-block d-lg-none icon-width"><i className="fas fa-spa"></i></span>Sobre Nosotros</a> </li>
    <li className="nav-item px-lg-2"> <a className="nav-link" href="#features"><span className="d-inline-block d-lg-none icon-width"><i className="far fa-user"></i></span>Doctores</a> </li>
    <li className="nav-item px-lg-2"> <a className="nav-link" href="#testimonials"><span className="d-inline-block d-lg-none icon-width"><i className="far fa-user"></i></span>Preguntas frecuentes</a> </li>
   
    

    
    </ul>
    </div>
    </div>
    </nav>
  )
}
