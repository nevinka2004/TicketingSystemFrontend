import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketingServiceService {

  private logSubject = new Subject<string>();

  private apiUrl = 'http://localhost:8080/api';

  http = inject(HttpClient)


  startVendors(count: number, rate: number): Observable<any> {
    this.log(`Starting ${count} vendors with release rate of ${rate}`);
    return this.http.post(`${this.apiUrl}/vendors/start?vendorsCount=${count}&ticketReleaseRate=${rate}`, {});
  }

  stopVendors(): Observable<any> {
    this.log('Stopping all vendors');
    return this.http.post(`${this.apiUrl}/vendors/stop`, {});
  }

  startCustomers(count: number, rate: number): Observable<any> {
    this.log(`Starting ${count} customers with retrieval rate of ${rate}`);
    return this.http.post(`${this.apiUrl}/customers/start?customerCount=${count}&customerRetrievalRate=${rate}`, {});
  }

  stopCustomers(): Observable<any> {
    this.log('Stopping all customers');
    return this.http.post(`${this.apiUrl}/customers/stop`, {});
  }

  getVendorCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/vendors/count`);
  }

  getCustomerCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/customers/count`);
  }

   connectToLogStream() {
    const eventSource = new EventSource(`${this.apiUrl}/logs/stream`);
    eventSource.onmessage = (event) => {
      this.logSubject.next(event.data);
    };
  }

  getLogs(): Observable<string> {
    return this.logSubject.asObservable();
  }

  private log(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.logSubject.next(`[${timestamp}] ${message}`);
  }
}
