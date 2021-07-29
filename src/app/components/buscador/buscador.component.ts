import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {paciente,PacientesService} from '../../services/pacientes.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html'
})
export class BuscadorComponent implements OnInit {

  pacientes:paciente[]=[];
  pacientesBuscados:paciente[]=[];
  paciente:paciente;
  termino:string;
  constructor(private activatedRoute:ActivatedRoute,
              private _pacientesService:PacientesService,
              private router:Router) {
               }

  ngOnInit(): void {
    this._pacientesService.getPacientes2()
    .subscribe(resp => {
     // console.log(resp);
      this.pacientes=resp;
      console.log('pacientes donde buscar',this.pacientes);
    });
    this.activatedRoute.params.subscribe(params =>{
      this.termino=params['termino'];
      console.log('termino busqueda',this.termino)
    });
    this.ejecutarBusqueda();
    
  }
  ejecutarBusqueda() {
    this.buscarPacientes(this.termino);
    console.log('busco:',this.termino,'en:',this.pacientes)
  }
  
  verPaciente(id:string): void{
    this.router.navigate(['/paciente',id]);
    console.log(id);
}

buscarPacientes(termino:string):void{
  let tempPacients:paciente[]=[];
  termino=termino.toLowerCase();
  console.log('pacientesBuscados',this.pacientesBuscados)
  /*
  for(let i=0;i<this.pacientes.length;i++){
    let nombre=this.pacientes[i].first_name.toLocaleLowerCase();
      if(nombre.indexOf(termino)>=0){
          this.pacientesBuscados.push(this.pacientes[i]);
      }
  }
  */
  
  for(var pacient of this.pacientes){
    console.log('iteraciones:',pacient)
      let nombre=pacient.first_name.toLocaleLowerCase();
      if(nombre.indexOf(termino)>=0){
          console.log('coincidencia',pacient);
          this.pacientesBuscados.push(pacient);
      }
  }
  
  console.log('pacientesBuscados',this.pacientesBuscados)
  
}

}



