import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.models';
import {NgForm} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario:UsuarioModel
  
  constructor(private auth:AuthService,private router:Router) { }

  ngOnInit(): void {
    this.usuario=new UsuarioModel();
  }
  
  estaslogeado():boolean{
    return this.auth.estaAutenticado();
  }

  onSubmit(formulario:NgForm){

    if(formulario.invalid){
      return;
    }
    
    Swal.fire('Espere por favor...','','info');
    Swal.showLoading();

    this.auth.login(this.usuario).subscribe(resp =>{

      console.log(resp);
      Swal.close();
      this.router.navigateByUrl('/home');
    }, (err)=>{
      console.log(err.error.error.message);
      Swal.fire('Correo o contraseña no válidos','','error');
    });
  }

  

}
