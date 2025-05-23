import { Component, OnInit, ViewChild } from '@angular/core';
import { ReferenciasMaterialModule } from '../../../shared/modules/referencias-material.module';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnMode, DatatableComponent, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { Seleccion } from '../../../shared/entidades/seleccion';
import { SeleccionService } from '../../../core/servicios/seleccion.service';
import { MatDialog } from '@angular/material/dialog';
import { SeleccionEditarComponent } from '../seleccion-editar/seleccion-editar.component';
import { DecidirComponent } from '../../../shared/componentes/decidir/decidir.component';

@Component({
  selector: 'app-seleccion',
  imports: [
    ReferenciasMaterialModule,
    NgFor,
    FormsModule,
    NgxDatatableModule,
  ],
  templateUrl: './seleccion.component.html',
  styleUrl: './seleccion.component.css'
})
export class SeleccionComponent implements OnInit {
  @ViewChild(DatatableComponent) tabla!: DatatableComponent;

  public readonly TAMANO: number = 10;

  public opcionBusqueda: number = -1;
  public opcionesBusqueda: string[] = ["Nombre", "Entidad"];
  public textoBusqueda: string = "";

  public selecciones: Seleccion[] = [];
  public columnas = [
    { name: "Nombre", prop: "nombre" },
    { name: "Entidad Regente", prop: "entidad" }
  ];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;
  public seleccionEscogida: Seleccion | undefined;
  public indiceSeleccionEscogida: number = -1;


  constructor(private servicioSeleccion: SeleccionService,
    private servicioDialogo: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.listar(-1);
  }

  escoger(event: any) {
    if (event.type == "click") {
      this.seleccionEscogida = event.row;
      this.indiceSeleccionEscogida = this.selecciones.findIndex(seleccion => seleccion == this.seleccionEscogida);
    }
  }

  public listar(idBuscado: number) {
    this.servicioSeleccion.listar().subscribe({
      next: response => {
        this.selecciones = response;
        if (idBuscado > 0) {
          this.indiceSeleccionEscogida = this.selecciones.findIndex(seleccion => seleccion.id == idBuscado);
          this.seleccionEscogida = this.selecciones[this.indiceSeleccionEscogida];
          setTimeout(() => {
            this.tabla.offset = Math.floor(this.indiceSeleccionEscogida / this.TAMANO);
          });

        }
      },
      error: error => {
        window.alert(error.message);
      }
    });
  }

  public modificar() {
    if (this.seleccionEscogida) {
      const dialogo = this.servicioDialogo.open(SeleccionEditarComponent, {
        width: "500px",
        height: "300px",
        data: {
          encabezado: `Modicando la Selección ${this.seleccionEscogida.nombre}`,
          seleccion: this.seleccionEscogida
        },
        disableClose: true,
      });
      dialogo.afterClosed().subscribe({
        next: datos => {
          if (datos) {
            this.servicioSeleccion.modificar(datos.seleccion).subscribe({
              next: response => {
                this.selecciones[this.indiceSeleccionEscogida] = response;
              },
              error: error => {
                window.alert(error.message);
              }
            });
          }
        },
        error: error => {
          window.alert(error.message);
        }
      });
    }
    else {
      window.alert("Debe escoger la Selección a modificar");
    }
  }

  public verificarEliminar() {
    if (this.seleccionEscogida) {
      const dialogo = this.servicioDialogo.open(DecidirComponent, {
        width: "300px",
        height: "200px",
        data: {
          encabezado: `Está seguro de eliminar la Selección ${this.seleccionEscogida.nombre} ?`,
          id: this.seleccionEscogida.id
        },
        disableClose: true,
      });
      dialogo.afterClosed().subscribe({
        next: datos => {
          if (datos) {
            this.servicioSeleccion.eliminar(datos.id).subscribe({
              next: response => {
                if (response) {
                  this.listar(-1);
                  window.alert("Selección eliminada con éxito");
                } else {
                  window.alert("No se pudo eliminar la Selección");
                }
              },
              error: error => {
                window.alert(error.message);
              }
            });
          }
        },
        error: error => {
          window.alert(error.message);
        }
      });
    }
    else {
      window.alert("Debe escoger la Selección a modificar");
    }
  }

  public buscar() {
    if (this.textoBusqueda.length > 0) {
      this.servicioSeleccion.buscar(this.opcionBusqueda, this.textoBusqueda).subscribe(
        {
          next: response => {
            this.selecciones = response;
          },
          error: error => {
            window.alert(error.message);
          }
        }
      );
    }
    else {
      this.listar(-1);
    }
  }

  public agregar() {
    const dialogo = this.servicioDialogo.open(SeleccionEditarComponent, {
      width: "500px",
      height: "300px",
      data: {
        encabezado: "Agregando una nueva Selección",
        seleccion: {
          id: 0,
          nombre: "",
          entidad: ""
        }
      },
      disableClose: true,
    });
    dialogo.afterClosed().subscribe({
      next: datos => {
        if (datos) {
          this.servicioSeleccion.agregar(datos.seleccion).subscribe({
            next: response => {
              this.listar(response.id);
            },
            error: error => {
              window.alert(error.message);
            }
          });
        }
      },
      error: error => {
        window.alert(error.message);
      }
    });
  }



}
