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
  paciente:paciente;
  cargando:boolean=false;

  constructor(private _pacientesService:PacientesService,
              private router:Router) { }

  ngOnInit(): void {
    this.cargando=true;
    this._pacientesService.getPacientes2()
    .subscribe( resp => {
      //this.pacientes=resp;
      for(var p of resp){
        if(p.protocolo.protocoloFinalizado==true){
          this.pacientes.push(p)
        }
      }
      this.cargando=false;
      for(var pa of this.pacientes){
        console.log('nombre:',pa.first_name,'protocolo:',pa.protocol)
      }
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
