import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { paciente, PacientesService } from '../../services/pacientes.service'
import {Router} from '@angular/router'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html'
  
})
export class PacienteComponent {

  pacientes:paciente[]=[];
  paciente:paciente;
  id:string;
  cargando:boolean=false;
  protocolo_establecido:boolean=false;

  constructor(private activatedRoute: ActivatedRoute,
              private _pacientesService: PacientesService,
              private router:Router) { 
    this.activatedRoute.params.subscribe( params =>{
      //parametro conectado al path de app.routes
      console.log('parametro:',params['id']);
      this.id=params['id'];
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

verCalendario(idx:string): void{
    this.router.navigate(['/calendario',idx]);
    //console.log(idx);
}

iniciarProtocolo(idx:string): void{
    this.router.navigate(['/iniciarProtocolo',idx]);
}
   
mostrarCargando(){
  while(this.cargando==true){
    Swal.fire('Espere por favor...','','info');
    Swal.showLoading();
    Swal.close();
  }
}

  

}
