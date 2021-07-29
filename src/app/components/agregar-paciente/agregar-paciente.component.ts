import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { paciente, PacientesService } from 'src/app/services/pacientes.service';
import { __values } from 'tslib';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-paciente',
  templateUrl: './agregar-paciente.component.html',
  styleUrls: ['./agregar-paciente.component.css']
})
export class AgregarPacienteComponent implements OnInit {

  constructor(private router:Router,private pacienteService:PacientesService) { }

  paciente:paciente;

  ngOnInit(): void {
      //inicializar el paciente vacio
      this.paciente=new paciente();
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
    this.pacienteService.crearPaciente(this.paciente)
    .subscribe(resp => {
      //redirigir al usuario a la pagina inicial
      Swal.close();
      this.router.navigateByUrl('/home');
      Swal.fire({title:'Paciente añadido con éxito',icon:'info'});
    });
  }

}
