import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
  /**styleUrls: ['./app.component.css']**/
})
export class AppComponent {


  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth'
  };

  public constructor(private titleService: Title) { 
    this.titleService.setTitle("ECN App");
  }
  
}
