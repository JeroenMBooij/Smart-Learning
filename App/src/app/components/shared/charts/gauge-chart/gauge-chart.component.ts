import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { BehaviorSubject } from 'rxjs';
import { IGaugeData } from './gauge-data.model';

@Component({
  selector: 'gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss']
})
export class GaugeChartComponent implements OnInit, AfterViewInit
{
    @Input()
    public label: string;

    @Input()
    public data: BehaviorSubject<IGaugeData>;

    public chart: Chart;

    @ViewChild('chartCanvas') chartCanvas: ElementRef

    constructor() { }

    ngOnInit(): void 
    {
        let canvas = document.getElementById('gauge-chart-canvas') as HTMLCanvasElement;
    }

    ngAfterViewInit(): void
    {   
        const data = {
            datasets: [{
              data: [this.data.value.progress, this.data.value.leftover],
              backgroundColor: this.data.value.colors
            }]
        };

        const titlePlugin = 
        {
            id: 'title',
            beforeDraw(chart, arfs, options) 
            {
                const { ctx, chartArea: {top, right, bottom, lef, width, height }} = chart;

                ctx.save();
                ctx.fillStyle= 'white';
                let x = right / 2;
                let y = height * 0.75;
                ctx.fillText('today\'s progress', x, y);
                ctx.textAlign = "center";
            }
        }
        
        this.chart = new Chart(this.chartCanvas.nativeElement, {
            type: 'doughnut',
            data: data,
            options: {
                rotation: -90,
                circumference: 180,
            },
            plugins: [titlePlugin]
        });

        this.data.subscribe(gaugeData => 
        {
            console.log("work");
            console.log(gaugeData.colors);
            this.chart.data.datasets[0].data = [gaugeData.progress, gaugeData.leftover];
            this.chart.data.datasets[0].backgroundColor = gaugeData.colors;

            this.chart.update();
        });

    }

}
