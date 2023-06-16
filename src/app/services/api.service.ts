import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  urlEndpoint: string = "http://localhost:8080/api/empleado/"
  constructor(private http: HttpClient) { }

  postProduct(data: any) {
    return this.http.post<any>(this.urlEndpoint, data)
  }

  getProduct() {
    return this.http.get<any>(this.urlEndpoint);
  }

  putProduct(data: any, id: number) {
    return this.http.put<any>(this.urlEndpoint + id, data)
  }

  deleteProduct(id: number) {
    return this.http.delete<any>(this.urlEndpoint + id)
  }

}
