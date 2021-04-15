import React, { Component } from "react"
import { Navigation }  from '../components/navigation'
import axios from 'axios'
import queryString from 'query-string'

const url ='https://teleconsul.org:8000/api/user/login'


class CancelMeet extends Component {
   
    checkLogin=(event) => {
        event.preventDefault();

        var data  = {
            mail: this.state.username,
            password: this.state.password,
        };
        axios.post(url,data).then(response=>{
           
          
            
        }).catch(function (error) {
            console.log(error.response.data);
            alert("Ocurrio un error al cancelar cita");
            window.location.href= './';
        });
    }

   

    componentDidMount() {
        const values = queryString.parse(this.props.location.search)
        if(values.length == 0){
            alert("Ocurrio un error al cancelar cita");
            window.location.href= './';
        }else{
            console.log(typeof(values.token));
            if(typeof(values.token) != 'undefined'){

            }else{
                alert("Ocurrio un error al cancelar cita");
                window.location.href= './';
            }
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
                        <h2>Su cita ha sido cancelada</h2>
                    </div>
                    
                </div>
            </div>
        </div>
        </>
        )
    }
  
}
  
  
export default CancelMeet
