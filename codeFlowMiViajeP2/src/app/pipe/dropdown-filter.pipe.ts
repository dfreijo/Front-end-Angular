import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dropdownFilter'
})
export class DropdownFilterPipe implements PipeTransform {
  // El método transform recibe los datos a filtrar y los criterios de filtrado
  transform(cities: any[], selectedDay: number | null): any[] {
    // Si no hay datos o no se ha seleccionado un día, devuelve la lista sin filtrar
    if (!cities || !selectedDay) {
      return cities; 
    }
    // Filtra la lista de ciudades por el día seleccionado
    return cities.filter(city => city.day === selectedDay); 
  }
}
