
import {Observable} from 'rxjs';
import {ReplaySubject} from 'rxjs';
import {of} from 'rxjs';
import {concat} from 'rxjs';
import {tap} from 'rxjs/operators';
import {share} from 'rxjs/operators';
// import {skipWhile} from 'rxjs/operators';
// import {switchMap} from 'rxjs/operators';

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

export function skipToggleReply1<T>(toggle: Observable<boolean>) {
    // const undefinedSymbol = Symbol('UNDEFINED');
    // let replayValue: symbol | T = undefinedSymbol;
    console.log('skipToggleReply');
    let replayValue: T;
    // if (replayValue === undefined) {
    //     console.log('skipToggleReply IF');
    //     return (source: Observable<T>) =>
    //         source.pipe(
    //             tap(d => console.log('tap if', d, replayValue)),
    //             share(),
    //             tap(d => replayValue = d),
    //             skipToggle(toggle),
    //         );
    // }
    return (source: Observable<T>) => {
        const s = source.pipe(
            tap(d => console.log('tap NOT IF', d, replayValue)),
            share(),
            tap(d => replayValue = d),
            skipToggle(toggle),
        )
        return concat(of(replayValue), s)
    }
}
