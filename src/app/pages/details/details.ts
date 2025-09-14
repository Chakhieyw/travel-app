import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripGetResponse, TripService } from '../../services/trip';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-details',
  templateUrl: './details.html',
  styleUrls: ['./details.scss'],
  imports: [MatCard, MatCardModule, CommonModule, RouterModule],
})
export class DetailsComponent implements OnInit {
  trip!: TripGetResponse;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        const url = `http://localhost:3000/trip/${id}`;
        this.trip = await lastValueFrom(this.http.get<TripGetResponse>(url));
        console.log('Trip detail:', this.trip);
      } catch (error) {
        console.error('Error fetching trip:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}
