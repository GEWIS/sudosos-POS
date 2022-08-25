import { Dinero } from 'dinero.js';
import { BaseEntity } from '@/entities/BaseEntity';
import { NFCDevice } from '@/entities/NFCDevice';

export enum UserType {
  MEMBER = 'MEMBER',
  ORGAN = 'ORGAN',
  BORRELKAART = 'BORRELKAART',
  LOCAL_USER = 'LOCAL_USER',
  LOCAL_ADMIN = 'LOCAL_ADMIN',
}

export interface UserPermissions {
  EDIT_OWN_POS_ENTITIES: boolean;
  EDIT_ALL_POS_ENTITIES: boolean;
  ACCEPT_POS_ENTITY_UPDATES: boolean;
  READ_FINANCIAL_DATA: boolean;
  EDIT_FINANCIAL_DATA: boolean;
}

export interface BaseUser extends BaseEntity {
  firstName: string;
  lastName: string;
  name: string;
  deleted: boolean;
}

export interface User extends BaseUser {
  gewisID?: number;
  email?: string;
  active: boolean;
  type: UserType;
  ean?: string;
  nfcDevices: NFCDevice[];
  acceptedToS: string;
  ofAge: boolean;
}

export function checkPermissions(permissions: UserPermissions, type: string) {
  if (type === 'container') {
    return permissions.EDIT_ALL_POS_ENTITIES || permissions.EDIT_OWN_POS_ENTITIES;
  }

  return false;
}
