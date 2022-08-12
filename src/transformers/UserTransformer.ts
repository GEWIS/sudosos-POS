import dinero from 'dinero.js';
import { BaseUser, User } from '@/entities/User';
import BaseTransformer from '@/transformers/BaseTransformer';

export default {
  makeUser(data: any) : BaseUser | User {
    if (data === undefined) {
      return {} as BaseUser;
    }

    if (!Object.keys(data).includes('active')) {
      return {
        ...BaseTransformer.makeBaseEntity(data),
        name: `${data.firstName} ${data.lastName}`.trim(),
      } as BaseUser;
    }

    const { ean } = data;
    let saldo;
    let nfcDevices = [];

    if ('saldo' in data) {
      // saldo = dinero({ amount: Number(data.saldo), currency: 'EUR' });
      saldo = data.saldo;
    }

    if ('nfcDevices' in data) {
      nfcDevices = data.nfcDevices.map((nfcDevice: { name: any; address: any; }) => (
        this.makeNFCDevice(nfcDevice)
      ));
    }

    return {
      ...BaseTransformer.makeBaseEntity(data),
      firstName: data.firstName,
      lastName: data.lastName,
      gewisID: data.gewisId,
      email: data.email,
      active: data.active,
      type: data.type,
      acceptedToS: data.acceptedToS,
      ofAge: data.ofAge,
      saldo,
      ean,
      nfcDevices,
    } as User;
  },

  makeNFCDevice(data: any) {
    return {
      ...BaseTransformer.makeBaseEntity(data),
      name: data.name,
      address: data.address,
    };
  },

  makeSaldo(data: any) {
    return dinero({ amount: data, currency: 'EUR' });
  },
};
