import { Grupo } from "./Grupo";
import { Seleccion } from "./Seleccion";

export interface GrupoPais {
    idGrupo: number;
    grupo: Grupo| null;
    idSeleccion: number;
    seleccion: Seleccion| null;
}