import React from 'react';
import UserStore from 'trc/user/UserStore';

var AskForm = React.createClass({
    displayName: 'AskForm',
    render: function () {
        return (
            <section>
                <form id="ask_us" method="post" action="/help/ask">
                    <h3 className="t-capitalize">Ask {UserStore.get('site').toLowerCase()} a question</h3>
                    <input type="hidden" name="firstName" id="firstName" value={UserStore.get('firstName')}/>
                    <input type="hidden" name="lastName" id="lastName" value={UserStore.get('lastName')}/>
                    <textarea className="Textarea row-x2" name="message" id="message" required="required"></textarea>
                    <button type="submit" className="Button">Ask</button>
                    <a href="/help/faq" className="l-right readmore">Check the FAQ</a>
                </form>
            </section>
        );
    }
});

module.exports = AskForm;