import React, { Component, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
function AddCatego(props) {
  const [name, setName] = useState("");
  const handleSubmit = () => {
    props.addParentCategory(name);
  };
  return (
    <div className={"modal"}>
      <div className="overlay">
        <div className="modal-content-catego">
          <form onSubmit={handleSubmit}>
            <div className="category-tit">
              <label for="category">Nom de category</label>
              <div>
                <input
                  name="category"
                  type="text"
                  placeholder="Category"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <button className="add-catego">Ajouter</button>
          </form>
          <button className="close-modal" onClick={props.toggleModal}>
            X
          </button>
        </div>
      </div>
    </div>
  );
}
export default AddCatego;
