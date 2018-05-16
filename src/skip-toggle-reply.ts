
import {Observable} from 'rxjs';
import {ReplaySubject} from 'rxjs';
import {share} from 'rxjs/operators';

import {skipToggle} from './skip-toggle';


export function skipToggleReply<T>(toggle: Observable<boolean>) {
    console.log('skipToggleReply');
    const replaySubject = new ReplaySubject<T>(1);
    return (source: Observable<T>) => {
        const s = source.pipe(
            share(),
            skipToggle(toggle),
        );
        s.subscribe(
            d => replaySubject.next(d),
            err => replaySubject.error(err),
            () => replaySubject.complete()
        )
        return replaySubject.asObservable();
    }
}

