import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  // El método transform recibe una lista de elementos y un texto de búsqueda
  transform(items: any[], searchText: string): any[] {
  // Si no hay elementos o no hay texto de búsqueda, devuelve la lista sin filtrar
  if (!items || !searchText) {
    return items;
  }
  // Filtra los elementos según el texto de búsqueda proporcionado
  const filteredItems = items.filter((item) => {
    // Convierte el nombre del elemento y el texto de búsqueda a minúsculas para una comparación sin distinción entre mayúsculas y minúsculas
    const cityName = item.name.toLowerCase();
    const searchInput = searchText.toLowerCase();

    // Comprueba si el nombre del elemento incluye el texto de búsqueda
    return cityName.includes(searchInput);
  });
  // Devuelve la lista filtrada
  return filteredItems;
}
}






 