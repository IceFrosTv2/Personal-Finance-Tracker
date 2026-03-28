import type {OperationTypeEnum} from "./operation-type.enum";

export type OperationsType = {
    "id": number,
    "type": OperationTypeEnum,
    "amount": number,
    "date": string,
    "comment": string,
    "category": string,
}

export type CreateOrUpdateOperation = {
    type: OperationTypeEnum,
    amount: number,
    date: string,
    comment: string,
    category_id: number,
};
