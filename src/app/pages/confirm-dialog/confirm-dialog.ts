import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>ยืนยัน</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">ยกเลิก</button>
      <button mat-raised-button color="warn" (click)="close(true)">ลบ</button>
    </mat-dialog-actions>
  `,
  imports: [MatDialogContent, MatDialogActions, MatButtonModule, RouterModule],
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(val: boolean) {
    this.dialogRef.close(val); // ส่งค่า true/false กลับไป component หลัก
  }
}
