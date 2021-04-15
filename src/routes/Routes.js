import React from 'react';
import { BrowserRouter,Switch,Route} from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import App from '../App'
import Terminos from '../pages/Terminos'
import PoliticaP from '../pages/PoliticaP'
import PanelGeneral from '../pages/PanelGeneral'
import Pacientes from '../pages/Pacientes'
import AdminPanel from '../pages/AdminPanel'
import AddUser from '../pages/AddUser'
import CancelMeet from '../pages/CancelMeet'
import Citas from '../pages/AdminCitas'
import UserInfo from '../pages/UserInfo'
import DoctorEdit from '../pages/DoctorEdit'

function Routes(){
    return(
        <BrowserRouter>
            <Switch>
            <Route exact path='/' component={App}/>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/register' component={Register}/>
            <Route exact path='/terminos' component={Terminos}/>
            <Route exact path='/politicas' component={PoliticaP}/>
            <Route exact path='/panelPrincipal' component={PanelGeneral}/>
            <Route exact path='/pacientes' component={Pacientes}/>
            <Route exact path='/adminPanel' component={AdminPanel}/>
            <Route exact path='/adduser' component={AddUser}/>
            <Route exact path='/cancelmeet' component={CancelMeet}/>
            <Route exact path='/admincitas' component={Citas}/>
            <Route exact path='/perfil' component={UserInfo}/>
            <Route exact path='/doctorUser' component={DoctorEdit}/>
            </Switch>
        </BrowserRouter>
    );
}

export default Routes