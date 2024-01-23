import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CodeFlowMiViajeP2Service } from 'src/app/services/code-flow-mi-viaje-p2.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import City from '../interfaces/city.interface';

@Component({
  selector: 'app-cities',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})

export class CityComponent implements OnInit{
  @Input() selectedCity: City | null = null; 
    // Variable para manejar el estado de la aplicación
  showErrorMessage: boolean = false;
    // Variable para manejar el estado de la aplicación del dropdown
  dropdownOpen: boolean = false;
    // Variable para manejar la aparición del formulario
  showForm: boolean = false;
    // Definición de los formularios reactivos para crear y editar ciudades
  formulario: FormGroup;
  formularioEditar: FormGroup;
    // Variable para almacenar los datos de la ciudad a editar
  cityEdit: City | undefined;
  diaEditar: Number = 0;
  ciudadEditar: String = "";
    // Array para almacenar las ciudades
  cities: City[] = [];
    // Objeto para almacenar los datos del nuevo elemento de la ciudad
  newCity: City = {
    name: '',
    day: 0,
    description: '',
    accomodation: '',
    activities: [],
    video: null,
  };
    // Almacena el valor del filtro de búsqueda
  filterValue: string = '';
    // Almacena el día seleccionado en el filtro del dropdown
  selectedDay: number | null = null;
    // Array para almacenar las ciudades filtradas según el día seleccionado
  filteredCities: City[] = [];

  constructor(
    private codeFlowMiViajeP2Service: CodeFlowMiViajeP2Service,
    private fb: FormBuilder,
  ) {
    // Inicialización del formulario 
    this.formulario = this.fb.group({
      name: [''],
      day: [''],
      description: [''],
      accomodation: [''],
      activities: [],
      video: [null],
    });
    this.formularioEditar = this.fb.group({
      name: [''],
      day: [''],
      description: [''],
      accomodation: [''],
      activities: [],
      video: [''],
    });
  }

  // Método que se ejecuta al inicio del componente
  async ngOnInit() {
    // Obtener las ciudades desde el servicio y suscribirse a los cambios
    (await this.codeFlowMiViajeP2Service.getCities()).subscribe((cities) => {
      // Ordenar las ciudades por el campo 'day' de forma ascendente
      this.cities = cities.sort((a, b) => a.day - b.day);
      this.filteredCities = this.cities;
    });
  }

  // Método para actualizar la lista de ciudades
  async refreshCityList() {
    // Obtener las ciudades desde el servicio y actualizar la variable local
    (await this.codeFlowMiViajeP2Service.getCities()).subscribe((cities) => {
      // Ordenar las ciudades por el campo 'day' de forma ascendente
      this.cities = cities.sort((a, b) => a.day - b.day);
    });
  }

  // Método para alternar el estado de la variable dropdownOpen
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Método para cerrar el menú desplegable
  closeDropdown() {
    this.dropdownOpen = false;
  }

  // Función para selecionar el dia en el dropdown
  onDaySelected(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedDay = selectedValue !== '' ? parseInt(selectedValue, 10) : null;
  }

  // Borra los días seleccionados y ciudades seleccionadas, restableciendo los filtros
  resetFilters() {
    this.selectedDay = null;
    this.filteredCities = this.cities; 
    window.location.reload();
  }

  // Función para mostrar los detalles del día seleccionado
  showDetails(day: City) {
      // Si el día seleccionado ya está mostrándose, ocúltalo
    if (this.selectedCity === day) {
      this.selectedCity = null;
    } else {
      // Si no, muestra los detalles del día seleccionado
      this.selectedCity = day; 
    }
  }

  // Metodo para eliminar un día (ciudad) específico
  async eliminarDia(city: City){
    console.log(city);
    await this.codeFlowMiViajeP2Service.deleteCity(city);
  }

  // Alterna la visibilidad del formulario.
  toggleForm() {
    this.showForm = !this.showForm;
  }

