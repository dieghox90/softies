import { NgModule } from '@angular/core';
import { EstudiantesComponent } from "./components/estudiantes/estudiantes.component";
import { FormEstudianteComponent } from './components/estudiantes/form-estudiante/form-estudiante.component';
import { DocentesComponent } from './components/docentes/docentes.component';
import { FormDocenteComponent } from './components/docentes/form-docente/form-docente.component';
import { DocentesInactivosComponent } from './components/docentes/docentes-inactivos/docentes-inactivos.component';
import { CarrerasComponent } from './components/carreras/carreras.component';
import { FormCarreraComponent } from './components/carreras/form-carrera/form-carrera.component';
import { PeriodosComponent } from './components/periodos/periodos.component';
import { FormPeriodoComponent } from './components/periodos/form-periodo/form-periodo.component';
import { AsignaturasComponent } from './components/asignaturas/asignaturas.component';
import { FormAsignaturaComponent } from './components/asignaturas/form-asignatura/form-asignatura.component';
import { MatriculasComponent } from './components/matriculas/matriculas.component';
import { FormMatriculaComponent } from './components/matriculas/form-matricula/form-matricula.component';
import { BusquedaMatriculaComponent } from './components/matriculas/busqueda-matricula/busqueda-matricula.component';
import { CargaHorariaComponent } from './components/carga-horaria/carga-horaria.component';
import { ClasificacionesComponent } from './components/evaluacion/clasificaciones/clasificaciones.component';
import { EvaluacionComponent } from './components/evaluacion/evaluacion.component';
import { FormEvaluacionComponent } from './components/evaluacion/form-evaluacion/form-evaluacion.component';
import { CriteriosComponent } from './components/preguntas/criterios/criterios.component';
import { PreguntasComponent } from './components/preguntas/preguntas.component';
import { FormPreguntaComponent } from './components/preguntas/form-pregunta/form-pregunta.component';
import { TiposPreguntasComponent } from './components/preguntas/tipos-preguntas/tipos-preguntas.component';
import { PlanificacionComponent } from './components/docentes/planificacion/planificacion.component';
import { PlanesSemanalesComponent } from './components/docentes/planes-semanales/planes-semanales.component';
import { RestriccionesComponent } from './components/evaluacion/restricciones/restricciones.component';
import { EvaluacionesComponent } from './components/evaluacion/evaluaciones/evaluaciones.component';
import { FormEvaluarComponent } from './components/evaluacion/evaluaciones/form-evaluar/form-evaluar.component';

import { HomeComponent } from './components/home/home.component';
import { ResultadosComponent } from './components/evaluacion/resultados/resultados.component';
import { FormSolicitudComponent } from './components/matriculas/solicitudes/form-solicitud/form-solicitud.component';
import { SolicitudesComponent } from './components/matriculas/solicitudes/solicitudes.component';
import { ExpedientesComponent } from './components/matriculas/expedientes/expedientes.component';
import { AsignaturaInformacionComponent } from './components/estudiantes/asignatura-informacion/asignatura-informacion.component';
import { AsignaturaPlanesComponent } from './components/estudiantes/asignatura-planes/asignatura-planes.component';
import { SeguimientoDocenteComponent } from './components/seguimiento-docente/seguimiento-docente.component';
import { ConfiguracionComponent } from './components/seguimiento-docente/configuracion/configuracion.component';
import { RepositorioComponent } from "./components/repositorio/repositorio.component";
import { RouterModule, Routes } from '@angular/router';


const childRoutes: Routes = [
  { path: "", redirectTo: '/home', pathMatch: 'full' },
  { path: "home", component: HomeComponent},
  { path: "estudiantes", component: EstudiantesComponent},
  { path: "estudiante/form", component: FormEstudianteComponent},
  { path: "estudiante/form/:id", component: FormEstudianteComponent},
  { path: "informacion-asignatura/:id", component: AsignaturaInformacionComponent},
  { path: "planes-asignatura/:id", component: AsignaturaPlanesComponent},
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
  { path: "asignatura/form", component: FormAsignaturaComponent },
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
  { path: "resultados", component: ResultadosComponent },
  { path: "form/solicitudes-matricula", component: FormSolicitudComponent},
  { path: "solicitudes-matricula", component: SolicitudesComponent},
  { path: "seguimiento-docente", component: SeguimientoDocenteComponent},
  { path: "configuración-planes", component: ConfiguracionComponent },
  { path: "repositorio", component: RepositorioComponent},
  
]

@NgModule({
  imports: [
    RouterModule.forChild(childRoutes),
  ],
  exports: [RouterModule]
})
export class ChildRoutesModule { }
