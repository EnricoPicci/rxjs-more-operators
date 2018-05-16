
import 'mocha';

import {Subject} from 'rxjs';
import {interval} from 'rxjs';
import {take} from 'rxjs/operators';
import {share} from 'rxjs/operators';

import {skipToggleReply} from './skip-toggle-reply';

describe('skip-toggle-replay tests', () => {

    it(`1.1 - emits between 0 and 1 second, stops after 1 second
        after 1.5 seconds subscribes again and should receive immediatly the last item 
        emitted by the observable before being stopped`, done => {
        const toggle = new Subject<boolean>();
        const source = interval(100).pipe(
            take(50),
            share()
        );
        source.subscribe();

        const toggledSource = source.pipe(
            take(50),
            skipToggleReply(toggle)
        );
        toggledSource.subscribe(
            d => d
        );

        setTimeout(() => {
            toggle.next(true);
        }, 0);
        setTimeout(() => {
            toggle.next(false);
        }, 1000);

        setTimeout(() => {
            toggledSource.subscribe(
                d => {
                    console.log('after 1500', d);
                    if (d !== 8) {
                        console.error('data received not as expected', d);
                        done();
                        throw(new Error('data received not as expected'));
                    }
                    done();
                }
            )
        }, 1500);
    }).timeout(10000);

    it(`1.2 - emits between 0 and 1 second, stops after 1 second
    after 2 seconds starts emitting again
    after 2.5 subscribes and should receive immediatly the item 
    expected after 2.5 seconds`, done => {
    const toggle = new Subject<boolean>();
    const source = interval(100).pipe(
        take(50),
        share()
    );
    source.subscribe();

    const toggledSource = source.pipe(
        take(50),
        skipToggleReply(toggle)
    );
    toggledSource.subscribe(
        d => d
    );

    setTimeout(() => {
        toggle.next(true);
    }, 0);
    setTimeout(() => {
        toggle.next(false);
    }, 1000);
    setTimeout(() => {
        toggle.next(true);
    }, 2000);

    setTimeout(() => {
        toggledSource.pipe(take(1)).subscribe(
            d => {
                console.log('after 2500', d);
                if (d !== 23) {
                    console.error('data received not as expected', d);
                    done();
                    throw(new Error('data received not as expected'));
                }
                done();
            }
        )
    }, 2500);
}).timeout(10000);

})