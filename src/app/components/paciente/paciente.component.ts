import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { paciente, PacientesService } from '../../services/pacientes.service'
import {Router} from '@angular/router'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html'
  
})
export class PacienteComponent implements OnInit {

  pacientes:paciente[]=[];
  paciente:paciente;
  id:string;
  cargando:boolean=false;
  protocoloCargado:boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private _pacientesService: PacientesService,
              private router:Router) { 
    this.activatedRoute.params.subscribe( params =>{
      //parametro conectado al path de app.routes
      console.log('parametro:',params['id']);
      this.id=params['id'];
    })
  }

  cargarProtocolo(){
    this.protocoloCargado=this.paciente.protocol;
  }

  ngOnInit(): void {
    this.paciente=new paciente();
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
      console.log('esto es paciente',this.paciente)
      console.log('esto es su protocolo',this.paciente.protocol)
    });
    this.cargarProtocolo()
  }

verCalendario(idx:string): void{
    this.router.navigate(['/calendario',idx]);
    //console.log(idx);
}

iniciarProtocolo(idx:string): void{
    this.router.navigate(['/iniciarProtocolo',idx]);
}

editarPaciente(idx:string): void{
  this.router.navigate(['/editarPaciente',idx]);
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
      this.router.navigate(['/pacientes',idx]);
    }

  });
}
   
mostrarCargando(){
  while(this.cargando==true){
    Swal.fire('Espere por favor...','','info');
    Swal.showLoading();
    Swal.close();
  }
}
  

}
