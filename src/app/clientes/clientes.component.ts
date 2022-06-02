
import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';
import { AuthService } from '../usuarios/auth.service';
import { URL_BACKEND } from '../config/config';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador:any;
  clienteSeleccionado:Cliente;
  urlBackend:string = URL_BACKEND;

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute,
              public modalService:ModalService,
              public authService:AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      params => {
        let page: number = +params.get('page');
        if (!page) page = 0;
        this.clienteService.getClientes(page).pipe(
          tap(response => {
            //console.log('tap 3');
            (response.content as Cliente[]).forEach(cliente => {
              //console.log(cliente.nombre);
            })
          }
          )
        ).subscribe((response: any) =>{          
          this.clientes = response.content;
          this.paginador = response;
        } 
          
        );
      }
    );

    this.modalService.notificarUpload.subscribe(cliente=>{
      this.clientes = this.clientes.map(clienteOriginal=>{
        if(cliente.id == clienteOriginal.id){
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    });

  }

  delete(cliente: Cliente): void {
    swal({
      title: 'Está seguro',
      text: '¿Seguro que desea elminar al ciente?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli.id !== cliente.id);
            swal('Cliente eliminado', 'Cliente eliminado con éxito', 'success');
          }
        )
      }
    })
  }

  abrirModal(cliente:Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal(); 
  }


}
