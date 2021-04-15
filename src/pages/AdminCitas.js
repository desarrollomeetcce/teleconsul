
import React, { Component } from "react"
import { NavigationAdmin }  from '../components/navigationAdmin'
import DataTable from 'react-data-table-component'
import {Modal,ModalBody,ModalFooter,ModalHeader,Input,Label, FormGroup,Button, Form} from 'reactstrap'
import Cookies from 'universal-cookie'


import axios from 'axios'

const cookies = new Cookies()

const urlGetCitas = 'https://teleconsul.org:8000/api/meeting/getstarted'
const url = 'https://teleconsul.org:8000/api/meeting/changestatus'

const columnas = [
  {
    name:'Nombre',
    selector: 'name',
    sortable: true
  },
  {
    name:'Apellido',
    selector: 'lastname',
    sortable: true
  },
  {
    name:'Fecha cita',
    selector: 'start',
    sortable: true
  },
  {
    name:'Correo',
    selector: 'email',
    sortable: true
  },
  {
    name:'Estatus',
    selector: 'meeting_state_name',
    sortable: true
  },
]

const pag= {
 rowsPerPageText: 'Filas por página',
 rangeSeparatorText: 'de',
 selectAllRowsItem: true,
 selectAllRowsItemText: 'Todos'

}

class Citas extends Component {
    calendarHorarios = React.createRef()
    calendarCitas = React.createRef()
    
    state = {
        historial: [],
        pacientes_activos: [],
        pacientes: [
           
        ],
        currentPa:{
            nombre: '',
            apellido : '',
            documento : '',
            documentid: '',
            mail : '',
            descripcion : '',
            start:'',
            id_meet:'',
            doctor_name:'',
            doctor_lastname:'',
            meeting_state_name: '',
            ini_url:'',
            stop_url:'',
        },
        receta:{
          mensaje:'',
         
        },
        documento: []
      };

    handleChange = async e =>{
        e.persist();
        await this.setState({
        
          receta:{
                ...this.state.doctorinfo,
                [e.target.name]: e.target.value,
            },
         
    
        });
      
    }
    revisaArchivo=(files,rejectedFiles) => {
      this.setState({documento: files});
      if(rejectedFiles.length > 0){
          alert("El archivo es demasiado pesado");
      }
    }
    componentDidMount() {
      if(!cookies.get("nombre")){
        window.location.href= './login';
      }
      if(cookies.get("type_user")!=1){
        window.location.href= './login';
      }
       this.consultaCitas();
       this.consultaCitasHistorial();
       this.consultaCitasHistorial2();
    }
  
