
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { CalendarOptions, FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { formatDate } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { ActivatedRoute, Router } from '@angular/router';
import { paciente, PacientesService } from 'src/app/services/pacientes.service';
import { Calendar } from '@fullcalendar/core';
import Swal from 'sweetalert2';
import { from } from 'rxjs';
import { NumberValueAccessor } from '@angular/forms';
import { Injector } from '@angular/core';


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit{

  //lista de pacientes
  pacientes:paciente[]=[];
  //paciente correspodiente
  paciente:paciente;
  //identificador de firebase del paciente
  id:string;
  //variable para checkear si se esta cargando la pagina
  cargando:boolean=false;
  //lista de tomas del paciente
  fechas=[]
  //contador de tomas
  contador=0;
  //contador de la cantidad actual de leche
  cantidad:number;
  // botones para comprobar la evolucion del paciente
  comprobantes=[]
  //variable para saber si acortar o no el protocolo
  //acortar:boolean=false;
  //opciones del calendario
  calendarOptions: CalendarOptions = {
    plugins: [ interactionPlugin, dayGridPlugin ],
    initialView: 'dayGridMonth',
    weekends: true, 
    eventClick: function(event) {
 
       if(event.event.title!='Inicio del protocolo' && event.event.title!='Inicio Alimentación enteral trófica'
       && event.event.title!='Fin Alimentación enteral trófica' && event.event.title!='Inicio Alimentación enteral completa' && event.event.title!='Fin Alimentación enteral completa'){
        Swal.fire({
          title: 'Evolución del paciente',
          html: `
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="checkbox1">
                      <label class="form-check-label" for="checkbox1">
                          ¿Presencia de ECN?
                      </label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="checkbox2">
                      <label class="form-check-label" for="checkbox2">
                          ¿Deposiciones normales?
                      </label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="checkbox3">
                      <label class="form-check-label" for="checkbox3">
                          ¿Vómitos?
                      </label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="checkbox4">
                      <label class="form-check-label" for="checkbox4">
                          ¿Abdomen normal?
                      </label>
                  </div>
          `,
          focusConfirm: false,
          preConfirm: () => {
              this.swal1=(document.getElementById('checkbox1') as HTMLInputElement).checked
              this.swal2=(document.getElementById('checkbox2') as HTMLInputElement).checked
              this.swal3=(document.getElementById('checkbox3') as HTMLInputElement).checked
              this.swal4=(document.getElementById('checkbox4') as HTMLInputElement).checked
          }
      });
       }
        
    },
    //dateClick: this.handleDateClick.bind(this), // bind is important!
    locale: 'es',
    headerToolbar: {
      left: 'prevYear,prev,next,nextYear today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    buttonText:{
      today:    'día actual',
      month:    'mes',
      week:     'semana',
      day:      'día',
      list:     'lista',
    },
    nowIndicator: true,
    eventDidMount: function(info) {
      if (info.event.extendedProps.status === 'done') {
        info.el.style.backgroundColor = '#d3d3d3';
        info.el.style.borderColor= '#d3d3d3';
        eventTextColor:'white'
      }
    },
    dayHeaderFormat: { weekday: 'long' },
    weekNumberCalculation: 'ISO',
    displayEventEnd: true,
    allDaySlot: true,
    allDayText: 'todo el día',
    navLinks:true,
    weekNumbers:true,
    weekText:'Sem ',
    selectable: true,
    aspectRatio:2,
    events:[]
  };
  
  constructor(private activatedRoute: ActivatedRoute,
    private _pacientesService: PacientesService,
    private router:Router,
    private injector:Injector) {
      this.activatedRoute.params.subscribe( params =>{
        //parametro conectado al path de app.routes
        this.id=params['id'];
      })
  }

  //arrancamos la pagina
  ngOnInit(): void {
     this.cargarDatos()
  
  }

  //cargamos los datos del paciente y actualizamos el calendario
  cargarDatos(){
    this.cargando=true;
    this.paciente= new paciente();
    this._pacientesService.getPacientes2()
    .subscribe(resp => {
      this.pacientes=resp;
      for(var p of this.pacientes){
        if(p.id==this.id){
          this.paciente=p;
        }
      }
      //actualizamos la lista de eventos del calendario
      this.actualizarEventos()
      this.cargando=false;
      console.log('acortar protocolo?',this.paciente.protocolo.acortarProtocolo)
    });
  }

  mostrarCargando(){
    while(this.cargando==true){
      Swal.fire('Espere por favor...','','info');
      Swal.showLoading();
      Swal.close();
    }
  }

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)
  }

  //fecha actual
  str = formatDate(new Date(), {
    month: 'long',
    year: 'numeric',
    day: 'numeric'
  });

  verPaciente(idx:string): void{
    this.router.navigate(['/paciente',idx]);
  }

  verCalendario(idx:string): void{
    this.router.navigate(['/calendario',idx]);
}

  //funcion para generar un evento
  generarEvento(titulo:string,fecha:string){
    return {title: titulo, start: fecha}
  }

  generarEvento3(titulo:string,fecha:string){
    return {title: titulo, date: fecha}
  }

  //funcion para calcular las tomas del paciente
  calcularProtocolo(){
    //limpiamos el contador antes
    this.contador=0
    //limpiamos las fechas antes por si acaso
    this.fechas=[]
    //creamos una fecha tipo Date con el inicio del protocolo
    var fecha=new Date(this.devolverFecha(this.paciente.protocolo.fechaInicio))
    //sumamos un dia para saber que el protocolo empieza el 2 dia
    fecha.setDate(fecha.getDate()+1)
    //agregamos estos eventos al calendario
    this.fechas.push(this.generarEvento3('Inicio del protocolo',this.devolverFecha(this.paciente.protocolo.fechaInicio)))
    this.fechas.push(this.generarEvento3('Inicio Alimentación enteral trófica',this.devolverFecha(this.paciente.protocolo.fechaInicio)))
    //generamos la lista de tomas troficas del paciente
    this.generarTomas(fecha)
    this.fechas.push(this.generarEvento3('Fin Alimentación enteral trófica',fecha.toISOString().split('T')[0]))
    this.fechas.push(this.generarEvento3('Inicio Alimentación enteral completa',fecha.toISOString().split('T')[0]))
    //generamos la lista de tomas completas del paciente
    this.alimentacionCompleta(fecha)
    this.fechas.push(this.generarEvento3('Fin Alimentación enteral completa',fecha.toISOString().split('T')[0]))

    return this.fechas;
  }

  alimentacionCompleta(fecha:Date){
    var horas=[0,3,6,9,12,15,18,21]
    while(this.cantidad<160){
      for(let hora=0; hora<horas.length; hora++){
        fecha.setHours(horas[hora])
        
        if(this.paciente.weight>1000){
          if(horas[hora]==12 || horas[hora]==0){
            
            this.cantidad=this.cantidad+this.calcularCantidad(10,1)
          }
        }else{
          if(horas[hora]==12 || horas[hora]==0){
            
            this.cantidad=this.cantidad+this.calcularCantidad(15,1)
          }
        }
        this.cantidad=Math.round((this.cantidad+Number.EPSILON)*100)/100
        if(this.cantidad>160){
          this.cantidad=160
        }
        
        this.fechas.push(this.generarEvento(this.numerarToma(this.contador+1,this.cantidad),fecha.toISOString()))
        this.contador++
      }
      fecha.setDate(fecha.getDate()+1)
    }
    
  }

  //funcion para generar el string del evento
  numerarToma(num:number,cantidad:number):string{
    var toma='Toma '+String(num)+': '+cantidad+' ml'
    return toma;
  }

  //funcion para generar las tomas segun las caracteristicas del paciente
  generarTomas(fecha:Date){
    //numero de horas a las que dar de comer, 8 tomas diarias, cada 3 horas
    var horas=[0,3,6,9,12,15,18,21]
    //numero de dias de alimentacion enteral trofica en funcion del peso,semanas y cir
    var numDias:number;
    if(this.paciente.weight<750 || this.paciente.pregnancy_period<25 || this.paciente.protocolo.cir==true){
      numDias=7
    }
    if(this.paciente.weight>750 && this.paciente.weight<1000){
      numDias=6
    }
    if(this.paciente.protocolo.acortarProtocolo==false && this.paciente.weight>1000 ){
      numDias=5
    }
    if(this.paciente.protocolo.acortarProtocolo==true && this.paciente.weight>1000){
      numDias=3
    }

    let hora:number;
    let dia:number;
    
    //iteramos sobre el numero de dias y las horas para generar las tomas
    for(dia=1; dia<numDias+1; dia++){
      for(hora=0; hora<horas.length; hora++){
        //cambiamos la fecha a la hora definida
        fecha.setHours(horas[hora])
        //si el paciente necesita 7 dias de trofica
        if(numDias==7){
          this.calcularAltoRiesgo(dia,fecha)
        }
        if(numDias==6){
          this.calcularRiesgoMedio(dia,fecha)
        }
        if(numDias==5){
          this.calcularRiesgoBajo(dia,fecha)
        }
        if(numDias==3){
          this.calcularRiesgoBajo(dia,fecha)
        }
        this.contador++
      }
      fecha.setDate(fecha.getDate()+1)
    }
  }

  calcularAltoRiesgo(dia:number,fecha:Date){
    var contTemp:number;
    if(dia<=3){
      contTemp=(this.contador)*3
      this.cantidad=this.calcularCantidad(0.3,contTemp)
    }
    // si estamos en los dias 4,5 o 6
    if(dia==4){
      contTemp=1
      this.cantidad=this.calcularCantidad(0.5,contTemp)+23*3*0.3*this.paciente.weight/1000
      this.cantidad=Math.round((this.cantidad+Number.EPSILON)*100)/100
    }
    if(dia==5){
      contTemp=1
      this.cantidad=this.calcularCantidad(0.5,contTemp)*2+23*3*0.3*this.paciente.weight/1000
      this.cantidad=Math.round((this.cantidad+Number.EPSILON)*100)/100
    }
    if(dia==6){
      contTemp=1
      this.cantidad=this.calcularCantidad(0.5,contTemp)*3+23*3*0.3*this.paciente.weight/1000
      this.cantidad=Math.round((this.cantidad+Number.EPSILON)*100)/100
    }
    // si estamos en el ultimo dia
    if(dia==7){
      contTemp=1
      this.cantidad=this.calcularCantidad(1,contTemp)+this.calcularCantidad(0.5,contTemp)*3+23*3*0.3*this.paciente.weight/1000
      this.cantidad=Math.round((this.cantidad+Number.EPSILON)*100)/100
    }
    this.fechas.push(this.generarEvento(this.numerarToma(this.contador+1,this.cantidad),fecha.toISOString()))
  }

  calcularRiesgoMedio(dia:number,fecha:Date){
    var contTemp:number;
    if(dia<=3){
      contTemp=(this.contador)*3
      this.cantidad=this.calcularCantidad(0.5,contTemp)
    }else{
      contTemp=(this.contador)*3
      this.cantidad=this.calcularCantidad(1,contTemp-72)+23*3*0.5*this.paciente.weight/1000
      this.cantidad=Math.round((this.cantidad+Number.EPSILON)*100)/100
      
    }
    this.fechas.push(this.generarEvento(this.numerarToma(this.contador+1,this.cantidad),fecha.toISOString()))
  }

  calcularRiesgoBajo(dia:number,fecha:Date){
    var contTemp:number;
    contTemp=(this.contador)*3
    this.cantidad=this.calcularCantidad(1,contTemp)
    this.fechas.push(this.generarEvento(this.numerarToma(this.contador+1,this.cantidad),fecha.toISOString()))
  }

  calcularCantidad(porcentaje:number,momento:number){
    var cantidad:number;
    if(momento==0){
      cantidad=(porcentaje*this.paciente.weight/1000*1)
    }else{
      
      cantidad=(porcentaje*(this.paciente.weight/1000)*momento)
    }
    
    cantidad=Math.round((cantidad+Number.EPSILON)*100)/100
   
    return cantidad;
  }

  //convertir la fecha de inicio del protocolo del paciente en el formato del calendario
  devolverFecha(fecha:string){
    var FechaArr=fecha.split('/')
    if(FechaArr[1].length==1){
      FechaArr[1]='0'.concat(FechaArr[1])
    }
    var tempfecha=FechaArr[2].concat('-').concat(FechaArr[1]).concat('-').concat(FechaArr[0])
    return tempfecha;
  }

  actualizarEvolucion(event):void{

    var titulos=['Inicio del protocolo','Inicio Alimentación enteral trófica','Fin Alimentación enteral trófica','Inicio Alimentación enteral completa','Fin Alimentación enteral completa']
    if(titulos.includes(event.event.title)==false){
      this.EvolucionDelPaciente(event)
    }
  }

  EvolucionDelPaciente(event){
    var tempDate=event.event.start;
    tempDate.setHours(event.event.start.getHours()+2);
    Swal.fire({
      title: 'Evolución del paciente:'+'\n'+event.event.title+'\n'+tempDate.toISOString().split('T')[0]+' '+tempDate.toISOString().split('T')[1].substring(0,5),
      showCancelButton: true,
      cancelButtonText:'Cancelar',
      cancelButtonColor: '#d33',
      html: `
      <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" id="checkbox2">
          <label class="form-check-label" for="checkbox2">
              ¿Deposiciones normales?
          </label>
      </div>
      <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" id="checkbox3">
          <label class="form-check-label" for="checkbox3">
              ¿Vómitos?
          </label>
      </div>
      <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" id="checkbox4">
          <label class="form-check-label" for="checkbox4">
              ¿Abdomen normal?
          </label>
      </div>
      `,
      focusConfirm: false,
      preConfirm:()=>{
        return new Promise((resolve,reject) =>{
          resolve({
            swal1:(document.getElementById('checkbox2') as HTMLInputElement).checked==true,
            swal2:(document.getElementById('checkbox3') as HTMLInputElement).checked==true,
            swal3:(document.getElementById('checkbox4') as HTMLInputElement).checked==true,
            swal4:(document.getElementById('checkbox2') as HTMLInputElement).checked==true &&  (document.getElementById('checkbox3') as HTMLInputElement).checked==false &&  (document.getElementById('checkbox4') as HTMLInputElement).checked==true
          })
        })
      }
    }).then(
      resp =>{
      
        this.comprobantes.push({titulo:event.event.title,fecha:tempDate,deposicionesNormales:resp.value['swal1'],vomitos:resp.value['swal2'],abdomenNormal:resp.value['swal3']})
        //this.paciente.protocolo.tomas=this.comprobantes;
        this.paciente.protocolo.tomas.push({titulo:event.event.title,fecha:tempDate,deposicionesNormales:resp.value['swal1'],vomitos:resp.value['swal2'],abdomenNormal:resp.value['swal3']})
        console.log('comprobantes',this.comprobantes)
        console.log('evolucion del paciente:',this.paciente.protocolo.tomas)
        if(resp.value['swal4']==true){
          this.paciente.protocolo.acortarProtocolo=true;
        }
        this._pacientesService.actualizarPaciente(this.paciente)
        .subscribe(resp => {
        });
        this.router.navigateByUrl('/home');
        this.ngOnInit()
          Swal.fire({title:'Datos actualizados',icon:'info'});
      }
    )
  }



  actualizarEventos(){
    this.calendarOptions= {
      //cargar plugins
      plugins: [ interactionPlugin, dayGridPlugin ],
      //vista inicial, modo semanal
      initialView: 'dayGridMonth',
      // valor inicial fin de semana
      weekends: true,
      eventClick: (event) => this.actualizarEvolucion(event),
      //dateClick: this.handleDateClick.bind(this), // bind is important!
      //eventos
      events: 
        this.calcularProtocolo()
      ,
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
      // cambiar el aspect ratio
      aspectRatio:3,
      // cambiar el color el evento al pinchar sobre el
      // tamaño del calendario para evitar scrolling
      //height:"auto",
      // hora con la que empezar
      //scrollTime: '06:00:00'
    };
  }

}
