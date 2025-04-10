import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Seleccion } from '../../shared/entidades/seleccion';

@Injectable({
  providedIn: 'root'
})
export class SeleccionService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url=`${environment.urlService}selecciones/`;
   }

  public listar(): Observable<Seleccion[]> {
    return this.http.get<Seleccion[]>(`${this.url}listar`);
  }

}
