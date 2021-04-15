
import React, { Component } from "react"
import { NavigationDoctor }  from '../components/navigationDoctor'


import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; 


import {Modal,ModalBody,ModalFooter,ModalHeader,Input,Label, FormGroup,Button, Form} from 'reactstrap'
import Cookies from 'universal-cookie'


import axios from 'axios'


const urlAddHor ='https://teleconsul.org:8000/api/meeting'
const urlGetCitas = 'https://teleconsul.org:8000/api/meeting'
const urlgetHor = 'https://teleconsul.org:8000/api/meeting/getfree'

const cookies = new Cookies()

class PanelGeneral extends Component {
  constructor(props) {
    super(props)
  }
  
    calendarHorarios = React.createRef()
    calendarCitas = React.createRef()
    
    state = {
      abiertohor: false,
      abierto: false,
      nuevoHorario: {
        f_ini : '',
        f_fin:'',
        id_user:0,
        status:1,
        created_at:'',
        id_document: '0',
        client:'nobody',
        day: '',
        hour: '',
      },
        horarios: [
          // initial event data
         
        ],
        pacientes: [

          ],
        currentPa:{
            nombre: '',
            apellido : '',
            documento : '',
            documentid: '',
            mail : '',
            descripcion : '',
            fecha:'',
            meeting_state_name:'',
            documents_urls:[],
        }
      };

      componentDidMount() {
      
        if(!cookies.get("nombre")){
          window.location.href= './login';
        }
        console.log(this.props.location.state);
       // this.consultaDoctores();
        this.consultaHorarios();
        this.consultaCitas();
      }
    
   
  
  
    render(){
        return(
          
        <>
      
        <NavigationDoctor name={cookies.get("nombre")+' '+cookies.get("apellido")}/>
        <div className="container">
            <div className="row py-5 mt-4 justify-content-center">
   
                <div id="citas" className="col-md-7 col-lg-12 terminos">
                <h2  className="centrar">Calendario de citas</h2>
                <FullCalendar 
                    ref={this.calendarCitas} 
                    
                    initialView="dayGridMonth"
                   
                    nowIndicator={true}
                    expandRows={true}
                    locale="es"
                    plugins={[dayGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: "",
                        center: "",
                        right: ""
                    }}
                 
                    eventClick= {this.pacienteCick}
                    events={this.state.pacientes}
                    eventContent= {(arg) => (
                       
                        <div className="eventPac">{arg.event._def.extendedProps.name} - {arg.timeText}</div>
                         
             
                       )}
                     
                    />
                </div>
<br></br>
                 <div id="horarios" className="col-md-7 col-lg-12 terminos">
                     <h2  className="centrar">Horarios para citas</h2>
                 <FullCalendar 
                    ref={this.calendarHorarios} 
                    dateClick= {this.horario}
                    initialView="timeGridWeek"
                    slotDuration= "01:00:00"
                    dayHeaderFormat={{ weekday: 'short',month: 'numeric', day: 'numeric' }}
                    slotLabelFormat= {[
                        {
                            hour: '2-digit',
                            minute: '2-digit',
                            meridiem: true,
                            hour12: true
                          }
                      ]}
                   
                    slotMinTime="09:00:00"
                    slotMaxTime="23:00:00"
                    allDaySlot={false}
                    slotLabelInterval="01:00:00"
                    nowIndicator={true}
                    expandRows={true}
                    locale="es"
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                   
                    events={this.state.horarios}
                    eventContent= {(arg) => (
                       <div className="centrar">{arg.timeText}</div>
                        
            
                      )}
                    />
                    </div>
               
               

               
            </div>
        </div>
        <Modal className="modalForm" isOpen={this.state.abierto}>
          <ModalHeader>Nuevo horario</ModalHeader>
          <Form onSubmit={this.registrarCita}>
          <ModalBody>
            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                    <Label for="name">Nombre</Label>
                    <Input type="text" id="name" name='name' value={this.state.currentPa.name} disabled/>
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                    <Label for="lastname">Apellido</Label>
                    <Input type="text" id="lastname" name='lastname' value={this.state.currentPa.lastname} disabled/>
                </FormGroup>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                    <Label for="document_type">Documento</Label>
                    <Input className="form-control" type="text" id="document_type" name="document_type" value={this.state.currentPa.document_type} disabled/>
                  
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                    <Label for="document_id">Número de Documento</Label>
                    <Input type="text" id="document_id" name='document_id' value={this.state.currentPa.document_id}disabled/>
                </FormGroup>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                    <Label for="fecha">Fecha</Label>
                    <Input className="form-control" type="text" id="fecha" name="fecha" value={this.state.currentPa.fecha.split(' ')[0]} disabled/>
                  
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                    <Label for="hora">Hora</Label>
                    <Input type="text" id="hora" name='hora' value={this.state.currentPa.fecha.split(' ')[1]} disabled/>
                </FormGroup>
              </div>
            </div>
           
            <FormGroup>
                <Label for="email">Correo</Label>
                <Input type="email" placeholder="ejemplo@mail.com" id="email" name='email' value={this.state.currentPa.email} disabled/>
            </FormGroup>
            <FormGroup>
                <Label for="description">Especificación de síntomas / Comentarios</Label>
                <textarea className="form-control" id="description" rows="3"  value={this.state.currentPa.description} disabled ></textarea>
            </FormGroup>
            <FormGroup>
              <Label for="documents">Documentos</Label>
              <ul>
              
              {this.state.currentPa.documents_urls
            ? this.state.currentPa.documents_urls.map((d,i) => (

                <li  key={i}>{d.split('/')[1]} <a target="_blank" href={'https://teleconsul.org:8000/api/assets/file?path='+d}> Revisar</a></li>
            
              ))
            : 'Loading...'}
            </ul>
            </FormGroup>
            
          
            
          </ModalBody>
          <ModalFooter>
            {this.state.currentPa.ini_url && this.state.currentPa.meeting_state_name!='Iniciada'  ? <Button color="primary"  onClick={this.iniciarMeet}>Iniciar</Button>:""}
            {this.state.currentPa.stop_url && this.state.currentPa.meeting_state_name=='Iniciada'? <Button color="danger"  onClick={this.terminaMeet}>Terminar</Button>:""}
            <Button color="secondary"  onClick={this.switchModal}>Cerrar</Button>
          </ModalFooter>
          </Form>
                        </Modal>

        <Modal className="modalForm" isOpen={this.state.abiertohor}>
          <ModalHeader>Nuevo horario</ModalHeader>
          <ModalBody>¿Desea crear un horario disponible el día {this.state.nuevoHorario.day} a las {this.state.nuevoHorario.hour}?</ModalBody>
          <ModalFooter>
            <Button color="primary"  onClick={this.agregarHorario}>Agregar</Button>
            <Button color="secondary"  onClick={this.switchModalHor}>Cerrar</Button>
          </ModalFooter>
          </Modal>
        </>
        )
    }
   
