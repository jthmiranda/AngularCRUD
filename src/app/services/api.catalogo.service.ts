import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiCatalogoService {

  urlEndpoint: string = "http://localhost:8080/api/catalogo/"

  constructor(private http: HttpClient) {
  }

  getCatalogo() {
    return this.http.get(this.urlEndpoint);
  }
}
