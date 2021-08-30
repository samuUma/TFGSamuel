import { Component, OnInit } from '@angular/core';
import { paciente,PacientesService } from '../../services/pacientes.service'
import {Router} from '@angular/router'
import { ThemeOption } from 'ngx-echarts';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls:['./estadisticas.component.html'] 
})
export class EstadisticasComponent implements OnInit {

  pacientes:paciente[]=[];
  male: number=0;
  female: number=0;
  cargando:boolean;
  pesos=[0,0,0,0]
  semanas=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  theme: string | ThemeOption;
  options1;
  options2;
  options3;

  initOpts = {
    renderer: 'svg',
    width: 300,
    height: 300
  };

  constructor(private _pacientesService:PacientesService,
              private router:Router) { 
   
  }

  ngOnInit(): void {
    console.log("estadisticas");
    this.cargarDatos()
  }

  cargarDatos(){
    this.cargando=true;
    this._pacientesService.getPacientes2()
    .subscribe(resp => {
      this.pacientes=resp;
      this.cargando=false;
      this.countGender()
      this.countPesos()
      this.countSemanas()
      this.cargarGrafica()
    });
  }
  
  cargarGrafica(){
    this.options1 = {
      title: {
        text: 'Pacientes según sexo',
        //subtext: 'Mocking Data',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      
      legend: {
        x: 'center',
        y: 'bottom',
        data: ['Masculino','Femenino']
      },
      calculable: true,
      series: [
        {
          name: '',
          type: 'pie',
          radius: [30, 80],
          roseType: 'area',
          data: [
            { value: this.male, name: 'Masculino' },
            { value: this.female, name: 'Femenino' }
          ]
        }
      ]
    };

    this.options2 = {
      title: {
        text: 'Pacientes según peso',
        //subtext: 'Mocking Data',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      
      legend: {
        x: 'center',
        y: 'bottom',
        data: ['<750 g','750-1000 g','1000-1500 g','>1500 g']
      },
      calculable: true,
      series: [
        {
          name: '',
          type: 'pie',
          radius: [30, 80],
          roseType: 'area',
          data: [
            { value: this.pesos[0], name: '<750 g' },
            { value: this.pesos[1], name: '750-1000 g' },
            { value: this.pesos[2], name: '1000-1500 g' },
            { value: this.pesos[3], name: '>1500 g' },
          ]
        }
      ]
    };
    this.options3 = {
      title: {
        text: 'Pacientes según '+'\n'+'semanas de gestación',
        //subtext: 'Mocking Data',
        x: 'center'
      },
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [{
        type: 'value'
      }],
      series: [{
        name: 'Counters',
        type: 'bar',
        barWidth: '60%',
        data: this.semanas,
      }]
    };
  }
  
  countGender(){
    for(var p of this.pacientes){
      if(p.sex=="M"){
        this.male++;
      }else{
        this.female++;
      }
    }
  }

  countPesos(){
    for(var p of this.pacientes){
      if(p.weight<750){
        this.pesos[0]++
      }else if(p.weight>750 && p.weight<1000){
        this.pesos[1]++
      }else if(p.weight>1000 && p.weight<1500){
        this.pesos[2]++
      }else{
        this.pesos[3]++
      }
    }
  }

  countSemanas(){
    for(var p of this.pacientes){
      this.semanas[p.pregnancy_period-24]++;
    }
  }
  
  
}
