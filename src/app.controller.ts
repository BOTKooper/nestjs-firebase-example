import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Callable } from './decorators/callable.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Callable('callable_only')
  callableOnly(abc: string): any {
    return {abc, service: this.appService.getHello()};
  }

  @Callable('http+callable')
  @Get('http-and-callable')
  httpAndCallable(@Query('abc') abc: string): any {
    return {abc, service: this.appService.getHello()};
  }

  @Get('http-only')
  httpOnly(@Query('abc') abc: string): any {
    return {abc, service: this.appService.getHello()};
  }

  none(abc: string): any {
    return {abc, service: this.appService.getHello()};
  }
}
