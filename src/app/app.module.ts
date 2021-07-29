import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

//rutas
import {APP_ROUTING} from './app.routes'

//servicios
import {PacientesService} from './services/pacientes.service'

//calendario-------------------------------------------------------------------------------------
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
//calendario-------------------------------------------------------------------------------------

//componentes
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { PacienteComponent } from './components/paciente/paciente.component';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { LoginComponent } from './components/login/login.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { AgregarPacienteComponent } from './components/agregar-paciente/agregar-paciente.component';
import { EditarPacienteComponent } from './components/editar-paciente/editar-paciente.component';
import { IniciarProtocoloComponent } from './components/iniciar-protocolo/iniciar-protocolo.component';

//calendario-------------------
FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
  listPlugin
]);

//calendario-------------------
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    PacientesComponent,
    EstadisticasComponent,
    PacienteComponent,
    BuscadorComponent,
    LoginComponent,
    CalendarioComponent,
    AgregarPacienteComponent,
    EditarPacienteComponent,
    IniciarProtocoloComponent,
    //calendario
  ],
  imports: [
    CommonModule,
    NgbModalModule,
    BrowserModule,
    APP_ROUTING,
    NgbModule,
    FormsModule,
    HttpClientModule,
    //calendario
    FullCalendarModule
  ],
  providers: [
    PacientesService,
    //calendario
 
  ],
  bootstrap: [AppComponent],
  exports: [
    CalendarioComponent,
    //calendario

  ],
  //calendario
  entryComponents: [],
})
export class AppModule { }
