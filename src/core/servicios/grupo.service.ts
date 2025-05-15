import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TablaPosicionesDTO } from '../../shared/dto/tablaposiciones.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.urlService}grupos/`;
  }


    // ***** Tabla de Posiciones *****

  public listarTablaPosiciones(idGrupo: number): Observable<TablaPosicionesDTO[]> {
    return this.http.get<TablaPosicionesDTO[]>(`${this.url}tablaposiciones/${idGrupo}`);
  }
}
