import { BaseVatGroup } from '@/entities/VatGroup';

export default {
  makeBaseVatGroup(data: any): BaseVatGroup {
    return {
      id: data.id,
      percentage: data.percentage,
      hidden: data.hidden,
    };
  },
};
