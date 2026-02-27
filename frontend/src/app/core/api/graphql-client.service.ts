import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GraphqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

@Injectable({ providedIn: 'root' })
export class GraphqlClient {
  private http = inject(HttpClient);
  private endpoint = `${environment.apiBaseUrl}/graphql`;

  request<T>(query: string, variables?: Record<string, any>): Observable<T> {
    return this.http.post<GraphqlResponse<T>>(this.endpoint, { query, variables }).pipe(
      map((res) => {
        if (res.errors?.length) throw new Error(res.errors.map(e => e.message).join(' | '));
        if (!res.data) throw new Error('GraphQL empty data');
        return res.data;
      })
    );
  }
}
