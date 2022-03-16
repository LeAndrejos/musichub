import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '@environments/environment';
import {AccountService} from '../_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const user = this.accountService.userValue;
    const token = this.accountService.token;
    const isLoggedIn = user && token;
    console.log(user);
    const isApiUrl = request.url.startsWith(environment.apiUrl);

    request = request.clone({
      setHeaders: {
        'Access-Control-Allow-Origin': '*'
      }
    });

    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `${escape(token)}`,
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    console.log(request);

    return next.handle(request);
  }
}
