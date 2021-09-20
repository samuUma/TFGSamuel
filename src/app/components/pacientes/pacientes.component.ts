import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {paciente, PacientesService} from '../../services/pacientes.service' 
import {Router} from '@angular/router'
import Swal from 'sweetalert2';


@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html'
})
export class PacientesComponent implements OnInit {

  pacientes:paciente[]=[];
  pacientesOrdenadosNombre:paciente[]=[];
  pacientesOrdenadosFecha:paciente[]=[];
  paciente:paciente;
  cargando:boolean=false;

  constructor(public _pacientesService:PacientesService,
              private router:Router) { 
    //console.log("constructor");
  }

  ngOnInit(): void {
    this._pacientesService.setEstadisticasFalse()
    this._pacientesService.setOrdenacionTrue()
    this.cargando=true;
    this._pacientesService.getPacientes2()
    .subscribe( resp => {
      //this.pacientes=resp;
      for(var p of resp){
        if(p.protocolo.protocoloFinalizado==false){
          this.pacientes.push(p)
        }
      }

      this.pacientesOrdenadosNombre=this.pacientes.slice()
      // pacientes ordenados por nombre
      this.pacientesOrdenadosNombre.sort((a,b) => (a.first_name.toLowerCase() > b.first_name.toLowerCase()) ? 1 : ((b.first_name.toLowerCase() > a.first_name.toLowerCase()) ? -1 : 0))
      
      // pacientes ordenados por fecha
      this.pacientesOrdenadosFecha=this.pacientes.slice();
      this.pacientesOrdenadosFecha.sort((a,b) => 
      (a.birthdate > b.birthdate) ? 1 : ((b.birthdate > a.birthdate) ? -1 : 0))

      this.cargando=false;
      
      console.log('normal:',this.pacientes)
      console.log('por nombre:',this.pacientesOrdenadosNombre)
      console.log('por fecha;',this.pacientesOrdenadosFecha)
      
    });
    
  
  }

getOrdenacionFecha(){
  return this._pacientesService.getOrdenacionFecha()
}

getOrdenacionNombre(){
  return this._pacientesService.getOrdenacionNombre()
}

getOrdenacionPredeterminada(){
  return this._pacientesService.getOrdenacionPredeterminada()
}

verPaciente(idx:string): void{
    this.router.navigate(['/paciente',idx]);
}

editarPaciente(idx:string): void{
    this.router.navigate(['/editarPaciente',idx]);
}

mostrarCargando(){
  while(this.cargando==true){
    Swal.fire('Espere por favor...','','info');
    Swal.showLoading();
    Swal.close();
  }
}

finalizarProtocolo(idx:string): void{
  for(var p of this.pacientes){
    if(p.id==idx){
      this.paciente=p;
    }
  }
  Swal.fire({
    title: '¿Finalizar protocolo alimenticio del paciente?',
    showCancelButton: true,
    cancelButtonText:'Cancelar',
    cancelButtonColor: '#d33',
    html: `
    <h5>Justifique el motivo:</h5>
    <div class="form-check">
        <input class="form-check-input" type="radio" name="justificante" value="" id="checkbox2" checked>
        <label class="form-check-label" for="checkbox2">
            Recuperación del paciente
        </label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="radio" name="justificante" value="" id="checkbox3" >
        <label class="form-check-label" for="checkbox3">
            Fallecimiento del paciente
        </label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="radio" name="justificante" value="" id="checkbox4">
        <label class="form-check-label" for="checkbox4">
            Tratamiento alternativo
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
        })
      })
    }
  }).then(
    resp =>{
      
      //console.log(resp)
      if(resp.value['swal1']==true){
        this.paciente.protocolo.protocoloFinalizadoBien=true;
      }
      if(resp.value['swal2']==true){
        this.paciente.protocolo.protocoloFinalizadoMal=true;
      }
      if(resp.value['swal3']==true){
        this.paciente.protocolo.protocoloFinalizadoOtro=true;
      }
      this.paciente.protocolo.protocoloFinalizado=true;
      this._pacientesService.actualizarPaciente(this.paciente)
        .subscribe(resp => {
        });
      this.router.navigateByUrl('/pacientes');
      this.ngOnInit()
      Swal.fire({title:'Datos actualizados',icon:'info'});
    }
  )
}

borrarPaciente(idx:string): void{
  Swal.fire({title:'¿Borrar Paciente?',icon:'info',showConfirmButton:true,showCancelButton:true,cancelButtonText:'Cancelar',
  cancelButtonColor: '#d33',})
  .then( resp => {
    if ( resp.value ) {
      var contador=0;
        for(var i of this.pacientes){
            if(i.id==idx){
              this.pacientes.splice(contador,1);
            }else{
                contador++;
            }
          }
      this._pacientesService.borrarPaciente(idx).subscribe();
    }

  });
}

verCalendario(idx:string): void{
  this.router.navigate(['/calendario',idx]);
  //console.log(idx);
}

iniciarProtocolo(idx:string): void{
  this.router.navigate(['/iniciarProtocolo',idx]);
}

}
