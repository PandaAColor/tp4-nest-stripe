
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
export class CreatePaymentDto {
    @IsString()
    orderId : string;

    @IsString()
    currency: string;
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => itemDTO)
    items: [
    { name: string, price: number, quantity: number}
    ]
}

export class itemDTO {
    @IsString()
    name : string

    @IsNumber()
    price: number

    @IsNumber()
    quantity : number
}