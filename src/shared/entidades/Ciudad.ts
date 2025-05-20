import { Seleccion } from "./Seleccion";

export interface Ciudad {
    id: number;
    nombre: string;
    idPais: number;
    pais: Seleccion;
}