import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-chart',
  imports: [],
  standalone: true,
  templateUrl: './home-chart.component.html',
  styleUrls: ['./home-chart.component.scss']
})
export class HomeChartComponent {
  @Input() title?: string = '';
  @Input() imageUrl?: string = '';
  @Input() imageAlt?: string = '';
  @Input() text?: string = '';
}
