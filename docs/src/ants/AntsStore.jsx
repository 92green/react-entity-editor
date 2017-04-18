import AnimalStore from '../components/AnimalStore';

// a stub data store to make the examples work
// see AnimalStore for more details

const AntsStore = () => AnimalStore({
    animalName: "ant",
    animalNamePlural: "ants",
    initialState: {
        animals: [
            {
                id: "1",
                name: "Zeke",
                legs: "6"
            },
            {
                id: "2",
                name: "David",
                legs: "6"
            }
        ]
    }
});

export default AntsStore;
