import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.models';
import {map} from 'rxjs/operators'
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    userToker:string;
    private apikey='AIzaSyBtC6Ujqymj6wEjLtCqOO-snXtXOdgzeM4';
  // api key
  // AIzaSyBtC6Ujqymj6wEjLtCqOO-snXtXOdgzeM4
  // login
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
  constructor(private http: HttpClient) {
    this.leerToken();
   }

  login(usuario:UsuarioModel){

    const authData={
      ...usuario,
      returnSecureToken:true
    };

    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apikey}`,
      authData
    ).pipe(map(resp =>{
      console.log('entro en el mapa');
      this.guardarToker(resp['idToken']);
      return resp;
    }));
  }


  logout(){
    localStorage.removeItem('token');
    this.userToker='';
  }

  private guardarToker(idToken:string){
    this.userToker=idToken;
    localStorage.setItem('token',idToken);

    let hoy=new Date();
    hoy.setTime(hoy.getTime()+3600*1000);
    localStorage.setItem('expira',hoy.getTime().toString());
  }

  leerToken(){
    if(localStorage.getItem('token')){
      this.userToker=localStorage.getItem('token');
    }else{
      this.userToker='';
    }
    return this.userToker;
  }

  estaAutenticado(): boolean{
    if(this.userToker.length<2){
      return false;
    }

    const expira=Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if(expiraDate>new Date()){
      return true;
    }else{
      return false;
    }
    
  }
}
