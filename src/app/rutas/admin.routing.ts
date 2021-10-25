import { ConfiguracionComponent } from './../components/seguimiento-docente/configuracion/configuracion.component';
import { SeguimientoDocenteComponent } from './../components/seguimiento-docente/seguimiento-docente.component';
import { SolicitudesComponent } from './../components/matriculas/solicitudes/solicitudes.component';
import { FormSolicitudComponent } from './../components/matriculas/solicitudes/form-solicitud/form-solicitud.component';
import { ResultadosComponent } from './../components/evaluacion/resultados/resultados.component';
import { FormEvaluarComponent } from './../components/evaluacion/evaluaciones/form-evaluar/form-evaluar.component';
import { EvaluacionesComponent } from './../components/evaluacion/evaluaciones/evaluaciones.component';
import { TiposPreguntasComponent } from './../components/preguntas/tipos-preguntas/tipos-preguntas.component';
import { FormPreguntaComponent } from './../components/preguntas/form-pregunta/form-pregunta.component';
import { PreguntasComponent } from './../components/preguntas/preguntas.component';
import { CriteriosComponent } from './../components/preguntas/criterios/criterios.component';
import { ClasificacionesComponent } from './../components/evaluacion/clasificaciones/clasificaciones.component';
import { RestriccionesComponent } from './../components/evaluacion/restricciones/restricciones.component';
import { FormEvaluacionComponent } from './../components/evaluacion/form-evaluacion/form-evaluacion.component';
import { EvaluacionComponent } from './../components/evaluacion/evaluacion.component';
import { CargaHorariaComponent } from './../components/carga-horaria/carga-horaria.component';
import { ExpedientesComponent } from './../components/matriculas/expedientes/expedientes.component';
import { BusquedaMatriculaComponent } from './../components/matriculas/busqueda-matricula/busqueda-matricula.component';
import { FormMatriculaComponent } from './../components/matriculas/form-matricula/form-matricula.component';
import { MatriculasComponent } from './../components/matriculas/matriculas.component';
import { FormAsignaturaComponent } from './../components/asignaturas/form-asignatura/form-asignatura.component';
import { AsignaturasComponent } from './../components/asignaturas/asignaturas.component';
import { FormPeriodoComponent } from './../components/periodos/form-periodo/form-periodo.component';
import { PeriodosComponent } from './../components/periodos/periodos.component';
import { FormCarreraComponent } from './../components/carreras/form-carrera/form-carrera.component';
import { CarrerasComponent } from './../components/carreras/carreras.component';
import { FormDocenteComponent } from './../components/docentes/form-docente/form-docente.component';
import { PlanesSemanalesComponent } from './../components/docentes/planes-semanales/planes-semanales.component';
import { HomeComponent } from './../components/home/home.component';
import { PlanificacionComponent } from './../components/docentes/planificacion/planificacion.component';
import { DocentesInactivosComponent } from './../components/docentes/docentes-inactivos/docentes-inactivos.component';
import { DocentesComponent } from './../components/docentes/docentes.component';
import { FormEstudianteComponent } from './../components/estudiantes/form-estudiante/form-estudiante.component';
import { RoleGuard } from './../guards/role.guard';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';


import { EstudiantesComponent } from '../components/estudiantes/estudiantes.component';

const routes: Routes = [
  
  {
    path:'admin',
    component: HomeComponent,
    canActivate: [RoleGuard],
    data: {role:['ROLE_ADMIN']},
    children:[
      { path: "", component: HomeComponent},
      { path: "home", component: HomeComponent},
      { path: "estudiantes", component: EstudiantesComponent},
      { path: "estudiante/form", component: FormEstudianteComponent},
      { path: "estudiante/form/:id", component: FormEstudianteComponent},
      { path: "docentes", component: DocentesComponent},
      { path: "docentes-inactivos", component: DocentesInactivosComponent},
      { path: "docente/planificacion/:id", component: PlanificacionComponent},
      { path: "docente/planes-semanales/:id", component: PlanesSemanalesComponent},
      { path: "docente/form", component: FormDocenteComponent},
      { path: "docente/form/:id", component: FormDocenteComponent},
      { path: "carreras", component: CarrerasComponent},
      { path: "carrera/form", component: FormCarreraComponent},
      { path: "carrera/form/:id", component: FormCarreraComponent},
      { path: "periodos", component: PeriodosComponent},
      { path: "periodo/form", component: FormPeriodoComponent},
      { path: "periodo/form/:id", component: FormPeriodoComponent},
      { path: "asignaturas", component: AsignaturasComponent},
      { path: "asignatura/form", component: FormAsignaturaComponent},
      { path: "asignatura/form/:id", component: FormAsignaturaComponent},
      { path: "matriculas", component: MatriculasComponent},
      { path: "matriculas/:id", component: MatriculasComponent},
      { path: "matricula/form/create/:id_estudiante", component: FormMatriculaComponent},
      { path: "matricula/form/edit/:id_matricula", component: FormMatriculaComponent},
      { path: "matricula/form/solicitud/:id_solicitud", component: FormMatriculaComponent},
      { path: "matricula-busqueda", component: BusquedaMatriculaComponent},
      { path: "matriculas-expedientes", component: ExpedientesComponent},
      { path: "distributivo", component: CargaHorariaComponent},
      { path: "evaluaciones", component: EvaluacionComponent},
      { path: "evaluacion/form", component: FormEvaluacionComponent},
      { path: "evaluacion/form/:id", component: FormEvaluacionComponent},
      { path: "evaluacion/restricciones", component: RestriccionesComponent},
      { path: "clasificaciones", component: ClasificacionesComponent},
      { path: "criterios", component: CriteriosComponent},
      { path: "preguntas", component: PreguntasComponent},
      { path: "pregunta/form", component: FormPreguntaComponent},
      { path: "pregunta/form/:id", component: FormPreguntaComponent},
      { path: "pregunta/tipos", component: TiposPreguntasComponent},
      { path: "evaluacion-docente/:id", component: EvaluacionesComponent},
      { path: "evaluar-docente/form", component: FormEvaluarComponent},
      { path: "resultados", component: ResultadosComponent},
      { path: "form/solicitudes-matricula", component: FormSolicitudComponent},
      { path: "solicitudes-matricula", component: SolicitudesComponent},
      { path: "seguimiento-docente", component: SeguimientoDocenteComponent},
      { path: "configuración-planes", component: ConfiguracionComponent }
      
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
