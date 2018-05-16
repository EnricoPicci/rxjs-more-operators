import { Observable } from 'rxjs';
export declare function skipToggleReply<T>(toggle: Observable<boolean>): (source: Observable<T>) => Observable<T>;
