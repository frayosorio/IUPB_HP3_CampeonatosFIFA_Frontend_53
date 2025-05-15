import { Component, OnInit, ViewChild } from '@angular/core';
import { ReferenciasMaterialModule } from '../../../shared/modules/referencias-material.module';
import { Campeonato } from '../../../shared/entidades/campeonato';
import { ColumnMode, DatatableComponent, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { CampeonatoService } from '../../../core/servicios/campeonato.service';
import { MatDialog } from '@angular/material/dialog';
import { CampeonatoEditarComponent } from '../campeonato-editar/campeonato-editar.component';
import { DecidirComponent } from '../../../shared/componentes/decidir/decidir.component';
import { FormsModule } from '@angular/forms';
import { Seleccion } from '../../../shared/entidades/seleccion';
import { SeleccionService } from '../../../core/servicios/seleccion.service';

@Component({
  selector: 'app-campeonato',
  imports: [
    ReferenciasMaterialModule,
    FormsModule,
    NgxDatatableModule
  ],
  templateUrl: './campeonato.component.html',
  styleUrl: './campeonato.component.css'
})
export class CampeonatoComponent implements OnInit {
  @ViewChild(DatatableComponent) tabla!: DatatableComponent;

  public readonly TAMANO: number = 10;

  public opcionBusqueda: number = -1;
  public opcionesBusqueda: string[] = ["Nombre", "Año", "País Organizador"];
  public textoBusqueda: string = "";

  public selecciones: Seleccion[] = [];
  public campeonatos: Campeonato[] = [];
  public columnas = [
    { name: "Nombre", prop: "nombre" },
    { name: "Año", prop: "año" },
    { name: "País Organizador", prop: "paisOrganizador.nombre" }
  ];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;
  public campeonatoEscogido: Campeonato | undefined;
  public indiceCampeonatoEscogido: number = -1;


  constructor(private servicioCampeonato: CampeonatoService,
    private servicioSeleccion: SeleccionService,
    private servicioDialogo: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.listar(-1);
    this.listarSelecciones();
  }

  escoger(event: any) {
    if (event.type == "click") {
      this.campeonatoEscogido = event.row;
      this.indiceCampeonatoEscogido = this.campeonatos.findIndex(campeonato => campeonato == this.campeonatoEscogido);
    }
  }

  public listarSelecciones() {
    this.servicioSeleccion.listar().subscribe({
      next: response => {
        this.selecciones = response;
      },
      error: error => {
        window.alert(error.message);
      }
    });
  }

  public listar(idBuscado: number) {
    this.servicioCampeonato.listar().subscribe({
      next: response => {
        this.campeonatos = response;
        if (idBuscado > 0) {
          this.indiceCampeonatoEscogido = this.campeonatos.findIndex(campeonato => campeonato.id == idBuscado);
          this.campeonatoEscogido = this.campeonatos[this.indiceCampeonatoEscogido];
          setTimeout(() => {
            this.tabla.offset = Math.floor(this.indiceCampeonatoEscogido / this.TAMANO);
          });

        }
      },
      error: error => {
        window.alert(error.message);
      }
    });
  }

  public modificar() {
    if (this.campeonatoEscogido) {
      this.campeonatoEscogido.year = this.campeonatoEscogido.año;
      const dialogo = this.servicioDialogo.open(CampeonatoEditarComponent, {
        width: "500px",
        height: "400px",
        data: {
          encabezado: `Modicando el Campeonato ${this.campeonatoEscogido.nombre}`,
          campeonato: { ...this.campeonatoEscogido },
          selecciones: this.selecciones
        },
        disableClose: true,
      });
      dialogo.afterClosed().subscribe({
        next: datos => {
          if (datos) {
            datos.campeonato.año = datos.campeonato.year;
            this.servicioCampeonato.modificar(datos.campeonato).subscribe({
              next: response => {
                this.campeonatos[this.indiceCampeonatoEscogido] = response;
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
      window.alert("Debe escoger el Campeonato a modificar");
    }
  }

  public verificarEliminar() {
    if (this.campeonatoEscogido) {
      const dialogo = this.servicioDialogo.open(DecidirComponent, {
        width: "300px",
        height: "200px",
        data: {
          encabezado: `Está seguro de eliminar el Campeonato ${this.campeonatoEscogido.nombre} ?`,
          id: this.campeonatoEscogido.id
        },
        disableClose: true,
      });
      dialogo.afterClosed().subscribe({
        next: datos => {
          if (datos) {
            this.servicioCampeonato.eliminar(datos.id).subscribe({
              next: response => {
                if (response) {
                  this.listar(-1);
                  window.alert("Campeonato eliminado con éxito");
                } else {
                  window.alert("No se pudo eliminar el Campeonato");
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
      window.alert("Debe escoger el Campeonato a modificar");
    }
  }

  public buscar() {
    if (this.textoBusqueda.length > 0) {
      this.servicioCampeonato.buscar(this.opcionBusqueda, this.textoBusqueda).subscribe(
        {
          next: response => {
            this.campeonatos = response;
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
    const dialogo = this.servicioDialogo.open(CampeonatoEditarComponent, {
      width: "500px",
      height: "400px",
      data: {
        encabezado: "Agregando un nuevo Campeonato",
        campeonato: {
          id: 0,
          nombre: "",
          paisOrganizador: {
            id: 0, nombre: "", entidad: ""
          },
          idSeleccion: 0,
          año: 0,
          year: 0
        },
        selecciones: this.selecciones
      },
      disableClose: true,
    });
    dialogo.afterClosed().subscribe({
      next: datos => {
        if (datos) {
          datos.campeonato.año = datos.campeonato.year;
          this.servicioCampeonato.agregar(datos.campeonato).subscribe({
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

