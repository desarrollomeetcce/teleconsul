import { useState, useEffect } from 'react'
import { Navigation } from './components/navigation'
import { Header } from './components/header'
import { Features } from './components/features'
import { About } from './components/about'
import { Services } from './components/services'
import { Gallery } from './components/gallery'
import { Testimonials } from './components/testimonials'
import { Team } from './components/Team'
import { Contact } from './components/contact'
import JsonData from './data/data.json'
import SmoothScroll from 'smooth-scroll'

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
})

const App = () => {
  const [landingPageData, setLandingPageData] = useState({})
  const [dataDoctor, setDataDoctor] = useState()
  const url ='http://35.239.252.119:8000/api/doctor'
  
  const fetchapi = async () => {
    //const response = await fetch(url)
    //const responseJson = await response.json()
    
    //console.log(responseJson)
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setDataDoctor(data)
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  useEffect(() => {
    setLandingPageData(JsonData)
    fetchapi()
  }, [])

  return (
    <div>
      <Navigation />
      <Header data={landingPageData.Header} />
      <About data={landingPageData.About} />
      <Features data={dataDoctor} />
      <Testimonials data={landingPageData.Testimonials} />
    </div>
  )
}

export default App
