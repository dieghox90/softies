import { Evaluacion } from './evaluacion';
import { TipoPregunta } from './tipo-pregunta';
import { Respuesta } from './respuesta';
import { Subcriterio } from './subcriterio';
import { ResultadoEvaluacion } from './resultado-evaluacion';

export class Pregunta {

    id: number;
    enunciado: string;
    estado: boolean;
    peso: number;
    puntuacion: number;
    create_at: string;
    tipo_pregunta: TipoPregunta;
    respuestas: Respuesta[];
    evaluaciones: Evaluacion[];
    subcriterio: Subcriterio;
    posicion: number;


    //solo para la vista - detalle resultado
    resultados: ResultadoEvaluacion[] = [];

}
