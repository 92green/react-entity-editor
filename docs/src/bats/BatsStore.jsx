import AnimalStore from '../components/AnimalStore';

// a stub data store to make the examples work
// see AnimalStore for more details

const BatsStore = () => AnimalStore({
    animalName: "bat",
    animalNamePlural: "bats",
    asyncDelay: 1000,
    initialState: {
        animalLoaded: false,
        animalsLoaded: false,
        animals: [
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
        ],
        viewState: {
            id: null,
            view: "list"
        }
    }
});

export default BatsStore;
