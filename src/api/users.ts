import UserTransformer from '@/transformers/UserTransformer';
import PaginationTransformer from '@/transformers/PaginationTransformer';
import APIHelper from '@/mixins/APIHelper';
import { User } from '@/entities/User';
import { TransactionFilter } from '@/entities/Transaction';
import TransactionTransformer from '@/transformers/TransactionTransformer';

export function getUsers(take: number | null = null, skip: number | null = null) {
  const body = {
    ...take && { take },
    ...skip && { skip },
  };

  return APIHelper.getResource('users', body, {
    pragma: 'no-cache',
    'cache-control': 'no-cache',
  }).then((response) => {
    response._pagination = PaginationTransformer.makePagination(response._pagination);
    response.records = response.records.map(
      (user: any) => UserTransformer.makeUser(user),
    );

    return response;
  });
}

export function postUser(user: any) {
  return APIHelper.postResource('users', user).then((response) => UserTransformer.makeUser(response));
}

export function getUser(id: number) {
  return APIHelper.getResource(`users/${id}`).then((response) => UserTransformer.makeUser(response));
}

export function patchUser(id: number, user: any) {
  return APIHelper.patchResource(`users/${id}`, user).then((response) => UserTransformer.makeUser(response));
}

export function deleteUser(id: number) {
  return APIHelper.delResource(`users/${id}`);
}

export function getOrganMembers(id: number): Promise<User[]> {
  return APIHelper.getResource(`users/${id}/members`)
    .then((response) => (response && response.records
      ? response.records.map((res: any) => UserTransformer.makeUser(res))
      : []));
}
