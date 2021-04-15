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
import 'bootstrap/dist/css/bootstrap.css'
import Dropzone from 'react-dropzone'

import Cookies from 'universal-cookie'

const cookies = new Cookies()

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
})

const url ='https://teleconsul.org:8000/api/doctor'
const urlMeeting ='https://teleconsul.org:8000/api/meeting/restermeet'
//

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
      name: '',
      lastname: '',
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
      horario_select:  e.target.id === 'fecha' ? this.state.horarios[ e.target.options.selectedIndex].horas:this.state.horario_select,
      cita:{
        ...this.state.cita,
        [e.target.name]: e.target.value,
        hora_select: e.target.id === 'fecha' ? this.state.horarios[ e.target.options.selectedIndex].horas[0].hora :e.target.name==='hora_select' ? e.target.value: this.state.cita.hora_select,
        id_cita: e.target.id === 'fecha' ? this.state.horarios[ e.target.options.selectedIndex].horas[0].id_cita :e.target.name==='hora_select' ? e.target[e.target.options.selectedIndex].id: this.state.cita.id_cita,
      },
     

    });
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
       
      if(this.state.cita.name=='' || this.state.cita.description=='' || this.state.cita.mail==''){
          alert("Favor de llenar los campos requeridos");
          return false;
      }
      let fd = new FormData();
      var docs = this.state.archivos;
      docs.map((doc) => {
          fd.append('documents[]',doc);
      });
      fd.append('f_ini', this.state.cita.fecha_select+' '+this.state.cita.hora_select);
      fd.append('f_fin', this.state.cita.fecha_select+' '+this.state.cita.hora_select);
      fd.append('id_user', this.state.cita.id_user);
      fd.append('status',2);
      fd.append('name', this.state.cita.name);
      fd.append('lastname', this.state.cita.lastname);
      fd.append('description', this.state.cita.description);
      fd.append('document_type', this.state.cita.document_type);
      fd.append('document_id', this.state.cita.document_id);
      fd.append('mail',this.state.cita.mail);
      fd.append('id',this.state.cita.id_cita);
      fd.append('created_at',new Date().toISOString().replace('T', ' ').substr(0, 19));

     // console.log(this.state.cita);

      axios.post(urlMeeting, fd, {headers: {

          'Content-Type': 'multipart/form-data; boundary=${data._boundary}',
          
        }}).then(response=>{
          console.log(response);
        alert("La cita se registró de forma correcta, recibira un correo de notificación. En caso de no visualizarlo revisar el correo Spam.");
         this.switchModal();
          this.consultaDoctores();
         window.location.href= './';
          
      }).catch(function (error) {
          console.log(error.response.data);
          alert("Ocurrio un error al registrar la cita");

      });
  }
  componentDidMount() {
    this.consultaDoctores();
   
  }
  componentDidUpdate() {
    
    
  }

  revisaArchivo=(files,rejectedFiles) => {
    this.setState({archivos: files});
    if(rejectedFiles.length > 0){
        alert("El archivo es demasiado pesado");
    }
  }

  redirecciona= (page) =>{
    window.location.href= './'+page;
  }
  render(){
      return (
        <>
        
        <div>
          <Navigation />
          <Header data={JsonData.Header} redirecciona = {this.redirecciona}/>
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
                    <Label for="name">Nombre</Label>
                    <Input type="text" id="name" name='name' onChange={this.handleChange}/>
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                    <Label for="lastname">Apellido</Label>
                    <Input type="text" id="lastname" name='lastname' onChange={this.handleChange}/>
                </FormGroup>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                    <Label for="document_type">Documento</Label>
                    <select className="form-control" type="text" id="document_type" name="document_type" onChange={this.handleChange}>
                     <option>DNI</option>
                     <option>Pasaporte</option>
                     <option>Carnet de extranjería</option>
                    </select>
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                    <Label for="document_id">Número de Documento</Label>
                    <Input type="text" id="document_id" name='document_id' onChange={this.handleChange}/>
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
                <textarea onChange={this.handleChange} className="form-control" id="descripcion" name="description" rows="3"></textarea>
            </FormGroup>
            <FormGroup>
              <Label for="documents">Documentos</Label>
              <Dropzone id="documents" name="documents" onDrop={this.revisaArchivo} maxSize={250000} multiple={true}>
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
                    <Label for="fecha_select">Fecha</Label>
                    <select className="form-control" type="text" id="fecha" name="fecha_select" onChange={this.handleChange}>
                    {this.state.horarios
                        ? this.state.horarios.map((horario, i) => (
                            <option key={i} value={horario.fecha} id={horario.id}>{horario.Fecha}</option>
                          ))
                        : 'Loading...'}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <Label for="hora_select">Hora</Label>
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
                          
                <label for="terminos">
                  <input className="" type="checkbox" value="" id="terminos" name ="terminos"  onChange={this.terminosCondiciones}/> He leído y estoy de acuerdo con los&nbsp;
                  <a href="/terminos"  target="_blank"> terminos y condiciones</a> para pacientes y la&nbsp;
                  <a href="/politicas"  target="_blank"> política de privacidad</a> de la plataforma.
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
