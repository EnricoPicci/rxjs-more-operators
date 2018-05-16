
import {Observable} from 'rxjs';
// import {of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {share} from 'rxjs/operators';
import {skipWhile} from 'rxjs/operators';
import {switchMap} from 'rxjs/operators';

export function skipToggle<T>(toggle: Observable<boolean>) {
    let togValue: boolean;
    return (source: Observable<T>) => toggle.pipe(
        tap(t => togValue = t),
        switchMap(() => source.pipe(share(), skipWhile(() => !togValue)))
    )
}
