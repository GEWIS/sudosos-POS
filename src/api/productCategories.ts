import { ProductCategory } from '@/entities/ProductCategory';
import APIHelper from '@/mixins/APIHelper';
import PaginationTransformer from '@/transformers/PaginationTransformer';
import ProductCategoryTransformer from '@/transformers/ProductCategoryTransformer';
import { Paginated } from '@/entities/Pagination';

/**
 * Get all the product categories using the `productcategories` endpoint, as a paginated response.
 * @param {Number} take The number of records to take, this can be null.
 * @param {Number} skip The number of records to skip, this can be null.
 * @returns {Promise<Paginated<ProductCategory>>} A promise that resolves to a paginated response.
 */
export async function getProductCategories(take: number | null = null, skip: number | null = null): Promise<Paginated<ProductCategory>> {
  const body = {
    ...take && { take },
    ...skip && { skip },
  };

  const response = await APIHelper.getResource('productcategories', body);
  const _pagination = PaginationTransformer.makePagination(response._pagination);
  const records = response.records.map(
    (productcategory: any) => ProductCategoryTransformer.makeProductCategory(productcategory),
  );

  return {_pagination, records} as Paginated<ProductCategory>;
}