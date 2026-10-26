
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  name = '';
  age: number | null = null;
  income: number | null = null;
  amount: number | null = null;
  result = '';
  loans: any[] = [];

  async apply() {
    if (!this.name.trim() || this.age === null ||
        this.income === null || this.amount === null ||
        this.age < 18 || this.income <= 0 || this.amount <= 0) {
      this.result = 'Please enter valid details';
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.name, age: this.age,
          income: this.income, amount: this.amount
        })
      });

      const data = await response.json();
      this.result = data.message;
      if (response.ok) this.viewLoans();
    } catch {
      this.result = 'Server not connected';
    }
  }

  async viewLoans() {
    this.loans = await fetch('http://localhost:3000/loans')
      .then(res => res.json());
  }
}
