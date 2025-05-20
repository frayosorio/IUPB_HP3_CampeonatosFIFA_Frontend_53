import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReferenciasMaterialModule } from '../../../shared/modules/referencias-material.module';
import { TablaPosicionesDTO } from '../../../shared/dto/tablaposiciones.dto';

export interface DatosPosiciones {
  encabezado: string;
  posiciones: TablaPosicionesDTO[];
}

@Component({
  selector: 'app-grupo-posiciones',
  imports: [
    ReferenciasMaterialModule,
    NgxDatatableModule,
  ],
  templateUrl: './grupo-posiciones.component.html',
  styleUrl: './grupo-posiciones.component.css'
})
export class GrupoPosicionesComponent {

public columnas = [
    { name: "Seleccion", prop: "pais", width: 150  },
    { name: "PJ", prop: "pj", width: 50 },
    { name: "PG", prop: "pg", width: 50 },
    { name: "PE", prop: "pe", width: 50 },
    { name: "PP", prop: "pp", width: 50 },
    { name: "GF", prop: "gf", width: 50 },
    { name: "GC", prop: "gc", width: 50 },
    { name: "Puntos", prop: "puntos", width: 50 },
  ];
  public modoColumna = ColumnMode;

  constructor(@Inject(MAT_DIALOG_DATA) public datos: DatosPosiciones,
    public dialogRef: MatDialogRef<GrupoPosicionesComponent>,
  ) {

  }

  cerrar() {
    this.dialogRef.close();
  }

}

