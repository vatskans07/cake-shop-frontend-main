export class OrderDto {
    orderId:string
	cartId:number
	shippingAddress:string;
	shippingDate:Date;
	deliveryTime:string;
	amount:number;
	customerId:string;
	cart:Array<any>;
	orderdate:Date;
}
