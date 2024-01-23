import { Component, Input, Output } from '@angular/core';
import City from '../interfaces/city.interface';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class DetailComponent {
  @Input() day!: City | null; // Recibe el día seleccionado desde el componente padre

}
