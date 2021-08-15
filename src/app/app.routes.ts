//fichero para el manejo de rutas
import {RouterModule, Routes} from '@angular/router';

// cada import corresponde a una ruta
import {HomeComponent} from './components/home/home.component'
import {PacientesComponent} from './components/pacientes/pacientes.component'
import {EstadisticasComponent} from './components/estadisticas/estadisticas.component'
import {PacienteComponent} from './components/paciente/paciente.component'
import {BuscadorComponent} from './components/buscador/buscador.component'
import { AuthGuard } from './guards/auth.guard'
import {LoginComponent} from './components/login/login.component'
import {CalendarioComponent} from './components/calendario/calendario.component'
import { AgregarPacienteComponent } from './components/agregar-paciente/agregar-paciente.component';
import { EditarPacienteComponent } from './components/editar-paciente/editar-paciente.component';
import { IniciarProtocoloComponent } from './components/iniciar-protocolo/iniciar-protocolo.component';

// cada path es el nombre de la ruta a usar en el [routerLink]="['nombre-de-la-ruta'] en el nav bar"
const APP_ROUTES: Routes = [
    { path: 'home', component: PacientesComponent, canActivate: [AuthGuard]},
    { path: 'pacientes', component: PacientesComponent, canActivate: [AuthGuard]},
    { path: 'estadisticas', component: EstadisticasComponent, canActivate: [AuthGuard]},
    { path: 'paciente/:id', component: PacienteComponent, canActivate: [AuthGuard]},
    { path: 'buscar/:termino', component: BuscadorComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent},
    { path: 'calendario/:id', component: CalendarioComponent,canActivate: [AuthGuard]},
    { path: 'agregarPaciente', component: AgregarPacienteComponent, canActivate: [AuthGuard]},
    { path: 'editarPaciente/:id', component: EditarPacienteComponent, canActivate: [AuthGuard]},
    { path: 'iniciarProtocolo/:id', component: IniciarProtocoloComponent, canActivate: [AuthGuard]},
    { path: 'paciente/:id/:pesoOSemanasAdecuado/:calostroOLmDisponible', component:PacienteComponent, canActivate: [AuthGuard]},
    { path: '**', pathMatch: 'full', redirectTo: 'login'}
];

//exportacion para el app.module.ts
export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES,{ useHash: true });