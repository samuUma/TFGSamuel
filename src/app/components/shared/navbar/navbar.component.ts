import { Component, OnInit } from '@angular/core';
import {paciente, PacientesService} from '../../../services/pacientes.service'; 
import {Router} from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  constructor(private _pacientesService: PacientesService,
    private router: Router,
    private auth: AuthService) { }


  ngOnInit(): void {
  }

  buscarPaciente(busqueda:string){
    this.router.navigate(['/buscar',busqueda]);
  }

  estaslogeado():boolean{
    return this.auth.estaAutenticado();
  }

  cerrarSesion():void{
    this.auth.logout();
    this.router.navigateByUrl('/login');
    Swal.fire({title:'Sesión cerrada',icon:'info'});
  }

  agregarPaciente(): void{
    this.router.navigate(['/agregarPaciente']);
    //console.log(idx);
}

}
