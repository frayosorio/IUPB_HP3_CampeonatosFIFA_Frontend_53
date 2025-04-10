import { Component, OnInit } from '@angular/core';
import { ReferenciasMaterialModule } from '../../../shared/modulos/referencias-material.module';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Seleccion } from '../../../shared/entidades/seleccion';
import { SeleccionService } from '../../../core/servicios/seleccion.service';

@Component({
  selector: 'app-seleccion',
  imports: [
    ReferenciasMaterialModule,
    FormsModule,
    NgFor,
    NgxDatatableModule
  ],
  templateUrl: './seleccion.component.html',
  styleUrl: './seleccion.component.css'
})
export class SeleccionComponent implements OnInit {

  public opcionBusqueda: number = -1;
  public textoBusqueda: string = "";
  public opcionesBusqueda: string[] = ["Nombre", "Entidad regente"];

  public selecciones: Seleccion[] = [];
  public columnas = [
    { name: "Nombre", prop: "nombre" },
    { name: "Entidad Regente", prop: "entidad" }
  ];
  public modoColumna = ColumnMode;

  constructor(private servicioSeleccion: SeleccionService) {
  }
  ngOnInit(): void {
    this.listar();
  }

  public listar() {
    this.servicioSeleccion.listar().subscribe({
      next: response => {
        this.selecciones = response;
      },
      error: error => {

      }
    }
    );
  }

  public buscar() {

  }

}
