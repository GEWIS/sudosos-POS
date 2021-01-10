import {
  VuexModule, Module, Mutation, Action,
} from 'vuex-module-decorators';
import { Product } from '@/entities/Product';
import { ProductCategory } from '@/entities/ProductCategory';
import { User, UserType } from '@/entities/User';

@Module({ namespaced: true, name: 'ProductsState' })
class ProductsState extends VuexModule {
    // *************************************************
    //
    //               Begin test data
    //
    // *************************************************
    private beer: ProductCategory = {
      id: 1,
      name: 'beer',
    };

    private drink: ProductCategory = {
      id: 2,
      name: 'drink',
    };

    private food: ProductCategory = {
      id: 3,
      name: 'food',
    };

    private ticket: ProductCategory = {
      id: 4,
      name: 'ticket',
    };

    private owner: User = {
      id: 1,
      gewisID: 1,
      name: 'TestUser',
      active: true,
      type: UserType.MEMBER,
      saldo: 4646,
    }

    beugel: Product = {
      id: 1,
      name: 'Grolsch beugel',
      owner: this.owner,
      price: 110,
      picture: 'https://www.supermarktaanbiedingen.com/public/images/product/2017/39/0-508102fls-grolsch-premium-pilsner-beugel-45cl.jpg',
      category: this.beer,
      version: 1,
      alcoholPercentage: 5.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tripel: Product = {
      id: 2,
      name: 'Grimbergen tripel (voor de sfeer)',
      owner: this.owner,
      price: 90,
      picture: 'https://deklokdranken.blob.core.windows.net/product-images/105120.jpg',
      category: this.beer,
      version: 1,
      alcoholPercentage: 5.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    alcoholFree: Product = {
      id: 3,
      name: 'Alcoholvrije Athena-meuk',
      owner: this.owner,
      price: 50,
      picture: 'https://www.cocktailicious.nl/wp-content/uploads/2019/10/sex-on-the-beach.jpg',
      category: this.drink,
      version: 1,
      alcoholPercentage: 5.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    cocktail: Product = {
      id: 4,
      name: 'Athena-meuk met alcohol',
      owner: this.owner,
      price: 150,
      picture: 'https://www.mitra.nl/cms/userfiles/cocktails/298-mojito43.png',
      category: this.drink,
      version: 1,
      alcoholPercentage: 5.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    starmix: Product = {
      id: 5,
      name: 'Starmix',
      owner: this.owner,
      price: 90,
      picture: 'https://www.kantinewinkel.nl/media/catalog/product/cache/3/thumbnail/9df78eab33525d08d6e5fb8d27136e95/5/7/574601.jpg',
      category: this.food,
      version: 1,
      alcoholPercentage: 5.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    genderInTheBlender: Product = {
      id: 6,
      name: 'Kaartje "Gender in the blender"',
      owner: this.owner,
      price: 100,
      picture: 'https://images1.persgroep.net/rcs/aEe3BRrfPbrJOENdix0_AJTfdY8/diocontent/153315357/_fitwidth/1240?appId=93a17a8fd81db0de025c8abd1cca1279&quality=0.9',
      category: this.ticket,
      version: 1,
      alcoholPercentage: 5.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // *************************************************
    //
    //               End test data
    //
    // *************************************************
    products: Product[] = [
      this.beugel,
      this.tripel,
      this.alcoholFree,
      this.cocktail,
      this.starmix,
      this.genderInTheBlender,
    ];
}
export default ProductsState;
