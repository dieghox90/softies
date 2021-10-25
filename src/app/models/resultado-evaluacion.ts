export class ResultadoEvaluacion {
    /*Esta clase no esta mapeada en la base de datos, sirve solo para la vista
        para presentar la informacion
    */

    nombre: String; // nombtr del tipo de respuesta = Siempre, Casi siempre, a veces y nunca
    total: number = 0; // el numero de frecunecia de cada tipo de respuesta
}
