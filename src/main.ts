import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as functions from 'firebase-functions';
import { ListOfCallables } from './decorators/callable.decorator';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

let cachedExpressServer = null;

function bootstrapFirebaseApp(appName = 'Something') {
  const getApp = async (path = '') => {
    if (cachedExpressServer) {
      return cachedExpressServer;
    }
    
    const expressServer = express();

    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressServer),
    );
    
    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    const options = new DocumentBuilder()
      .setTitle('Forge ' + appName + ' API')
      .setDescription('Forge ' + appName + ' API description')
      .setVersion('1.0')
      .addServer(path)
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    await app.init();

    cachedExpressServer = expressServer;
    return expressServer;
  };

  const exporting: Record<
    string,
    functions.HttpsFunction & functions.Runnable<any>
  > = {};

  ListOfCallables.forEach(callable => {
    const callableFunction = functions.https.onCall(async message => {
      const app = await getApp();
      const runtime = app.get(callable.class);
      try {
        const res = await runtime[callable.methodName](message);
        return res;
      } catch (err) {
        return {
          data: null,
          error: {
            code: 500,
            text: 'Internal server error',
          },
        };
      }
    });
    exporting[callable.pattern] = callableFunction;
  });

  module.exports = {
    ...module.exports,
    ...exporting,
    http: functions.https.onRequest(async (req, res) => {
      const app = await getApp(req.baseUrl);
      app(req, res);
    }),
  };
}

bootstrapFirebaseApp('DemoApp');
