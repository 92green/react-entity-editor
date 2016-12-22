import React from 'react';

export default (props) => {
    return <div className="Wrapper">
        <h1>react-entity-editor</h1>
        <ul className="Content"><li>Poo</li></ul>
        <section>
        {props.children}
        </section>
    </div>
}
