import { Component, OnInit } from '@angular/core';
import { Customer } from '../app-model/customer';
import Swal from 'sweetalert2';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {
  customerId;
  order:Array<any> = new Array<any>();
  orderItem:Array<any> = new Array<any>();
  shippingAddress: String;
  amount:number;
  constructor(private service:CustomerService) { }

  ngOnInit(): void {
    this.customerId = String(localStorage.getItem('customerId'));
    this.service.fetchOrder(this.customerId).then((response)=>{
      this.order = response;
      console.log("orderresponse",response)
      console.log("orderresponse",this.order)
      //this.orderItem = response.productlist
      //console.log("productlist",this.orderItem)
    })
  }
  cancelOrder(orderId:string,customer_id:string)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: " ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.cancelOrder(orderId,customer_id).then((response)=>{
          Swal.fire(
            'Canceled!',
            'Your Order has been canceled.',
            'success'
          )
        })
        this.ngOnInit()
        
      }
    })
    

  }

}

// this.customerId = String(localStorage.getItem('customerId'));
//     this.service.fetchOrder(this.customerId).subscribe(
//       response=> {
//         //console.log(response.orderId);

//         console.log(response);
//         this.shippingAddress=response[0].shippingAddress;
//         console.log(this.shippingAddress);
//         this.amount=response.amount;
//         console.log(this.amount);
//         this.order = response;
//       }
//     )
