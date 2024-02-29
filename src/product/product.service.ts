import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as puppeteer from 'puppeteer';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly configService: ConfigService) {}

  async findOne(productId: string): Promise<Product> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log(browser);

    // URL del producto específico en Amazon que deseas scrapear
    const amazonDomain = this.configService.get<string>('AMAZON_URL_DOMAIN');
    const url = `${amazonDomain}dp/${productId}`; // URL de ejemplo de un producto

    // Navega a la página del producto
    await page.goto(url);

    // Espera a que se cargue la página del producto
    await page.waitForSelector('#productTitle');

    // Extrae información del producto
    const product = await page.evaluate(() => {
      const title = document.querySelector('#productTitle').textContent.trim();
      const price = document
        .querySelector('#priceblock_ourprice')
        .textContent.trim();
      const rating = document
        .querySelector(`span[data-asin="${productId}"] .a-icon-alt`)
        .textContent.trim();
      const description = document
        .querySelector('#productDescription')
        .textContent.trim();
      const image = document
        .querySelector('#imgTagWrapperId')
        .querySelector('img')
        .getAttribute('src');

      return {
        title,
        description,
        price,
        rating,
        image,
      };
    });

    await browser.close();
    return product;
  }
}
