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
  cir: number=0;
  nocir: number=0;
  cateter:number=0;
  nocateter:number=0;
  deposiciones:number=0;
  vomitos:number=0;
  abdomen:number=0;
  dias:number=0;
  finalbien:number=0;
  finalMal:number=0;
  finalOtro:number=0;
  nofinal:number=0;
  theme: string | ThemeOption;
  options1;
  options2;
  options3;
  options4;
  options5;
  options6;
 

  initOpts = {
    renderer: 'svg',
    width: 300,
    height: 300
  };

   CoolTheme = {
    color: [
      '#b21ab4',
      '#6f0099',
      '#2a2073',
      '#0b5ea8',
      '#17aecc',
      '#b3b3ff',
      '#eb99ff',
      '#fae6ff',
      '#e6f2ff',
      '#eeeeee'
    ]};

  constructor(private _pacientesService:PacientesService,
              private router:Router) { 
   
  }

  ngOnInit(): void {
    console.log("estadisticas");
    this.cargarDatos()
  }

  cargarDatos(){
    this._pacientesService.setEstadisticasTrue()
    this._pacientesService.setOrdenacionFalse()
    this.cargando=true;
    this._pacientesService.getPacientes2()
    .subscribe(resp => {
      this.pacientes=resp;
      this.cargando=false;
      this.countGender()
      this.countPesos()
      this.countSemanas()
      this.countCir()
      this.countCateter()
      this.countEvolucion()
      this.countFinalizacion()
      this.cargarGrafica()
    });
  }
  
  cargarGrafica(){
    this.options1 = {
      title: {
        text: 'Pacientes según progreso',
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
        data: ['no finalizado aún','finalizado con éxito','fallecido','inacabado']
      },
      calculable: true,
      series: [
        {
          name: '',
          type: 'pie',
          radius: [30, 80],
          roseType: 'area',
          data: [
            { value: this.nofinal, name: 'no finalizado aún' },
            { value: this.finalbien, name: 'finalizado con éxito' },
            { value: this.finalMal, name: 'fallecido' },
            { value: this.finalOtro, name: 'inacabado' }
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

    this.options4 = {
      title: {
        text: 'Pacientes CIR',
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
        data: ['CIR','No CIR']
      },
      calculable: true,
      series: [
        {
          name: '',
          type: 'pie',
          radius: [30, 80],
          roseType: 'area',
          data: [
            { value: this.cir, name: 'CIR' },
            { value: this.nocir, name: 'No CIR' }
          ]
        }
      ]
    };

    this.options5 = {
      title: {
        text: 'Pacientes con catéter umbilical',
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
        data: ['catéter umbilical','sin catéter umbilical']
      },
      calculable: true,
      series: [
        {
          name: '',
          type: 'pie',
          radius: [30, 80],
          roseType: 'area',
          data: [
            { value: this.cateter, name: 'catéter umbilical' },
            { value: this.nocateter, name: 'sin catéter umbilical' }
          ]
        }
      ]
    };

    this.options6 = {
      title: {
        text: 'Deposiciones, vómitos y abdomen normal',
        //subtext: 'Mocking Data',
        x: 'center'
      },
      legend: {
        data: ['Depos  normales', 'Ab normal','vomitos'],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        //data: ['Deposiciones normales','Abdomen normal','Vómitos'],
        silent: false,
        splitLine: {
          show: false,
        },
      },
      xAxisTicks:['Deposiciones normales','Abdomen normal','Vómitos'],
      yAxis:[{
        type: 'value'
      }],
      series: [
        {
          name: 'Deposiciones normales',
          type: 'bar',
          data: [this.deposiciones],
          animationDelay: (idx) => idx * 10,
        },
        {
          name: 'Abdomen normal',
          type: 'bar',
          data: [this.abdomen],
          animationDelay: (idx) => idx * 10 + 100,
        },
        {
          name: 'Vomitos',
          type: 'bar',
          data: [this.vomitos],
          animationDelay: (idx) => idx * 10 + 100,
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
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

  countCir(){
    for(var p of this.pacientes){
      if(p.protocolo.cir==true){
        this.cir++;
      }else{
        this.nocir++
      }
    }
  }

  countCateter(){
    for(var p of this.pacientes){
      if(p.protocolo.cateter==true){
        this.cateter++;
      }else{
        this.nocateter++
      }
    }
  }

  countEvolucion(){
      for(var p of this.pacientes){
        if(p.protocolo.tomas.length>1){
          for(var toma of p.protocolo.tomas){
              if(toma.titulo!='inicio'){
                if(toma.abdomenNormal){
                  this.abdomen++
                }
                if(toma.deposicionesNormales){
                  this.deposiciones++
                }
                if(toma.vomitos){
                  this.vomitos++
                }
                this.dias++
              }
              
            
          }
        }
      }
      console.log('abdomen',this.abdomen)
      console.log('abdomen',this.deposiciones)
      console.log('abdomen',this.vomitos)
      console.log('dias',this.dias)
  }

  countFinalizacion(){
    for(var p of this.pacientes){
      if(p.protocolo.protocoloFinalizado==false){
        this.nofinal++;
      }else{
        if(p.protocolo.protocoloFinalizadoBien==true){
          this.finalbien++
        }else if(p.protocolo.protocoloFinalizadoMal==true){
          this.finalMal++;
        }else{
          this.finalOtro++;
        }
      }
    }
    console.log('no acabado',this.nofinal)
      console.log('exito',this.finalbien)
      console.log('mal',this.finalMal)
      console.log('otro',this.finalOtro)
  }



}
