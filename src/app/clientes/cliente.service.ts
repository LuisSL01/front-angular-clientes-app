import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, catchError, throwError,tap } from 'rxjs';
import { Cliente } from './cliente';
import { Region } from './region';
import { URL_BACKEND } from '../config/config';



@Injectable()
export class ClienteService {

  private urlEndPoint:string=URL_BACKEND+'/api/clientes';
//  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

  constructor(private http : HttpClient, private router:Router) { }

  /* //se implementa in interceptor
  private agregarAuthorizationHeader():HttpHeaders{
    let token = this.authService.token;
    if(token != null){
      return this.httpHeaders.append('Authorization','Bearer '+token);
    }
    return this.httpHeaders;
  } */

/* //se implementa en un interceptor   
  private isNoAutorizado(e):boolean{
    if(e.status ==401){
      if(this.authService.isAuthenticated()){
        this.authService.logout();
      }
      this.router.navigate(['/login'])
      return true;
    }
    if(e.status == 403){
      swal('Acceso denegado', 'Hola '+this.authService.usuario.username+', no tienes acceso a este recurso','warning');
      this.router.navigate(['/clientes'])
      return true;
    }
    return false;
  } */

  getRegiones():Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint+'/regiones');
  }

  getClientes(page:number):Observable<any>{
    //return of (CLIENTES);
    return this.http.get(this.urlEndPoint+'/page/'+page).pipe(
      tap((response :any)=>{
        //console.log('tap 1');                
        (response.content as Cliente[]).forEach(cliente=>{
          //console.log(cliente.nombre);          
        })
      }),
      map((response:any) =>{        
        (response.content as Cliente[]).map(cliente=>{
          cliente.nombre = cliente.nombre.toUpperCase();          
          //let datePipe = new DatePipe('es')
          //cliente.createAt = formatDate(cliente.createAt, 'dd/MM/yyyy', 'en-US')
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
          return cliente;
        });
        return response;
        }),
        tap((response:any)=>{
          //console.log('tap 2');
          (response.content as Cliente[]).forEach(cliente=>{
            //console.log(cliente.nombre);          
          })
        }),
    );
  }

  create(cliente:Cliente):Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente).pipe(
      map((response:any)=> response.cliente as Cliente),
      catchError(e=>{
        if(e.status == 400){
          return throwError( () => e );
        }        
        return throwError( () => e );
      })
    );
  }

  getCliente(id:number):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e=>{
        if(e.status != 401 && e.error.mensaje){
          this.router.navigate(['/clientes'])        
        }
        return throwError( () => e );
      })
    );
  }

  update(cliente:Cliente):Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente).pipe(
      catchError(e=>{
        if(e.status == 400){
          return throwError( () => e );
        }        
        return throwError( () => e );
      })
    );
  }

  delete(id:number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e=>{
        return throwError( () => e );
      })
    );
  }

  subirFoto(archivo:File, id:any):Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    
    const req = new HttpRequest('POST',`${this.urlEndPoint}/upload`,formData,{
      reportProgress:true    
    })
    return this.http.request(req);
    /* .pipe(
      map((response:any)=> response.cliente as Cliente),
      catchError(e=>{
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError( () => e );
      })
    ) */
    
  }

}