    render(){
        return(
          
        <>
        <NavigationAdmin name={cookies.get("nombre")+' '+cookies.get("apellido")}/>
          <div className="container">
            <div className="row py-5 mt-4 justify-content-center">
   
                <div id="activos" className="col-md-7 col-lg-12 terminos">
                  <DataTable
                   
                    columns={columnas}
                    data={this.state.pacientes_activos}
                    title="Salas activas"
                    pagination
                    fixedHeader
                    fixedHeaderScrollHeight="600px"
                    paginationComponentOptions={pag}
                    onRowClicked={this.pacienteCick}/>
                </div>
            </div>
            <div className="row py-5 mt-4 justify-content-center">
              
              <div id="Pendientes" className="col-md-7 col-lg-12 terminos">
                <DataTable
                  columns={columnas}
                  data={this.state.pacientes}
                  title="Citas Pendientes"
                  pagination
                  fixedHeader
                  fixedHeaderScrollHeight="600px"
                  paginationComponentOptions={pag}
                  onRowClicked={this.pacienteCick}/>
              </div>
            </div>
            <div className="row py-5 mt-4 justify-content-center">
              
              <div id="historial" className="col-md-7 col-lg-12 terminos">
                <DataTable
                  columns={columnas}
                  data={this.state.historial}
                  title="Citas Historial"
                  pagination
                  fixedHeader
                  fixedHeaderScrollHeight="600px"
                  paginationComponentOptions={pag}
                  onRowClicked={this.pacienteCick}/>
              </div>
            </div>
          </div>
          <Modal className="modalForm" isOpen={this.state.abierto}>
          <ModalHeader>Cita</ModalHeader>
          <Form onSubmit={this.registrarCita}>
          <ModalBody>
            <FormGroup>
                <Label for="doctor_name">Doctor</Label>
                <Input type="doctor_name" placeholder="ejemplo@mail.com" id="doctor_name" name='doctor_name' value={this.state.currentPa.doctor_name+' '+this.state.currentPa.doctor_lastname} disabled/>
            </FormGroup>
            <FormGroup>
                <Label for="doctor_name">Paciente</Label>
                <Input type="doctor_name" placeholder="ejemplo@mail.com" id="doctor_name" name='doctor_name' value={this.state.currentPa.name+' '+this.state.currentPa.lastname} disabled/>
            </FormGroup>
          
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
                    <Input className="form-control" type="text" id="fecha" name="fecha" value={this.state.currentPa.start.split(' ')[0]} disabled/>
                  
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                    <Label for="hora">Hora</Label>
                    <Input type="text" id="hora" name='hora' value={this.state.currentPa.start.split(' ')[1]} disabled/>
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
          {this.state.currentPa.ini_url && this.state.currentPa.meeting_state_name=='Iniciada'  ? <Button color="primary"  onClick={this.iniciarMeet}>Unirse</Button>:""}
            {this.state.currentPa.stop_url && this.state.currentPa.meeting_state_name=='Iniciada'? <Button color="danger"  onClick={this.terminaMeet}>Terminar</Button>:""}
            <Button color="secondary"  onClick={this.switchModal}>Cerrar</Button>
          </ModalFooter>
          </Form>
                        </Modal>
       
        </>
        )
    }
    
  
    switchModal=() => {
        this.setState({abierto: !this.state.abierto});
        this.setState({archivos: [],terminos:false});
    }
   
    consultaCitas=() => {
      var updateMeet = {
        id: cookies.get('id'),
        status: 3
      }
      axios.post(urlGetCitas,updateMeet).then(response=>{
       // console.log(response.data);

        this.setState({pacientes_activos: response.data})
       } ).catch(error=>{
          alert("Ocurrió un error al consultar citas");
      });
    }

    consultaCitasHistorial=() => {
     // console.log(cookies.get('id'));
      var updateMeet = {
        status: '4',
      };

     // console.log(updateMeet);
      axios.post(urlGetCitas,updateMeet).then(response=>{
       // console.log(response.data);

        this.setState({pacientes: response.data})
       } ).catch(error=>{
          alert("Ocurrió un error al consultar citas");
      });
    }
    consultaCitasHistorial2=() => {
      //console.log(cookies.get('id'));
      var updateMeet = {
        status: '5',
      };

     // console.log(updateMeet);
      axios.post(urlGetCitas,updateMeet).then(response=>{
        //console.log(response.data);

        this.setState({historial: response.data})
       } ).catch(error=>{
          alert("Ocurrió un error al consultar historial");
      });
    }


    mandaconsulta=(event) => {
        event.preventDefault();

        let fd = new FormData();
        var docs = this.state.documento;
        docs.map((doc) => {
            fd.append('documents[]',doc);
        });
        fd.append('mensaje',this.state.receta.mensaje);
        fd.append('id',this.state.currentPa.id_meet);
        fd.append('status','5');

        axios.post(url, fd, {headers: {

            'Content-Type': 'multipart/form-data; boundary=${data._boundary}',
          }}).then(response=>{
          
            alert("Se envio la receta al paciente");

            
        }).catch(function (error) {
           // console.log(error.response.data);
            alert("Ocurrio un error al enviar receta");
        });
    }
    pacienteCick = info => {
      var paciente = info
      this.setState({
          currentPa:paciente
      });
      this.switchModal()
 
    };
    iniciarMeet=() =>{
   
       window.open(this.state.currentPa.doctor_url, '_blank').focus();
         
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
  
  
export default Citas

