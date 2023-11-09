import React, { Component, useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import "./produits.css";
import Pagination from "@mui/material/Pagination";
import { AiFillDelete } from "react-icons/ai";
import axios from "../../../helpers/axios";
import { useNavigate } from "react-router-dom";
function Produits(props) {
  props.funcNav(true);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setpostsPerPage] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCat, setSelectedSubCat] = useState("");
  const [maxPrice, setMaxPrice] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxCat, setMaxCat] = useState(null);
  const [minCat, setMinCat] = useState(null);
  let [Data, setData] = useState(null);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const navigate = useNavigate()

  useEffect(() => {
    myGetFunction();
  }, []);

  useEffect(() => {
    if (products) {
      setData(products.slice(indexOfFirstPost, indexOfLastPost));
    }
  }, [indexOfFirstPost, postsPerPage]);

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(products.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    console.log(value);
    result = products.filter((data) => {
      return data.name.search(value) != -1;
    });
    setData(result);
  };
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleInpuChange = (event) => {
    if (event.target.value != 0) setpostsPerPage(event.target.value);
  };

  useEffect(() => {
    let byPrice = [];

    if (maxPrice && minPrice) {
      byPrice = products.filter(
        (data) => data.price <= maxPrice && data.price >= minPrice
      );
    } else if (maxPrice) {
      byPrice = products.filter((data) => data.price <= maxPrice);
    } else if (minPrice) {
      byPrice = products.filter((data) => data.price >= minPrice);
    }

    setData(byPrice.slice(indexOfFirstPost, indexOfLastPost));
  }, [maxPrice, minPrice]);

  useEffect(() => {
    let byCat = [];

    if (maxCat && minCat) {
      byCat = products.filter(
        (data) => data.stock <= maxCat && data.stock >= minCat
      );
      setData(byCat.slice(indexOfFirstPost, indexOfLastPost));
    } else if (maxCat) {
      byCat = products.filter((data) => data.stock <= maxCat);
      setData(byCat.slice(indexOfFirstPost, indexOfLastPost));
    } else if (minCat) {
      byCat = products.filter((data) => data.stock >= minCat);
      setData(byCat.slice(indexOfFirstPost, indexOfLastPost));
    } else if (Data) setData(Data.slice(indexOfFirstPost, indexOfLastPost));
  }, [maxCat, minCat]);

  const myGetFunction = async () => {
    try {
      const res = await axios.get("product/get_all_products");
      setProducts(res.data.products);
      setData(res.data.products.slice(indexOfFirstPost, indexOfLastPost));
      const resCat = await axios.get("category/get_categories");
      setCategories(resCat.data.categories);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("categories", categories);
  console.log("selectCat", selectedCategory);

  const handleSelectedCategory = (e) => {
    console.log(e.target.value);
    if (e.target.value == "Tous") {
      //All parent categories selected
      setSelectedCategory("");
      setSelectedSubCat("");
      setData(products.slice(indexOfFirstPost, indexOfLastPost));
    } else {
      const selectedCat = JSON.parse(e.target.value);
      let filtredDataChildOfSelectedCat = [];
      let filtredData = [];
      setSelectedCategory(selectedCat);
      if (selectedCat.children.length > 0) {
        filtredData = products.filter(
          (data) => data.categoryId._id == selectedCat._id
        );
        filtredDataChildOfSelectedCat = products.filter((data) =>
          selectedCat.children.some(({ _id }) => _id === data.categoryId._id)
        );
        console.log(
          "filtredData",
          filtredDataChildOfSelectedCat.concat(filtredData)
        );
        setData(
          filtredDataChildOfSelectedCat
            .concat(filtredData)
            .slice(indexOfFirstPost, indexOfLastPost)
        );
      } else {
        filtredData = products.filter(
          (data) => data.categoryId._id == selectedCat._id
        );
        console.log("filtredData", filtredData);
        setData(filtredData.slice(indexOfFirstPost, indexOfLastPost));
      }
    }
  };

  const handleSelectedSubCat = (e) => {
    if (e.target.value == "Tous") {
      let filtredDataChildOfSelectedCat = [];
      let filtredData = [];
      filtredData = products.filter(
        (data) => data.categoryId._id == selectedCategory._id
      );
      filtredDataChildOfSelectedCat = products.filter((data) =>
        selectedCategory.children.some(({ _id }) => _id === data.categoryId._id)
      );
      console.log(
        "filtredData",
        filtredDataChildOfSelectedCat.concat(filtredData)
      );
      setData(
        filtredDataChildOfSelectedCat
          .concat(filtredData)
          .slice(indexOfFirstPost, indexOfLastPost)
      );
    } else {
      const selectedSubCat = JSON.parse(e.target.value);
      setSelectedSubCat(selectedSubCat);
      const filtredData = products.filter(
        (data) => data.categoryId.name == selectedSubCat.name
      );
      setData(filtredData.slice(indexOfFirstPost, indexOfLastPost));
    }
  };

  const deleteProduct = async (_id) => {
    const array = [...Data];
    const i = array.findIndex((item) => item._id === _id);
    if (i < 0) return;
    array.splice(i, 1);
    setData(array);

    await axios.post("product/delete_product", { _id });
  };

  const handleVisible = async (visible, index, productId) => {
    const arr = [...Data];
    arr[index].visible = visible;
    setData(arr);

    await axios.post('/product/update_product_visible', {
      productId,
      visible,
    });
  };

  if (categories && Data)
    return (
      <div className="products-container">
        <h1>Produits</h1>
        <table>
          <thead>
            <tr>
              <th>
                <div>
                  <span>Nom de produit</span>
                  <input
                    type="text"
                    placeholder="Chercher"
                    onChange={(event) => handleSearch(event)}
                  />
                </div>
              </th>
              <th>
                <div>
                  <span>Price</span>
                  <div className="inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th>
                <div>
                  <span>Category</span>
                  <select onChange={handleSelectedCategory}>
                    <option selected disabled>
                      Choisir
                    </option>
                    <option>Tous</option>
                    {categories.map((category) => {
                      return (
                        <option
                          key={category._id}
                          value={JSON.stringify(category)}
                        >
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </th>
              <th>
                <div>
                  <span>Sous Category</span>
                  <select onChange={handleSelectedSubCat} disabled= {selectedCategory ? false : true}>
                    <option selected disabled>
                      Choisir
                    </option>
                    <option>Tous</option>
                    {selectedCategory
                      ? selectedCategory.children.map((subCat) => {
                          return (
                            <option
                              key={subCat._id}
                              value={JSON.stringify(subCat)}
                            >
                              {subCat.name}
                            </option>
                          );
                        })
                      : null}
                  </select>
                </div>
              </th>
              <th>
                <div>
                  <span>Quantity</span>
                  <div className="inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      onChange={(e) => setMinCat(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      onChange={(e) => setMaxCat(e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th>
                <div>
                  <span>Statut</span>
                  <select>
                    <option selected disabled>
                      Choisir
                    </option>
                    <option>Enabled</option>
                    <option>Disabled</option>
                    <option>ALL</option>
                  </select>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Data.map((item, index) => {
              return (
                <tr key={item._id} className="item">
                  <td>
                    <div>
                      <span className="titre" onClick={() => navigate(`/admin/addProduct/${item._id}`)}>{item.name}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{item.price}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      {item.categoryId.parentId ? (
                        <span>
                          {
                            categories.filter((elem) =>
                              elem.children.some(
                                ({ _id }) => _id === item.categoryId._id
                              )
                            )[0].name
                          }
                        </span>
                      ) : (
                        <span>{item.categoryId.name}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{item.categoryId.name}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{item.stock}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <Switch 
                       size="small"
                       checked={item.visible}
                       onChange={(e) => handleVisible(e.target.checked, index, item._id)}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="delete-icon">
                      <AiFillDelete onClick={() => deleteProduct(item._id)}/>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination">
          <div>
            <span>Afficher</span>
            <input
              type="number"
              min="1"
              onkeydown="return false"
              inputmode="numeric"
              readonly
              value={postsPerPage}
              onChange={(event) => handleInpuChange(event)}
            />
            <span>Par page</span>
          </div>
          <div>
            <Pagination
              count={pageNumbers.length}
              variant="outlined"
              shape="rounded"
              siblingCount={0}
              page={currentPage}
              onChange={handleChange}
            />
            <span>{products.length} produits</span>
          </div>
        </div>
      </div>
    );
}
export default Produits;
