import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { paciente, PacientesService } from '../../services/pacientes.service';
import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';


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

  alarma:boolean;
  atencion='Atención';
  textos:string[];
  textoPesoSemanas='El peso o semanas de gestación del paciente no es apropiado para este protocolo.'
  textoLeche='Se recomienda posponer el protocolo hasta que haya leche materna o calostro disponible.'
  textoCir='Los pacientes CIR que no presenten factores de riesgo para el intestino deben empezar el protocolo alimenticio el segundo día de vida.'
  textoCateter='Los pacientes con catéteres umbilicales que no presenten factores de riesgo para el intestino pueden empezar el protocolo alimenticio.'
  
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
    this.protocolo=new InicioProtocolo();
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

    this.alarma=false;
    this.textos=new Array();  

    if(forma.invalid){
      Object.values(forma.controls).forEach(control => 
        {control.markAllAsTouched()});
        return;
    }

    console.log('valores del formulario',forma.value)

    this.protocolo.estabilidadHemodinamica=forma.value['estabilidadHemodinamica'];
    this.protocolo.perfusion12horas=forma.value['perfusion12horas'];
    this.protocolo.sinAsfixia=forma.value['sinAsfixia'];
    this.protocolo.pesoOSemanasAdecuado=forma.value['pesoOSemanasAdecuado'];
    this.protocolo.calostroOLmDisponible=forma.value['calostroOLmDisponible'];
    this.protocolo.cir=forma.value['cir'];
    this.protocolo.cateter=forma.value['cateter'];

    if(!this.protocolo.pesoOSemanasAdecuado){
      this.protocolo.pesoOSemanasAdecuado=false;
    }
    if(!this.protocolo.calostroOLmDisponible){
      this.protocolo.calostroOLmDisponible=false;
    }
    if(!this.protocolo.cir){
      this.protocolo.cir=false;
    }
    if(!this.protocolo.cateter){
      this.protocolo.cateter=false;
    }
    console.log('protocolo',this.protocolo)

    
  

    if(this.checkPesoSemanas && !this.protocolo.pesoOSemanasAdecuado){
      this.textos.push(this.textoPesoSemanas);
      this.alarma=true;
    }
    if(!this.protocolo.calostroOLmDisponible){
      this.textos.push(this.textoLeche);
      this.alarma=true;
    }
    if(this.protocolo.cir){
      this.textos.push(this.textoCir);
      this.alarma=true;
    }
    if(this.protocolo.cateter){
      this.textos.push(this.textoCateter);
      this.alarma=true;
    }

    if(this.alarma){
      this.terminarFormulario(this.atencion,this.textos)
    }else{
      this.terminarFormulario2();
    }

  }

  terminarFormulario2():void{
    this._pacientesService.actualizarProtocolo(this.paciente);
        this._pacientesService.actualizarPaciente(this.paciente)
        .subscribe(resp => {
        });
        this.ngOnInit();
        this.router.navigateByUrl('/home');
      Swal.fire({title:'Protocolo iniciado con éxito',icon:'info'});
  }

  terminarFormulario(titulo:string,textos:string[]): void{

    Swal.fire({title:titulo,html:textos.join('<br>'),
      icon:'info',showConfirmButton:true,showCancelButton:true})
     .then(  resp =>{
     if(resp.value){
       this._pacientesService.actualizarProtocolo(this.paciente);
       this._pacientesService.actualizarPaciente(this.paciente)
       .subscribe(resp => {
       });
       this.ngOnInit();
       this.router.navigateByUrl('/home');
       Swal.fire({title:'Protocolo iniciado con éxito',icon:'info'});
     } 
   })
  }

  checkPesoSemanas(): boolean{
    if(this.paciente.weight<1500 || this.paciente.pregnancy_period<32){
      return true;
    }else{
      return false;
    }
  }

  verPaciente(idx:string): void{
    this.router.navigate(['/paciente',idx]);
    //console.log(idx);
  }
  
}

export class InicioProtocolo{

  estabilidadHemodinamica:boolean;
  perfusion12horas:boolean;
  sinAsfixia:boolean;
  pesoOSemanasAdecuado:boolean;
  calostroOLmDisponible:boolean;
  cir:boolean;
  cateter:boolean
}
