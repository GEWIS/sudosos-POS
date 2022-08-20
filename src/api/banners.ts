import APIHelper from '@/mixins/APIHelper';
import BannerTransformer from '@/transformers/BannerTransformer';
import PaginationTransformer from '@/transformers/PaginationTransformer';
import { Banner } from '@/entities/Banner';

export function getBanners(take: number | null = null, skip: number | null = null) {
  const body = {
    ...take && { take },
    ...skip && { skip },
  };

  return APIHelper.getResource('banners', body).then((response) => {
    response._pagination = PaginationTransformer.makePagination(response._pagination);
    response.records = response.records.map((banner: any) => BannerTransformer.makeBanner(banner));

    return response;
  });
}

export async function getAllActiveBanners() {
  const date = new Date();
  return APIHelper.readPagination('open/banners').then((bannersResponse) => {
    const banners: Banner[] = bannersResponse.map(
      (banner: any) => BannerTransformer.makeBanner(banner),
    );
    return banners.filter((b) => b.active || (b.startDate < date && date < b.endDate));
  });
}

export function postFullBanner(banner: any, image: FormData) {
  return APIHelper.postResource('banners', banner).then((response) => APIHelper.postFile(`banners/${response.id}/image`, image)).then((response) => BannerTransformer.makeBanner(response));
}

export function postBannerImage(id: number, image: FormData) {
  return APIHelper.postFile(`banners/${id}/image`, image).then((response) => BannerTransformer.makeBanner(response));
}

export function getBanner(id: Number) {
  return APIHelper.getResource(`banners/${id}`).then((response) => BannerTransformer.makeBanner(response));
}

export function patchBanner(id: Number, banner: any) {
  return APIHelper.patchResource(`banners/${id}`, banner).then((response) => BannerTransformer.makeBanner(response));
}

export function deleteBanner(id: Number) {
  return APIHelper.delResource(`banners/${id}`).then((response) => BannerTransformer.makeBanner(response));
}
