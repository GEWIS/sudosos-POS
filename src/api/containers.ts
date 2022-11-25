import ContainerTransformer from '@/transformers/ContainerTransformer';
import APIHelper from '@/mixins/APIHelper';
import PaginationTransformer from '@/transformers/PaginationTransformer';
import ProductTransformer from '@/transformers/ProductTransformer';
import { BaseContainer, Container } from '@/entities/Container';

/**
 * Get the container at the given id using the `containers/${id}` endpoint.
 * @param {Number} id The id of the container.
 * @returns {Promise<BaseContainer | Container>} A promise that resolves to a
 * container.  
 */
export async function getContainer(id: number): Promise<BaseContainer | Container> {
  const response = await APIHelper.getResource(`containers/${id}`);
  
  return ContainerTransformer.makeContainer(response);
}