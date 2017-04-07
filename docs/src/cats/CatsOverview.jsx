import React, {Component} from 'react';

import CatsList from './CatsList';
import CatsItem from './CatsItem';
import Source from '../components/Source';
//import js from '!!raw!./CatsOverview.jsx';

class CatsOverview extends Component {
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

        this.onGo = this.onGo.bind(this);

        // create "catModifier", which is a set of methods that let you modify the cats list
        // and simulate xhr requests by having a delay and returning promises
        this.catModifier = {
            create: (payload) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        this.onCreate(payload);
                        resolve();
                    }, 500);
                });
            },
            update: (id, payload) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        this.onUpdate(id, payload);
                        resolve();
                    }, 500);
                });
            },
            delete: (id) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        this.onDelete(id);
                        resolve();
                    }, 500);
                });
            }
        };
    }

    onGet(id) {
        return this.state.cats.find(cat => cat.id == id);
    }

    onCreate(payload) {
        console.log('catModifier: create cat', payload);
        const {cats} = this.state;
        const newId = String(Number(cats.slice(-1).pop().id) + 1);

        const newCat = {
            ...payload,
            id: newId
        };

        this.setState({
            cats: [...cats, newCat]
        });
    }

    onUpdate(id, payload) {
        console.log('catModifier: update cat', id, payload);
        const {cats} = this.state;
        const catIndex = cats
            .map(cat => cat.id)
            .indexOf(id);

        if(catIndex == -1) {
            return;
        }

        var newCats = cats.slice();
        newCats[catIndex] = {
            ...payload,
            id
        };

        this.setState({
            cats: newCats
        });
    }

    onDelete(id) {
        console.log('catModifier: delete cat', id);
        const {cats} = this.state;
        this.setState({
            cats: cats.splice(id, 1)
        });
    }

    onGo(view) {
        console.log('navigating to another view:', view);
        this.setState({
            view
        });
    }

    render() {
        const {view, cats} = this.state;
        console.log('cats', cats);

        return <div>
            <h1>Cats</h1>
            <p>This example exists just to dev the new structure.</p>
            <p><Source exampleDir="cats">Source</Source></p>
            {view.name == "list" &&
                <div>
                    <p>List:</p>
                    <CatsList
                        cats={cats}
                        onGo={this.onGo}
                        catModifier={this.catModifier}
                    />
                </div>
            }
            {view.name == "item" &&
                <div>
                    <p>Item {view.id}:</p>
                    <CatsItem
                        cat={this.onGet(view.id)}
                        onGo={this.onGo}
                        catModifier={this.catModifier}
                    />
                </div>
            }
        </div>;
    }
}

export default CatsOverview;
