import React from "react";
import Header from "./Header";
import useFetch from "./custom_hooks/useFetch";
import "./styles/diet.css";

const Alimentos = () => {
  const [select, setSelect] = React.useState("");
  const [foodId, setFoodId] = React.useState(null);
  const [allFoods, setAllFoods] = React.useState([]);
  const [updatedValue, setUpdatedValue] = React.useState({
    value: "",
  });
  const [totalMacro, setTotalMacro] = React.useState({
    carbo: 0,
    protein: 0,
    lipid: 0,
  });
  const [carboValues, setCarboValues] = React.useState({});
  const [proteinValues, setProteinValues] = React.useState({});
  const [lipidValues, setLipidValues] = React.useState({});

  const { request, data, loading, error } = useFetch();

  // BUSCA NA API A LISTAGEM DOS ALIMENTOS
  React.useEffect(() => {
    async function fetchData() {
      const { response, json } = await request(
        "https://taco-food-api.herokuapp.com/api/v1/food/",
      );
    }
    fetchData();
  }, [request]);

  // MANIPULA O SELECT E PEGA O ID DO ALIMENTO CLICADO
  function appendSelectedFoodId({ target }) {
    if (target.value !== "") {
      setSelect(target.value);
      let foodSelect = document.querySelector("#food-select");
      let id = document.querySelector("#food-select").selectedIndex;

      let selectedChildren = foodSelect.children[id];
      selectedChildren.setAttribute("disabled", "");
      setFoodId(id);
      setSelect("");
    }
  }
  //POPULA A TABELA DE ACORDO COM O ALIMENTO SELECIONADO
  React.useEffect(() => {
    let foodSelect = document.querySelector("#food-select");

    if (foodId !== null) {
      async function fetchSelectedFood() {
        const foodResponse = await fetch(
          `https://taco-food-api.herokuapp.com/api/v1/food/${foodId}`,
        );
        let foodData = await foodResponse.json();

        populateAllFood(foodData);
        setFoodId(null);
      }
      fetchSelectedFood();
      function populateAllFood(food) {
        setAllFoods((allFoods) => [...allFoods, food]);
      }
      foodSelect.value = "";
    }
  }, [foodId]);
  //INPUT VALUE UPDATE
  function updateValue(event) {
    let input = document.querySelector(`#${event.target.id}`);
    let quantityUpdate = input.nextElementSibling;
    let value = +event.target.value;
    if (isNaN(value)) {
      value = 100;
    }
    setUpdatedValue({ [event.target.id]: event.target.value });
    let carbo = document.querySelector(`.carbo${event.target.dataset.foodid}`);
    let protein = document.querySelector(
      `.protein${event.target.dataset.foodid}`,
    );
    let lipid = document.querySelector(`.lipid${event.target.dataset.foodid}`);

    quantityUpdate.innerText = value + "g";
    input.value = value;

    let carboValue = +carbo.dataset.carbo;
    let proteinValue = +protein.dataset.protein;
    let lipidValue = +lipid.dataset.lipid;

    let calcCarbo = ((value * carboValue) / 100).toFixed(2);
    let calcProtein = ((value * proteinValue) / 100).toFixed(2);
    let calcLipid = ((value * lipidValue) / 100).toFixed(2);

    carbo.innerText = calcCarbo + "g";
    setCarboValues({ ...carboValues, [input.id]: calcCarbo });
    protein.innerText = calcProtein + "g";
    setProteinValues({ ...proteinValues, [input.id]: calcProtein });
    lipid.innerText = calcLipid + "g";
    setLipidValues({ ...lipidValues, [input.id]: calcLipid });
  }

  // DELETE ELEMENT
  React.useEffect(() => {
    const deleteBtn = document.querySelectorAll(".deleteBtn");
    let foodSelect = document.querySelector("#food-select");

    function deleteRow() {
      deleteBtn.forEach((delBtn) => {
        delBtn.addEventListener("click", (e) => {
          let rowToDelete = e.target.parentElement;
          let idToRemove = +rowToDelete.firstChild.id;
          let selectedChildren = foodSelect.children[idToRemove];

          selectedChildren.removeAttribute("disabled");
          const foods = allFoods.filter((food) => {
            if (+idToRemove !== food[0].id) return food;
          });
          setAllFoods(foods);
        });
      });
    }
    deleteRow();
  }, [allFoods]);

  // SET TOTAL
  React.useEffect(() => {
    let somaCarbo = 0;
    for (const key of Object.keys(carboValues)) {
      somaCarbo = somaCarbo + +carboValues[key];
    }

    let somaProtein = 0;
    for (const key of Object.keys(proteinValues)) {
      somaProtein = somaProtein + +proteinValues[key];
    }

    let somaLipid = 0;
    for (const key of Object.keys(lipidValues)) {
      somaLipid = somaLipid + +lipidValues[key];
    }

    setTotalMacro({
      carbo: somaCarbo.toFixed(2),
      protein: somaProtein.toFixed(2),
      lipid: somaLipid.toFixed(2),
    });
  }, [allFoods, carboValues, proteinValues, lipidValues]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="all-content">
      <Header />

      <h1>Gerenciador de dieta</h1>
      <section className="diet-content">
        <h2>Café da manhã</h2>
        <div className="foods">
          <table className="food-info">
            <thead>
              <tr>
                <th>Alimentos</th>
                <th>Quantidade</th>
                <th>Carboidratos</th>
                <th>Proteínas</th>
                <th>Gorduras</th>
              </tr>
            </thead>
          </table>

          <div className="modal active">
            <div className="modal-card">
              <div className="modal-content">
                <h1>Selecione os alimentos</h1>
                <div className="foods-section">
                  <select
                    value={select}
                    name="food-select"
                    id="food-select"
                    onChange={appendSelectedFoodId}
                  >
                    <option value="">- Selecione um alimento -</option>

                    {data &&
                      data.map((food) => (
                        <option key={food.id}>{food.description}</option>
                      ))}
                  </select>
                </div>

                <table className="selected-food">
                  <thead>
                    <tr>
                      <th>Alimentos</th>
                      <th>
                        Digite a quantidade <span className="grama">(g)</span>
                      </th>
                      <th>Carboidratos</th>
                      <th>Proteínas</th>
                      <th>Gorduras Totais</th>
                    </tr>
                  </thead>

                  <tbody>
                    {allFoods &&
                      allFoods.map((food) => {
                        if (food[0])
                          return (
                            <tr key={food[0].id}>
                              <th id={food[0].id}>{food[0].description}</th>
                              <th>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                  }}
                                >
                                  <input
                                    id={"input" + food[0].id}
                                    defaultValue={updatedValue.value}
                                    name={"input" + food[0].id}
                                    data-foodid={food[0].id}
                                    onChange={
                                      (event) => updateValue(event)
                                      // setUpdatedValue(event.target.value)
                                    }
                                    className="newQt"
                                    type="text"
                                  />
                                  <span
                                    className={"quantityUpdate" + food[0].id}
                                  >
                                    100g
                                  </span>
                                </div>
                              </th>
                              <th
                                className={"carbo" + food[0].id}
                                data-carbo={
                                  food[0].attributes.carbohydrate
                                    ? food[0].attributes.carbohydrate.qty.toFixed(
                                        2,
                                      )
                                    : 0
                                }
                              >
                                {food[0].attributes.carbohydrate
                                  ? food[0].attributes.carbohydrate.qty.toFixed(
                                      2,
                                    ) + "g"
                                  : 0 + "g"}
                              </th>
                              <th
                                className={"protein" + food[0].id}
                                data-protein={
                                  food[0].attributes.protein
                                    ? food[0].attributes.protein.qty.toFixed(2)
                                    : 0
                                }
                              >
                                {food[0].attributes.protein
                                  ? food[0].attributes.protein.qty.toFixed(2) +
                                    "g"
                                  : 0 + "g"}
                              </th>
                              <th
                                className={"lipid" + food[0].id}
                                data-lipid={
                                  food[0].attributes.lipid
                                    ? food[0].attributes.lipid.qty.toFixed(2)
                                    : 0
                                }
                              >
                                {food[0].attributes.lipid
                                  ? food[0].attributes.lipid.qty.toFixed(2) +
                                    "g"
                                  : 0 + "g"}
                              </th>
                              <th className="deleteBtn">X</th>
                            </tr>
                          );
                      })}
                  </tbody>

                  <tfoot>
                    <tr className="macroTotal">
                      <th>Total</th>
                      <td>
                        {" "}
                        Calorias:{" "}
                        {(
                          totalMacro.carbo * 4 +
                          totalMacro.protein * 4 +
                          totalMacro.lipid * 9
                        ).toFixed(2)}
                        {""}
                        kcal
                      </td>
                      <td className="carboTotal"> {totalMacro.carbo}g </td>
                      <td className="proteinTotal"> {totalMacro.protein}g </td>
                      <td className="fatTotal"> {totalMacro.lipid}g </td>
                    </tr>
                  </tfoot>
                </table>

                <button className="record-button">Gravar</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Alimentos;
