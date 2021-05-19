import { Component, OnInit } from '@angular/core';
//import { Cart } from '../app-model/cart';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  customerId;
  cart;
  p:number;
  q :number;
  cartItems:Array<any> = new Array<any>();
  constructor(private service:CustomerService) { }

  ngOnInit(): void {
    this.customerId = String(localStorage.getItem('customerId'));
    this.service.fetchCart(this.customerId).then((response) =>{
      this.cart = response;
      console.log("mycart",this.cart)
    })
    

  }
  removeitem(cartid:string)
  {
    this.service.removeitem(cartid,this.customerId).then((response)=>{
      this.ngOnInit()
    })
  }
}
// this.service.fetchCart(this.customerId).subscribe(
//   response=> {
//     console.log(response.cartItems);
//     this.cartItems = response.cartItems;
//   }
// )
