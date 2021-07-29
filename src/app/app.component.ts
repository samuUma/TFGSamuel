import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
  /**styleUrls: ['./app.component.css']**/
})
export class AppComponent {
  title = 'ECNApp';

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth'
  };
  
}
