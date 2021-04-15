
import React, { Component } from "react"
import { NavigationAdmin }  from '../components/navigationAdmin'
import DataTable from 'react-data-table-component'
import {Modal,ModalBody,ModalFooter,ModalHeader,Input,Label, FormGroup,Button, Form} from 'reactstrap'
import Cookies from 'universal-cookie'


import axios from 'axios'

const urlPend ='https://teleconsul.org:8000/api/user/pend_users'
const urlUsers ='https://teleconsul.org:8000/api/user/not_pend'
const urlUPdateStatus = 'https://teleconsul.org:8000/api/user/updatestatus'
const urlResetPass = 'https://teleconsul.org:8000/api/user/changedata'

const cookies = new Cookies()

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
    name:'Correo',
    selector: 'email',
    sortable: true
  },
  {
    name:'Estatus',
    selector: 'status_name',
    sortable: true
  },
  {
    name:'Tipo Usuario',
    selector: 'type_name',
    sortable: true
  },
]

const pag= {
 rowsPerPageText: 'Filas por página',
 rangeSeparatorText: 'de',
 selectAllRowsItem: true,
 selectAllRowsItemText: 'Todos'

}

class AdminPanel extends Component {
    calendarHorarios = React.createRef()
    calendarCitas = React.createRef()
    
    state = {
  
      pendientes: [],
      usuarios: [],
        currentPa:{
            nombre: '',
            apellido : '',
            documento : '',
            documentid: '',
            mail : '',
            descripcion : '',

        }
      };

    
    componentDidMount() {
      if(!cookies.get("nombre")){
        window.location.href= './login';
      }
      if(cookies.get("id_doctor")){
        cookies.remove('id_doctor', {path:'/'});
      }
     
      this.consultaPend();
      this.consultaUsuarios();
    }

    consultaPend(){

      axios.post(urlPend).then(response=>{
       
        this.setState({pendientes: response.data});

       } ).catch(error=>{

          alert("Ocurrió un error al consultar doctores pendientes de aprobación");
      });
    }
    consultaUsuarios(){

      axios.post(urlUsers).then(response=>{
      
        this.setState({usuarios: response.data});

       } ).catch(error=>{

          alert("Ocurrió un error al consultar usuarios");
      });
    }
    render(){
        return(
          
        <>
          <NavigationAdmin name={cookies.get("nombre")+' '+cookies.get("apellido")}/>
          <div className="container">
            <div className="row py-5 mt-4 justify-content-center">
   
                <div id="pacientes" className="col-md-7 col-lg-12 terminos">
                  <DataTable
                    columns={columnas}
                    data={this.state.pendientes}
                    title="Aprobaciones pendientes"
                    pagination
                    fixedHeader
                    fixedHeaderScrollHeight="600px"
                    paginationComponentOptions={pag}
                    onRowClicked={this.tableClic}/>
                </div>
            </div>
            <div className="row py-5 mt-4 justify-content-center">
   
                <div id="usuarios" className="col-md-7 col-lg-12 terminos">
                  <DataTable
                    columns={columnas}
                    data={this.state.usuarios}
                    title="Usuarios"
                    pagination
                    fixedHeader
                    fixedHeaderScrollHeight="600px"
                    paginationComponentOptions={pag}
                    onRowClicked={this.tableClic}/>
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
                    <Label for="nombre">Nombre</Label>
                    <Input type="text" id="name" name='name' value={this.state.currentPa.name} disabled/>
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                    <Label for="apellido">Apellido</Label>
                    <Input type="text" id="lastname" name='lastname' value={this.state.currentPa.lastname} disabled/>
                </FormGroup>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                    <Label for="documento">Correo</Label>
                    <Input className="form-control" type="text" id="email" name="email" value={this.state.currentPa.email} disabled/>
                  
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                    <Label for="documentid">Estatus</Label>
                    <Input type="text" id="status_name" name='status_name' value={this.state.currentPa.status_name}disabled/>
                </FormGroup>
              </div>
              
            </div>
          
            <FormGroup>
                <Label for="description">Descripción</Label>
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
           {this.state.currentPa.status == 1? <Button color="primary"  onClick={()=>this.estatusUsuario(2,'aprobado')}>Aprobar</Button>: "" }
           {this.state.currentPa.status == 3? <Button color="primary"  onClick={()=>this.estatusUsuario(2,'activado')}>Activar</Button>: "" }
           {this.state.currentPa.type_user ==2 && this.state.currentPa.status == 2? <Button color="Secondary"  onClick={()=>this.editUser()}>Editar</Button>: "" }
           {this.state.currentPa.status == 2? <Button color="danger"  onClick={()=>this.estatusUsuario(3,'bloqueado')}>Bloquear</Button>: "" }
           {this.state.currentPa.status == 2? <Button color="primary"  onClick={()=>this.resetPass()}>Restaurar Contraseña</Button>: "" }
           
            <Button color="secondary"  onClick={this.switchModal}>Cerrar</Button>
          </ModalFooter>
          </Form>
                        </Modal>
        </>
        )
    }
    
    tableClic = info => {
      var paciente = info
      this.setState({
          currentPa:paciente
      });
      this.switchModal()
      console.log(paciente);
    };

    switchModal=() => {
        this.setState({abierto: !this.state.abierto});
        this.setState({archivos: [],terminos:false});
    }
    estatusUsuario=(estatus,mensaje) => {
        var update = {
          "status": estatus,
          "id": this.state.currentPa.id
        }
        axios.post(urlUPdateStatus,update).then(response=>{
       
            this.consultaPend();
            this.consultaUsuarios();
            alert("Usuario "+response.data.name+' '+mensaje);
            this.switchModal();

         } ).catch(error=>{
  
            alert("Ocurrió un error al aproba doctor");
        });
    }
    resetPass=()=>{
        var update = {
          "id": this.state.currentPa.id,
          "name": this.state.currentPa.name,
          "lastname": this.state.currentPa.lastname,
          "email": this.state.currentPa.email,
          "password" : "teleconsul$$"
        }
        console.log(update);
        
        axios.post(urlResetPass,update).then(response=>{
      
            this.consultaPend();
            this.consultaUsuarios();
            alert("Se restauró la constraseña del usuario "+response.data.name+' ');
            this.switchModal();

        } ).catch(error=>{

            alert("Ocurrió un error al restaurar contraseña");
        });
    }
    editUser = () =>{
      cookies.set('id_doctor',this.state.currentPa.id,{path:'/'});
      window.location.href= './doctorUser';

    }
  
}
  
  
export default AdminPanel

