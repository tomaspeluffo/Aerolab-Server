import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('products')
  async getProducts(@Query() params) {
    return await this.appService.getProducts(params.page);
  }

  @Get('category_tree')
  async getCategories() {
    return await this.appService.getCategories();
  }
}
