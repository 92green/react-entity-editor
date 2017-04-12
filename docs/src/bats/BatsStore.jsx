import AnimalStore from '../components/AnimalStore';

// a stub data store to make the examples work
// see AnimalStore for more details

const BatsStore = () => AnimalStore({
    animalName: "bat",
    animalNamePlural: "bats",
    asyncDelay: 1000,
    initialState: {
        viewState: {
            id: null,
            view: "list"
        }
    },
    asyncAnimalList: [
        {
            id: "1",
            name: "Vlad",
            diet: "Berries"
        },
        {
            id: "2",
            name: "Sven",
            diet: "Blood"
        }
    ]
});

export default BatsStore;
