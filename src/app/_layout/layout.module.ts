import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "./navbar/navbar.component";
import { AppLayoutComponent } from './app-layout/app-layout.component';







@NgModule({
  declarations: [NavbarComponent, AppLayoutComponent],
  imports: [CommonModule, NavbarComponent]
})
export class LayoutModule { }