    pacienteCick = info => {
        var paciente = info.event._def.extendedProps
   // console.log(paciente);
        this.setState({
            currentPa:paciente
          });
        this.switchModal()

    };
    horario = info => {
      var date = info.dateStr.replace('T', ' ').substr(0, 19);
      var dateData = date.split(' ');
      var nowDate = new Date().toISOString().replace('T', ' ').substr(0, 19);
      this.switchModalHor();
      this.setState({nuevoHorario: {
        f_ini:date,
        f_fin: date,
        day: dateData[0],
        hour: dateData[1],
        id_user:cookies.get("id"),
        status:1,
        created_at:nowDate,
        id_document: '0',
        client:'nobody',
      }});
     // console.log(this.state.nuevoHorario);
  };
    switchModal=() => {
        this.setState({abierto: !this.state.abierto});
        this.setState({archivos: [],terminos:false});
    }
    switchModalHor=() => {
      this.setState({abiertohor: !this.state.abiertohor});
  }
    consultaDoctores = () =>{
      
    }
    agregarHorario=() => {
      
      axios.post(urlAddHor,this.state.nuevoHorario).then(response=>{
       this.consultaHorarios();
        this.switchModalHor();
        alert("Horario agregado");
        
      }).catch(error=>{
       // console.log(error.response.data);
          alert("Ocurrió un error al agregar horario");
      });
    }
    consultaHorarios=() => {
      var horarios = [];
      var request ={
        id: cookies.get("id")
      }
      axios.post(urlgetHor,request).then(response=>{
        //console.log(response);
        response.data.map((d, i) => {
            
            horarios[i] = [];
            horarios[i]['start'] = d.f_ini;
            horarios[i]['end'] =  d.f_fin;
            horarios[i]['id'] = d.id;
            horarios[i]['color'] = '#91c788';
        });
        //console.log(horarios);
        this.setState({horarios: horarios})
  
       } ).catch(error=>{
          alert("Ocurrió un error al consultar horarios");
      });
    }
    consultaCitas=() => {
     
      axios.get(urlGetCitas+'/'+cookies.get("id")).then(response=>{
        response.data.map((d, i) => {
            
          d['fecha'] = d.start;

      });
     // console.log( response.data);
        this.setState({pacientes: response.data})
       } ).catch(error=>{
          alert("Ocurrió un error al consultar citas");
      });
    }
    iniciarMeet=() =>{
     var request = {
       url: "'"+this.state.currentPa.ini_url+"'"
     }
     var updateMeet = {
      id: this.state.currentPa.id_meet,
      status: 3
    }
        axios.post('https://teleconsul.org:8000/api/client/inimeet',request).then(response=>{
          window.open(this.state.currentPa.doctor_url, '_blank').focus();
          axios.post('https://teleconsul.org:8000/api/meeting/changestatus',updateMeet).then(response=>{
            //api/meeting/changestatus
            this.consultaCitas();
            this.switchModal();
         } ).catch(error=>{
          // console.log(error.response.data);
            alert("Ocurrió un error al iniciar la consulta");
        });
          window.open(this.state.currentPa.doctor_url, '_blank').focus();
       } ).catch(error=>{
        
      });
    }
    terminaMeet=() =>{
      var request = {
        url: "'"+this.state.currentPa.stop_url+"'"
      }
      var updateMeet = {
        id: this.state.currentPa.id_meet,
        status: 4
      }
        axios.post('https://teleconsul.org:8000/api/client/inimeet',request).then(response=>{
          
          
        alert('Se termino la consulta');
       } ).catch(error=>{
        // console.log(error);
          alert("Ocurrió un error al cerrar la consulta");
      });
      axios.post('https://teleconsul.org:8000/api/meeting/changestatus',updateMeet).then(response=>{
        //api/meeting/changestatus
        this.switchModal();
     } ).catch(error=>{
      // console.log(error.response.data);
        alert("Ocurrió un error al cerrar la consulta");
    });
    }
    
  
  
}
  
  
export default PanelGeneral

