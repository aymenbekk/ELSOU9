import React, { Component, useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import "../produits/produits.css";
import Pagination from "@mui/material/Pagination";
import AddCatego from "./addCatego";
import axios from "../../../helpers/axios";
import "./addcatego.css";
import cloudinary from "cloudinary/lib/cloudinary";

cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUD_NAME,
  api_key: process.env.REACT_APP_API_KEY,
  api_secret: process.env.REACT_APP_API_SECRET,
});

function CategoriesAdmin(props) {
  props.funcNav(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setpostsPerPage] = useState(5);
  const [modal, setModal] = useState(false);
  const [addedSousCat, setAddedSousCat] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedSubCatId, setSelectedSubCatId] = useState("");

  let [Data, setData] = useState([]);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  useEffect(() => {
    axios
      .get("category/get_categories")
      .then((res) => {
        if (res.status == 200) {
          setCategories(res.data.categories);
          setData(res.data.categories.slice(indexOfFirstPost, indexOfLastPost));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setData(categories.slice(indexOfFirstPost, indexOfLastPost));
  }, [indexOfFirstPost, postsPerPage]);
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(categories.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleInpuChange = (event) => {
    if (event.target.value != 0) setpostsPerPage(event.target.value);
  };
  const toggleModal = () => {
    setModal(!modal);
  };

  const handleSelectedSubCat = (e) => {
    setSelectedSubCatId(e.target.value);
  };

  const handleAddSousCatego = (e) => {
    setAddedSousCat(e.target.value);
  };

  const deleteParentCategory = (categoryId) => {
    const array = [...Data];
    const i = array.findIndex((item) => item._id === categoryId);
    if (i < 0) return;
    array.splice(i, 1);
    setData(array);

    axios
      .post("category/delete_parent_category", { categoryId })
      .then(async (res) => {
        console.log("Categorie est supprimé");

        if (res.data.imageToDelete > 0) {
          const imagesToDelete = res.data.imagesToDelete;
          for (let imageToDelete of imagesToDelete) {
            await deleteImage(imageToDelete.public_id);
          }
        }
        
      })
      .catch((err) => console.log(err));
  };

  async function deleteImage(publicId) {
    await cloudinary.v2.uploader
      .destroy(publicId, function(error, result) {
        console.log(result, error);
      })
      .then((resp) => console.log(resp))
      .catch((_err) =>
        console.log("Something went wrong, please try again later.")
      );
  }

  const deleteSubCategory = (parentId, indexParent, indexChild) => {
    const arr = [...categories];

    if (selectedSubCatId) {
      console.log(selectedSubCatId)
      axios
        .post("category/delete_child_category", {
          categoryId: selectedSubCatId,
        })
        .then(async (res) => {
          arr
            .find((item) => item._id == parentId)
            .children.some(({ _id }) => _id !== selectedSubCatId);
          console.log("arr", arr);
          setCategories(arr);

          if (res.data.imageToDelete.length > 0) {
            const imagesToDelete = res.data.imagesToDelete;
            for (let imageToDelete of imagesToDelete) {
              await deleteImage(imageToDelete.public_id);
            }
          }
          
        })
        .catch((err) => console.log(err));
    } else console.log("Selectionnez une categorie");
  };

  const addParentCategory = (name) => {
    const arr = [...categories];

    axios
      .post("category/add_category", { name })
      .then((res) => {
        arr.push(res.data.category);
        setCategories(arr);
      })
      .catch((err) => console.log(err));
  };

  const addChildCategory = (parentId) => {
    const arr = [...categories];
    if (addedSousCat) {
      axios
        .post("category/add_category", {
          name: addedSousCat,
          parentId: parentId,
        })
        .then((res) => {
          arr
            .find((item) => item._id == parentId)
            .children.push(res.data.category);
          setCategories(arr);
          console.log("Sous category est ajouté");
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="products-container">
      <div>
        <h1>Categories</h1>
        <button onClick={toggleModal}>Ajouter Category</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <div>
                <span>Nom de Category</span>
              </div>
            </th>
            <th>
              <div>
                <span>Sous Category</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {Data.map((item) => {
            return (
              <tr key={item._id} className="item">
                <td>
                  <div>
                    <span className="titre">{item.name}</span>
                  </div>
                </td>
                <td>
                  <div className="sous-category-admin">
                    {" "}
                    <select onChange={handleSelectedSubCat}>
                      <option selected disabled>
                        Choisir
                      </option>
                      {item.children.map((subItem) => {
                        return (
                          <option key={subItem._id} value={subItem._id}>
                            {subItem.name}
                          </option>
                        );
                      })}
                    </select>
                    <div className="delete-icon">
                      <AiFillDelete
                        onClick={() => deleteSubCategory(item._id)}
                      />
                    </div>
                  </div>
                </td>

                <td>
                  <div className="add-sous-catego">
                    <input
                      type="text"
                      onChange={handleAddSousCatego}
                      placeholder="Sous Categorie"
                    />
                    <button onClick={() => addChildCategory(item._id)}>
                      Ajouter Sous Category
                    </button>
                  </div>
                </td>

                <td>
                  <div className="delete-icon">
                    <AiFillDelete
                      onClick={() => deleteParentCategory(item._id)}
                    />
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
          <span>{categories.length} produits</span>
        </div>
      </div>
      {modal && (
        <AddCatego
          toggleModal={toggleModal}
          addParentCategory={addParentCategory}
        />
      )}
    </div>
  );
}
export default CategoriesAdmin;
