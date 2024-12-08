import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TicketingServiceService } from './ticketing-service.service';
import { interval, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  vendorCount: number = 0;
  customerCount: number = 0;
  vendorStartCount: number = 1;
  vendorRate: number = 5;
  customerStartCount: number = 1;
  customerRate: number = 5;
  logs: string[] = []; // Array per i log

  ticketingService = inject(TicketingServiceService);


  ngOnInit(): void {
        // Aggiorna inizialmente i contatori
        this.updateCounts();

        // Aggiorna costantemente i contatori ogni 5 secondi
        interval(1000).pipe(
          switchMap(() => this.ticketingService.getVendorCount())
        ).subscribe(count => this.vendorCount = count);
    
        interval(1000).pipe(
          switchMap(() => this.ticketingService.getCustomerCount())
        ).subscribe(count => this.customerCount = count);

         // Avvia la connessione al flusso di log
        this.ticketingService.connectToLogStream();

        // Iscriviti ai log per aggiornarli in tempo reale
        this.ticketingService.getLogs().subscribe(log => {
          this.logs.push(log);
        });


  }

  startVendors() {
    this.ticketingService.startVendors(this.vendorStartCount, this.vendorRate).subscribe(() => {
      this.updateCounts();
    });
  }

  stopVendors() {
    this.ticketingService.stopVendors().subscribe(() => {
      this.updateCounts();
    });
  }

  startCustomers() {
    this.ticketingService.startCustomers(this.customerStartCount, this.customerRate).subscribe(() => {
      this.updateCounts();
    });
  }

  stopCustomers() {
    this.ticketingService.stopCustomers().subscribe(() => {
      this.updateCounts();
    });
  }

  updateCounts() {
    this.ticketingService.getVendorCount().subscribe(count => this.vendorCount = count);
    this.ticketingService.getCustomerCount().subscribe(count => this.customerCount = count);
  }
}
