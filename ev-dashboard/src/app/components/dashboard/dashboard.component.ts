import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MatToolbar } from '@angular/material/toolbar';
import { CsvReaderService } from '../../services/csv-reader.service';
import { Chart, registerables } from 'chart.js';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, MatToolbar , RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  evData: any[] = []; // Store parsed CSV data

  constructor(private csvReaderService: CsvReaderService) { }

  ngOnInit(): void {
    Chart.register(...registerables);
    this.loadEVData(); 
  }

  loadEVData(): void {
    this.csvReaderService.loadCSV().subscribe({
      next: (data: any[]) => {
        console.log(data);
        this.evData = data; 
        this.createGrowthChart();
        this.createRegionChart();
        this.createVehicleTypePieChart();
      },
      error: (error) => {
        console.error('Error loading CSV data', error);
      }
    });
  }

  createGrowthChart(): void {
    const yearData = this.evData.reduce((acc, item) => {
      const year = item['Model Year'];
      acc[year] = (acc[year] || 0) + 1; 
      return acc;
    }, {} as { [key: string]: number });
    
    const years = Object.keys(yearData).sort();
    const evCount = years.map(year => yearData[year]);
    
    new Chart('evGrowthChart', {
      type: 'line',
      data: {
        labels: years,
        datasets: [{
          label: 'EV Population Growth',
          data: evCount,
          borderColor: '#92d13c', // Change this to your desired color
          fill: false,
          tension: 0.1,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Year'
            }
          },
          y: {
            title: {
              display: true,
              text: 'EV Population'
            },
            beginAtZero: true
          }
        }
      }
    });
  }
  

  createRegionChart(): void {
    const regions = Array.from(new Set(this.evData.map(item => item['City']))); 
    const regionCounts = regions.map(region => this.evData.filter(item => item['City'] === region).length);

    new Chart('evRegionChart', {
      type: 'bar',
      data: {
        labels: regions,
        datasets: [{
          label: 'EV Population by City',
          data: regionCounts,
          backgroundColor: '#92d13c'
        }]
      }
    });
  }

  createVehicleTypePieChart(): void {
    // Count occurrences of each electric vehicle type
    const vehicleTypeData = this.evData.reduce((acc, item) => {
      const vehicleType = item['Electric Vehicle Type']; // Use 'Electric Vehicle Type' instead of 'Vehicle Type'
      if (vehicleType) {
        acc[vehicleType] = (acc[vehicleType] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });
  
    // Extract labels (vehicle types) and data (count of each type)
    const vehicleTypes = Object.keys(vehicleTypeData);
    const vehicleTypeCounts = vehicleTypes.map(type => vehicleTypeData[type]);
  
  
    // Check if we have valid data before rendering the pie chart
    if (vehicleTypes.length > 0 && vehicleTypeCounts.length > 0) {
      new Chart('evVehicleTypeChart', {
        type: 'pie',
        data: {
          labels: vehicleTypes, // Vehicle types (e.g., BEV, PHEV, etc.)
          datasets: [{
            data: vehicleTypeCounts, // Counts of each vehicle type
            backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#92d13c'], 
            hoverBackgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#92d13c'] 
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          }
        }
      });
    } else {
      console.error('No valid data available to create the pie chart.');
    }
  }
  
  

}
