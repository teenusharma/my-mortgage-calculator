import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators,FormGroup } from "@angular/forms";
import { Summary } from '../summary';
import { EChartsOption } from 'echarts';

export interface CalculationSummary {
  category: string;
  term: string;
  amortization_period: string;
}

@Component({
  selector: 'app-mortgage-calculator',
  templateUrl: './mortgage-calculator.component.html',
  styleUrls: ['./mortgage-calculator.component.css']
})
export class MortgageCalculatorComponent implements OnInit {
  mortgageAmount:number;
  interestRate:number;
  selectedAmortizationPeriodYear:number;
  selectedAmortizationPeriodMonth:number;
  selectedPaymentFrequency:number;
  selectedTerm:number;
  prePaymentAmount:number;
  selectedPrePaymentFrequency:string;
  startWithPayment:number;
  chartOption: EChartsOption;
  years=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
  months=[1,2,3,4,5,6,7,8,9,10,11];
  paymentFrequencies=[{"value":52,"display":"Weekly"},{"value":26,"display":"Bi-weekly (every 2 weeks)"},{"value":24,"display":"Semi-monthly (24x per year)"},{"value":12,"display":"Monthly (12x per year)"}];
  terms=[1,2,3,4,5,6,7,8,9,10];
  prePaymentFrequency=["One time","Each year","Same as regular payment"];
  summaryDetail = new Summary;
  summary = this.calculate();

  paymentForm: FormGroup = this.formBuilder.group({
    mortgageAmount: [, { validators: [Validators.required]}],
    interestRate : [, { validators: [Validators.required]}]
    });
  // Reset form to default values
  public reset() {
    this.mortgageAmount = 150000.00;
    this.interestRate= 5.00;
    this.selectedAmortizationPeriodYear= 25;
    this.selectedAmortizationPeriodMonth= 0;
    this.selectedPaymentFrequency=12,
    this.selectedTerm=5;
    this.prePaymentAmount = 0.00;
    this.selectedPrePaymentFrequency="One time";
    this.startWithPayment=1;
  }
  // Calculate mortgage payment
  public calculateMP(prValue,intRate,period){
    let mortgagePayment = (prValue * intRate) / (1 - Math.pow(1 + intRate, -(period*this.selectedPaymentFrequency)));
    return mortgagePayment;
  }
  // Calculate principal amount
  public calculatePrincipalAmount(mortgagePayment,intRate,mortgageAmount,term){
    let principalAmount = ((mortgagePayment-intRate*mortgageAmount)*(Math.pow(1+intRate,term)-1))/intRate;
    return principalAmount;
  }
// calculate interest
  public calculateInterest(mortgagePayment,principalAmount,term){
    let interest = (term*mortgagePayment)-principalAmount;
    return interest;
  }
// trigger calculations
  public calculate(){

    let numPaymentsTerm = this.selectedPaymentFrequency*this.selectedTerm;
    let numPaymentAP = this.selectedPaymentFrequency * (this.selectedAmortizationPeriodYear + this.selectedAmortizationPeriodMonth/12);
    let intRate = (this.interestRate/100)/this.selectedPaymentFrequency;
    let period = (this.selectedAmortizationPeriodYear + this.selectedAmortizationPeriodMonth/12);
    let mortgagePaymentTerm = this.calculateMP(this.mortgageAmount,intRate,period);
    let principalAmountTerm = this.calculatePrincipalAmount(mortgagePaymentTerm,intRate,this.mortgageAmount,numPaymentsTerm);
    let principalAmountAMP = this.calculatePrincipalAmount(mortgagePaymentTerm,intRate,this.mortgageAmount,numPaymentAP);
    let interestTerm = this.calculateInterest(mortgagePaymentTerm,principalAmountTerm,numPaymentsTerm);
    let interestAMP = this.calculateInterest(mortgagePaymentTerm,principalAmountAMP,numPaymentAP);
    let totalCostTerm = principalAmountTerm + interestTerm;
    let totalCostAP = principalAmountAMP + interestAMP;
    let summary = new Summary;
    summary = {
      "numberOfPaymentsTerm": numPaymentsTerm.toString(),
      "numberOfPaymentsAP": numPaymentAP.toString(),
      "mortgagePaymentTerm": "$"+parseFloat(mortgagePaymentTerm.toFixed(2)).toLocaleString(),
      "mortgagePaymentAP": "$"+parseFloat(mortgagePaymentTerm.toFixed(2)).toLocaleString(),
      "prepaymentTerm": "$"+this.prePaymentAmount,
      "prepaymentAP": "$"+this.prePaymentAmount,
      "principalPaymentsTerm": "$"+parseFloat(principalAmountTerm.toFixed(2)).toLocaleString(),
      "principalPaymentsAP": "$"+parseFloat(principalAmountAMP.toFixed(2)).toLocaleString(),
      "interestPaymentTerm": "$"+parseFloat(interestTerm.toFixed(2)).toLocaleString(),
      "interestPaymentAP": "$"+parseFloat(interestAMP.toFixed(2)).toLocaleString(),
      "totalCostTerm": "$"+parseFloat(totalCostTerm.toFixed(2)).toLocaleString(),
      "totalCostAP": "$"+parseFloat(totalCostAP.toFixed(2)).toLocaleString(),
      "amortizationPeriod": (this.selectedAmortizationPeriodYear + this.selectedAmortizationPeriodMonth/12).toString(),
      "termPeriod": this.selectedTerm,
      "graphPricipal":principalAmountAMP,
      "graphInterest":interestAMP
    };
    this.summaryDetail = {...summary};
    this.updateGraph(summary);
    return summary;
  }
  // Update graph
  public updateGraph(summary){
    this.chartOption = {
      legend: {
        data: ['Interest Payment', 'Principal Payment']
    },
      xAxis: {
        type: 'category',
        data: ['Payments']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        { name: "Principal Payments",
          label: {
          show: true,
          position: 'inside',
          formatter: ' {a} - {c} '
      }, type: "bar", data: [parseInt(summary.graphPricipal)], stack: "stackbar" },
        { name: "Interest Payments",
        label: {
          show: true,
          position: 'inside',
          formatter: ' {a} - {c} '
      }, type: "bar", data: [parseInt(summary.graphInterest)] , stack: "stackbar"}
      ],
    };
  }
  constructor( private formBuilder: FormBuilder){
    this.reset();
    this.summary = this.calculate();
  }

  ngOnInit(): void {
  }

}
