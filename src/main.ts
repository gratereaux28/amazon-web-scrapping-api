import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
  
	const LISTEN_PORT = configService.get<number>('APP_LISTEN_PORT');
	await app.listen(LISTEN_PORT || 22006);
}
bootstrap();
