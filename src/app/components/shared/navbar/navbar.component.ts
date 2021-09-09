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

  json;
  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  constructor(private _pacientesService: PacientesService,
    private router: Router,
    private auth: AuthService) { }


  ngOnInit(): void {
    this.descargarEstadisticas()
  }

  buscarPaciente(busqueda:string){
    this.router.navigate(['/buscar',busqueda]);
  }

  descargarEstadisticas(){
    this.json=this._pacientesService.descargarPacientes();
    console.log('esto es el json:',this.json)
  }

  estaslogeado():boolean{
    return this.auth.estaAutenticado();
  }

  cambiarColor(){
    // Get the container element
    var btnContainer = document.getElementById("navbarSupportedContent");
    var btns = btnContainer.getElementsByClassName("btn");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("btn active");
    
        // If there's no active class
        if (current.length > 0) {
          current[0].className = current[0].className.replace(" active", "");
        }
    
        // Add the active class to the current/clicked button
        this.className += " active";
      });
    }
  }

  cerrarSesion():void{
    Swal.fire({title:'¿Cerrar sesión?',icon:'info',showConfirmButton:true,showCancelButton:true,cancelButtonText:'Cancelar',
    cancelButtonColor: '#d33',})
    .then(  resp =>{
      console.log('esto es pa salir',resp)
      if(resp.value){
        this.auth.logout();
        this.router.navigateByUrl('/login');
        Swal.fire({title:'Sesión cerrada',icon:'info'});
      }else{
        var current = document.getElementsByClassName("btn active");
        if (current.length > 0) {
          current[0].className = current[0].className.replace(" active", "");
        }
        document.getElementById("pacientesactivos").className += " active"
        this.router.navigateByUrl('/pacientes');
      }
    })
    
  }

  agregarPaciente(): void{
    this.router.navigate(['/agregarPaciente']);
    //console.log(idx);
}

//////////////////

dynamicDownloadTxt() {
  this.json.subscribe((res) => {
    this.dyanmicDownloadByHtmlTag({
      fileName: 'My Report',
      text: JSON.stringify(res)
    });
  });
}

dynamicDownloadJson() {
  this.json.subscribe((res) => {
    this.dyanmicDownloadByHtmlTag({
      fileName: 'datos_pacientes_ecn.json',
      text: JSON.stringify(res)
    });
  });
}

private dyanmicDownloadByHtmlTag(arg: {
  fileName: string,
  text: string
}) {
  if (!this.setting.element.dynamicDownload) {
    this.setting.element.dynamicDownload = document.createElement('a');
  }
  const element = this.setting.element.dynamicDownload;
  const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
  element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
  element.setAttribute('download', arg.fileName);

  var event = new MouseEvent("click");
  element.dispatchEvent(event);
}

}
