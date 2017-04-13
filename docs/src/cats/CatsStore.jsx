import AnimalStore from '../components/AnimalStore';

// a stub data store to make the examples work
// see AnimalStore for more details

const CatsStore = () => AnimalStore({
    animalName: "cat",
    animalNamePlural: "cats",
    asyncDelay: 500,
    initialState: {
        animals: [
            {
                id: "1",
                name: "Fluffy",
                toy: "Ball of string"
            },
            {
                id: "2",
                name: "Scruffy",
                toy: "Ball of mice"
            }
        ],
        viewState: {
            id: null,
            view: "list"
        }
    }
});

export default CatsStore;
