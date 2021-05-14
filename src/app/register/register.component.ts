import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Customer } from '../app-model/customer';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  customer:Customer = new Customer();
  constructor(private service: CustomerService, private router: Router) { }

  ngOnInit(): void {
  }

  register(registerForm:NgForm) {
    this.service.register(this.customer).subscribe(
      response => {
        if(response != null) {
          localStorage.setItem('customerId', String(response.customerId));
          localStorage.setItem('customerName', String(response.name));
          Swal.fire({
            title: "Registration Successful",
              text:"You are ready to buy some delicious desserts",
              icon: "success",
              confirmButtonText: "Okay"
          });
          this.router.navigate(['/']);
          this.ngOnInit();
        } else {
          Swal.fire({
            title: "Registration Failed",
             text:"Please Try Again. Login if already have an account",
             icon: "error",
             confirmButtonText: "Okay"
          });
          registerForm.resetForm();
        }
      }
    )

  }

}
