import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cart } from '../app-model/cart';
import { Cartitemdto } from '../app-model/cartitemdto';
import { CustomerService } from '../customer.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-product-catalogue',
  templateUrl: './product-catalogue.component.html',
  styleUrls: ['./product-catalogue.component.css']
})
export class ProductCatalogueComponent implements OnInit {
  category;
  products;
 // cartItemDto:Cartitemdto = new Cartitemdto();
 // cart:Cart = new Cart();
  constructor(private router:Router, private route:ActivatedRoute, private service:CustomerService) {
    
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.category = routeParams.get('category');
    this.service.fetchProducts(this.category).then((response)=>{
        this.products = response;
        console.log(this.products);


      }
    )
  }

  addToCart(product) 
  {
    let formdata : FormData = new FormData()
    formdata.append('p_name',product.name)
    formdata.append('p_price',product.unitprice)
    formdata.append('category',this.category);
    formdata.append('customer_id',localStorage.getItem('customerId'))
    console.log(product.name)
    this.service.addToCart(formdata).then((response) =>{
      //console.log(response);
         Swal.fire({
           title: "Product Added",
           text:"Product added to cart",
           icon: "success",
           confirmButtonText: "Okay"
         })

    })
    
    
  }

}
// var flag=false;
//     console.log(product);
//     //this.cartItemDto.customerId = Number(localStorage.getItem('customerId'));
//     this.cartItemDto.productId = product.productId;
//     this.cartItemDto.quantity = 1;
//     this.service.addToCart(this.cartItemDto)(
//       response=> {
//         console.log(response);
//         Swal.fire({
//           title: "Product Added",
//           text:"Product added to cart",
//           icon: "success",
//           confirmButtonText: "Okay"
//         })
//       }
//     )
