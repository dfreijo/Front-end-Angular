import { Injectable } from '@angular/core';
import { Firestore, addDoc, collectionData, collection, doc, deleteDoc, where, query, updateDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { getDocs } from '@firebase/firestore';
import City from '../interfaces/city.interface';

@Injectable({
  providedIn: 'root'
})

export class CodeFlowMiViajeP2Service {

  constructor(private db: Firestore, private storage: Storage) { }

  // CRUD Ciudad
  async addCity(city: City) {
    const cityRef = collection(this.db, 'cities');
    return addDoc(cityRef, city); 
  }
  
  async getCities(filter = '') {
    const cityRef = collection(this.db, 'cities');
    let q = query(cityRef);
    if (filter) {
      q = query(cityRef, where('city', '==', filter));
    }
    return collectionData(q) as unknown as Observable<City[]>;
  }

  async updateCity(city: City, dia: Number, ciudad: String) {
    
    try{
      const cityRef = collection(this.db, 'cities');
      let q = query(cityRef, where('name', '==', ciudad), where('day', '==', dia));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (document) => {
        const docRef = doc(this.db, 'cities', document.id);
        await updateDoc(docRef, { ...city });
      });
    }catch (error) {
      console.error("Error updating city:", error);
    }
  }

  async deleteCity(city: City) {
    const cityRef = collection(this.db, 'cities');
    let q = query(cityRef, where('name', '==', city.name), where('day', '==', city.day));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (document) => {
      const docRef = doc(this.db, 'cities', document.id);
      deleteDoc(docRef);
    });
  }

  async addCityWithVideo(city: City, videoFile: File) {
    // Agregar la ciudad sin el video
    const addedCity = await this.addCity(city);
  
    // Subir el video a Firebase Storage
    if (videoFile) {
      const videoRef = ref(this.storage, `videos/${videoFile.name}`);
      await uploadBytes(videoRef, videoFile);
      
      // Actualizar la ciudad para incluir la URL del video en Firestore
      const videoUrl = await getDownloadURL(videoRef);
      await updateDoc(doc(this.db, 'cities', addedCity.id), { video: videoUrl });
    }
  
    return addedCity;
  }
  
  async UpdateCityWithVideo(city: City, dia: Number, ciudad: String) {
    // Agregar la ciudad sin el video
      const id = await this.obtenerIdPorNombreYDia(ciudad,dia);
      console.log("ID ->" + id);
  
    if (id && city.video instanceof File) {
      try {
        const videoRef = ref(this.storage, `videos/${id}/${city.video.name}`);
        await uploadBytes(videoRef, city.video);
  
        const videoUrl = await getDownloadURL(videoRef);
        console.log('videoUrl:', videoUrl);
  
        // Verifica que videoUrl sea una cadena antes de intentar actualizar Firestore
        if (typeof videoUrl === 'string') {
          const updatedData = { ...city, video: videoUrl };
          await updateDoc(doc(this.db, 'cities', id), updatedData);
        } else {
          console.error('Error: videoUrl is not a string');
        }
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }else{
      await this.updateCity(city,dia,ciudad);
    }
    
  }
 
  async obtenerIdPorNombreYDia(nombre: String, dia: Number): Promise<string | null> {
    try {
      const citiesRef = collection(this.db, 'cities');
      const q = query(citiesRef, where('name', '==', nombre), where('day', '==', dia));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]; // Obtener el primer documento que coincida
        return doc.id;
      } else {
        return null; // No se encontró ningún documento con el nombre y el día especificados
      }
    } catch (error) {
      console.error('Error al obtener ID:', error);
      return null;
    }
  }
}


