import { Component, OnInit } from '@angular/core';
import { paciente,PacientesService } from '../../services/pacientes.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html'
})
export class EstadisticasComponent implements OnInit {

  pacientes:paciente[]=[];
  male: number=0;
  female: number=0;

  constructor(private _pacientesService:PacientesService,
              private router:Router) { 
    console.log("constructor");
  }
  ngOnInit(): void {
    //this.pacientes=this._pacientesService.getPacientes2();
    //this.countGender();
  }
  
  /*
  countGender(){
    for(let i=0; i<this.pacientes.length;i++){
        if(this._pacientesService.getGender(i)=="M"){
          this.male++;
        }
        if(this._pacientesService.getGender(i)=="F"){
          this.female++;
        }
    }
  }
  */
  
}
