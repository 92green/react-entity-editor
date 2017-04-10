//
// This file provides props for the cats example
// + cats data as props
// + methods to modify cat data
// + state regarding the views (including which item is being edited)
// + methods to modify which view is being viewed
//

import React, {Component} from 'react';

export default (): Function => {
    return (ComposedComponent): ReactClass<any> => {

        class CatsStateHockDecorator extends Component {

            constructor(props) {
                super(props);
                this.state = {
                    view: {
                        id: null,
                        name: "list"
                    },
                    cats: [
                        {
                            id: "1",
                            name: "Fred",
                            toy: "Fuzz ball"
                        },
                        {
                            id: "2",
                            name: "Scruffy",
                            toy: "Cork"
                        }
                    ]
                };

                // this.onGet = this.onGet.bind(this);
                // this.onList = this.onList.bind(this);
                this.onGo = this.onGo.bind(this);
                this.onCreate = this.onCreate.bind(this);
                this.onUpdate = this.onUpdate.bind(this);
                this.onDelete = this.onDelete.bind(this);
                this.onCreateAsync = this.onCreateAsync.bind(this);
                this.onUpdateAsync = this.onUpdateAsync.bind(this);
                this.onDeleteAsync = this.onDeleteAsync.bind(this);
            }

            // onGet(id) {
            //     return this.state.cats.find(cat => cat.id == id);
            // }

            // onList() {
            //     return this.state.cats;
            // }

            onGo(view) {
                console.log('navigating to another view:', view);
                this.setState({
                    view
                });
            }

            onCreate(payload) {
                console.log('cat state: create cat', payload);
                const {cats} = this.state;
                const newId = cats.length
                    ? String(Number(cats.slice(-1).pop().id) + 1)
                    : "1";

                const newCat = {
                    ...payload,
                    id: newId
                };

                this.setState({
                    cats: [...cats, newCat]
                });

                return newCat;
            }

            onUpdate(id, payload) {
                console.log('cat state: update cat', id, payload);
                const {cats} = this.state;
                const catIndex = cats
                    .map(cat => cat.id)
                    .indexOf(id);

                if(catIndex == -1) {
                    return;
                }

                const newCat = {
                    ...payload,
                    id
                };

                var newCats = cats.slice();
                newCats[catIndex] = newCat;

                this.setState({
                    cats: newCats
                });

                return newCat;
            }

            onDelete(id) {
                console.log('cat state: delete cat', id);
                const {cats} = this.state;
                const catIndex = cats
                    .map(cat => cat.id)
                    .indexOf(id);

                if(catIndex == -1) {
                    return;
                }

                var newCats = cats.slice();
                newCats.splice(catIndex, 1);

                this.setState({
                    cats: newCats
                });

                return {id};
            }

            onCreateAsync(payload) {
                return this.fakeAsync(this.onCreate, [payload]);
            }

            onUpdateAsync(id, payload) {
                return this.fakeAsync(this.onUpdate, [id, payload]);
            }

            onDeleteAsync(id) {
                return this.fakeAsync(this.onDelete, [id]);
            }

            fakeAsync(callback, args) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        callback(...args);
                        resolve();
                    }, 500);
                });
            }

            render(): React.Element<any> {
                return <ComposedComponent
                    {...this.props}
                    cats={this.state.cats}
                    view={this.state.view}
                    onGo={this.onGo}
                    onCreate={this.onCreate}
                    onUpdate={this.onUpdate}
                    onDelete={this.onDelete}
                    onCreateAsync={this.onCreateAsync}
                    onUpdateAsync={this.onUpdateAsync}
                    onDeleteAsync={this.onDeleteAsync}
                />;
            }
        }

        return CatsStateHockDecorator;
    }
};
