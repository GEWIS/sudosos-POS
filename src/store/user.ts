import { VuexModule, Module, Mutation } from 'vuex-module-decorators';
import { User, UserType } from '@/entities/User';

@Module({ namespaced: true, name: 'UserState' })
class UserState extends VuexModule implements User {
  name: string = 'Test User';

  active: boolean = true;

  type: UserType = UserType.MEMBER;

  saldo: number = 4646;

  id: number = 1;

  gewisID: number = 7987;
}
export default UserState;
