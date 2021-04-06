import React, { Component } from "react"
import { Navigation } from './components/navigation'
import { Header } from './components/header'
import { Features } from './components/features'
import { About } from './components/about'
import { Testimonials } from './components/testimonials'
import JsonData from './data/data.json'
import SmoothScroll from 'smooth-scroll'
/*
  Dependencia nuevas para el funcionamiento
 */

import axios from 'axios'
import {Modal,ModalBody,ModalFooter,ModalHeader,Input,Label, FormGroup,Button, Form} from 'reactstrap'
import {Dropdown,DropdownMenu,DropdownItem,DropdownToggle} from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.css'
import Dropzone from 'react-dropzone'


export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
})

const url ='http://35.239.252.119:8000/api/doctor'
const urlMeeting ='http://35.239.252.119:8000/api/meeting'

class App extends Component {
  state = {
    abierto : false,
    terminos: false,
    data:[],
    cita:{
      id_cita:'',
      fecha_select:'',
      hora_select: '',
      f_ini:'',
      f_fin:'',
      id_user:'',
      status:'2',
      created_at:'',
      client:'',
      mail: '',
    },
    horarios: [],
    horario_select: [],
    archivos: [],
  }

  switchModal=() => {
    this.setState({abierto: !this.state.abierto});
    this.setState({archivos: [],terminos:false});
  }
  consultaDoctores = () =>{
    axios.get(url).then(response=>{
      this.setState({data:response.data});
    });
  }

  handleChange = async e =>{
    e.persist();
    await this.setState({
      horario_select:  e.target.id == 'fecha' ? this.state.horarios[ e.target.options.selectedIndex].horas:this.state.horario_select,
      cita:{
        ...this.state.cita,
        [e.target.name]: e.target.value,
        hora_select: e.target.id == 'fecha' ? this.state.horarios[ e.target.options.selectedIndex].horas[0].hora :e.target.name=='hora_select' ? e.target.value: this.state.cita.hora_select,
        id_cita: e.target.id == 'fecha' ? this.state.horarios[ e.target.options.selectedIndex].horas[0].id_cita :e.target.name=='hora_select' ? e.target[e.target.options.selectedIndex].id: this.state.cita.id_cita,
      },
     

    });
    console.log(this.state.terminos);
  }

  terminosCondiciones=async event =>{
    event.persist();
    await this.setState({
      terminos:  event.target.checked,
    })
   
  }
  seleccionaCita=(cita) => {
    this.setState({
      cita:{
        fecha_select: cita.horarios? cita.horarios[0].Fecha : '',
        hora_select: cita.horarios? cita.horarios[0].horas[0].hora : '',
        id_cita:  cita.horarios ? cita.horarios[0].horas[0].id_cita : '',
        f_ini:'',
        f_fin:'',
        id_user:cita.doctor.id,
        status:'2',
        created_at:'',
        client:'',
        mail: '',
      },
      horarios: cita.horarios,
      horario_select:  cita.horarios? cita.horarios[0].horas : [],
    });
  
  }

  registrarCita=(event) => {
      event.preventDefault();
     
      var citaFinal = {
        f_ini: this.state.cita.fecha_select+' '+this.state.cita.hora_select,
        f_fin: this.state.cita.fecha_select+' '+this.state.cita.hora_select,
        id_user: this.state.cita.id_user+'',
        created_at: "2021-03-28 12:55:00",
        status: "2",
        client: this.state.cita.mail

      };

      axios.put(urlMeeting+"/"+ this.state.cita.id_cita,citaFinal).then(response=>{
        this.switchModal();
        this.consultaDoctores();
        //console.log(response);
      });
     // console.log(citaFinal);
  }
  componentDidMount() {
    this.consultaDoctores();
  }
  componentDidUpdate() {
    
    
  }

  revisaArchivo=(files,rejectedFiles) => {
    this.setState({archivos: files});
  }

