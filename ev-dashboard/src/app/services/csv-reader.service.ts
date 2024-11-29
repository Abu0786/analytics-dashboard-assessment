import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as Papa from 'papaparse';


@Injectable({
  providedIn: 'root'
})
export class CsvReaderService {

  constructor(private http: HttpClient) { }

   // Method to load CSV file from assets folder
   public loadCSV(): Observable<any> {
    return new Observable((observer) => {
      this.http.get('../assets/Electric_Vehicle_Population_Data.csv', { responseType: 'text' })
        .subscribe({
          next: (data) => {
            Papa.parse(data, {
              header: true,
              complete: (result) => {
                observer.next(result.data); // Emit parsed CSV data
                observer.complete();
              },
              error: (error: any) => {
                observer.error(error); // Emit error if parsing fails
              }
            });
          },
          error: (error) => {
            observer.error(error); // Emit error if file reading fails
          }
        });
    });
  }
}
