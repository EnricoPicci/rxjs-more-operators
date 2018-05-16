import { Observable } from 'rxjs';
export declare function skipToggle<T>(toggle: Observable<boolean>): (source: Observable<T>) => Observable<T>;
