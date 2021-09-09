import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { paciente, PacientesService } from '../../services/pacientes.service';
import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { formatCurrency } from '@angular/common';


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

    if(forma.value['estabilidadHemodinamica']=="false"){
      forma.form.controls['estabilidadHemodinamica'].setErrors({'incorrect': true});
        return;
    }

    if(forma.value['perfusion12horas']=="false"){
      forma.form.controls['perfusion12horas'].setErrors({'incorrect': true});
        return;
    }
    if(forma.value['sinAsfixia']=="false"){
      forma.form.controls['sinAsfixia'].setErrors({'incorrect': true});
        return;
    }
    
    if(forma.invalid){
      Object.values(forma.controls).forEach(control => 
        {control.markAllAsTouched()});
        return;
    }
    
    console.log('valores del formulario',forma.value)

    this.protocolo.estabilidadHemodinamica=forma.value['estabilidadHemodinamica'];
    this.protocolo.perfusion12horas=forma.value['perfusion12horas'];
    this.protocolo.sinAsfixia=forma.value['sinAsfixia'];
    if(forma.value['pesoOSemanasAdecuado']=="false"){
      this.protocolo.pesoOSemanasAdecuado=false;
    }else{
      this.protocolo.pesoOSemanasAdecuado=true;
    }
    if(forma.value['calostroOLmDisponible']=="false"){
      this.protocolo.calostroOLmDisponible=false;
    }else{
      this.protocolo.calostroOLmDisponible=true;
    }
    if(forma.value['cir']=="false"){
      this.protocolo.cir=false;
    }else{
      this.protocolo.cir=true;
    }
    if(forma.value['cateter']=="false"){
      this.protocolo.cateter=false;
    }else{
      this.protocolo.cateter=true;
    }
    this.protocolo.protocoloFinalizado=false;
    this.protocolo.protocoloFinalizadoBien=false;
    this.protocolo.protocoloFinalizadoMal=false;
    this.protocolo.protocoloFinalizadoOtro=false;
    /*
    this.protocolo.calostroOLmDisponible=forma.value['calostroOLmDisponible'];
    this.protocolo.cir=forma.value['cir'];
    this.protocolo.cateter=forma.value['cateter'];

    if(!this.protocolo.pesoOSemanasAdecuado){
      console.log('peso',this.protocolo.pesoOSemanasAdecuado)
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
    */
    console.log('protocolo',this.protocolo)

    
  

    if(this.checkPesoSemanas && !this.protocolo.pesoOSemanasAdecuado){
      console.log('peso',this.checkPesoSemanas())
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

    //this.protocolo.fechaInicio=new Date().toISOString()
    this.protocolo.fechaInicio=new Date().toLocaleDateString()
    this.protocolo.acortarProtocolo=false;
    console.log('que pasa protocolo',this.valoresProtocolo(this.protocolo))
    this.paciente.protocolo=this.protocolo;
    if(this.alarma){
      this.terminarFormulario(this.atencion,this.textos,forma)
    }else{
      this.terminarFormulario2();
    }

  }

  
  terminarFormulario2():void{
    this.paciente.protocol=true;
    this._pacientesService.actualizarPaciente(this.paciente)
        .subscribe(resp => {
        });
        this.router.navigateByUrl('/home');
        this.ngOnInit();
      Swal.fire({title:'Protocolo iniciado con éxito',icon:'info'});
  }

  terminarFormulario(titulo:string,textos:string[],forma:NgForm): void{

    Swal.fire({title:titulo,html:textos.join('<br>'),
      icon:'info',showConfirmButton:true,showCancelButton:true,
      cancelButtonText:'Cancelar',
      cancelButtonColor: '#d33',})
     .then(  resp =>{
     if(resp.value){
      this.paciente.protocol=true;
       this._pacientesService.actualizarPaciente(this.paciente)
       .subscribe(resp => {
       });
       this.router.navigateByUrl('/home');
       this.ngOnInit();
       Swal.fire({title:'Protocolo iniciado con éxito',icon:'info'});
     }else{
       forma.resetForm()
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

  valoresProtocolo(proto:InicioProtocolo): string[] {
    var valoresTemp = new Array();
    valoresTemp.push(String(proto.estabilidadHemodinamica))
    valoresTemp.push(String(proto.perfusion12horas))
    valoresTemp.push(String(proto.sinAsfixia))
    valoresTemp.push(String(proto.pesoOSemanasAdecuado))
    valoresTemp.push(String(proto.calostroOLmDisponible))
    valoresTemp.push(String(proto.cir))
    valoresTemp.push(String(proto.cateter))
    valoresTemp.push(String(proto.fechaInicio))
    return valoresTemp;
  }
  
}

export class InicioProtocolo{
  estabilidadHemodinamica:boolean;
  perfusion12horas:boolean;
  sinAsfixia:boolean;
  pesoOSemanasAdecuado:boolean;
  calostroOLmDisponible:boolean;
  cir:boolean;
  cateter:boolean;
  fechaInicio:string;
  acortarProtocolo:boolean;
  protocoloFinalizado:boolean;
  protocoloFinalizadoBien:boolean;
  protocoloFinalizadoMal:boolean;
  protocoloFinalizadoOtro:boolean;
  tomas=[{titulo:'inicio',fecha:'fecha inicial',deposicionesNormales:'inicio',vomitos:'inicio',abdomenNormal:'inicio'}]
}



