import APIHelper from '@/mixins/APIHelper';
import PointOfSaleTransformer from '@/transformers/PointOfSaleTransformer';
import { PointOfSale } from '@/entities/PointOfSale';
import PaginationTransformer from '@/transformers/PaginationTransformer';
import ContainerTransformer from '@/transformers/ContainerTransformer';
import ProductTransformer from '@/transformers/ProductTransformer';

/**
 * Get the point of sale at the given id using the `pointsofsale/${id}` endpoint.
 * @param {Number} posID The id of the point of sale.
 * @returns {Promise<PointOfSale>} A promise that resolves to a point of sale.
 */
export async function getPointOfSale(posID: number): Promise<PointOfSale> {
  const response = await APIHelper.getResource(`pointsofsale/${posID}`, undefined, {
    pragma: 'no-cache',
    'cache-control': 'no-cache',
  });

  return PointOfSaleTransformer.makePointOfSale(response) as PointOfSale;
}