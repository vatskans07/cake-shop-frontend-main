import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  customerId;
  name;
  isLoggedIn:boolean = false;
  cartLength;
  constructor(private router:Router, private service:CustomerService) { }

  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId');
    this.name = localStorage.getItem('customerName');
    if(this.customerId != null) {
      this.isLoggedIn = true;
      // this.service.fetchCart(this.customerId).subscribe(
      //   response=> {
      //     if(response == null) {
      //       this.cartLength = 0;
      //     } else {
      //       this.cartLength = response.cartItems.length;
      //     }
      //   }
      // )
    } else {
      this.isLoggedIn = false
      this.cartLength = 0
    }
    console.log(this.customerId);
  }

  logout() {
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerName');
    this.ngOnInit();
    this.router.navigateByUrl('/');
    
  }

}
