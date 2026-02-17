package com.sunisland.drafts;

import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.stereotype.Component;
import graphql.schema.DataFetchingEnvironment;

@Component
public class GraphqlExceptionAdvice extends DataFetcherExceptionResolverAdapter {
  @Override
  protected GraphQLError resolveToSingleError(Throwable ex, DataFetchingEnvironment env) {
    if (ex instanceof DraftConflictException) {
      return GraphqlErrorBuilder.newError(env)
        .message("CONFLICT: " + ex.getMessage())
        .build();
    }
    return null;
  }
}
