export const About = (props) => {
  return (
   
     <section id="about" className="about">
      <div className="container">
      <h3 className="centerText">Sobre nosotros</h3>
      <br>
      </br>
      <br></br>
        <div className="row">
          <div className="col-lg-6">
            <img src="assets/img/about.jpg" className="img-fluid" alt=""></img>
          </div>
          <div className="col-lg-6 pt-4 pt-lg-0">
           
            <p className="aboutus">
              {props.data.paragraph}
            </p>
            
            {/*<div className="row icon-boxes">
              <div className="col-md-6">
                <i className="bx bx-receipt"></i>
                <h4>Corporis voluptates sit</h4>
                <p>Consequuntur sunt aut quasi enim aliquam quae harum pariatur laboris nisi ut aliquip</p>
              </div>
              <div className="col-md-6 mt-4 mt-md-0">
                <i className="bx bx-cube-alt"></i>
                <h4>Ullamco laboris nisi</h4>
                <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt</p>
              </div>
            </div>*/}
          </div>
        </div>

      </div>
     
    </section>
    
  )
}
