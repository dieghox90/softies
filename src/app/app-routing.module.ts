import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
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
import { LoginComponent } from './components/usuarios/login/login.component';
import { AppLayoutComponent } from './_layout/app-layout/app-layout.component';
import { HomeComponent } from './components/home/home.component';
import { RoleGuard } from './guards/role.guard';
import { ResultadosComponent } from './components/evaluacion/resultados/resultados.component';
import { FormSolicitudComponent } from './components/matriculas/solicitudes/form-solicitud/form-solicitud.component';
import { SolicitudesComponent } from './components/matriculas/solicitudes/solicitudes.component';
import { ExpedientesComponent } from './components/matriculas/expedientes/expedientes.component';
import { AsignaturaInformacionComponent } from './components/estudiantes/asignatura-informacion/asignatura-informacion.component';
import { AsignaturaPlanesComponent } from './components/estudiantes/asignatura-planes/asignatura-planes.component';
import { SeguimientoDocenteComponent } from './components/seguimiento-docente/seguimiento-docente.component';
import { ConfiguracionComponent } from './components/seguimiento-docente/configuracion/configuracion.component';



const routes: Routes = [
  {
    path: '', component: AppLayoutComponent,
    children: [
      { path: "", redirectTo: '/home', pathMatch: 'full' },
      { path: "home", component: HomeComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_ESTUDIANTE', 'ROLE_DOCENTE', 'ROLE_SECRETARIA'] } },
      { path: "estudiantes", component: EstudiantesComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_SECRETARIA'] } },
      { path: "estudiante/form", component: FormEstudianteComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
      { path: "estudiante/form/:id", component: FormEstudianteComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
      { path: "informacion-asignatura/:id", component: AsignaturaInformacionComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ESTUDIANTE'] } },
      { path: "planes-asignatura/:id", component: AsignaturaPlanesComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ESTUDIANTE'] } },
      { path: "docentes", component: DocentesComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
      { path: "docentes-inactivos", component: DocentesInactivosComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
      { path: "docente/planificacion/:id", component: PlanificacionComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_DOCENTE'] } },
      { path: "docente/planes-semanales/:id", component: PlanesSemanalesComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_DOCENTE'] } },
      { path: "docente/form", component: FormDocenteComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
      { path: "docente/form/:id", component: FormDocenteComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
      { path: "carreras", component: CarrerasComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_SECRETARIA'] } },
      { path: "carrera/form", component: FormCarreraComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_SECRETARIA'] } },
      { path: "carrera/form/:id", component: FormCarreraComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_SECRETARIA'] } },
      { path: "periodos", component: PeriodosComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_SECRETARIA'] } },
      { path: "periodo/form", component: FormPeriodoComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_SECRETARIA'] } },
      { path: "periodo/form/:id", component: FormPeriodoComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_SECRETARIA'] } },
      { path: "asignaturas", component: AsignaturasComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_SECRETARIA'] } },
      { path: "asignatura/form", component: FormAsignaturaComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
      { path: "asignatura/form/:id", component: FormAsignaturaComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
      { path: "matriculas", component: MatriculasComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_SECRETARIA'] } },
      { path: "matriculas/:id", component: MatriculasComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_SECRETARIA'] } },
      { path: "matricula/form/create/:id_estudiante", component: FormMatriculaComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_SECRETARIA'] } },
      { path: "matricula/form/edit/:id_matricula", component: FormMatriculaComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_SECRETARIA'] } },
      { path: "matricula/form/solicitud/:id_solicitud", component: FormMatriculaComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_SECRETARIA'] } },
      { path: "matricula-busqueda", component: BusquedaMatriculaComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_SECRETARIA'] } },
      { path: "matriculas-expedientes", component: ExpedientesComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_SECRETARIA'] } },
    //  { path: "distributivo", component: CargaHorariaComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
    //  { path: "evaluaciones", component: EvaluacionComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
    //  { path: "evaluacion/form", component: FormEvaluacionComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
     // { path: "evaluacion/form/:id", component: FormEvaluacionComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
     // { path: "evaluacion/restricciones", component: RestriccionesComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
     // { path: "clasificaciones", component: ClasificacionesComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
     // { path: "criterios", component: CriteriosComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
    //  { path: "preguntas", component: PreguntasComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
     // { path: "pregunta/form", component: FormPreguntaComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
     // { path: "pregunta/form/:id", component: FormPreguntaComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
     // { path: "pregunta/tipos", component: TiposPreguntasComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
     // { path: "evaluacion-docente/:id", component: EvaluacionesComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_ESTUDIANTE', 'ROLE_DOCENTE'] } },
    //  { path: "evaluar-docente/form", component: FormEvaluarComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_ESTUDIANTE', 'ROLE_DOCENTE'] } },
     // { path: "resultados", component: ResultadosComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
      { path: "form/solicitudes-matricula", component: FormSolicitudComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_ESTUDIANTE'] } },
      { path: "solicitudes-matricula", component: SolicitudesComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN', 'ROLE_SECRETARIA'] } },
    //  { path: "seguimiento-docente", component: SeguimientoDocenteComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },
     // { path: "configuración-planes", component: ConfiguracionComponent, canActivate: [RoleGuard], data: { role: ['ROLE_ADMIN'] } },

    ]
  },
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: "**", redirectTo: '' },





];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
