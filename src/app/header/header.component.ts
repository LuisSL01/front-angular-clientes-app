import { Component } from "@angular/core";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { AuthService } from "../usuarios/auth.service";

@Component({
    selector:'app-header',
    templateUrl:'./header.component.html'
})
export class HeaderComponent{
    title :string ='App Angular'

    constructor(public authService:AuthService, private router:Router){}

    logout():void{
        this.authService.logout();
        swal('Logout', 'Ha cerrado sesión con exito', 'success');
        this.router.navigate(['/login'])

    }
}