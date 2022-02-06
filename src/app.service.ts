import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  async getProducts(page) {
    let date = new Date();
    date = new Date(date.setDate(date.getDate() - 30));
    const dolarInfo = await this.getDollar();

    try {
      const result = await axios.get(
        `https://challenge-api.aerolab.co/products?page=${page}`,
      );

      const filterProducts = result.data.products.filter(
        (prod) => new Date(prod.updatedAt) > date,
      );

      for (const product of filterProducts) {
        product.dolarPrice = Number(
          (product.price / dolarInfo.rate).toFixed(2),
        );
      }

      return filterProducts;
    } catch (error) {
      throw new HttpException(
        'La paginacion no es tan grande, prueba con una pagina menor',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getDollar() {
    const result = await axios.get('https://challenge-api.aerolab.co/dollar');
    return result.data;
  }

  async getCategories() {
    const result = await axios.get(
      'https://challenge-api.aerolab.co/categories',
    );

    var tree = [],
      mappedArr = {};

    result.data.categories.forEach(function (item) {
      var id = item.id;
      if (!mappedArr.hasOwnProperty(id)) {
        mappedArr[id] = item; 
        mappedArr[id].subcategories = [];
      }
    });

    for (var id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        let mappedElem = mappedArr[id];

        if (mappedElem.parent_id) {
          var parentId = mappedElem.parent_id;
          mappedArr[parentId].subcategories.push(mappedElem);
        }

        else {
          tree.push(mappedElem);
        }
      }
    }

    return tree;
  }
}
