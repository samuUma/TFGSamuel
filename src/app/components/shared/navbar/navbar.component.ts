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

  mantenerColor(){
    if(this.router.url=="/pacientesInactivos"){
      var botonInactivos=document.getElementById("pacientesInactivos");
      botonInactivos.className += " active";
    }
    if(this.router.url=="/pacientes"){
      var botonInactivos=document.getElementById("pacientesactivos");
      botonInactivos.className += " active";
    }
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

  ordenarNombre(){
    this._pacientesService.setOrdenacionNombreTrue()
    console.log('pre:',this._pacientesService.getOrdenacionPredeterminada(),'nom:',this._pacientesService.getOrdenacionNombre(),
    'fecha:',this._pacientesService.getOrdenacionFecha())
  }

  ordenarFecha(){
    this._pacientesService.setOrdenacionFechaTrue()
  }

  ordenarPredeterminado(){
    this._pacientesService.setOrdenacionPredeterminadaTrue()
    console.log('pre:',this._pacientesService.getOrdenacionPredeterminada(),'nom:',this._pacientesService.getOrdenacionNombre(),
    'fecha:',this._pacientesService.getOrdenacionFecha())
  }

  devolverUrl(){
    return this.router.url;
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

downloadFile(data, filename='data') {
  let csvData = this.ConvertToCSV(data, ['birthdate','first_name', 'last_name', 'pregnancy_period', 'protocol','protocolo','sex','weight']);
  console.log(csvData)
  let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
  let dwldLink = document.createElement("a");
  let url = URL.createObjectURL(blob);
  let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
  if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
  }
  dwldLink.setAttribute("href", url);
  dwldLink.setAttribute("download", filename + ".csv");
  dwldLink.style.visibility = "hidden";
  document.body.appendChild(dwldLink);
  dwldLink.click();
  document.body.removeChild(dwldLink);
}

ConvertToCSV(objArray, headerList) {
   let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
   let str = '';
   let row = 'S.No,';

   for (let index in headerList) {
       row += headerList[index] + ',';
   }
   row = row.slice(0, -1);
   str += row + '\r\n';
   for (let i = 0; i < array.length; i++) {
       let line = (i+1)+'';
       for (let index in headerList) {
          let head = headerList[index];

           line += ',' + array[i][head];
       }
       str += line + '\r\n';
   }
   return str;
}

descargarCSV(){
  this.downloadFile(this.json, 'datos_pacientes_ecn');
}

}
