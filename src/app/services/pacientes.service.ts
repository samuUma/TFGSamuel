import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { PacienteComponent } from '../components/paciente/paciente.component';
import { config, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InicioProtocolo } from '../components/iniciar-protocolo/iniciar-protocolo.component';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';

@Injectable()
export class PacientesService{
    
    
    private url ='https://app-angular-tutorial-default-rtdb.europe-west1.firebasedatabase.app/';
    private pacientes:paciente[];
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    firebaseConfig = {
      apiKey: "AIzaSyBtC6Ujqymj6wEjLtCqOO-snXtXOdgzeM4",
      authDomain: "app-angular-tutorial.firebaseapp.com",
      databaseURL: "https://app-angular-tutorial-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "app-angular-tutorial",
      storageBucket: "app-angular-tutorial.appspot.com",
      messagingSenderId: "57704641855",
      appId: "1:57704641855:web:6e203d4008024b18cf4f8a",
      measurementId: "G-V0JCXG24H5"
    };

    ordenacion:boolean;
    ordenacionNombre:boolean=false;
    ordenacionFecha:boolean=false;
    ordenacionPredeterminada:boolean=true;
    estadisticas:boolean;

    constructor(private router:Router,private http: HttpClient){
    
    }
    
    getPacientes(){
        return this.pacientes;
    }

    ngOnInit(): void {
    
        this.getPacientes2()
        .subscribe(resp => {
          console.log('pacientes servicio:',resp);
          this.pacientes=resp;
        });
    }

    descargarPacientes(){
        return this.http.get(`${this.url}.json`)
    }

    getPacientes2(){
        return this.http.get(`${this.url}.json`)
        .pipe(
            map( this.crearArray )
        );
    }

    private crearArray( Objeto: object){
        const pacientes: paciente[]=[];
        if(Objeto===null){
            return [];
        }
        Object.keys(Objeto).forEach(key => {
            const paciente: paciente = Objeto[key];
            paciente.id=key;

            pacientes.push(paciente);
        })
        return pacientes;
    }

    buscarPacientes(termino:string):paciente[]{
        let tempPacients:paciente[]=[];
        termino=termino.toLowerCase();
        for(let pacient of this.pacientes){
            let nombre=pacient.first_name.toLocaleLowerCase();
            if(nombre.indexOf(termino)>=0){
                tempPacients.push(pacient);
            }
        }
        return tempPacients;
    }

    getOrdenacion(){
        return this.ordenacion;
    }
    
    setOrdenacionTrue(){
       this.ordenacion=true;
    }

    setOrdenacionFalse(){
        this.ordenacion=false;
    }

    getEstadisticas(){
        return this.estadisticas;
    }
    
    setEstadisticasTrue(){
       this.estadisticas=true;
    }

    setEstadisticasFalse(){
        this.estadisticas=false;
    }

    crearPaciente(paciente:paciente){
        console.log('paciente ingresado con exito',`${this.url}.json`,paciente);
        paciente.protocol=false;
        console.log('el paciente es:',paciente)
        return this.http.post(`${this.url}.json`,paciente)
        .pipe(
            map( (resp: any) => {
              paciente.id=resp.name;
              return paciente;
            })
          );
    }

    borrarPaciente(idx: string) {
        return this.http.delete(`${this.url}/${idx}.json`);
      }

    actualizarPaciente(paciente: paciente) {

        const pacienteTemp={
            ...paciente
        }
        delete pacienteTemp.id;
        return this.http.put(`${this.url}/${paciente.id}.json`,pacienteTemp);
      }
    
    getGender(i: string): string {
        for(var index in this.pacientes){
            if(this.pacientes[index].id == i){
                return this.pacientes[index].sex;
            }
        }
      }

    setOrdenacionNombreTrue(){
        this.ordenacionNombre=true;
        this.setOrdenacionFechaFalse()
        this.setOrdenacionPredeterminadaFalse()
    }
    
    setOrdenacionNombreFalse(){
        this.ordenacionNombre=false;
    }

    setOrdenacionFechaTrue(){
        this.ordenacionFecha=true;
        this.setOrdenacionNombreFalse()
        this.setOrdenacionPredeterminadaFalse()
    }
    
    setOrdenacionFechaFalse(){
        this.ordenacionFecha=false;
    }

    setOrdenacionPredeterminadaFalse(){
        this.ordenacionPredeterminada=false;
    }

    setOrdenacionPredeterminadaTrue(){
        this.ordenacionPredeterminada=true;
        this.setOrdenacionFechaFalse()
        this.setOrdenacionNombreFalse()
    }

    getOrdenacionNombre(){
        return this.ordenacionNombre;
    }

    getOrdenacionFecha(){
        return this.ordenacionFecha;
    }

    getOrdenacionPredeterminada(){
        return this.ordenacionPredeterminada;
    }
}

export class paciente{
    id:string;
    first_name:string;
    last_name:string;
    birthdate:string;
    sex:string;
    pregnancy_period:number;
    weight:number;
    protocol:boolean=false;
    protocolo:InicioProtocolo={
        estabilidadHemodinamica: false,
        perfusion12horas: false,
        sinAsfixia: false,
        pesoOSemanasAdecuado:false,
        calostroOLmDisponible:false,
        cir:false,
        cateter:false,
        fechaInicio:"",
        acortarProtocolo:false,
        protocoloFinalizado:false,
        protocoloFinalizadoBien:false,
        protocoloFinalizadoMal:false,
        protocoloFinalizadoOtro:false,
        tomas:[{titulo:'inicio',fecha:'fecha inicial',deposicionesNormales:'inicio',vomitos:'inicio',abdomenNormal:'inicio'}]
    }
}