import { Ciclo } from './ciclo';

export class Asignatura {
    id: number;
    nombre: string;
    numero_autonomos: number;
    numero_docencia: number;
    numero_experimentacion: number;
    estado: boolean;
    ciclo: Ciclo;
    etiqueta: string;

    //no esta mapeada, se ultilza solo para los checkBox
    estado_asig_mat: boolean;



    // Esto no esta mapeado sirve unicamente para el repositorio
    guia: string;
    ruta_guia: string;
    silabo: string;
    ruta_silabo: string;
    

    public Asignatura() {
        this.estado_asig_mat = false;
    }




}
