import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  regiones: Region[];

  public titulo: String = 'Crear cliente';

  public errores: String[];


  constructor(private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe( response => { this.regiones = response;});
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(
      params => {
        let id = +params['id'];
        if (id) {
          this.clienteService.getCliente(id).subscribe(cliente =>
            this.cliente = cliente
          );
        }

      }
    )
  }

  public create(): void {
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        swal('Nuevo Cliente', `El cliente ${cliente.nombre} ha sido creado con éxito!`, 'success');
      },
      err => {
        this.errores = err.error.errors as String[];
      }
    );
  }

  public update(): void {
    this.cliente.facturas = null;//solo nos interesa editar el cliente, facturas se manda a nulo
    this.clienteService.update(this.cliente).subscribe(
      response => {
        this.router.navigate(['/clientes'])
        swal('Cliente Actualizado', `${response.mensaje} : ${response.cliente.nombre}`, 'success');
      }, err => {
        this.errores = err.error.errors as String[];
      }
    )
  }

  compararRegion(o1:Region, o2:Region):boolean{
    if(o1 === undefined && o2 === undefined){
      return true;
    }
    return (o1 === null || o2=== null || o1 === undefined || o2=== undefined )?false:o1.id===o2.id;
  }

}
