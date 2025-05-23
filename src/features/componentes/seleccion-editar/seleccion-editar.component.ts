import { Component, Inject } from '@angular/core';
import { Seleccion } from '../../../shared/entidades/seleccion';
import { ReferenciasMaterialModule } from '../../../shared/modules/referencias-material.module';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DatosEdicionSeleccion {
  encabezado: string;
  seleccion: Seleccion;
}

@Component({
  selector: 'app-seleccion-editar',
  imports: [
    ReferenciasMaterialModule,
    FormsModule
  ],
  templateUrl: './seleccion-editar.component.html',
  styleUrl: './seleccion-editar.component.css'
})
export class SeleccionEditarComponent {


  constructor(@Inject(MAT_DIALOG_DATA) public datos: DatosEdicionSeleccion,
    private referenciaDialogo: MatDialogRef<SeleccionEditarComponent>) {

  }

  public cerrar() {
    this.referenciaDialogo.close();
  }

}
