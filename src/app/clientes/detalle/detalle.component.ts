import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { URL_BACKEND } from 'src/app/config/config';
import { Factura } from 'src/app/facturas/models/factura';
import { FacturaService } from 'src/app/facturas/services/factura.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input()cliente: Cliente;
  titulo:string='Detalle del cliente'
  public fotoSeleccionada:File;
  public progreso:number=0;
  urlBackend:string = URL_BACKEND;

  constructor(private clienteService: ClienteService, 
              public authService:AuthService,
              private facturaService:FacturaService,
              public modalService:ModalService) {

  }

  ngOnInit(): void {
    /* this.activatedRoute.paramMap.subscribe(params => {
      let id: number = +params.get('id');
      if (id) {
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        }
        );
      }
    }); */
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    if(this.fotoSeleccionada){
      if(this.fotoSeleccionada.type.indexOf('image') < 0){
        swal('Error seleccionar imagen','El archivo debe ser una imagen', 'error');
        this.fotoSeleccionada = null;
      }
    }
  }

  subirFoto(){
    if(this.fotoSeleccionada){
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).
        subscribe(event=>{
          
          if(event.type === HttpEventType.UploadProgress){
            this.progreso = Math.round((event.loaded/event.total)*100);;
          }else if(event.type === HttpEventType.Response){
            let response:any = event.body;
            this.cliente = response.cliente as Cliente;
            this.modalService.notificarUpload.emit(this.cliente);
            swal('La foto se ha cargado correctamente',response.mensaje , 'success');
          }
        }
      );
    }else{
      swal('Error','No se ha seleccionado foto', 'error');
    }
  }

  cerrarModal(){
    this.fotoSeleccionada = null;
    this.progreso = 0;
    this.modalService.cerrarModal();
  }

  
  delete(factura:Factura):void{
    swal({
      title: 'Está seguro',
      text: `¿Seguro que desea elminar la factura ${factura.descripcion}?`,
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
        this.facturaService.delete(factura.id).subscribe(
          () => {
            this.cliente.facturas = this.cliente.facturas.filter(fac => fac.id !== factura.id);
            swal('Factura eliminada', `Factura ${factura.descripcion} eliminada con éxito`, 'success');
          }
        )
      }
    });
  }
}
