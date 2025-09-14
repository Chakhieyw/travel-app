import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TripGetResponse {
  idx: number;
  name: string;
  country: string;
  coverimage: string;
  detail: string;
  price: number;
  duration: number;
  destination_zone: DestinationZone;
}

export enum DestinationZone {
  ประเทศไทย = 'ประเทศไทย',
  ยุโรป = 'ยุโรป',
  เอเชีย = 'เอเชีย',
  เอเชียตะวันออกเฉียงใต้ = 'เอเชียตะวันออกเฉียงใต้',
}
@Injectable({
  providedIn: 'root',
})
export class TripService {
  private baseUrl = 'http://192.168.1.131:3000/trip';

  constructor(private http: HttpClient) {}

  getTrips(filter?: {
    id?: string;
    name?: string;
    country?: string;
  }): Observable<TripGetResponse[]> {
    let params = new HttpParams();
    if (filter) {
      if (filter.id) params = params.set('id', filter.id);
      if (filter.name) params = params.set('name', filter.name);
      if (filter.country) params = params.set('country', filter.country);
    }
    return this.http.get<TripGetResponse[]>(this.baseUrl, { params });
  }

  getTrip(idx: number): Observable<TripGetResponse> {
    return this.http.get<TripGetResponse>(`${this.baseUrl}/${idx}`);
  }

  // trip.service.ts
  createTrip(trip: any) {
    return this.http.post<TripGetResponse>(
      'http://192.168.1.131:3000/trip',
      trip
    );
  }

  updateTrip(id: number, trip: any) {
    return this.http.put<TripGetResponse>(
      `http://192.168.1.131:3000/trip/${id}`,
      trip
    );
  }

  deleteTrip(idx: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idx}`);
  }
}
