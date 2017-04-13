/*
 * AnimalStore
 *
 * This is a stub data store used to make examples work. Its exact implementation doesn't matter for the examples.
 * It passes data down as props, and also passes down CRUD functions to modify the data.
 * You can imagine this would be replaced with a combination of XHR requests and redux if it were in an actual app.
 *
 * Additionally it holds state about the current viewState (including which item is being edited)
 * and a function to change the viewState.
 * In an actual app React Router v4 could possibly be used instead.
 */

import React, {Component} from 'react';

export default (config): Function => {
    return (ComposedComponent): ReactClass<any> => {

        class AnimalStoreDecorator extends Component {

            constructor(props) {
                super(props);
                this.state = {
                    animal: null,
                    animalLoaded: true,
                    animals: null,
                    animalsLoaded: true,
                    ...config.initialState
                };

                // sync
                this.onGet = this.onGet.bind(this);
                this.onList = this.onList.bind(this);
                this.onCreate = this.onCreate.bind(this);
                this.onUpdate = this.onUpdate.bind(this);
                this.onDelete = this.onDelete.bind(this);
                this.onGo = this.onGo.bind(this);

                // async
                this.onGetAsync = this.onGetAsync.bind(this);
                this.onListAsync = this.onListAsync.bind(this);
                this.onCreateAsync = this.onCreateAsync.bind(this);
                this.onUpdateAsync = this.onUpdateAsync.bind(this);
                this.onDeleteAsync = this.onDeleteAsync.bind(this);
            }

            onGet(id) {
                console.log(`getting ${config.animalName}`, id);
                const animal = this.state.animals.find(animal => animal.id == id);
                this.setState({
                    animal,
                    animalLoaded: true
                });
            }

            onList() {
                console.log(`listing ${config.animalNamePlural}`);
                this.setState({
                    animalsLoaded: true
                });
            }

            onGo(viewState) {
                console.log(`going to another view:`, viewState);
                this.setState({
                    viewState
                });
            }

            onCreate(payload) {
                console.log(`creating ${config.animalName}`, payload);
                const {animals} = this.state;
                const newId = animals.length
                    ? String(Number(animals.slice(-1).pop().id) + 1)
                    : "1";

                const newCat = {
                    ...payload,
                    id: newId
                };

                this.setState({
                    animals: [...animals, newCat]
                });

                return newCat;
            }

            onUpdate(id, payload) {
                console.log(`updating ${config.animalName}`, id, payload);
                const {animals} = this.state;
                const catIndex = animals
                    .map(cat => cat.id)
                    .indexOf(id);

                if(catIndex == -1) {
                    return;
                }

                const newCat = {
                    ...payload,
                    id
                };

                var newCats = animals.slice();
                newCats[catIndex] = newCat;

                this.setState({
                    animals: newCats
                });

                return newCat;
            }

            onDelete(id) {
                console.log(`deleting ${config.animalName}`, id);
                const {animals} = this.state;
                const catIndex = animals
                    .map(cat => cat.id)
                    .indexOf(id);

                if(catIndex == -1) {
                    return;
                }

                var newCats = animals.slice();
                newCats.splice(catIndex, 1);

                this.setState({
                    animals: newCats
                });

                return {id};
            }

            onGetAsync(id) {
                this.setState({
                    animalLoaded: false
                });
                return this.fakeAsync(this.onGet, [id]);
            }

            onListAsync() {
                this.setState({
                    animalsLoaded: false
                });
                return this.fakeAsync(this.onList, []);
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
                        resolve(callback(...args));
                    }, config.asyncDelay);
                });
            }

            render(): React.Element<any> {
                var animalProps = {
                    [config.animalName]: this.state.animalLoaded ? this.state.animal : null,
                    [config.animalNamePlural]: this.state.animalsLoaded ? this.state.animals : null
                };

                return <ComposedComponent
                    {...this.props}
                    {...animalProps}
                    viewState={this.state.viewState}
                    onGo={this.onGo}
                    onGet={this.onGet}
                    onList={this.onList}
                    onCreate={this.onCreate}
                    onUpdate={this.onUpdate}
                    onDelete={this.onDelete}
                    onGetAsync={this.onGetAsync}
                    onListAsync={this.onListAsync}
                    onCreateAsync={this.onCreateAsync}
                    onUpdateAsync={this.onUpdateAsync}
                    onDeleteAsync={this.onDeleteAsync}
                />;
            }
        }

        return AnimalStoreDecorator;
    }
};
