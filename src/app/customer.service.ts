import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Customer } from './app-model/customer';
import { LoginStatus } from './app-model/login-status';
import { Category } from './app-model/category';
import { Cartitemdto } from './app-model/cartitemdto';
import { Products } from './app-model/products';
import { Cart } from './app-model/cart';
import { OrderDto } from './app-model/order-dto';
import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import {environment} from 'src/environments/environment'
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private uploadtask : firebase.storage.UploadTask;
  products;

  constructor(private httpClient: HttpClient) {
    firebase.initializeApp(environment.firebaseConfig)
   }

  login(customer:Customer):Observable<LoginStatus>{
    return this.httpClient.post<LoginStatus>("http://localhost:8181/login",customer);
  }

  register(customer:Customer):Observable<Customer> {
    return this.httpClient.post<Customer>("http://localhost:8181/register",customer);
  }

  addCategory(category:Category) {
    var categories;
    var ob=null
    this.fetchCategoryNames().then((response)=> {
      if(response.indexOf(category.name)>-1){
        alert("Category exists")
      } else {
        firebase.database().ref('Products/'+category.name).push({
          ob
        })
      }
    });
  }

  addProduct(product:FormData , imgfile){
    console.log("image"+imgfile)
    var urld;
    var url;
    var storageref = firebase.storage().ref();
    this.uploadtask = storageref.child('images/'+product.get('image')).put(imgfile);

    this.uploadtask.then(() => {
        urld = this.uploadtask.snapshot.ref.getDownloadURL();
        console.log(urld.then((response)=> {
          console.log(response)
          url = response
          firebase.database().ref('Products/'+product.get('categoryName')+'/'+product.get('name')).set({
            name:product.get('name'),
            unitprice:product.get('unitPrice'),
            description:product.get('description'),
            imageURL: url
          })
          console.log("At the end")
        }));
    });
  }

  fetchCategoryNames():Promise<any>{
    var products;
    return firebase.database().ref('Products/').get()
    .then((snapshot)=>{
      if(snapshot.exists()){
          
          return Object.keys(snapshot.val());
          // return this.products;
      }
    })
  }

  fetchProducts(category:string):Promise<any> {
    var products = [];
    return firebase.database().ref('Products/'+category+'/').get()
    .then((snapshot)=>{
      if(snapshot.exists()){
          Object.keys(snapshot.val()).forEach(element => {
            if(element == "name") {
              console.log(element)
            } else {
              products.push(snapshot.child(element).val())
              console.log(products)
            }
          });
          return products;
      }
    })
  }
  addToCart(carddata:FormData):Promise<any>{
    var res;
    var cartid = carddata.get('category') +"-"+carddata.get('p_name')
    var dataref = firebase.database().ref('Carts/'+carddata.get('customer_id')+'/'+cartid+'/');
    return dataref.get()
        .then((snapshot) => {
          if(snapshot.exists()){
            console.log("Exists")
            console.log("========")
           // console.log(snapshot.val().quantity)
            var currentquantity : number;
            currentquantity = +snapshot.val().quantity;
            console.log("currentquantity : "+currentquantity)
            var Totalquantity:number;
            Totalquantity = currentquantity + 1;
            console.log("Totalquantity : "+Totalquantity)
            dataref.update({
              "quantity":Totalquantity
            }).then((respone) => {
              res = respone
             // console.log(res)
            })
            return res;
          }
          else{
            console.log("Adding cart")
            dataref.set({
              name:carddata.get('p_name'),
              price:carddata.get('p_price'),
              quantity:"1",
              cartid:cartid
            }).then((response)=>{
              res = response;
              //console.log(res)
            })
            console.log("Added")
            console.log("========")
          }
          return res;
        })
    
  }
  fetchCart(customerId:String):Promise<any>
  {
    var Carts = [];
    return firebase.database().ref('Carts/'+customerId+'/').get()
              .then((snapshot)=>{
                if(snapshot.exists()){ 
                  Object.keys(snapshot.val()).forEach(element => {
                    Carts.push(snapshot.child(element).val())
                    //console.log(Carts)
                  })
                }
                return Carts;
              })
  }

  //service for remove item from cart
  removeitem(cartid,customerId){
    var result;
    var dbref = firebase.database().ref('Carts/'+customerId+'/'+cartid+'/');
    return dbref.get().then((snapshot)=>{
      if(snapshot.exists()){
        var currentquantity:number
        currentquantity = +snapshot.val().quantity
        console.log(currentquantity)
        if(currentquantity == 1){
          dbref.remove().then((response)=>{
            result = response  
          })
          return result
        }
        else{
          var totalquantity:number
          totalquantity = currentquantity - 1
          dbref.update({
            quantity:totalquantity
          }).then((response)=>{
            result = response
          })
          return result;
        }
      }
      return result;
    })

  }

  placeOrder(orderDto:OrderDto):Promise<any> {
    
    return firebase.database().ref('orders/'+orderDto.customerId+'/'+orderDto.orderId+'/').set({
              orderId:orderDto.orderId,
              username:orderDto.customerId,
              productlist:orderDto.cart,
              totalamount:orderDto.amount,
              orderDate: new Date().toDateString(),
              shippingAddress:orderDto.shippingAddress,
              timeslot:orderDto.deliveryTime,
              shippingDate: orderDto.shippingDate,
              status:'PENDING'
            }).then((response)=>{
              return response;
            })

  }
  //Service for delecting card after order has been placed
  removeCart(customer_id:string)
  {
    console.log(customer_id)
    firebase.database().ref('Carts/'+customer_id+'/').remove();

  }

  fetchOrder(customerId:string):Promise<any>{
    var OrderData = [];
    return firebase.database().ref('orders/'+customerId+'/').get()
        .then((snapshot)=>{
          if(snapshot.exists()){  
            Object.keys(snapshot.val()).forEach(element => {
              OrderData.push(snapshot.child(element).val())
              //console.log("order:",snapshot.val())
              console.log("order:",OrderData)
            })
          }
          return OrderData;  
        })
  }
  cancelOrder(orderId:string,customer_id:string):Promise<any>{
    var result;
    return firebase.database().ref('orders/'+customer_id+'/'+'/'+orderId).update({
      "status":"CANCELLED"
      }).then((response)=>{
            result = response

              return result;
            })
              

  }
}
//Object.keys(snapshot.val()).forEach(element => {
