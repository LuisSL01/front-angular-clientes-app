import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  titulo:string='Por favor Inicia Sesión';

  usuario:Usuario;

  constructor(private authService:AuthService, private router:Router) {
    this.usuario = new Usuario();
   }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      swal('Login','Hola '+ this.authService.usuario.username+', ya estas autenticado', 'info');
      this.router.navigate(['/clientes'])
    }
  }

  login():void{
    if(this.usuario.username == null || this.usuario.password == null){
      swal('Error en el login','Username o password vacios', 'error');
      return;
    }else{
      this.authService.login(this.usuario).subscribe(
        response=>{        
          this.authService.guardarUsuario(response.access_token);
          this.authService.guardarToken(response.access_token);

          let usuario = this.authService.usuario;

          this.router.navigate(['/clientes']);
          swal('Login','Hola '+usuario.username+' , bienvenido', 'success');
        },
        err=>{
          if(err.status == 400){
            swal('Error en el login','Usuario o clave incorrectos', 'error');
          }          
        }
      );
    }


  }

  

}
