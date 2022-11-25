import {
  Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import Dinero from 'dinero.js';
import store from '@/store';
import { User, UserPermissions, UserType } from '@/entities/User';
import { Organ } from '@/entities/Organ';
import APIHelper from '@/mixins/APIHelper';
import { getOrganMembers, getUsers } from '@/api/users';
import UserTransformer from '@/transformers/UserTransformer';
import { NFCDevice } from '@/entities/NFCDevice';
import jwtDecode from 'jwt-decode';
import { BasePointOfSale } from '@/entities/PointOfSale';

@Module({
  dynamic: true, namespaced: true, store, name: 'UserModule',
})
export default class UserModule extends VuexModule {
  user: User = {} as User;

  userBalance: Dinero.Dinero = null;

  userRoles: string[] = [];

  userPOSs: BasePointOfSale[] = [];

  allUsers: User[] = [];

  allOrgans: Organ[] = [];

  permissions: UserPermissions = {} as UserPermissions;

  automaticRestart: boolean = true;

  @Mutation
  reset() {
    this.user = {} as User;
    this.userRoles = [];
    this.userPOSs = [];
    this.allUsers = [];
    this.allOrgans = [];
    this.permissions = {} as UserPermissions;
  }

  @Mutation
  setUser(user: User) {
    this.user = user;
  }

  @Mutation
  setAllUsers(allUsers: User[]) {
    this.allUsers = allUsers;
  }

  @Mutation
  setUserPOSs(pointsOfSale: BasePointOfSale[]) {
    this.userPOSs = pointsOfSale.sort((a, b) => (a.name.localeCompare(b.name)));
  }

  @Mutation
  setAllOrgans() {
    if (this.allUsers.length > 0) {
      this.allOrgans = this.allUsers
        .filter((user) => user.type.toString() === 'ORGAN')
        .map((user) => ({
          organUser: user,
          organMembers: [] as User[],
          organName: user.firstName,
        }));
    }
  }

  @Mutation
  setUserRoles(roles: string[]) {
    this.userRoles = roles;
  }

  @Mutation
  updateBalance(balance: Dinero.Dinero) {
    this.userBalance = balance;
  }

  @Mutation
  updatePinCode(data: {}) {
    APIHelper.putResource('user/pincode', data);
    this.fetchUser(true);
  }

  @Mutation
  updateUsersPinCode(data: {}) {
    APIHelper.putResource('user/pincode', data);
    this.fetchAllUsers(true);
  }

  @Mutation
  addNFCDevice(data: {}) {
    const nfcResponse = APIHelper.postResource('user/nfcdevice', data);
    this.user.nfcDevices.splice(0, 0, UserTransformer.makeNFCDevice(nfcResponse));
  }

  @Mutation
  addUsersNFCDevice(data: {
    userID: number;
  }) {
    const nfcResponse = APIHelper.postResource('user/nfcdevice', data);
    const index = this.allUsers.findIndex((user) => user.id === data.userID);
    const user = this.allUsers[index];

    user.nfcDevices.splice(0, 0, UserTransformer.makeNFCDevice(nfcResponse));

    this.allUsers.splice(index, 1, user);
  }

  @Mutation
  updateNFCDevice(data: {id : number}) {
    const nfcResponse = APIHelper.putResource('user/nfcdevice', data);
    const index = this.user.nfcDevices.findIndex((nfc: NFCDevice) => nfc.id === data.id);
    this.user.nfcDevices.splice(index, 1, UserTransformer.makeNFCDevice(nfcResponse));
  }

  @Mutation
  updateUsersNFCDevice(data: {id : number, userID: number}) {
    const nfcResponse = APIHelper.putResource('user/nfcdevice', data);
    const userIndex = this.allUsers.findIndex((user) => user.id === data.userID);
    const user = this.allUsers[userIndex];
    const index = user.nfcDevices.findIndex(
      (nfc: NFCDevice) => nfc.id === data.id,
    );

    user.nfcDevices.splice(
      index, 1, UserTransformer.makeNFCDevice(nfcResponse),
    );

    this.allUsers.splice(userIndex, 1, user);
  }

  @Mutation
  removeNFCDevice(data: {id: number}) {
    const nfcResponse = APIHelper.delResource('user/nfcdevice', data);
    const index = this.user.nfcDevices.findIndex((nfc: NFCDevice) => nfc.id === data.id);
    this.user.nfcDevices.splice(index, 1);
  }

  @Mutation
  removeUsersNFCDevice(data: {id: number, userID: number}) {
    const nfcResponse = APIHelper.delResource('user/nfcdevice', data);
    const userIndex = this.allUsers.findIndex((user) => user.id === data.userID);
    const user = this.allUsers[userIndex];
    const index = user.nfcDevices.findIndex(
      (nfc: NFCDevice) => nfc.id === data.id,
    );

    user.nfcDevices.splice(index, 1);
    this.allUsers.splice(userIndex, 1, user);
  }

  @Mutation
  updateUserInformation(data: {
    userID: number,
    firstname: string,
    lastname: string,
    email: string,
    }) {
    const userResponse = APIHelper.putResource('user/updateUserInfo', data);
    this.user.firstName = data.firstname;
    this.user.lastName = data.lastname;
    this.user.email = data.email;
  }

  @Mutation
  updateUsersUserInformation(data: {
    userID: number,
    firstname: string,
    lastname: string,
    email: string,
    active: boolean,
  }) {
    const userResponse = APIHelper.putResource('user/updateUserInfo', data);
    const userIndex = this.allUsers.findIndex((user) => user.id === data.userID);
    const user = this.allUsers[userIndex];

    user.firstName = data.firstname;
    user.lastName = data.lastname;
    user.name = `${data.firstname} ${data.lastname}`;
    user.email = data.email;
    user.active = data.active;

    this.allUsers.splice(userIndex, 1, user);
  }

  @Mutation
  // eslint-disable-next-line class-methods-use-this
  updatePassword(data: {id: number, password: string}) {
    const passwordResponse = APIHelper.putResource('user/password', data);
  }

  @Mutation
  // eslint-disable-next-line class-methods-use-this
  updateUsersPassword(data: {userID: number, password: string}) {
    const passwordResponse = APIHelper.putResource('user/password', data);
  }

  @Action({
    rawError: (process.env.VUE_APP_DEBUG_STORES === 'true'),
  })
  async fetchBalance(id: number) {
    try {
      const balanceResponse = await APIHelper.getResource(`balances/${id}`);
      const balance = Dinero(balanceResponse.amount);
      this.context.commit('updateBalance', balance);
    } catch (e) {
      this.context.commit('updateBalance', null);
    }
  }

  @Action({
    rawError: (process.env.VUE_APP_DEBUG_STORES === 'true'),
  })
  async fetchUser(force: boolean = false) {
    if (this.user.id === undefined || force) {
      const token = jwtDecode(APIHelper.getToken().jwtToken as string) as any;

      const userResponse = await APIHelper.getResource(`users/${token.user.id}`);
      const user = UserTransformer.makeUser(userResponse);

      this.context.commit('setUser', user);

      await this.fetchBalance(user.id);
      APIHelper.getResource(`users/${token.user.id}/pointsofsale`).then((pointOfSaleResponse) => {
        this.context.commit('setUserPOSs', pointOfSaleResponse.records);
      });
    }
  }

  @Action({
    rawError: (process.env.VUE_APP_DEBUG_STORES === 'true'),
  })
  async fetchAllUsers(force: boolean = false) {
    if (this.allUsers.length === 0 || force) {
      const take = 500;
      let usersResponse = await getUsers(take);
      const allUsers = usersResponse.records;

      const pages = Math.ceil(usersResponse._pagination.count / take);

      allUsers.push(...(await Promise.all(Array(pages-1).fill(1).map(async (_, i) => {
        usersResponse = await getUsers(take, (i+1)*take);
        return usersResponse.records;
      }))).flat());
      this.context.commit('setAllUsers', allUsers);
      this.context.commit('setAllOrgans');
      this.fetchAllOrganMembers();
    }
  }

  @Action({
    rawError: (process.env.VUE_APP_DEBUG_STORES === 'true'),
  })
  async fetchAllOrganMembers() {
    // TODO: Replace with actual fetch code
    // eslint-disable-next-line no-restricted-syntax
    for (const organ of this.allOrgans) {
      // eslint-disable-next-line no-await-in-loop
      organ.organMembers = await getOrganMembers(organ.organUser.id);
    }
  }
}
