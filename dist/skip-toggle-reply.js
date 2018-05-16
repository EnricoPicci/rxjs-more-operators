"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const skip_toggle_1 = require("./skip-toggle");
function skipToggleReply(toggle) {
    console.log('skipToggleReply');
    const replaySubject = new rxjs_1.ReplaySubject(1);
    return (source) => {
        const s = source.pipe(operators_1.share(), skip_toggle_1.skipToggle(toggle));
        s.subscribe(d => replaySubject.next(d), err => replaySubject.error(err), () => replaySubject.complete());
        return replaySubject.asObservable();
    };
}
exports.skipToggleReply = skipToggleReply;
//# sourceMappingURL=skip-toggle-reply.js.map