import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent {

  listaCurso:string[] = ['typescript', 'javascript','java','python','c#'];

  habilitar:boolean=true;

  constructor() { }

}
