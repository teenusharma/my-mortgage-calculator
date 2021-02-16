import { Component, OnInit ,Input} from '@angular/core';
import { Summary } from '../summary';
import { ChangeDetectionStrategy } from '@angular/core';
import {  OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-summary-detail',
  templateUrl: './summary-detail.component.html',
  styleUrls: ['./summary-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryDetailComponent implements OnInit {
  @Input() summary: Summary;
  ngOnInit(): void {
  }

}
