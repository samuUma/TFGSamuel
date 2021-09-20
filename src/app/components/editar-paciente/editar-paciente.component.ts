import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { paciente, PacientesService } from '../../services/pacientes.service';

@Component({
  selector: 'app-editar-paciente',
  templateUrl: './editar-paciente.component.html',
  styleUrls: ['./editar-paciente.component.css']
})
export class EditarPacienteComponent implements OnInit {

  pacientes:paciente[]=[];
  paciente:paciente;
  id:string;
  cargando:boolean=false;

  constructor(private activatedRoute: ActivatedRoute,
    private _pacientesService: PacientesService,
    private router:Router) 
    {
      this.activatedRoute.params.subscribe( params =>{
        //parametro conectado al path de app.routes
        console.log('parametro:',params['id']);
        this.id=params['id'];
     })
  }

  ngOnInit(): void {
    this._pacientesService.setEstadisticasFalse()
    this._pacientesService.setOrdenacionFalse()
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
  
  cambiarActivo(){
    var current = document.getElementsByClassName("btn active");
    if (current.length > 0) {
      current[0].className = current[0].className.replace(" active", "");
    }
    document.getElementById("pacientesactivos").className += " active"
  }
  
  guardar( forma:NgForm ){
    //comprobar la validez del formulario
    if( forma.invalid ){
      //marcar las opciones tocadas
      Object.values(forma.controls).forEach(control => 
        {control.markAllAsTouched()});
        return;
    }

    //mostrar mensaje de espera
    Swal.fire('Espere por favor...','','info');
    Swal.showLoading();

    // agregar los datos del formulario al nuevo paciente
    this.paciente.first_name=forma.value['nombre'];
    this.paciente.last_name=forma.value['apellidos'];
    this.paciente.birthdate=forma.value['fecha']
    this.paciente.pregnancy_period=forma.value['semanas_gestacion']
    this.paciente.sex=forma.value['sexo']
    this.paciente.weight=forma.value['peso']

    //enviar los datos del paciente a la base de datos
    this._pacientesService.actualizarPaciente(this.paciente)
    .subscribe(resp => {
      //redirigir al usuario a la pagina inicial
      Swal.close();
      this.router.navigateByUrl('/home');
      Swal.fire({title:'Paciente editado con éxito',icon:'info'});
    });
  }


}

  
