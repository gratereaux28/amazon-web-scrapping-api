import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly configService: ConfigService) {}

  async findOne(id: string): Promise<Product> {
    let product: Product;

    // URL del producto específico en Amazon que deseas scrapear
    const amazonDomain = this.configService.get<string>('AMAZON_URL_DOMAIN');
    const url = `${amazonDomain}dp/${id}?th=1`; // URL de ejemplo de un producto

    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
      },
    });

    const {
      data,
      request: {
        res: { responseUrl },
      },
    } = response;
    const $ = cheerio.load(data);
    const link = responseUrl.substring(0, responseUrl.lastIndexOf('?'));

    $('div#ppd').each((i, el) => {
      const image = $(el)
        .find('#imgTagWrapperId')
        .first()
        .find('img')
        .attr('src');

      const domain = image.substring(0, image.lastIndexOf('/') + 1);
      const image_name = image.substring(
        image.lastIndexOf('/') + 1,
        image.length + 1,
      );

      product = {
        title: $(el).find('#productTitle').text().trim(),
        description: $(el)
          .find('span.a-declarative')
          .attr('data-ssf-share-icon'),
        price: '0',
        rating: $(el).find('#acrPopover').attr('title'),
        image: domain + image_name.replace(/\..*?\./g, '.'),
        link: link,
      };
    });

    return product;
  }

  async findOneByUrl(url: string): Promise<Product> {
    let product: Product;

    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
      },
    });

    const {
      data,
      request: {
        res: { responseUrl },
      },
    } = response;
    const $ = cheerio.load(data);
    const link = responseUrl.substring(0, responseUrl.lastIndexOf('?'));

    $('div#ppd').each((i, el) => {
      const image = $(el)
        .find('#imgTagWrapperId')
        .first()
        .find('img')
        .attr('src');

      const domain = image.substring(0, image.lastIndexOf('/') + 1);
      const image_name = image.substring(
        image.lastIndexOf('/') + 1,
        image.length + 1,
      );

      product = {
        title: $(el).find('#productTitle').text().trim(),
        description: $(el)
          .find('span.a-declarative')
          .attr('data-ssf-share-icon'),
        price: '0',
        rating: $(el).find('#acrPopover').attr('title'),
        image: domain + image_name.replace(/\..*?\./g, '.'),
        link: link,
      };
    });

    return product;
  }
}
