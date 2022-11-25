import APIHelper from '@/mixins/APIHelper';
import BannerTransformer from '@/transformers/BannerTransformer';
import { Banner } from '@/entities/Banner';

/**
 * Get all the active banners using the `open/banners` endpoint. It will fetch all the pages until
 * it has all the active banners.
 * @returns {Promise<Banner[]>} A promise that resolves to an array of banners.
 */
export async function getAllActiveBanners(): Promise<Banner[]> {
  const date = new Date();
  const response = await  APIHelper.readPagination('open/banners');
  const banners: Banner[] = response.map((banner: any) => BannerTransformer.makeBanner(banner));
  
  return banners.filter((b) => b.active || (b.startDate < date && date < b.endDate));
}