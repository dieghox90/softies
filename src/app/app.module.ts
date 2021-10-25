import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from '@angular/core';


import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EstudiantesComponent } from "./components/estudiantes/estudiantes.component";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormEstudianteComponent } from './components/estudiantes/form-estudiante/form-estudiante.component';
import { DocentesComponent } from './components/docentes/docentes.component';
import { FormDocenteComponent } from './components/docentes/form-docente/form-docente.component';
import { MatPaginatorModule } from "@angular/material/paginator";
import { DocentesInactivosComponent } from './components/docentes/docentes-inactivos/docentes-inactivos.component';
import { CarrerasComponent } from './components/carreras/carreras.component';



import { ModalCarreraComponent } from './components/carreras/modal-carrera/modal-carrera.component';
import { FormCarreraComponent } from './components/carreras/form-carrera/form-carrera.component';
import { ModalCicloComponent } from './components/carreras/form-carrera/modal-ciclo/modal-ciclo.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PeriodosComponent } from './components/periodos/periodos.component';
import { FormPeriodoComponent } from './components/periodos/form-periodo/form-periodo.component';

import { registerLocaleData, DatePipe } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsignaturasComponent } from './components/asignaturas/asignaturas.component';
import { FormAsignaturaComponent } from './components/asignaturas/form-asignatura/form-asignatura.component';
import { MatriculasComponent } from './components/matriculas/matriculas.component';
import { FormMatriculaComponent } from './components/matriculas/form-matricula/form-matricula.component';
import { BusquedaMatriculaComponent } from './components/matriculas/busqueda-matricula/busqueda-matricula.component';

import { MatSelectModule } from '@angular/material/select';
import { CargaHorariaComponent } from './components/carga-horaria/carga-horaria.component';
import { ModalAsignacionComponent } from './components/carga-horaria/modal-asignacion/modal-asignacion.component';
import { ClasificacionesComponent } from './components/evaluacion/clasificaciones/clasificaciones.component';
import { FormClasificacionComponent } from './components/evaluacion/clasificaciones/form-clasificacion/form-clasificacion.component';
import { EvaluacionComponent } from './components/evaluacion/evaluacion.component';
import { FormEvaluacionComponent } from './components/evaluacion/form-evaluacion/form-evaluacion.component';
import { PreguntasComponent } from './components/preguntas/preguntas.component';
import { CriteriosComponent } from './components/preguntas/criterios/criterios.component';
import { ModalCriterioComponent } from './components/preguntas/criterios/modal-criterio/modal-criterio.component';
import { FormPreguntaComponent } from './components/preguntas/form-pregunta/form-pregunta.component';
import { TiposPreguntasComponent } from './components/preguntas/tipos-preguntas/tipos-preguntas.component';
import { ModalTipoRespuestaComponent } from './components/preguntas/tipos-preguntas/modal-tipo-respuesta/modal-tipo-respuesta.component';
import { PlanificacionComponent } from './components/docentes/planificacion/planificacion.component';
import { PlanesSemanalesComponent } from './components/docentes/planes-semanales/planes-semanales.component';
import { RestriccionesComponent } from './components/evaluacion/restricciones/restricciones.component';
import { ModalRestriccionComponent } from './components/evaluacion/restricciones/modal-restriccion/modal-restriccion.component';
import { EvaluacionesComponent } from './components/evaluacion/evaluaciones/evaluaciones.component';
import { FormEvaluarComponent } from './components/evaluacion/evaluaciones/form-evaluar/form-evaluar.component';
import { LoginComponent } from './components/usuarios/login/login.component';
import { AppLayoutComponent } from './_layout/app-layout/app-layout.component';
import { NavbarComponent } from './_layout/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AuthInterceptor } from 'c:/Users/diegog/Desktop/pp/src/app/interceptors/auth.interceptor';
import { ResultadosComponent } from './components/evaluacion/resultados/resultados.component';
import { DetalleModalComponent } from './components/evaluacion/resultados/detalle-modal/detalle-modal.component';


import { MatRadioModule } from '@angular/material/radio';

//tabla
import { MatTableModule } from '@angular/material/table';


//toast
import { ToastrModule } from 'ngx-toastr';

// Import library module
import { NgxSpinnerModule } from "ngx-spinner";
import { ModalCopiarEvaluacionComponent } from './components/evaluacion/modal-copiar-evaluacion/modal-copiar-evaluacion.component';
import { SolicitudesComponent } from './components/matriculas/solicitudes/solicitudes.component';
import { FormSolicitudComponent } from './components/matriculas/solicitudes/form-solicitud/form-solicitud.component';
import { ModalCorreccionComponent } from './components/matriculas/solicitudes/modal-correccion/modal-correccion.component';
import { ModalDetalleMatriculaComponent } from './components/matriculas/modal-detalle-matricula/modal-detalle-matricula.component';
import { ExpedientesComponent } from './components/matriculas/expedientes/expedientes.component';
import { AsignaturaInformacionComponent } from './components/estudiantes/asignatura-informacion/asignatura-informacion.component';
import { AsignaturaPlanesComponent } from './components/estudiantes/asignatura-planes/asignatura-planes.component';
import { SeguimientoDocenteComponent } from './components/seguimiento-docente/seguimiento-docente.component';
import { ConfiguracionComponent } from './components/seguimiento-docente/configuracion/configuracion.component';
import { IncrementadorComponent } from './components/incrementador/incrementador.component';
import { RepositorioComponent } from './components/repositorio/repositorio.component';


// Fecha y hora
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

registerLocaleData(localeES, 'es');

@NgModule({
  declarations: [AppComponent,
    NavbarComponent,
    EstudiantesComponent,
    FormEstudianteComponent,
    DocentesComponent,
    FormDocenteComponent,
    DocentesInactivosComponent,
    CarrerasComponent,
    FormCarreraComponent,
    ModalCicloComponent,
    ModalCarreraComponent,
    PeriodosComponent,
    FormPeriodoComponent,
    AsignaturasComponent,
    FormAsignaturaComponent,
    MatriculasComponent,
    FormMatriculaComponent,
    BusquedaMatriculaComponent,
    CargaHorariaComponent,
    ModalAsignacionComponent,
    ClasificacionesComponent,
    FormClasificacionComponent,
    EvaluacionComponent,
    FormEvaluacionComponent,
    PreguntasComponent,
    CriteriosComponent,
    ModalCriterioComponent,
    FormPreguntaComponent,
    TiposPreguntasComponent,
    ModalTipoRespuestaComponent,
    PlanificacionComponent,
    PlanesSemanalesComponent,
    RestriccionesComponent,
    ModalRestriccionComponent,
    EvaluacionesComponent,
    FormEvaluarComponent,
    LoginComponent,
    AppLayoutComponent,
    HomeComponent,
    ResultadosComponent,
    DetalleModalComponent,
    ModalCopiarEvaluacionComponent,
    SolicitudesComponent,
    FormSolicitudComponent,
    ModalCorreccionComponent,
    ModalDetalleMatriculaComponent,
    ExpedientesComponent,
    AsignaturaInformacionComponent,
    AsignaturaPlanesComponent,
    SeguimientoDocenteComponent,
    ConfiguracionComponent,
    IncrementadorComponent,
    RepositorioComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDatepickerModule, MatMomentDateModule,
    ReactiveFormsModule, MatAutocompleteModule, MatInputModule, MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatDividerModule,
    MatTableModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,OwlDateTimeModule, OwlNativeDateTimeModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DatePipe,
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
