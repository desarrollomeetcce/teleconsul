import React, { Component } from "react"
import { NavigationAdmin }  from '../components/navigationAdmin'

import Dropzone from 'react-dropzone'
import axios from 'axios'
import {Form} from 'reactstrap'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

const urlAdd = 'https://teleconsul.org:8000/api/user/addadmin'
class AddUser extends Component {
    state = {
        admininfo:{
           
        },
        archivos: [],
        terminos:false,
    }
    componentDidMount() {
        if(!cookies.get("nombre")){
          window.location.href= './login';
        }
        if(cookies.get("type_user")!=1){
            window.location.href= './login';
          }
        if(cookies.get("id_doctor")){
            cookies.remove('id_doctor', {path:'/'});
        }
      }
    registraAdmin=(event) => {
        event.preventDefault();
        axios.post(urlAdd,this.state.admininfo).then(response=>{
       
                alert("Usuario registrado");
                window.location.href= './adminPanel';
           } ).catch(error=>{
            console.log(error.response.data);
              alert("Ocurrió un error al registrar usuario");
          });
       
     
    }


    handleChange = async e =>{
        e.persist();
        await this.setState({
        
            admininfo:{
                ...this.state.admininfo,
                [e.target.name]: e.target.value,
            },
         
    
        });
      }
    
    render(){
        return(
          
        <>
        <NavigationAdmin name={cookies.get("nombre")+' '+cookies.get("apellido")}/>
        <div className="container ">
            <div className="row py-5 mt-4 align-items-center ">
              
                
        
                
                <div className="col-md-12 col-lg-12 ">
                   <Form  onSubmit={this.registraAdmin}> 
                        <h3>Agregar usuario</h3>
                        <br></br>
                        <div className="row">
        
                           
                            <div className="input-group col-lg-6 mb-4">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-white px-4 border-md border-right-0">
                                        <i className="fa fa-user text-muted"></i>
                                    </span>
                                </div>
                                <input onChange={this.handleChange} id="name" type="text" name="name" placeholder="Nombre" className="form-control bg-white border-left-0 border-md"/>
                            </div>
        
                            
                            <div className="input-group col-lg-6 mb-4">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-white px-4 border-md border-right-0">
                                        <i className="fa fa-user text-muted"></i>
                                    </span>
                                </div>
                                <input onChange={this.handleChange} id="lastName" type="text" name="lastname" placeholder="Apellidos" className="form-control bg-white border-left-0 border-md"/>
                            </div>
        
                          
                            <div className="input-group col-lg-12 mb-4">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-white px-4 border-md border-right-0">
                                        <i className="fa fa-envelope text-muted"></i>
                                    </span>
                                </div>
                                <input onChange={this.handleChange} id="email" type="email" name="email" placeholder="Correo" className="form-control bg-white border-left-0 border-md"/>
                            </div>
        

                            <div className="input-group col-lg-12 mb-4">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-white px-4 border-md border-right-0">
                                        <i className="fa fa-lock text-muted"></i>
                                    </span>
                                </div>
                                <input onChange={this.handleChange} id="password" type="password" name="password" placeholder="Password" className="form-control bg-white border-left-0 border-md"/>
                            </div>
                           
                            
                         
                          
                            <div className="form-group col-lg-12 mx-auto mb-0">
                             
                                    <button type="submit" className="btn btn-primary btn-block py-2">
                                        <span className="font-weight-bold">Agregar usuario</span>
                                    </button>
                            </div>
   
                        </div>
                    </Form>
                </div>
            </div>
        </div>
        </>
        )
    }
  
}
  
  
export default AddUser