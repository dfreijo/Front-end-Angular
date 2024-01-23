import { Component, Input } from '@angular/core';
import City from '../interfaces/city.interface';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  @Input() day!: City | null;
  selectedVideo: File | null = null;
  
    onVideoSelected(event: any) {
      const fileInput = event.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        this.selectedVideo = fileInput.files[0];
      }
    }

    isVideo(video: any): boolean {
      const supportedFormats = ['mp4', 'webm', 'avi']; // Puedes añadir más formatos aquí
      const lowerCaseVideo = video.toLowerCase();
      return supportedFormats.some(format => lowerCaseVideo.includes(format));
    }
    isImage(video: any): boolean {
      const supportedFormats = ['jpg', 'png', 'bmp']; // Puedes añadir más formatos aquí
      const lowerCaseVideo = video.toLowerCase();
      return supportedFormats.some(format => lowerCaseVideo.includes(format));
    }
  }
  

