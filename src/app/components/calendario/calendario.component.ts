
import { Component, OnInit } from '@angular/core';
import { CalendarOptions, FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { formatDate } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { ActivatedRoute, Router } from '@angular/router';
import { paciente, PacientesService } from 'src/app/services/pacientes.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  pacientes:paciente[]=[];
  paciente:paciente;
  id:string;
  cargando:boolean=false;

  constructor(private activatedRoute: ActivatedRoute,
    private _pacientesService: PacientesService,
    private router:Router) {
      this.activatedRoute.params.subscribe( params =>{
        //parametro conectado al path de app.routes
        this.id=params['id'];
        console.log('parametro calendario:',this.id);
      })
  }

  ngOnInit(): void {
    this.cargando=true;
    this._pacientesService.getPacientes2()
    .subscribe(resp => {
      this.pacientes=resp;
      for(var p of this.pacientes){
        if(p.id==this.id){
          this.paciente=p;
        }
      }
      this.cargando=false;
    });
  }

  //opciones del calendario
  calendarOptions: CalendarOptions = {
    //cargar plugins
    plugins: [ interactionPlugin, dayGridPlugin ],
    //vista inicial, modo semanal
    initialView: 'timeGridWeek',
    // valor inicial fin de semana
    weekends: true, 
    dateClick: this.handleDateClick.bind(this), // bind is important!
    //eventos
    events: [
      { title: 'prueba 1', date: '2021-07-14' },
      { title: 'prueba 2', date: '2021-07-15' },
      { title: 'evento largo', start: '2021-07-1', end: '2021-07-5'},
      { title: 'evento terminado', start: '2021-07-12T14:30:00',extendedProps: {status: 'done'}},
      {
        title: 'Birthday Party',
        //daysOfWeek: [ '3' ], //repeticion del evento todos los miercoles
        start: '2021-07-13T07:00:00',
        backgroundColor: 'green',
        borderColor: 'green',
        
      }
    ],
    //idioma
    locale: 'es',
    //cabecera
    headerToolbar: {
      left: 'prevYear,prev,next,nextYear today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    // texto de los botones
    buttonText:{
      today:    'día actual',
      month:    'mes',
      week:     'semana',
      day:      'día',
      list:     'lista',
    },
    // hora actual
    nowIndicator: true,
    // cambiar estilo de los eventos terminados
    eventDidMount: function(info) {
      if (info.event.extendedProps.status === 'done') {
  
        // cambiar el color a gris de los eventos terminados
        info.el.style.backgroundColor = '#d3d3d3';
        info.el.style.borderColor= '#d3d3d3';
        eventTextColor:'white'
        
      }
    },
    // mostrar el nombre completo del dia de la semana
    dayHeaderFormat: { weekday: 'long' },
    // mostrar la semana empezando por el lunes
    weekNumberCalculation: 'ISO',
    // mostrar el final de un evento
    displayEventEnd: true,
    // mostrar franja para eventos de todo un dia
    allDaySlot: true,
    // texto a mostrar para eventos de todo un dia
    allDayText: 'todo el día',
    // permitir que los textos sean linkeables
    navLinks:true,
    // mostrar numero de semana
    weekNumbers:true,
    // texto previo al numero de semana
    weekText:'Sem ',
    // permitir seleccionar dias clicando y arrastrando
    selectable: true,
    // cambiar el color el evento al pinchar sobre el
    /*
    eventClick: function(info) {
      // change the border color just for fun
      if(info.el.style.borderColor!='red'){
        info.el.style.borderColor = 'red';
        info.el.style.backgroundColor = 'red';
      }else{
        info.el.style.borderColor='#3788d8';
        info.el.style.backgroundColor='#3788d8';
      }
    }
    */
    
    // tamaño del calendario para evitar scrolling
    //height:"auto",
    // hora con la que empezar
    //scrollTime: '06:00:00'

  
  };

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)
  }

  //fecha actual
  str = formatDate(new Date(), {
    month: 'long',
    year: 'numeric',
    day: 'numeric'
    //console.log(this.str); para mostrar la fecha inicial
  });

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends // activar o desactivar findes
  }

  verPaciente(idx:string): void{
    this.router.navigate(['/paciente',idx]);
    //console.log(idx);
  }

}

