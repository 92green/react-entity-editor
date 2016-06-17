import React from 'react';
import {childContextTypes} from 'trc-client-core/src/auth/AuthProvider';

export default function AskForm(props, {currentUser}) {
    return <section>
        <form id="ask_us" method="post" action="/help/ask">
            <h3 className="t-capitalize">Ask us a question</h3>
            <input type="hidden" name="firstName" id="firstName" value={currentUser.get('firstName')}/>
            <input type="hidden" name="lastName" id="lastName" value={currentUser.get('lastName')}/>
            <textarea className="Textarea row-x2" name="message" id="message" required="required"></textarea>
            <button type="submit" className="Button">Ask</button>
            <a href="/help/faq" className="l-right readmore">Check the FAQ</a>
        </form>
    </section>;
}

AskForm.contextTypes = childContextTypes;
