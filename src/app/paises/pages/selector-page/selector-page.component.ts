import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from "rxjs/operators";
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region:['',Validators.required],
    pais:['',Validators.required],
    frontera:['',Validators.required],
    
  })

  //llenar selectores
  regiones  :string[] = [];
  paises    : PaisSmall[] = [];
  fronteras : PaisSmall[]  = [];
  cargando : boolean = false;


  constructor(private fb : FormBuilder, private ps : PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.ps.regiones;

    //Cuando Cambie la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( (_) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;

        }),
        switchMap(region => this.ps.getPaisesPorRegion(region))
      )
      .subscribe(paises =>{
      this.paises = paises;
      this.cargando = false;
      })

    //Cuando Cambie el pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap ( () =>{
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;

        }),
        switchMap(codigo => this.ps.getPaisPorCodigo(codigo)),
        switchMap(pais => this.ps.getPaisesPorCodigos(pais? pais![0]?.borders: []))
      )
      .subscribe(paises => {
        if (paises.length > 0) {
          this.fronteras = paises;
          this.cargando=false;
        }
        else{
          this.fronteras=[];
          this.cargando=false;
        }
      })
      
  }

  guardar(){
    console.log(this.miFormulario.value);
    
  }

}