  // Método que se ejecuta al enviar el formulario
  onSubmit() {
    console.log('Método onSubmit() llamado');
    // Obtener los controles del formulario para realizar validaciones
    const nameControl = this.formulario.get('name');
    const dayControl = this.formulario.get('day');
    const descriptionControl = this.formulario.get('description');
    const accomodationControl = this.formulario.get('accomodation');
    const activitiesControl = this.formulario.get('activities');
    const videoControl = this.formulario.get('video');

    // Verificar si los campos obligatorios están vacíos
    if (
      !nameControl?.value ||
      !dayControl?.value ||
      !descriptionControl?.value ||
      !accomodationControl?.value ||
      !activitiesControl?.value
    ) {
      // Mostrar el mensaje de error si falta información obligatoria
      this.showErrorMessage = true;
      return; 
    }

    // Verificar si el formulario es válido
    if (this.formulario.valid) {
      // El formulario es válido, proceder a enviar los datos
      const activitiesValue = this.formulario.get('activities')?.value;
      const activities = activitiesValue ? activitiesValue.split(',') : [];

      // Crear un nuevo objeto City con los datos del formulario
      const newCity: City = {
        name: this.formulario.get('name')?.value || '',
        day: this.formulario.get('day')?.value || 0,
        description: this.formulario.get('description')?.value || '',
        accomodation: this.formulario.get('accomodation')?.value || '',
        activities: activities,
        video: null,
      };

      // Obtener el archivo de video del control del formulario
      const videoFile: File = videoControl?.value;

      // Llamar al servicio para agregar la ciudad
      this.codeFlowMiViajeP2Service.addCityWithVideo(newCity, videoFile ).then((response) => {
        if (response) {
          
          // Actualizar la lista de ciudades y resetear el formulario
          this.refreshCityList();
          this.formulario.reset();
          this.showErrorMessage = false;
          // Cerrar el formulario automáticamente después de enviarlo
          this.toggleForm();
        } else {
          // Realizar alguna acción de validación adicional si es necesario
          console.error('Error al guardar la ciudad.');
        }
      });
    } else {
      // El formulario no es válido, mostramos un mensaje de error
      console.error('El formulario contiene errores o campos obligatorios que no están llenos.');
    }
  }

  // Método que se ejecuta cuando se selecciona un archivo de video en el formulario
  onVideoSelected($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
  
    if (inputElement && inputElement.files) {
      const selectedFile = inputElement.files[0];
  
      if (selectedFile) {
        console.log('Video seleccionado:', selectedFile);
  
        const videoControl = this.formulario.get('video'); 
  
        if (videoControl) {
          videoControl.setValue(selectedFile);
        }
      } else {
        console.error('No se seleccionó ningún archivo.');
      }
    } else {
      console.error('El elemento de entrada no es válido o no tiene archivos.');
    }
  }
  
  // Método que se ejecuta al enviar el formulario de edición
  onSubmitEditar() {
    var activities: string[] = [];
    const activitiesValue = this.formularioEditar.get('activities')?.value;

    if(typeof activitiesValue === 'string'){
       activities = activitiesValue.split(',');
    }else{
      activities = this.formularioEditar.get('activities')?.value;
    }

    const videoControl = this.formularioEditar.get('videoSubido');
    const videoFile: File = videoControl?.value;

    const newCity: City = {
      name: this.formularioEditar.get('name')?.value || '',
      day: this.formularioEditar.get('day')?.value || 0,
      description: this.formularioEditar.get('description')?.value || '',
      accomodation: this.formularioEditar.get('accomodation')?.value || '',
      activities: activities || [],
      video: this.formularioEditar.get('video')?.value || null,
    };

    this.codeFlowMiViajeP2Service.UpdateCityWithVideo(newCity,this.diaEditar,this.ciudadEditar);
    this.closeModal();
  }

  // Método que se ejecuta cuando se selecciona un archivo de video en el formulario editar
  onVideoSelectedEditar($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
  
    if (inputElement && inputElement.files) {
      const selectedFile = inputElement.files[0];
  
      if (selectedFile) {
        console.log('Video seleccionado:', selectedFile);
  
        const videoControl = this.formularioEditar.get('video'); 
  
        if (videoControl) {
          videoControl.setValue(selectedFile);
        }
      } else {
        console.error('No se seleccionó ningún archivo.');
      }
    } else {
      console.error('El elemento de entrada no es válido o no tiene archivos.');
    }
  }

  // Se utiliza para controlar la visibilidad del modal "editar" en la interfaz.
  showModal = false;
  openModal(city: City) {
    this.diaEditar = city.day;
    this.ciudadEditar = city.name;

    this.formularioEditar.patchValue({
      id: city.id,
      name: city.name,
      day: city.day,
      description: city.description,
      accomodation: city.accomodation,
      activities: city.activities,
      video: city.video,
      // Añade aquí otros campos del formulario si los tienes
    });
    this.showModal = true;
  }

  // Cierra el modal
  closeModal() {
    this.showModal = false;
  }
}