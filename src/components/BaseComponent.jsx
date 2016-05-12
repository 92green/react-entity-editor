import React from 'react';

class BaseComponent extends React.Component {

    constructor(props, shouldAutoBind = true) {

      // Call 'React.Component' constructor
      super(props);

      // If options `shouldAutoBind` is true (default),
      // bind all methods to class instance (instead of window in browser)
      if (shouldAutoBind) {
        this.autoBind();
      }
    }

    // Bind an array of method name to class instance
    bind(methods) {
      methods.forEach(method => {
        this[method] = this[method].bind(this);
      });
    }

    // Bind all methods to class instance
    autoBind() {
        this.bind(
            Object.getOwnPropertyNames(this.constructor.prototype)
                .filter(prop => typeof this[prop] === 'function')
        );
    }

}

export default BaseComponent;
