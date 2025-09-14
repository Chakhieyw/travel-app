import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { TripService, TripGetResponse } from '../../services/trip';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, finalize, Observable, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.html',
  styleUrls: ['./admin-list.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule,
    CommonModule,
  ],
})
export class AdminListComponent implements OnInit {
  trip: TripGetResponse[] = [];
  trip$!: Observable<TripGetResponse[]>;
  loading = true;
  dataSource = new MatTableDataSource<TripGetResponse>();

  constructor(
    private ts: TripService,
    private dialog: MatDialog,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.ts.getTrips().subscribe((data) => {
      setTimeout(() => {
        this.trip = data; // update หลังจาก Angular render เสร็จ
      });
      this.cd.detectChanges();
    });
  }

  loadTrips() {
    this.ts
      .getTrips()
      .pipe(
        catchError((err) => {
          console.error('Error fetching trips', err);
          return of([]); // กรณี error คืน array ว่าง
        })
      )
      .subscribe((data) => {
        this.trip = data; // แสดง Table ทันที
      });
  }

  add() {
    this.router.navigate(['/admin/add']);
  }

  edit(idx: number) {
    this.router.navigate(['/admin/edit', idx]);
  }

  confirmDelete(idx: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'ยืนยันการลบ?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.ts.deleteTrip(idx).subscribe(() => {
          // ลบข้อมูลจาก array ทันที
          this.trip = this.trip.filter((t) => t.idx !== idx);
        });
      }
    });
  }
}
