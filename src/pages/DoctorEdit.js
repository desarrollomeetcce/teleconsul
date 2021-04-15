import React, { Component } from "react"
import { NavigationAdmin }  from '../components/navigationAdmin'

import Dropzone from 'react-dropzone'
import axios from 'axios'
import {Form} from 'reactstrap'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

const urlAdd = 'https://teleconsul.org:8000/api/user/changedata'
const getDoctor = 'https://teleconsul.org:8000/api/user/getdoctorinfo'

class UserInfo extends Component {
    revisaArchivo=(files,rejectedFiles) => {
        this.setState({userinfo:{
            ...this.state.userinfo,
           documents:files,
        },});
        if(rejectedFiles.length > 0){
            alert("El archivo es demasiado pesado");
        }
      }
    state = {
        userinfo:{
           name: '...',
           lastname:'...',
           email: '...',
           speciality: '...',
           phone: '...',
           document_type:'...',
           document_id:'...',
           password:'...',
           description:'...',
           documents: [],
        },

    }
    componentDidMount() {
        if(!cookies.get("nombre")){
          window.location.href= './login';
          
        }
        if(cookies.get("id_doctor")){
            console.log("Busca doctor");
          this.getDoctorInfo();
        }else{
            this.setState({userinfo:{
                name: '',
                lastname:'',
                email: '',
                speciality: '',
                phone: '',
                document_type:'DNI',
                document_id:'',
                password:'',
                description:'',
                documents: [],
             }});
        }
        console.log(this.state.userinfo);
      }
    registraAdmin=(event) => {
        event.preventDefault();

        var request = this.state.userinfo;
        let fd = new FormData();
        var docs = this.state.userinfo.documents;
        if(docs.length!=0){
            docs.map((doc) => {
                fd.append('documents[]',doc);
            });
        }else{
            fd.append('documents',this.state.userinfo.documents);
        }
        if(request.id){
            fd.append('id',request.id);
            console.log("tiene id");
        }
       
        fd.append('name',request.name);
        fd.append('lastname',request.lastname);
        fd.append('email',request.email);

        fd.append('document_type',request.document_type);
        fd.append('document_id',request.document_id);
        fd.append('phone',request.phone);
        fd.append('psasword',request.password);
        fd.append('speciality',request.speciality);
        fd.append('description',request.description);
 
        axios.post(urlAdd,fd, {headers: {

            'Content-Type': 'multipart/form-data; boundary=${data._boundary}',
          }}).then(response=>{
            if(cookies.get("id_doctor")){
                alert("Datos actualizados");
                window.location.href= './adminPanel';
            }else{
                alert("Doctor agregado");
                window.location.href= './adminPanel';
            }
               
  
           } ).catch(error=>{
                console.log(error.response.data);
              alert("Ocurrió un error al actualizar usuario");
          });
       
     
    }

    getDoctorInfo =async () => {
        var request = {
            id:cookies.get("id_doctor")
        }
        axios.post(getDoctor,request).then(response=>{
              console.log(response.data[0]);
              this.setState({
        
                userinfo:{
                    ...this.state.userinfo,
                    id:response.data[0].id,
                    name:response.data[0].name,
                    lastname:response.data[0].lastname,
                    email:response.data[0].email,
                    speciality:response.data[0].speciality,
                    phone:response.data[0].phone,
                    document_type:response.data[0].document_type,
                    document_id:response.data[0].document_id,
                    description:response.data[0].description,
                    
                },
             
        
            });
           
              //  this.setState({userinfo: response.data[0]});
             
           } ).catch(error=>{
                console.log(error.response.data);
              alert("Ocurrió un error al consultar usuario");
          });
    }


    handleChange = async e =>{
        e.persist();
        await this.setState({
        
            userinfo:{
                ...this.state.userinfo,
                [e.target.name]: e.target.value,
            },
         
    
        });
        console.log(this.state.userinfo);
      }
    
