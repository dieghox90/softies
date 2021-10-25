import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from './_layout/app-layout/app-layout.component';
import { LoginComponent } from './components/usuarios/login/login.component';
import { RoleGuard } from './guards/role.guard';





const routes: Routes = [

  {
    path: '', component: AppLayoutComponent,
    canActivate: [RoleGuard],
    data: { role: ['ROLE_ADMIN', 'ROLE_ESTUDIANTE', 'ROLE_DOCENTE', 'ROLE_SECRETARIA'] },
    loadChildren: () => import('./child-routes.module').then(m => m.ChildRoutesModule)
  },
 

  
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  //{ path: "**", redirectTo: '',pathMatch: 'prefix'  },

];



@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
