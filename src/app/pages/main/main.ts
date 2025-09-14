import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TripGetResponse, TripService } from '../../services/trip';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.html',
  styleUrls: ['./main.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    RouterModule,
  ],
})
export class MainComponent implements OnInit {
  filterForm: FormGroup;
  trip: TripGetResponse[] = [];
  countries: string[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private http: HttpClient
  ) {
    this.filterForm = this.fb.group({
      id: [''],
      name: [''],
      country: [''],
    });
    this.tripService.getTrips().subscribe({
      next: (res) => {
        this.trip = res;
      },
      error: (err) => console.error(err),
    });
  }

  ngOnInit() {
    this.loadTrips();
  }

  // ดึงข้อมูลทั้งหมดและสร้าง list ประเทศอัตโนมัติ
  async loadTrips() {
    try {
      const url = 'http://192.168.1.131:3000/trip';
      const data = await lastValueFrom(this.http.get<TripGetResponse[]>(url));
      this.trip = data;

      // สร้าง array ของประเทศที่ไม่ซ้ำ
      this.countries = Array.from(
        new Set(this.trip.map((t) => t.country))
      ).sort();
    } catch (error) {
      console.error('Error fetching trip:', error);
      this.trip = [];
      this.countries = [];
    }
  }

  // ค้นหาตามฟอร์ม: ID, Name, Country
  async search() {
    const { id, name, country } = this.filterForm.value;

    try {
      if (id) {
        const url = `http://192.168.1.131:3000/trip/${id}`;
        const data = await lastValueFrom(this.http.get<TripGetResponse>(url));
        this.trip = [data];
      } else {
        // ดึงทั้งหมดก่อน แล้ว filter
        await this.loadTrips();
        this.trip = this.trip.filter(
          (t) =>
            (name ? t.name.toLowerCase().includes(name.toLowerCase()) : true) &&
            (country ? t.country === country : true)
        );
      }
    } catch (error) {
      console.error('Search error', error);
      this.trip = [];
    }
  }
}
