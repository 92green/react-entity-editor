import AnimalStore from '../components/AnimalStore';

// a stub data store to make the examples work
// see AnimalStore for more details

const DogsStore = () => AnimalStore({
    animalName: "dog",
    animalNamePlural: "dogs",
    initialState: {
        animals: [
            {
                id: "1",
                name: "Charlie",
                toy: "Frisbee"
            },
            {
                id: "2",
                name: "Rover",
                toy: "Stick"
            }
        ],
        viewState: {
            id: null,
            view: "list"
        }
    }
});

export default DogsStore;