    render(){
        return(
          
        <>
        <NavigationAdmin name={cookies.get("nombre")+' '+cookies.get("apellido")}/>
        <div className="container ">
            <div className="row py-5 mt-4 align-items-center ">
              
                
        
                
                <div className="col-md-12 col-lg-12 ">
                   <Form  onSubmit={this.registraAdmin}> 
                        <h3>{cookies.get("id_doctor") ? "Actualizar perfil":"Agregar Doctor"}</h3>
                        <br></br>
                        <div className="row">
        
                           
                            <div className="input-group col-lg-6 mb-4">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-white px-4 border-md border-right-0">
                                        <i className="fa fa-user text-muted"></i>
                                    </span>
                                </div>
                                <input  value={this.state.userinfo.name} onChange={this.handleChange} id="name" type="text" name="name" placeholder="Nombre" className="form-control bg-white border-left-0 border-md"/>
                            </div>
        
                            
                            <div className="input-group col-lg-6 mb-4">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-white px-4 border-md border-right-0">
                                        <i className="fa fa-user text-muted"></i>
                                    </span>
                                </div>
                                <input value={this.state.userinfo.lastname}  onChange={this.handleChange} id="lastName" type="text" name="lastname" placeholder="Apellidos" className="form-control bg-white border-left-0 border-md"/>
                            </div>
                            <div className="input-group col-lg-12 mb-4">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-white px-4 border-md border-right-0">
                                        <i className="fa fa-id-card-o text-muted"></i>
                                    </span>
                                </div>
                                <select value={this.state.userinfo.document_type} onChange={this.handleChange} id="document_type" name="document_type" className="custom-select form-control bg-white border-left-0 border-md h-100 font-weight-bold text-muted">
                                    <option value="DNI" >DNI</option>
                                    <option value="Pasaporte">Pasaporte</option>
                                    <option value="Carnet">Carnet de extranjería</option>
                                </select>
                                <input value={this.state.userinfo.document_id} onChange={this.handleChange} id="document_id"  name="document_id" placeholder="Número de docmuento" className="form-control bg-white border-md border-left-0 pl-3"/>
                            </div>
                          
                            <div className="input-group col-lg-12 mb-4">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-white px-4 border-md border-right-0">
                                        <i className="fa fa-envelope text-muted"></i>
                                    </span>
                                </div>
                                <input value={this.state.userinfo.email} onChange={this.handleChange} id="email" type="email" name="email" placeholder="Correo" className="form-control bg-white border-left-0 border-md"/>
                            </div>
                            <div className="input-group col-lg-12 mb-4">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-white px-4 border-md border-right-0">
                                        <i className="fa fa-phone-square text-muted"></i>
                                    </span>
                                </div>
                             
                                <input value={this.state.userinfo.phone} onChange={this.handleChange} id="phone" type="tel" name="phone" placeholder="Teléfono" className="form-control bg-white border-left-0 border-md"/>
                            </div>
                            <div className="input-group col-lg-12 mb-4">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-white px-4 border-md border-right-0">
                                        <i className="fa fa-black-tie text-muted"></i>
                                    </span>
                                </div>
                                <select value={this.state.userinfo.speciality} onChange={this.handleChange} id="speciality" name="speciality" className="form-control custom-select bg-white border-left-0 border-md">
                                <option value="0">Especialidad*</option>
                                    <option value="1" className="text-capitalize">ADMINISTRACION DE HOSPITALES</option>
                                    <option value="2" className="text-capitalize">ADMINISTRACION DE SALUD</option>
                                    <option value="3" className="text-capitalize">ADMINISTRACION Y GESTION EN SALUD</option>
                                    <option value="4" className="text-capitalize">ADOLESCENTOLOGIA</option>
                                    <option value="5" className="text-capitalize">ALERGIA E INMULOGIA CLINICA PEDIATRICA</option>
                                    <option value="6" className="text-capitalize">ALERGIA E INMUNOPATOLOGIA</option>
                                    <option value="7" className="text-capitalize">ALERGOLOGIA</option>
                                    <option value="8" className="text-capitalize">ANALISIS CLINICO</option>
                                    <option value="9" className="text-capitalize">ANATOMIA HUMANA</option>
                                    <option value="10" className="text-capitalize">ANATOMIA PATOLOGICA</option>
                                    <option value="11" className="text-capitalize">ANATOMIA PATOLOGICA - PATOLOGIA CLINICA</option>
                                    <option value="12" className="text-capitalize">ANATOMIA PATOLOGICA Y LABORATORIO</option>
                                    <option value="13" className="text-capitalize">ANESTESIA, ANALGESIA Y REANIMACION</option>
                                    <option value="14" className="text-capitalize">ANESTESIOLOGIA</option>
                                    <option value="15" className="text-capitalize">ANESTESIOLOGIA CARDIOVASCULAR</option>
                                    <option value="16" className="text-capitalize">ANESTESIOLOGIA OBSTETRICA</option>
                                    <option value="17" className="text-capitalize">ANESTESIOLOGIA Y CUIDADOS INTENSIVOS</option>
                                    <option value="18" className="text-capitalize">ANESTESIOLOGIA Y TERAPIA INTENSIVA CARDIOVASCULAR</option>
                                    <option value="19" className="text-capitalize">ANGIOLOGIA</option>
                                    <option value="20" className="text-capitalize">APARATO DIGESTIVO</option>
                                    <option value="21" className="text-capitalize">ARTROSCOPIA Y CIRUGIA DE RODILLA</option>
                                    <option value="22" className="text-capitalize">BIOQUIMICA</option>
                                    <option value="23" className="text-capitalize">CARDIOLOGIA</option>
                                    <option value="24" className="text-capitalize">CARDIOLOGIA INFANTIL</option>
                                    <option value="25" className="text-capitalize">CIRUGIA</option>
                                    <option value="26" className="text-capitalize">CIRUGIA CARDIOVASCULAR</option>
                                    <option value="27" className="text-capitalize">CIRUGIA CARDIOVASCULAR PEDIATRICA</option>
                                    <option value="28" className="text-capitalize">CIRUGIA COLORRECTAL</option>
                                    <option value="29" className="text-capitalize">CIRUGIA CRANEOMAXILOFACIAL</option>
                                    <option value="30" className="text-capitalize">CIRUGIA DE CABEZA Y CUELLO</option>
                                    <option value="31" className="text-capitalize">CIRUGIA DE CABEZA, CUELLO Y MAXILOFACIAL</option>
                                    <option value="32" className="text-capitalize">CIRUGIA DE LA RODILLA</option>
                                    <option value="33" className="text-capitalize">CIRUGIA DE MANO</option>
                                    <option value="34" className="text-capitalize">CIRUGIA DE TORAX</option>
                                    <option value="35" className="text-capitalize">CIRUGIA DEL APARATO DIGESTIVO</option>
                                    <option value="36" className="text-capitalize">CIRUGIA ENDOSCOPICA GINECOLOGICA</option>
                                    <option value="37" className="text-capitalize">CIRUGIA GASTROENTEROLOGICA</option>
                                    <option value="38" className="text-capitalize">CIRUGIA GENERAL</option>
                                    <option value="39" className="text-capitalize">CIRUGIA GENERAL Y ONCOLOGICA</option>
                                    <option value="40" className="text-capitalize">CIRUGIA HEPATOPANCREATOBILIAR Y TRANSPLANTE</option>
                                    <option value="41" className="text-capitalize">CIRUGIA HOSPITALARIA</option>
                                    <option value="42" className="text-capitalize">CIRUGIA NEUMOLOGICA</option>
                                    <option value="43" className="text-capitalize">CIRUGIA ONCOLOGICA</option>
                                    <option value="44" className="text-capitalize">CIRUGIA ONCOLOGICA ABDOMINAL</option>
                                    <option value="45" className="text-capitalize">CIRUGIA ONCOLOGICA DE CABEZA Y CUELLO</option>
                                    <option value="46" className="text-capitalize">CIRUGIA ONCOLOGICA DE MAMAS, TEJIDOS BLANDOS Y PIEL</option>
                                    <option value="47" className="text-capitalize">CIRUGIA ORTOPEDICA Y TRAUMATOLOGIA</option>
                                    <option value="48" className="text-capitalize">CIRUGIA PEDIATRICA</option>
                                    <option value="49" className="text-capitalize">CIRUGIA PLASTICA</option>
                                    <option value="50" className="text-capitalize">CIRUGIA PLASTICA FACIAL</option>
                                    <option value="51" className="text-capitalize">CIRUGIA PLASTICA Y CAUMATOLOGIA</option>
                                    <option value="52" className="text-capitalize">CIRUGIA PLASTICA Y RECONSTRUCTIVA</option>
                                    <option value="53" className="text-capitalize">CIRUGIA PLASTICA Y REPARADORA</option>
                                    <option value="54" className="text-capitalize">CIRUGIA PLASTICA Y REPARADORA DE MANO</option>
                                    <option value="55" className="text-capitalize">CIRUGIA PLASTICA, RECONSTRUCTIVA Y ESTETICA</option>
                                    <option value="56" className="text-capitalize">CIRUGIA PLASTICA, RECONSTRUCTIVA, ESTETICA Y MAXILO FACIAL</option>
                                    <option value="57" className="text-capitalize">CIRUGIA TORACICA Y CARDIOVASCULAR</option>
                                    <option value="58" className="text-capitalize">CIRUGIA VASCULAR PERIFERICA</option>
                                    <option value="59" className="text-capitalize">CIRUGIA VASCULAR Y ANGIOLOGIA</option>
                                    <option value="60" className="text-capitalize">CIRUGIA, TRANSPLANTOLOGIA Y ANDROLOGIA</option>
                                    <option value="61" className="text-capitalize">DERMATOLOGIA</option>
                                    <option value="62" className="text-capitalize">DERMATOLOGIA PEDIATRICA</option>
                                    <option value="63" className="text-capitalize">DERMATOLOGIA Y VENEREOLOGIA</option>
                                    <option value="64" className="text-capitalize">DIAGNOSTICO POR IMAGENES</option>
                                    <option value="65" className="text-capitalize">EMBRIOLOGIA</option>
                                    <option value="66" className="text-capitalize">EMERGENCIAS Y DESASTRES</option>
                                    <option value="67" className="text-capitalize">ENDOCRINOLOGIA</option>
                                    <option value="68" className="text-capitalize">ENDOCRINOLOGIA PEDIATRICA</option>
                                    <option value="69" className="text-capitalize">ENDOCRINOLOGIA PEDIATRICA Y GENETICA</option>
                                    <option value="70" className="text-capitalize">ENDOCRINOLOGIA Y NUTRICION</option>
                                    <option value="71" className="text-capitalize">ENFERMEDADES INFECCIOSAS</option>
                                    <option value="72" className="text-capitalize">ENFERMEDADES INFECCIOSAS Y TROPICALES</option>
                                    <option value="73" className="text-capitalize">EPIDEMIOLOGIA</option>
                                    <option value="74" className="text-capitalize">EPIDEMIOLOGIA DE CAMPO</option>
                                    <option value="75" className="text-capitalize">FARMACOLOGIA</option>
                                    <option value="76" className="text-capitalize">FISIOLOGIA</option>
                                    <option value="77" className="text-capitalize">FLEBOLOGIA Y LINFOLOGIA</option>
                                    <option value="78" className="text-capitalize">GASTROENTEROLOGIA</option>
                                    <option value="79" className="text-capitalize">GASTROENTEROLOGIA PEDIATRICA</option>
                                    <option value="80" className="text-capitalize">GENETICA</option>
                                    <option value="81" className="text-capitalize">GENETICA MEDICA</option>
                                    <option value="82" className="text-capitalize">GERENCIA DE LA SALUD OCUPACIONAL</option>
                                    <option value="83" className="text-capitalize">GERIATRIA</option>
                                    <option value="84" className="text-capitalize">GESTION EN SALUD</option>
                                    <option value="85" className="text-capitalize">GINECOLOGIA DE LA NIÑA Y ADOLESCENTE</option>
                                    <option value="86" className="text-capitalize">GINECOLOGIA ONCOLOGICA</option>
                                    <option value="87" className="text-capitalize">GINECOLOGIA Y OBSTETRICIA</option>
                                    <option value="88" className="text-capitalize">HEMATOLOGIA</option>
                                    <option value="89" className="text-capitalize">HEMATOLOGIA CLINICA</option>
                                    <option value="90" className="text-capitalize">HEMATOLOGIA PEDIATRICA</option>
                                    <option value="91" className="text-capitalize">HEMATOLOGIA Y HEMOTERAPIA</option>
                                    <option value="92" className="text-capitalize">HEPATOLOGIA</option>
                                    <option value="93" className="text-capitalize">HISTOLOGIA</option>
                                    <option value="94" className="text-capitalize">HISTOPATOLOGIA</option>
                                    <option value="95" className="text-capitalize">INFECTOLOGIA</option>
                                    <option value="96" className="text-capitalize">INFECTOLOGIA PEDIATRICA</option>
                                    <option value="97" className="text-capitalize">INMUNOLOGIA</option>
                                    <option value="98" className="text-capitalize">INMUNOLOGIA CLINICA Y ALERGOLOGIA</option>
                                    <option value="99" className="text-capitalize">INMUNOLOGIA Y ALERGIA</option>
                                    <option value="100" className="text-capitalize">INMUNOLOGIA Y REUMATOLOGIA</option>
                                    <option value="101" className="text-capitalize">LABORATORIO CLINICO</option>
                                    <option value="102" className="text-capitalize">LABORATORIO CLINICO Y ANATOMIA PATOLOGICA</option>
                                    <option value="103" className="text-capitalize">MEDICINA AEROESPACIAL</option>
                                    <option value="104" className="text-capitalize">MEDICINA CRITICA</option>
                                    <option value="105" className="text-capitalize">MEDICINA CRITICA DE ADULTO</option>
                                    <option value="106" className="text-capitalize">MEDICINA CRITICA Y TERAPIA INTENSIVA</option>
                                    <option value="107" className="text-capitalize">MEDICINA DE EMERGENCIAS Y DESASTRES</option>
                                    <option value="108" className="text-capitalize">MEDICINA DE ENFERMEDADES INFECCIOSAS Y TROPICALES</option>
                                    <option value="109" className="text-capitalize">MEDICINA DE REHABILITACION</option>
                                    <option value="110" className="text-capitalize">MEDICINA DEL DEPORTE</option>
                                    <option value="111" className="text-capitalize">MEDICINA DEL TRABAJO</option>
                                    <option value="112" className="text-capitalize">MEDICINA FAMILIAR</option>
                                    <option value="113" className="text-capitalize">MEDICINA FAMILIAR Y COMUNITARIA</option>
                                    <option value="114" className="text-capitalize">MEDICINA FAMILIAR Y SALUD COMUNITARIA</option>
                                    <option value="115" className="text-capitalize">MEDICINA FISICA Y REHABILITACION</option>
                                    <option value="116" className="text-capitalize">MEDICINA GENERAL INTEGRAL</option>
                                    <option value="117" className="text-capitalize">MEDICINA GENERAL Y ONCOLOGICA</option>
                                    <option value="118" className="text-capitalize">MEDICINA HIPERBARICA Y SUBACUATICA</option>
                                    <option value="119" className="text-capitalize">MEDICINA INTEGRAL Y GESTION EN SALUD</option>
                                    <option value="120" className="text-capitalize">MEDICINA INTENSIVA</option>
                                    <option value="121" className="text-capitalize">MEDICINA INTENSIVA PEDIATRICA</option>
                                    <option value="122" className="text-capitalize">MEDICINA INTENSIVA Y DE EMERGENCIA</option>
                                    <option value="123" className="text-capitalize">MEDICINA INTERNA</option>
                                    <option value="124" className="text-capitalize">MEDICINA INTERNA - GASTROENTEROLOGIA</option>
                                    <option value="125" className="text-capitalize">MEDICINA INTERNA PEDIATRICA</option>
                                    <option value="126" className="text-capitalize">MEDICINA INTERNA Y PEDIATRIA</option>
                                    <option value="127" className="text-capitalize">MEDICINA LEGAL</option>
                                    <option value="128" className="text-capitalize">MEDICINA MATERNO FETAL</option>
                                    <option value="129" className="text-capitalize">MEDICINA NUCLEAR</option>
                                    <option value="130" className="text-capitalize">MEDICINA OCUPACIONAL Y MEDIO AMBIENTE</option>
                                    <option value="131" className="text-capitalize">MEDICINA PEDIATRICA</option>
                                    <option value="132" className="text-capitalize">MEDICINA PREVENTIVA Y SALUD PUBLICA</option>
                                    <option value="194" className="text-capitalize">MEDICO CIRUJANO</option>
                                    <option value="133" className="text-capitalize">NEFROLOGIA</option>
                                    <option value="134" className="text-capitalize">NEFROLOGIA PEDIATRICA</option>
                                    <option value="135" className="text-capitalize">NEONATOLOGIA</option>
                                    <option value="136" className="text-capitalize">NEUMOLOGIA</option>
                                    <option value="137" className="text-capitalize">NEUMOLOGIA CLINICA</option>
                                    <option value="138" className="text-capitalize">NEUMOLOGIA PEDIATRICA</option>
                                    <option value="139" className="text-capitalize">NEUMONOLOGIA CLINICA</option>
                                    <option value="140" className="text-capitalize">NEUMONOLOGIA Y TISIOLOGIA</option>
                                    <option value="141" className="text-capitalize">NEUROCIRUGIA</option>
                                    <option value="142" className="text-capitalize">NEUROCIRUGIA PEDIATRICA</option>
                                    <option value="143" className="text-capitalize">NEUROFISIOLOGIA CLINICA</option>
                                    <option value="144" className="text-capitalize">NEUROLOGIA</option>
                                    <option value="145" className="text-capitalize">NEUROLOGIA PEDIATRICA</option>
                                    <option value="146" className="text-capitalize">NUTRICION</option>
                                    <option value="147" className="text-capitalize">NUTRICION CON ORIENTACION EN OBESIDAD</option>
                                    <option value="148" className="text-capitalize">OFTALMOLOGIA</option>
                                    <option value="149" className="text-capitalize">OFTALMOLOGIA ONCOLOGICA</option>
                                    <option value="150" className="text-capitalize">OFTALMOLOGIA PEDIATRICA Y ESTRABISMO</option>
                                    <option value="151" className="text-capitalize">ONCOLOGIA</option>
                                    <option value="152" className="text-capitalize">ONCOLOGIA CLINICA</option>
                                    <option value="153" className="text-capitalize">ONCOLOGIA MEDICA</option>
                                    <option value="154" className="text-capitalize">ONCOLOGIA PEDIATRICA</option>
                                    <option value="155" className="text-capitalize">ONCOLOGIA QUIRURGICA</option>
                                    <option value="156" className="text-capitalize">ONCOLOGIA RADIOTERAPICA</option>
                                    <option value="157" className="text-capitalize">ORTOPEDIA ONCOLOGICA</option>
                                    <option value="158" className="text-capitalize">ORTOPEDIA Y TRAUMATOLOGIA</option>
                                    <option value="159" className="text-capitalize">OTORRINOLARINGOLOGIA</option>
                                    <option value="160" className="text-capitalize">OTORRINOLARINGOLOGIA PEDIATRICA</option>
                                    <option value="161" className="text-capitalize">OTORRINOLARINGOLOGIA Y CIRUGIA DE CABEZA Y CUELLO</option>
                                    <option value="193" className="text-capitalize">OTROS</option>
                                    <option value="162" className="text-capitalize">PARASITOLOGIA</option>
                                    <option value="163" className="text-capitalize">PATOLOGIA</option>
                                    <option value="164" className="text-capitalize">PATOLOGIA CLINICA</option>
                                    <option value="165" className="text-capitalize">PATOLOGIA ONCOLOGICA</option>
                                    <option value="166" className="text-capitalize">PATOLOGIA Y LABORATORIO CLINICO</option>
                                    <option value="167" className="text-capitalize">PEDIATRIA</option>
                                    <option value="168" className="text-capitalize">PEDIATRIA DE EMERGENCIAS Y DESASTRES</option>
                                    <option value="169" className="text-capitalize">PEDIATRIA Y PUERICULTURA</option>
                                    <option value="170" className="text-capitalize">PROCTOLOGIA</option>
                                    <option value="195" className="text-capitalize">PSICOLOGÍA</option>
                                    <option value="171" className="text-capitalize">PSIQUIATRIA</option>
                                    <option value="172" className="text-capitalize">PSIQUIATRIA DE NIÑOS Y ADOLESCENTES</option>
                                    <option value="173" className="text-capitalize">PSIQUIATRIA EN ADICCIONES</option>
                                    <option value="174" className="text-capitalize">RADIODIAGNOSTICO</option>
                                    <option value="175" className="text-capitalize">RADIOLOGIA</option>
                                    <option value="176" className="text-capitalize">RADIOLOGIA E IMAGEN</option>
                                    <option value="177" className="text-capitalize">RADIOLOGIA INTERVENCIONISTA</option>
                                    <option value="178" className="text-capitalize">RADIOLOGIA Y DIAGNOSTICO POR IMAGENES</option>
                                    <option value="179" className="text-capitalize">RADIOTERAPIA</option>
                                    <option value="180" className="text-capitalize">REUMATOLOGIA</option>
                                    <option value="181" className="text-capitalize">SALUD OCUPACIONAL</option>
                                    <option value="182" className="text-capitalize">SALUD PUBLICA</option>
                                    <option value="183" className="text-capitalize">TERAPEUTICAS ALTERNATIVAS Y FARMACOLOGIA VEGETAL</option>
                                    <option value="184" className="text-capitalize">TERAPIA INTENSIVA</option>
                                    <option value="185" className="text-capitalize">TOCOGINECOLOGIA</option>
                                    <option value="186" className="text-capitalize">TOXICOLOGIA</option>
                                    <option value="187" className="text-capitalize">TOXICOLOGIA MEDICA</option>
                                    <option value="188" className="text-capitalize">UROLOGIA</option>
                                    <option value="189" className="text-capitalize">UROLOGIA GENERAL Y ONCOLOGICA</option>
                                    <option value="190" className="text-capitalize">UROLOGIA ONCOLOGICA</option>
                                    <option value="191" className="text-capitalize">UROLOGIA PEDIATRICA</option>
                                    <option value="192" className="text-capitalize">VENEREOLOGIA</option>
                                </select>
                            </div>
                            <div className="input-group col-lg-12 mb-4">
                            <div className="input-group-prepend">
                                    <span className="input-group-text bg-white px-4 border-md border-right-0">
                                     
                                    </span>
                                </div>
                                <textarea  value={this.state.userinfo.description} onChange={this.handleChange} id="description" name="description" placeholder="Descripción" className="form-control bg-white border-left-0 border-md"/>
                            </div>
                            <div className="input-group col-lg-12 mb-4">
                               
                                <Dropzone id="documents" onDrop={this.revisaArchivo} maxSize={250000} multiple={true}>
                                    {({getRootProps, getInputProps}) => (
                                    <div {...getRootProps()}  className="dropzone">
                                        <input onChange={this.handleChange} {...getInputProps()} />
                                        
                                        <div> {this.state.userinfo.documents.length != 0
                                            ? <ul> {this.state.userinfo.documents.map((archivo, i) => (
                                                <li key={i} value={archivo.name} id={archivo.name}>{archivo.name}</li>
                                            ))}</ul>
                                            : <p>Agrega documentos aquí</p>}</div>
                                    </div>
                                    
                                    )}
                                </Dropzone>
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
                                        <span className="font-weight-bold">{cookies.get("id_doctor") ? "Actualizar perfil":"Agregar Doctor"}</span>
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
  
  
export default UserInfo