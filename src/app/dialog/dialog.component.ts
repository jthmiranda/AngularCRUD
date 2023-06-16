import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {ApiService} from "../services/api.service";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ApiCatalogoService} from "../services/api.catalogo.service";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit{

  productForm! : FormGroup;
  actionLabel: string = "Nuevo Empleado";
  actionBtn: string = "Save";

  direccionList: any;
  departamentoList: any;
  municipioList: any;

  constructor(private formBuilder: FormBuilder,
              private api: ApiService,
              private apiCatalogo: ApiCatalogoService,
              @Inject(MAT_DIALOG_DATA) public editData : any,
              private dialogRef: MatDialogRef<DialogComponent>) {

  }

  ngOnInit(): void {


    this.productForm = this.formBuilder.group({
      id: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.minLength(8),Validators.maxLength(8)]],
      departamento: ['', Validators.required],
      municipio: ['', Validators.required]
    })

    if (this.editData) {
      this.actionBtn = "Update";
      this.actionLabel = "Actualizar Empleado"

      this.productForm.controls['id'].setValue(this.editData.id);
      this.productForm.controls['nombre'].setValue(this.editData.nombre);
      this.productForm.controls['apellido'].setValue(this.editData.apellido);
      this.productForm.controls['correo'].setValue(this.editData.correo);
      this.productForm.controls['telefono'].setValue(this.editData.telefono);
      this.productForm.controls['departamento'].setValue(this.editData.departamento.id);
      this.productForm.controls['municipio'].setValue(this.editData.municipio.id);

      // para setear catalogo de municios al editar
      this.chooseCatalog(this.editData.departamento.id);

    } else {

      // para setear catalogo completo al crear
      this.chooseCatalog(0);
    }


  }

  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        let valor = this.productForm.controls['departamento'].getRawValue();
        let jsonFormat = { id : valor}
        this.productForm.controls['departamento'].setValue(jsonFormat);

        let valor2 = this.productForm.controls['municipio'].getRawValue();
        let jsonFormat2 = { id : valor2}
        this.productForm.controls['municipio'].setValue(jsonFormat2);

        this.api.postProduct(this.productForm.value).subscribe({
          next: (resp) => {
            alert("Empleado agregado con exito")
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error: () => {
            alert("Error while adding the product")
          }
        })
      }
    } else {
      this.updateProduct()
    }
  }

  updateProduct() {
    let valor = this.productForm.controls['departamento'].getRawValue();
    let jsonFormat = { id : valor}
    this.productForm.controls['departamento'].setValue(jsonFormat);

    let valor2 = this.productForm.controls['municipio'].getRawValue();
    let jsonFormat2 = { id : valor2}
    this.productForm.controls['municipio'].setValue(jsonFormat2);

    this.api.putProduct(this.productForm.value, this.editData.id).subscribe({
      next: (resp) => {
        alert("Empleado actualizado con exito")
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error: (err) => {
        alert("Error while updating the record")
      }
    })
  }

  onChangeDepartmento(id: number) {
    console.log("salta la funcion on change " + id );
    if (id == 0) return;
    this.municipioList = this.direccionList.filter((item:any) => item.padre == id);
  }

  chooseCatalog(id: number) {
    this.apiCatalogo.getCatalogo().subscribe({
      next: (resp) => {
        this.direccionList = resp;
        this.departamentoList = this.direccionList.filter((item:any) => item.padre == null)
        if (id == 0) {
          console.log("nuevo empleado")
          this.municipioList = this.direccionList.filter((item:any) => item.padre > 0)
        } else {
          console.log("cuando edito")
          this.municipioList = this.direccionList.filter((item:any) => item.padre == id);
        }
      }
    })
  }

}
