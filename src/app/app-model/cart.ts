import { Customer } from "./customer";
import { Customercart } from "./customercart";
import { Products } from "./products";

export class Cart {
    cartItemId:number;
    product:Products;
    quantity:number;
    cart:Customercart
}
