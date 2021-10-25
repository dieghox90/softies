import { Clasificacion } from './clasificacion';
import { Pregunta } from './pregunta';
import { Periodo } from './periodo';
import { Evaluador } from './evaluador';
import { ResultadoEvaluacion } from './resultado-evaluacion';

export class Evaluacion {

    id: number;
    porcentaje: number;
    create_at: string;
    etiqueta: string;
    descripcion: string;
    clasificacion: Clasificacion;
    preguntas: Pregunta[];
    periodo: Periodo;
    estado: boolean;
    evaluadores: Evaluador[];
    fecha_fin: string;


    // Esto no esta mapeado
    id_evaluado: number;
    id_evaluador: number;
    asignatura: string;
    paralelo: string;
    id_asignatura: number;
    id_paralelo: number;
    nombre_evaluado: string;
    nombre_evaluador: string;
    numero_preguntas: number;
    preguntas_contestadas: number;

    //esto es para ver si ya han completado la evaluacion
    avance: number = 0;
    resultados: ResultadoEvaluacion[]; //no esta mapeado

}
