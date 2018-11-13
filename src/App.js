import React from "react";
import Collapsible from "./components/Collapsible";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      cars: []
    };
  }

  componentWillMount() {
    localStorage.getItem("cars") &&
      this.setState({
        cars: JSON.parse(localStorage.getItem("cars")),
        isLoading: false
      });
  }

  componentDidMount() {
    const date = localStorage.getItem("carsDate");
    const carsDate = date && new Date(parseInt(date));
    const now = new Date();
    const dataAge = Math.round((now - carsDate) / (1000 * 60)); // in minutes
    const tooOld = dataAge >= 15;
    if (tooOld) {
      this.fetchData();
    } else {
      console.log(
        `Using data from localStorage that are ${dataAge} minutes old.`
      );
    }
  }

  fetchData() {
    this.setState({
      isLoading: true,
      cars: []
    });

    fetch("https://api.myjson.com/bins/cadkm")
      .then(response => response.json())
      .then(parsedJSON =>
        parsedJSON.results.map(car => ({
          name: `${car.make}`,
          model: `${car.model}`,
          description: `${car.description}`,
          collection: `${car.collection}`,
          photo: `${car.photo}`,
          passengers: `${car.details.passengers}`,
          suitcase: `${car.details.suitcase}`,
          transmission: `${car.details.transmission}`,
          ac: `${car.details.ac}`,
          miles: `${car.details.miles}`,
          co2: `${car.details.co2}`,
          additionalInformation: `${car.additionalInformation}`,
          desclimer: `${car.desclimer}`
        }))
      )
      .then(cars =>
        this.setState({
          cars,
          isLoading: false
        })
      )
      .catch(error => console.log("parsing failed", error));
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem("cars", JSON.stringify(nextState.cars));
    localStorage.setItem("carsDate", Date.now());
  }

  render() {
    const { isLoading, cars } = this.state;
    return (
      <div className="topHeader">
        <header>
          <h2>
            <button
              className="btn btn-sm btn-warning"
              onClick={e => {
                this.fetchData();
              }}
            >
              Get new data from Json
            </button>
          </h2>
        </header>

        <div className="row">
          <div className={`content ${isLoading ? "is-loading" : ""}`}>
            <div className="panel-group">
              {!isLoading && cars.length > 0
                ? cars.map(car => {
                    const {
                      name,
                      model,
                      description,
                      collection,
                      photo,
                      passengers,
                      suitcase,
                      transmission,
                      ac,
                      miles,
                      co2,
                      additionalInformation
                    } = car;
                    return (
                      <Collapsible
                        key={photo}
                        collection={collection}
                        title={name}
                        photo={photo}
                        passengers={passengers}
                      >
                        <p className="description">
                          <strong>Model:</strong> {model}
                        </p>
                        <p>{description}</p>
                        <div className="row">
                          <div className="col">
                            <ul className="carDetails">
                              <li>{passengers}</li>
                              <li>{suitcase}</li>
                              <li>{transmission}</li>
                              <li>{ac}</li>
                              <li>{miles}</li>
                              <li>{co2}</li>
                            </ul>
                          </div>
                          <div className="col">
                            <img
                              alt={photo}
                              src={require("./images/" + photo)}
                            />
                          </div>
                        </div>
                        <button type="button" className="btn btn-warning">
                          Save for my reservation
                        </button>
                        <p className="additionalInformations">
                          {additionalInformation}
                        </p>
                      </Collapsible>
                    );
                  })
                : null}
            </div>
            <div className="loader">
              <div className="icon" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default App;
