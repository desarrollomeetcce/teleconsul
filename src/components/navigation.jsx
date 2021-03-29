export const Navigation = (props) => {
  return (
    <nav id='menu' className='navbar navbar-default navbar-fixed-top'>
      <div className='container'>
        <div className='navbar-header'>
          <button
            type='button'
            className='navbar-toggle collapsed'
            data-toggle='collapse'
            data-target='#bs-example-navbar-collapse-1'
          >
            {' '}
            <span className='sr-only'>Toggle navigation</span>{' '}
            <span className='icon-bar'></span>{' '}
            <span className='icon-bar'></span>{' '}
            <span className='icon-bar'></span>{' '}
          </button>
          <a className='navbar-brand page-scroll' href='#page-top'>
            Teleconsul
          </a>{' '}
        </div>

        <div
          className='collapse navbar-collapse'
          id='bs-example-navbar-collapse-1'
        >
          <ul className='nav navbar-nav navbar-right'>
            <li>
              <a href='#page-top' className='page-scroll'>
                Inicio
              </a>
            </li>
            <li>
              <a href='#about' className='page-scroll'>
                Sobre nosotros
              </a>
            </li>
            <li>
              <a href='#features' className='page-scroll'>
                Doctores
              </a>
            </li>
            <li>
              <a href='#testimonials' className='page-scroll'>
                Preguntas frecuentes
              </a>
            </li>
           
          </ul>
        </div>
      </div>
    </nav>
  )
}
