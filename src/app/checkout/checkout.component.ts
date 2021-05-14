import { Component, OnInit } from '@angular/core';
import { Cart } from '../app-model/cart';
import { OrderDto } from '../app-model/order-dto';
import { CustomerService } from '../customer.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  customerId;
  cus_id;
  cartLength;
  finalAmount;
  cartss;
  cart:Array<any> = new Array<any>();
  cartId:number;
  orderDto:OrderDto = new OrderDto();
  today;
  pincode:string;
  constructor(private service:CustomerService, private router:Router) { }

  ngOnInit(): void {
    this.orderDto.deliveryTime = "9 AM - 10 AM"
    this.cus_id = String(localStorage.getItem('customerId'));
    this.service.fetchCart(this.cus_id).then((response) =>{
      this.cart = response;
      console.log(this.cart)
      this.finalAmount = this.calculateFinalAmount(this.cart);

    })

    this.customerId = String(localStorage)
    var date = String(new Date().getDate());
    console.log(date)
    var month = new Date().getUTCMonth()+1;
    console.log(month+1)
    var year = new Date().getFullYear();
    console.log(year)
    var hour = new Date().getHours();
    console.log(hour)
    var minutes = new Date().getMinutes();
    console.log(minutes);
    var seconds = new Date().getSeconds();
    console.log(seconds)
    var dateTime = date + '-' + month + '-' + year + '-' + hour + '-' + minutes + '-' + seconds;
    console.log(dateTime)

  }

  onDateChange(event)  {
    // console.log(event.target.value)
    this.orderDto.shippingDate = event.target.value;
  }

  onTimeChange(event) {
    this.orderDto.deliveryTime = event.target.options[event.target.options.selectedIndex].value;
  }

  calculateFinalAmount(cart:Array<any>):number {
    var amount = 0;
    cart.forEach((element)=> {
      amount+= Number(element.price)*Number(element.quantity);
      //console.log(element)
    })
    return amount
  }

  placeOrder() {
    var date = String(new Date().getDate());
    console.log(date)
    var month = new Date().getUTCMonth()+1;
    console.log(month+1)
    var year = new Date().getFullYear();
    console.log(year)
    var hour = new Date().getHours();
    console.log(hour)
    var minutes = new Date().getMinutes();
    console.log(minutes);
    var seconds = new Date().getSeconds();
    console.log(seconds)
    var dateTime = date + '-' + month + '-' + year + '-' + hour + '-' + minutes + '-' + seconds;
    
    this.orderDto.orderId = dateTime;
    this.orderDto.cartId = this.cartId;
    this.orderDto.customerId = localStorage.getItem('customerId');
    this.orderDto.amount = this.finalAmount;
    this.orderDto.shippingAddress;
    this.orderDto.cart = this.cart;
    this.orderDto.orderdate = new Date()
    console.log(this.orderDto);
   // this.router.navigateByUrl('/viewOrders');
    this.service.placeOrder(this.orderDto).then((response)=>{
            Swal.fire({
              title: "Order Placed",
              text:"Order successfully placed",
              icon: "success",
              confirmButtonText: "Okay"
            }),
            console.log("vgdbhnsjm",this.cus_id)
            this.service.removeCart(this.cus_id);  
    })
  }

}

