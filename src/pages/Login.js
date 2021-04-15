import React, { Component } from "react"
import { Navigation }  from '../components/navigation'
import axios from 'axios'
import {Form} from 'reactstrap'

import Cookies from 'universal-cookie'
const url ='https://teleconsul.org:8000/api/user/login'

const cookies = new Cookies()
class Login extends Component {
    
    state = {
        username: '',
       password: '',
    }
    checkLogin=(event) => {
        event.preventDefault();

        var data  = {
            mail: this.state.username,
            password: this.state.password,
        };
        axios.post(url,data).then(response=>{
           if(response.data.length > 0){
                //window.location.href= './panelGeneral';
                cookies.set('nombre', response.data[0].name,{path:'/'});
                cookies.set('apellido', response.data[0].lastname,{path:'/'});
                cookies.set('correo', response.data[0].email,{path:'/'});
                cookies.set('id', response.data[0].id,{path:'/'});
                cookies.set('user', response.data[0].email,{path:'/'});
                cookies.set('especialidad', response.data[0].speciality,{path:'/'});
                cookies.set('telefono', response.data[0].phone,{path:'/'});
                cookies.set('document_type', response.data[0].document_type,{path:'/'});
                cookies.set('document_id', response.data[0].document_id,{path:'/'});
                cookies.set('description', response.data[0].description,{path:'/'});
                

                if( response.data[0].type_user== 1){
                    window.location.href= './adminPanel';
                }
                if( response.data[0].type_user== 2){
                   
                    window.location.href= './panelPrincipal';
                }
           }else{
                console.log(response);
                alert("Usuario o contraseña incorrectos");
           }
           this.setState({password:''});
            
        }).catch(function (error) {
            console.log(error.response.data);
            alert("Ocurrio un error al registrar el usuario");
            window.location.href= './';
        });
    }

    handleChange = async e =>{
        e.persist();
        await this.setState({
            [e.target.name]: e.target.value,
    
        });
       
       
    }

    componentDidMount() {
       
        if(cookies.get("nombre")){
            cookies.remove('nombre',{path:'/'});
            cookies.remove('apellido',{path:'/'});
            cookies.remove('correo',{path:'/'});
            cookies.remove('id',{path:'/'});
            cookies.remove('especialidad',{path:'/'});
            cookies.remove('telefono',{path:'/'});
            cookies.remove('document_type',{path:'/'});
            cookies.remove('document_id', {path:'/'});
            cookies.remove('description', {path:'/'});
            cookies.remove('id_doctor', {path:'/'});
        }
      }
   
    render(){
        return(
          
        <>
        <Navigation />
        <div className="container">
            <div className="row py-5 mt-4 justify-content-center">
              
              
        
                
                <div className="col-md-7 col-lg-6 login">
                    <div className="align-items-center">
                    <h2>Bienvenido</h2>
                    </div>
                    <br>
                    </br>
                    <Form  onSubmit={this.checkLogin} autocomplete="on">
                    
                        <div className="row">
        
                          
                          
                            <div className="input-group col-lg-12 mb-4">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-white px-4 border-md border-right-0">
                                        <i className="fa fa-envelope text-muted"></i>
                                    </span>
                                </div>
                                <input onChange={this.handleChange} id="username" type="text" name="username" placeholder="Correo" className="form-control bg-white border-left-0 border-md"/>
                            </div>
        
                         
                         
                           
                          
        
                            
                            <div className="input-group col-lg-12 mb-4">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-white px-4 border-md border-right-0">
                                        <i className="fa fa-lock text-muted"></i>
                                    </span>
                                </div>
                                <input onChange={this.handleChange} id="password" type="password" name="password" placeholder="Contraseña" className="form-control bg-white border-left-0 border-md"/>
                            </div>
        
                           
                           
                            <div className="form-group col-lg-12 mx-auto mb-0">
                                <button type="submit" className="btn btn-primary btn-block py-2">
                                  <label>Entrar</label>
                                </button>
                            </div>
                            <div className="form-group col-lg-12 mx-auto d-flex align-items-center my-4">
                                <div className="border-bottom w-100 ml-5"></div>
                                <span className="px-2 small text-muted font-weight-bold text-muted">OR</span>
                                <div className="border-bottom w-100 mr-5"></div>
                            </div>
        
                           
                            
        
                         
                            <div className="text-center w-100">
                                <p className="text-muted font-weight-bold">¿No tienes cuenta? <a href="/register" className="text-primary ml-2">registrate</a></p>
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
  
  
export default Login
