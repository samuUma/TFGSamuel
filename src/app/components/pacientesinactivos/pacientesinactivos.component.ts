import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {paciente, PacientesService} from '../../services/pacientes.service' 
import {Router} from '@angular/router'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pacientesinactivos',
  templateUrl: './pacientesinactivos.component.html',
  styleUrls: ['./pacientesinactivos.component.css']
})
export class PacientesinactivosComponent implements OnInit {

  pacientes:paciente[]=[];
  pacientesOrdenadosNombre:paciente[]=[];
  pacientesOrdenadosFecha:paciente[]=[];
  paciente:paciente;
  cargando:boolean=false;

  constructor(public _pacientesService:PacientesService,
              private router:Router) { }

  ngOnInit(): void {
    this._pacientesService.setEstadisticasFalse()
    this._pacientesService.setOrdenacionTrue()
    //console.log('ruta:',this.router.url)
    this.cargando=true;
    this._pacientesService.getPacientes2()
    .subscribe( resp => {
      //this.pacientes=resp;
      for(var p of resp){
        if(p.protocolo.protocoloFinalizado==true){
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

  verPaciente(idx:string): void{
    this.router.navigate(['/paciente',idx]);
  }

  mostrarCargando(){
    while(this.cargando==true){
      Swal.fire('Espere por favor...','','info');
      Swal.showLoading();
      Swal.close();
    }
  }

  verCalendario(idx:string): void{
    this.router.navigate(['/calendario',idx]);
    //console.log(idx);
  }

}
