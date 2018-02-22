// Import from @angular
import { Observable } from 'rxjs/Observable';

export function asyncScriptLoad(id, src): Observable<any> {
  return Observable.create(observer => {
    if (typeof window === 'undefined' || document.getElementById(id)) {
      observer.next();
      observer.complete();
    }

    const fjs = document.getElementsByTagName('script')[0];
    let js;

    js = document.createElement('script');
    js.id = id;
    js.src = src;

    js.onload = js.onreadystatechange = function() {
      if (!this.readyState || this.readyState === 'complete') {
        observer.next();
        observer.complete();
      }
    };

    fjs.parentNode.insertBefore(js, fjs);
  });
}
