import { Component, OnInit, Input } from '@angular/core';
import { Summary } from '../summary';
@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.css']
})
export class SummaryReportComponent implements OnInit {
  @Input() summary: Summary;
  constructor() { }

  ngOnInit(): void {
  }

}
