export interface ProductionChainEditDto {
  name?: string;
  productId?: string;
  // id of the equipment, and amount for ProductionChainEquipment relation
  equipments: EquipmentRelEditDto[];
  users: UserRelEditDto[];
  // id of the resource, and amount for ProductionChainResource relation
  resources: ResourceRelEditDto[];
}

export interface EquipmentRelEditDto {
  id: string;
  amount: number;
}

export interface UserRelEditDto {
  id: string;
}

export interface ResourceRelEditDto {
  id: string;
  amount: number;
}

export interface ProductionChainUpsertDto {
  name: string;
  productId: string;
}
