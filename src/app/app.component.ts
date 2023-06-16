import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog"
import {DialogComponent} from "./dialog/dialog.component";
import {ApiService} from "./services/api.service";
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {ApiCatalogoService} from "./services/api.catalogo.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {

  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'correo', 'telefono', 'departamento', 'municipio', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  title = 'AngularMaterial';
  catalogoList: any;

  constructor(public dialog: MatDialog,
              private api: ApiService,
              private apiCatalogo: ApiCatalogoService) {
  }

  ngOnInit() {
    this.getAllProducts();
    this.getCatalogo();
  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllProducts();
      }
    })
  }

  getAllProducts() {
    this.api.getProduct().subscribe({
      next: (resp) => {
        this.dataSource = new MatTableDataSource<any>(resp);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert("Error while fetching the Records")
      }
    })
  }

  editProduct(row: any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update'){
        this.getAllProducts();
      }
    })
  }

  deleteProduct(id: number) {
    this.api.deleteProduct(id).subscribe({
      next: (resp) => {
        alert("Eliminado con exito");
        this.getAllProducts();
      },
      error: (err) => {
        alert("Error while deleting the product");
      }
    })
  }

  getCatalogo() {
    this.apiCatalogo.getCatalogo().subscribe({
      next: (resp) => this.catalogoList = resp
    })
  }

  getLabelCatalogo(id: string) {
    if (this.catalogoList !== undefined) {
      // @ts-ignore
      let entidad = this.catalogoList.find(valor => valor.id == id) ;
     return entidad.valor;
    } else {
      return "";
    }
  }

  applyFilter(event: Event) {
    console.log((event.target as HTMLInputElement).value)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
