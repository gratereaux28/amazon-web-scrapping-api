import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly configService: ConfigService) {}

  async findOne(id: string): Promise<Product> {
    const browser = await puppeteer.launch({
      // headless: false,
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage();

    // URL del producto específico en Amazon que deseas scrapear
    const amazonDomain = this.configService.get<string>('AMAZON_URL_DOMAIN');
    const url = `${amazonDomain}dp/${id}?th=1`; // URL de ejemplo de un producto

    // Navega a la página del producto
    await page.goto(url);

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector('#productTitle');
    // await page.click('#nav-global-location-data-modal-action');
    // await page.waitForSelector('#GLUXZipUpdateInput');
    // await page.type('#GLUXZipUpdateInput', '33192', { delay: 500 });
    // await page.keyboard.press('Enter');
    // await page.reload();

    // Espera a que se cargue la página del producto
    // await page.waitForSelector('#productTitle', { timeout: 0 });

    // Extrae información del producto
    const product = await page.evaluate(() => {
      const title = document.querySelector('#productTitle').textContent.trim();
      // const price = document
      //   .querySelector('#priceblock_ourprice')
      //   .textContent.trim();
      // const rating = document
      //   .querySelector(`span[data-asin=""] .a-icon-alt`)
      //   .textContent.trim();
      // const description = document
      //   .querySelector('#productDescription')
      //   .textContent.trim();
      let image = document
        .querySelector('#imgTagWrapperId')
        .querySelector('img')
        .getAttribute('src');

      const lastBar = image.lastIndexOf('/');
      const domain = image.substring(0, lastBar + 1);
      const imageName = image.substring(lastBar + 1, image.length + 1);
      image = domain + imageName.replace(/\..*?\./g, '.');

      const rating = '';
      const description = '';
      const price = '';

      return {
        title,
        description,
        price,
        rating,
        image,
      };
    });

    // await browser.close();
    return product;
  }
}
