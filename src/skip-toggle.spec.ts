
import 'mocha';

import {Subject} from 'rxjs';
import {interval} from 'rxjs';
import {take} from 'rxjs/operators';
import {share} from 'rxjs/operators';

import {skipToggle} from './skip-toggle';

describe('skip-toggle', () => {

    it(`1.1 - emits between 0 and 1 second and then stops`, done => {
        let dataEmitted;
        const toggle = new Subject<boolean>();
        const source = interval(100).pipe(
            take(50),
            skipToggle(toggle)
        );

        source.subscribe(
            d => {
                dataEmitted = d;
            }
        );

        setTimeout(() => {
            toggle.next(true);
        }, 0);
        setTimeout(() => {
            toggle.next(false);
        }, 1000);

        setTimeout(() => {
            const dataToCheck = dataEmitted;
            // it should be 3, since the interval emits 4 times in 500 milliseconds
            if (dataToCheck != 3) {
                console.error('dataToCheck not as expected', dataToCheck);
                done();
                throw(new Error('dataToCheck not as expected'));
            }
        }, 500);
        setTimeout(() => {
            const dataToCheck = dataEmitted;
            // it should be 8, since the interval emits 9 times in 1000 milliseconds and then
            // we decided to block the emission
            if (dataToCheck != 8) {
                console.error('dataToCheck not as expected', dataToCheck);
                done();
                throw(new Error('dataToCheck not as expected'));
            }
            done();
        }, 1500);

    });

    it(`1.2 - emits between 0 and 1 second, does not emit between 1 and 2 seconds, 
        emits again after 2 seconds`, done => {
        let dataEmitted;
        const toggle = new Subject<boolean>();
        const source = interval(100).pipe(
            take(50),
            share()
        );
        source.subscribe();

        const toggledSource = source.pipe(
            take(50),
            skipToggle(toggle)
        );
        toggledSource.subscribe(
            d => {
                dataEmitted = d;
            }
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
            toggle.next(false);
        }, 3000);

        setTimeout(() => {
            const dataToCheck = dataEmitted;
            // it should be 23, since the interval emits 23 times in 2500 milliseconds
            // we block emission from 1 sec to 2 sec of toggledSource observable, but the
            // underlying source continues to emit - so when we start the emission of toggledSource
            // again, we have 23 as a result after 2500 milliseconds
            if (dataToCheck != 23) {
                console.error('dataToCheck not as expected', dataToCheck);
                done();
                throw(new Error('dataToCheck not as expected'));
            }
        }, 2500);
        setTimeout(() => {
            const dataToCheck = dataEmitted;
            // it should be 28, since the interval emits 28 times in 3000 milliseconds
            // and we block emission after 3 seconds
            // see the above comment for why it is 28 even if we blocked toggledSource 
            // from 1 second to 2 seconds
            if (dataToCheck != 28) {
                console.error('dataToCheck not as expected', dataToCheck);
                done();
                throw(new Error('dataToCheck not as expected'));
            }
            console.log(dataToCheck);
            done();
        }, 3500);
    }).timeout(10000);

})