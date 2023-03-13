import {
  Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import Dinero from 'dinero.js';
import store from '@/store';
import { User, UserPermissions } from '@/entities/User';
import { Organ } from '@/entities/Organ';
import APIHelper from '@/mixins/APIHelper';
import { getOrganMembers, getUsers } from '@/api/users';
import UserTransformer from '@/transformers/UserTransformer';
import { NFCDevice } from '@/entities/NFCDevice';
import jwtDecode from 'jwt-decode';
import { BasePointOfSale } from '@/entities/PointOfSale';

/**
 * The module that controls the current user.
 */
@Module({
  dynamic: true, namespaced: true, store, name: 'UserModule',
  })
export default class UserModule extends VuexModule {
  /**
   * The user that is currently logged in.
   */
  public user: User = {} as User;

  /**
   * The balance of the user that is currently logged in.
   */
  public userBalance: Dinero.Dinero = null;

  /**
   * The roles of the user that is currently logged in.
   */
  public userRoles: string[] = [];

  /**
   * The points of sale that the user that is currently logged in has access to.
   */
  public userPOSs: BasePointOfSale[] = [];

  /**
   * All users that are currently in the system.
   */
  public allUsers: User[] = [];

  /**
   * All organs that are currently in the system.
   */
  public allOrgans: Organ[] = [];

  /**
   * MUTATION. Resets the user.
   */
  @Mutation
  reset() {
    this.user = {} as User;
    this.userRoles = [];
    this.userPOSs = [];
    this.allUsers = [];
    this.allOrgans = [];
  }

  /**
   * MUTATION. Sets the user.
   * @param {User} user The user to set.
   */
  @Mutation
  setUser(user: User) {
    this.user = user;
  }

  /**
   * MUTATION. Sets the all users.
   * @param {User[]} allUsers The all users to set.
   */
  @Mutation
  setAllUsers(allUsers: User[]) {
    this.allUsers = allUsers;
  }

  /**
   * MUTATION. Sets the user points of sale.
   * @param {BasePointOfSale[]} pointsOfSale The points of sale to set.
   */
  @Mutation
  setUserPOSs(pointsOfSale: BasePointOfSale[]) {
    this.userPOSs = pointsOfSale.sort((a, b) => (a.name.localeCompare(b.name)));
  }

  /**
   * MUTATION. Sets the all organs by filtering all the users.
   * @param {Organ[]} allOrgans The all organs to set.
   */
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

  /**
   * MUTATION. Sets the users roles.
   */
  @Mutation
  setUserRoles(roles: string[]) {
    this.userRoles = roles;
  }

  /**
   * MUTATION. Updates the users balance.
   * @param {Dinero.Dinero} balance The balance to set.
   */
  @Mutation
  updateBalance(balance: Dinero.Dinero) {
    this.userBalance = balance;
  }

  /**
   * MUTATION. Updates the users pin code and refreshes the user.
   * @param {object} data ??
   */
  @Mutation
  updatePinCode(data: {}) {
    APIHelper.putResource('user/pincode', data);
    this.fetchUser(true);
  }

  /**
   * MUTATION. Updates the users pin code and refreshes all the users.
   * @param {object} data ??
   */
  @Mutation
  updateUsersPinCode(data: {}) {
    APIHelper.putResource('user/pincode', data);
    this.fetchAllUsers(true);
  }

  /**
   * MUTATION. Adds an NFC device to the user.
   * @param {object} data ??
   */
  @Mutation
  async addNFCDevice(data: {}) {
    const nfcResponse = await APIHelper.postResource('user/nfcdevice', data);
    this.user.nfcDevices.splice(0, 0, UserTransformer.makeNFCDevice(nfcResponse));
  }

  /**
   * MUTATION. Adds an NFC device for the given user.
   * @param {number} {userID} The ID of the user to add the NFC device to.
   * @param {object} data ??
   */
  @Mutation
  async addUsersNFCDevice(data: {userID: number}) {
    const nfcResponse = await APIHelper.postResource('user/nfcdevice', data);
    const index = this.allUsers.findIndex((user) => user.id === data.userID);
    const user = this.allUsers[index];

    user.nfcDevices.splice(0, 0, UserTransformer.makeNFCDevice(nfcResponse));

    this.allUsers.splice(index, 1, user);
  }

  /**
   * MUTATION. Updates the given NFC device.
   * @param {number} {id} The ID of the NFC device to update.
   * @param {object} data ??
   */
  @Mutation
  async updateNFCDevice(data: {id : number}) {
    const nfcResponse = await APIHelper.putResource('user/nfcdevice', data);
    const index = this.user.nfcDevices.findIndex((nfc: NFCDevice) => nfc.id === data.id);
    this.user.nfcDevices.splice(index, 1, UserTransformer.makeNFCDevice(nfcResponse));
  }

  /**
   * MUTATION. Updates the given NFC device for the given user.
   * @param {number} {id} The ID of the NFC device to update.
   * @param {number} {userID} The ID of the user to update the NFC device for.
   * @param {object} data ??
   */
  @Mutation
  updateUsersNFCDevice(data: {id : number, userID: number}) {
    const nfcResponse = APIHelper.putResource('user/nfcdevice', data);
    const userIndex = this.allUsers.findIndex((user) => user.id === data.userID);
    const user = this.allUsers[userIndex];
    const index = user.nfcDevices.findIndex((nfc: NFCDevice) => nfc.id === data.id);

    user.nfcDevices.splice(index, 1, UserTransformer.makeNFCDevice(nfcResponse));

    this.allUsers.splice(userIndex, 1, user);
  }

  /**
   * MUTATION. Removes the given NFC device.
   * @param {number} {id} The ID of the NFC device to remove.
   * @param {object} data ??
   */
  @Mutation
  async removeNFCDevice(data: {id: number}) {
    await APIHelper.delResource('user/nfcdevice', data);
    const index = this.user.nfcDevices.findIndex((nfc: NFCDevice) => nfc.id === data.id);
    this.user.nfcDevices.splice(index, 1);
  }

  /**
   * MUTATION. Removes an NFC device for the given user.
   * @param {number} {id} The ID of the NFC device to remove.
   * @param {number} {userID} The ID of the user to remove the NFC device for.
   * @param {object} data ??
   */
  @Mutation
  async removeUsersNFCDevice(data: {id: number, userID: number}) {
    await APIHelper.delResource('user/nfcdevice', data);
    const userIndex = this.allUsers.findIndex((user) => user.id === data.userID);
    const user = this.allUsers[userIndex];
    const index = user.nfcDevices.findIndex(
      (nfc: NFCDevice) => nfc.id === data.id,
    );

    user.nfcDevices.splice(index, 1);
    this.allUsers.splice(userIndex, 1, user);
  }

  /**
   * MUTATION. Updates the users information.
   * @param {number} {userID} The ID of the user to update.
   * @param {string} {firstname} The new first name of the user.
   * @param {string} {lastname} The new last name of the user.
   * @param {string} {email} The new email of the user.
   * @param {object} data ??
   */
  @Mutation
  async updateUserInformation(
    data: {userID: number, firstname: string, lastname: string, email: string},
  ) {
    await APIHelper.putResource('user/updateUserInfo', data);
    this.user.firstName = data.firstname;
    this.user.lastName = data.lastname;
    this.user.email = data.email;
  }

  /**
   * MUTATION. Updates the users information. ??
   * @param {number} {userID} The ID of the user to update.
   * @param {string} {firstname} The new first name of the user.
   * @param {string} {lastname} The new last name of the user.
   * @param {string} {email} The new email of the user.
   * @param {boolean} {active} ??
   * @param {object} data ??
   */
  @Mutation
  async updateUsersUserInformation(
    data: {userID: number, firstname: string, lastname: string, email: string, active: boolean},
  ) {
    await APIHelper.putResource('user/updateUserInfo', data);
    const userIndex = this.allUsers.findIndex((user) => user.id === data.userID);
    const user = this.allUsers[userIndex];

    user.firstName = data.firstname;
    user.lastName = data.lastname;
    user.name = `${data.firstname} ${data.lastname}`;
    user.email = data.email;
    user.active = data.active;

    this.allUsers.splice(userIndex, 1, user);
  }

  /**
   * MUTATION. Updates the users password.
   * @param {number} {id} The ID of the user to update.
   * @param {string} {password} The new password of the user.
   * @param {object} data ??
   */
  @Mutation
  updatePassword(data: {id: number, password: string}) {
    return APIHelper.putResource('user/password', data);
  }

  /**
   * MUTATION. Updates the users password.
   * @param {number} {userID} The ID of the user to update.
   * @param {string} {password} The new password of the user.
   * @param {object} data ??
   */
  @Mutation
  updateUsersPassword(data: {userID: number, password: string}) {
    return APIHelper.putResource('user/password', data);
  }

  /**
   * ACTION. Fetches the balance of the given user.
   * @param {number} id The ID of the user to fetch the balance for.
   */
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

  /**
   * ACTION. Fetches the user. If the user is already fetched, it will not fetch
   * again unless forced.
   * @param {boolean} force Will force to fetch if the user is already fetched.
   */
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
      APIHelper.getResource(`users/${token.user.id}/pointsofsale`)
        .then((pointOfSaleResponse) => {
          this.context.commit('setUserPOSs', pointOfSaleResponse.records);
        });
    }
  }

  /**
   * ACTION. Fetches all users. If the users are already fetched, it will not
   * fetch again unless forced. It will first fetch the first 500 users, then
   * fetch the rest of the users in parallel.
   * @param {boolean} force Will force to fetch if the users are already
   * fetched.
   */
  @Action({
    rawError: (process.env.VUE_APP_DEBUG_STORES === 'true'),
    })
  async fetchAllUsers(force: boolean = false) {
    if (this.allUsers.length === 0 || force) {
      const take = 500;
      let usersResponse = await getUsers(take);
      const allUsers = usersResponse.records;

      const pages = Math.ceil(usersResponse._pagination.count / take);

      allUsers.push(...(await Promise.all(Array(pages - 1).fill(1).map(async (_, i) => {
        usersResponse = await getUsers(take, (i + 1) * take);
        return usersResponse.records;
      }))).flat());
      this.context.commit('setAllUsers', allUsers);
      this.context.commit('setAllOrgans');
      this.fetchAllOrganMembers();
    }
  }

  /**
   * ACTION. Fetches all organ members.
   */
  @Action({
    rawError: (process.env.VUE_APP_DEBUG_STORES === 'true'),
    })
  async fetchAllOrganMembers() {
    // TODO: Replace with actual fetch code
    for (const organ of this.allOrgans) {
      organ.organMembers = await getOrganMembers(organ.organUser.id);
    }
  }
}
