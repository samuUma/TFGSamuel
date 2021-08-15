import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { PacienteComponent } from '../components/paciente/paciente.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PacientesService{
    
    
    private url ='https://app-angular-tutorial-default-rtdb.europe-west1.firebasedatabase.app/';
    private pacientes:paciente[];

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

    /*
    getPaciente( idx: number): paciente{
        //return this.pacientes[idx];
        for(var index in this.pacientes){
            if(this.pacientes[index].id == idx){
                return this.pacientes[index];
            }
        }
    }
    */

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

    actualizarProtocolo(paciente:paciente){
        paciente.protocol=true;
    }
    /*
    getGender(i: string): string {
        for(var index in this.pacientes){
            if(this.pacientes[index].id == i){
                return this.pacientes[index];
            }
        }
      }
    */

}

export class paciente{
    id:string;
    first_name:string;
    last_name:string;
    birthdate:string;
    sex:string;
    pregnancy_period:number;
    weight:number;
    protocol:boolean
}