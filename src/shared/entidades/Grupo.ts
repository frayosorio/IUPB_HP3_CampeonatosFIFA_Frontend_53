import { Campeonato } from "./Campeonato";

export interface Grupo {
    id: number;
    idCampeonato: number;
    campeonato: Campeonato;
    nombre: string;
    paises: string;
}