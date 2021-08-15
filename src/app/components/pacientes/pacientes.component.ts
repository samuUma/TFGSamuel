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
  cargando:boolean=false;
  

  constructor(private _pacientesService:PacientesService,
              private router:Router) { 
    console.log("constructor");
  }

  ngOnInit(): void {
    this.cargando=true;
    this._pacientesService.getPacientes2()
    .subscribe( resp => {
      this.pacientes=resp;
      this.cargando=false;
      for(var pa of this.pacientes){
        console.log('nombre:',pa.first_name,'protocolo:',pa.protocol)
      }
    });
    
  
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

borrarPaciente(idx:string): void{
  Swal.fire({title:'¿Estás seguro?',icon:'info',showConfirmButton:true,showCancelButton:true})
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


}
