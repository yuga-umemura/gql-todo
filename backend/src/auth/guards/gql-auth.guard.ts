import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class GqlAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  // getRequestはAuthGuardクラスで定義されているメソッドだが、
  // REST APIのコンテキスト向けに設計されているため、GraphQLのコンテキストでも使えるようにオーバーライドする
  getRequest(context: ExecutionContext) {
    // GraphQL用の実行コンテキストの作成
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();
    request.body = ctx.getArgs().signInInput;
    return request;
  }
}
