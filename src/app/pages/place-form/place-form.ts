import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TripGetResponse, TripService } from '../../services/trip';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-place-form',
  templateUrl: './place-form.html',
  styleUrls: ['./place-form.scss'],
  imports: [
    MatCard,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatError,
    RouterModule,
  ],
})
export class PlaceFormComponent implements OnInit {
  form: any; // หรือ FormGroup
  countries: string[] = [];
  continents = [
    'Asia',
    'Europe',
    'North America',
    'Africa',
    'Oceania',
    'South America',
    'Antarctica',
  ];
  isEdit = false;
  id?: string;
  trip: TripGetResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private ps: TripService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    // สร้าง form ใน constructor ✅
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      country: ['', Validators.required],
      continent: ['', Validators.required],
      imageFile: [null],
      imageUrl: [''],
    });
  }
  async loadTrips() {
    try {
      const url = 'http://192.168.1.131:3000/trip';
      const data = await lastValueFrom(this.http.get<TripGetResponse[]>(url));
      this.trip = data || [];

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

  async ngOnInit() {
    await this.loadTrips(); // โหลด trips เพื่อสร้าง countries
    this.id = this.route.snapshot.paramMap.get('id') || undefined;

    if (this.id) {
      this.isEdit = true;
      this.ps.getTrip(+this.id).subscribe((p) => {
        this.form.patchValue(p);
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.form.patchValue({ imageFile: file });
    }
  }
  cancel() {
    this.router.navigate(['/admin']);
  }
  submit() {
    if (this.form.invalid) return;

    const formVal = this.form.value;
    const payload = {
      name: formVal.name,
      detail: formVal.description,
      price: formVal.price,
      country: formVal.country,
      destination_zone: formVal.continent,
      coverimage: formVal.imageUrl || '',
    };

    const obs = this.isEdit
      ? this.ps.updateTrip(+this.id!, payload)
      : this.ps.createTrip(payload);

    obs.subscribe({
      next: () => this.router.navigate(['/admin']),
      error: (err) => console.error('Error saving trip:', err),
    });
  }
}
