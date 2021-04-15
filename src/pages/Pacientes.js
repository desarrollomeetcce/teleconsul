
import React, { Component } from "react"
import { NavigationDoctor }  from '../components/navigationDoctor'
import DataTable from 'react-data-table-component'
import {Modal,ModalBody,ModalFooter,ModalHeader,Input,Label, FormGroup,Button, Form} from 'reactstrap'
import Cookies from 'universal-cookie'
import Dropzone from 'react-dropzone'

import axios from 'axios'

const cookies = new Cookies()

const urlGetCitas = 'https://teleconsul.org:8000/api/meeting/getstarteddoc'
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

class Pacientes extends Component {
    calendarHorarios = React.createRef()
    calendarCitas = React.createRef()
    
    state = {
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
       this.consultaCitas();
       this.consultaCitasHistorial();
    }
  
    render(){
        return(
          
        <>
          <NavigationDoctor name={cookies.get("nombre")+' '+cookies.get("apellido")}/>
          <div className="container">
            <div className="row py-5 mt-4 justify-content-center">
   
                <div id="activos" className="col-md-7 col-lg-12 terminos">
                  <DataTable
                   
                    columns={columnas}
                    data={this.state.pacientes_activos}
                    title="Pacientes pendientes de receta"
                    pagination
                    fixedHeader
                    fixedHeaderScrollHeight="600px"
                    paginationComponentOptions={pag}
                    onRowClicked={this.pacienteReceta}/>
                </div>
            </div>
            <div className="row py-5 mt-4 justify-content-center">
              
              <div id="historial" className="col-md-7 col-lg-12 terminos">
                <DataTable
                  columns={columnas}
                  data={this.state.pacientes}
                  title="Historial de pacientes"
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
            
            <Button color="secondary"  onClick={this.switchModal}>Cerrar</Button>
          </ModalFooter>
          </Form>
                        </Modal>
        <Modal className="modalForm" isOpen={this.state.abiertoReceta}>
          <ModalHeader>Correo para paciente</ModalHeader>
          <Form onSubmit={this.mandaconsulta}>
          <ModalBody>
            <div className="row">
             
              <div className="col-md-12">
                <FormGroup>
                    <Label for="lastname">Mensaje Correo</Label>
                    <Input type="textarea" id="mensaje" name='mensaje' onChange={this.handleChange}/>
                </FormGroup>
              </div>
            </div>
            <div className="row">
             
             <div className="col-md-12">
               <FormGroup>
                   <Label for="lastname">Receta</Label>
                 
                 
               </FormGroup>
             </div>
           </div>
            <div className="input-group col-lg-12 mb-4">
             
                <Dropzone id="documentos" onDrop={this.revisaArchivo} maxSize={250000} multiple={false}>
                    {({getRootProps, getInputProps}) => (
                    <div {...getRootProps()}  className="dropzone">
                        <input onChange={this.handleChange} {...getInputProps()} />
                        
                        <div> {this.state.documento
                            ? <ul> {this.state.documento.map((archivo, i) => (
                                <li key={i} value={archivo.name} id={archivo.name}>{archivo.name}</li>
                            ))}</ul>
                            : <p>Agrega documentos aquí</p>}</div>
                    </div>
                    
                    )}
                </Dropzone>
               
            </div>
              
          </ModalBody>
          <ModalFooter>
            <Button color="primary"  type="submit">Enviar</Button>
            <Button color="secondary"  onClick={this.switchModalReceta}>Cerrar</Button>
          </ModalFooter>
          </Form>
        </Modal>
        </>
        )
    }
    
    pacienteCick = info => {
      var paciente = info
      this.setState({
          currentPa:paciente
      });
      this.switchModal()
 
    };
    pacienteReceta = info => {
      var paciente = info
      this.setState({
          currentPa:paciente
      });
      this.switchModalReceta()
 
    };
    switchModal=() => {
        this.setState({abierto: !this.state.abierto});
        this.setState({archivos: [],terminos:false});
    }
    switchModalReceta=() => {
      this.setState({abiertoReceta: !this.state.abiertoReceta});
      this.setState({archivos: [],terminos:false});
    }
    consultaCitas=() => {
      var updateMeet = {
        id: cookies.get('id'),
        status: 4
      }
      axios.post(urlGetCitas,updateMeet).then(response=>{
        console.log(response.data);

        this.setState({pacientes_activos: response.data})
       } ).catch(error=>{
          alert("Ocurrió un error al consultar citas");
      });
    }

    consultaCitasHistorial=() => {
      console.log(cookies.get('id'));
      var updateMeet = {
        id:  cookies.get('id'),
        status: '5',
      };

      console.log(updateMeet);
      axios.post(urlGetCitas,updateMeet).then(response=>{
        console.log(response.data);

        this.setState({pacientes: response.data})
       } ).catch(error=>{
          alert("Ocurrió un error al consultar citas");
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
            this.switchModalReceta();
            
        }).catch(function (error) {
            console.log(error.response.data);
            alert("Ocurrio un error al enviar receta");
        });
    }
  
}
  
  
export default Pacientes