  render(){
      return (
        <>
        <div>
          <Navigation />
          <Header data={JsonData.Header} />
          <About data={JsonData.About} />
          <Features data={this.state.data} openModal={this.switchModal} selectCita={this.seleccionaCita}/>
          <Testimonials data={JsonData.Testimonials} />
        </div>
        
        <Modal className="modalForm" isOpen={this.state.abierto}>
          <ModalHeader>Registrar cita</ModalHeader>
          <Form onSubmit={this.registrarCita}>
          <ModalBody>
            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                    <Label for="client">Nombre</Label>
                    <Input type="text" id="client" name='client' onChange={this.handleChange}/>
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                    <Label for="client">Apellido</Label>
                    <Input type="text" id="apellido" name='apellido' onChange={this.handleChange}/>
                </FormGroup>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                    <Label for="documento">Documento</Label>
                    <select className="form-control" type="text" id="documento" name="documento" onChange={this.handleChange}>
                     <option>DNI</option>
                     <option>Pasaporte</option>
                     <option>Carnet de extranjería</option>
                    </select>
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                    <Label for="documentid">Número de Documento</Label>
                    <Input type="text" id="documentid" name='documentid' onChange={this.handleChange}/>
                </FormGroup>
              </div>
            </div>
            <FormGroup>

                <Input type="hidden" id="id_user" name='id_user' onChange={this.handleChange} value={this.state.cita? this.state.cita.id_user : ''}/>
            </FormGroup>
           
            <FormGroup>
                <Label for="mail">Correo</Label>
                <Input type="email" placeholder="ejemplo@mail.com" id="mail" name='mail' onChange={this.handleChange}/>
            </FormGroup>
            <FormGroup>
                <Label for="descripcion">Especificación de síntomas / Comentarios</Label>
                <textarea class="form-control" id="descripcion" rows="3"></textarea>
            </FormGroup>
            <FormGroup>
              <Label for="documents">Documentos</Label>
              <Dropzone id="documents" onDrop={this.revisaArchivo} maxSize={30000} multiple={true}>
                {({getRootProps, getInputProps}) => (
                  <div {...getRootProps()}  className="dropzone">
                    <input {...getInputProps()} />
                    
                    <div> {this.state.archivos
                        ? <ul> {this.state.archivos.map((archivo, i) => (
                            <li key={i} value={archivo.name} id={archivo.name}>{archivo.name}</li>
                          ))}</ul>
                        : <p>Agrega documentos aquí</p>}</div>
                  </div>
                  
                )}
              </Dropzone>
            </FormGroup>
            <FormGroup>
               <div className="row">
                  <div className="col-md-6">
                    <Label for="fecha">Fecha</Label>
                    <select className="form-control" type="text" id="fecha" name="fecha_select" v>
                    {this.state.horarios
                        ? this.state.horarios.map((horario, i) => (
                            <option key={i} value={horario.fecha} id={horario.id}>{horario.Fecha}</option>
                          ))
                        : 'Loading...'}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <Label for="hora">Hora</Label>
                    <select className="form-control" type="text" id="hora" name="hora_select" onChange={this.handleChange}>
                    {this.state.horario_select
                        ? this.state.horario_select.map((hora, i) => (
                          
                            <option id={hora.id_cita} key={i} value={hora.hora}>{hora.hora}</option>
                          
                          ))
                        : 'Loading...'}
                    </select>
                  </div>
               </div>
             
            </FormGroup>
            <FormGroup>
           
                <label className="form-control" for="terminos">
                <input className="" type="checkbox" value="" id="terminos" name ="terminos"  onChange={this.terminosCondiciones}/> He leido y acepto los terminos y condiciones
                </label>
            </FormGroup>
            
          </ModalBody>
          <ModalFooter>
            {this.state.cita.id_cita ?  this.state.terminos ? <Button color="primary" type="submit">Registrar</Button>: <div></div> : <div></div>}
            <Button color="secondary"  onClick={this.switchModal}>Cerrar</Button>
          </ModalFooter>
          </Form>
        </Modal>
        
        </>
      )
  }

}


export default App
