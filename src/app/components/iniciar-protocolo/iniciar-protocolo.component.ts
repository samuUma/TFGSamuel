import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { paciente, PacientesService } from '../../services/pacientes.service';

@Component({
  selector: 'app-iniciar-protocolo',
  templateUrl: './iniciar-protocolo.component.html',
  styleUrls: ['./iniciar-protocolo.component.css']
})
export class IniciarProtocoloComponent implements OnInit {

  pacientes:paciente[]=[];
  paciente:paciente;
  protocolo:InicioProtocolo;
  id:string;

  constructor(private activatedRoute: ActivatedRoute,
    private _pacientesService: PacientesService,
    private router:Router) {
      this.activatedRoute.params.subscribe( params =>{
        //parametro conectado al path de app.routes
        console.log('parametro:',params['id']);
        this.id=params['id'];
     })
     }

  ngOnInit(): void {
    //this.cargando=true;
    this._pacientesService.getPacientes2()
    .subscribe(resp => {
      this.pacientes=resp;
      for(var p of this.pacientes){
        if(p.id==this.id){
          this.paciente=p;
        }
      }
      //this.cargando=false;
    });
  }

  guardar(forma:NgForm){

    if(forma.invalid){
      Object.values(forma.controls).forEach(control => 
        {control.markAllAsTouched()});
        return;
    }

    console.log('valores del formulario',forma.value)
    //mostrar mensaje de espera
    Swal.fire('Espere por favor...','','info');
    Swal.showLoading();

    this.protocolo.estabilidadHemodinamica=forma.value['estabilidadHemodinamica'];
    this.protocolo.perfusion12horas=forma.value['perfusion12horas'];
    this.protocolo.sinAsfixia=forma.value['sinAsfixia'];
    this.protocolo.pesoOSemanasAdecuado=forma.value['pesoOSemanasAdecuado'];
    this.protocolo.calostroOLmDisponible=forma.value['calostroOLmDisponible'];
    console.log('protocolo',this.protocolo)

  }

  checkPesoSemanas(): boolean{

    //console.log('peso',this.paciente.weight)
    //console.log('semanas',this.paciente.pregnancy_period)
    //const checkbox = document.getElementById("pesoOSemanasAdecuado") as HTMLInputElement;
    //console.log('checkbox',checkbox)
    if(this.paciente.weight<1500 || this.paciente.pregnancy_period<32){
      return true;
    }else{
      return false;
    }
  }
}

export class InicioProtocolo{

  estabilidadHemodinamica:boolean;
  perfusion12horas:boolean;
  sinAsfixia:boolean;
  pesoOSemanasAdecuado:boolean;
  calostroOLmDisponible:boolean
}
