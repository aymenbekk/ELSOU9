import React, { Component, useEffect, useState } from "react";
import axios from "../../../helpers/axios";
import "./addproduct.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import ListItemText from "@mui/material/ListItemText";
// import Select from "@mui/material/Select";
import Rating from "@mui/material/Rating";
import { AiFillDelete } from "react-icons/ai";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate, useParams } from "react-router-dom";
import cloudinary from "cloudinary/lib/cloudinary";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const names = ["XS", "S", "M", "L", "XL", "XXL"];
function AddProduct(props) {
  props.funcNav(true);

  const ITEM_HEIGHT = 50;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 100,
      },
    },
  };
  const theme = useTheme();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState();
  const [weight, setWeight] = useState();
  const [stock, setStock] = useState();
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState();
  const [preview, setPreview] = useState([]);
  const [files, setFiles] = useState([]);
  const [visible, setVisible] = React.useState(true);
  const [tailles, setTailles] = React.useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedParent, setSelectedParent] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);
  const [colors, setColors] = useState([]);
  const [color, setColor] = useState("");
  const [colorList, setColorList] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [details, setDetails] = useState([]);
  const [product, setProduct] = useState(null);
  const [oldPics, setOldPics] = useState([]);
  const [oldParent, setOldParent] = useState(null);
  const [oldChild, setOldChild] = useState(null);
  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);
  const sizeList = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const listTest = ["Rouge", "Vert"];

  let var1;
  let var2;
  let var3;
  let var4;

  const params = useParams();
  const navigate = useNavigate();

  const reset = () => {
    setName("");
    setDesc("");
    setPrice("");
    setStock("");
    setCategoryId("");
    setPreview([]);
    setFiles([]);
    setVisible(true);
    setTailles([]);
    setWeight();
  };

  const getCategories = async () => {
    const res = await axios.get("category/get_categories");
    setCategories(res.data.categories);

    if (params.id != "add") {
      const ress = await axios.post(`product/get_product_details/${params.id}`);
      console.log(ress.data.product);
      setProduct(ress.data.product);
      const product = ress.data.product;
      setName(product.name);
      setDesc(product.description);
      setPrice(product.price);
      setWeight(product.weight);
      setVisible(product.visible);
      setRating(product.topProduit);
      setStock(product.stock);
      setOldChild(product.categoryId);
      if (product.categoryId.parentId) {
        const res = await axios.post("category/get_category_by_id", {
          parentId: product.categoryId.parentId,
        });
        setOldParent(res.data.parentCategory);
      } else {
        setOldParent(product.categoryId);
      }
      let arr = [];
      let arrr = [];
      await product.productPictures.forEach((elem) => {
        arr.push(elem.img);
        arrr.push(elem);
      });
      setPreview(arr);
      setOldPics(arrr);
      //Details
      if (ress.data.product.details.length > 0) {
        if (ress.data.product.details[0].color) {
          // check if there is colors in this product

          const arrUniqueValues = [
            ...new Map(
              ress.data.product.details.map((item) => [item["color"], item])
            ).values(),
          ];

          const arr = [...colors];

          arrUniqueValues.forEach((item) => {
            arr.push(item.color);
          });
          setColors(arr);
        } else {
          setNotChecked(false);
        }
        if (!ress.data.product.details[0].size) setNotSizeChecked(false);
        setDetails(ress.data.product.details);
      } else {
        setNotChecked(false);
        setNotSizeChecked(false);
      }
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleChange = (event) => {
    setVisible(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !desc || !stock || !price || !weight) {
      setSuccess(false);
      setError("Fill all the field");
      return;
    }

    var detailsToRemove = details.filter(
      (elem) =>
        !elem ||
        !elem.stock ||
        elem.stock == NaN ||
        elem.stock == "" ||
        elem.stock == 0
    );
    detailsToRemove.forEach((x) =>
      details.splice(
        details.findIndex((n) => n === x),
        1
      )
    );

    try {
      let imageUrl = "";
      let productPictures = [...oldPics];
      if (files) {
        for (const image of files) {
          const formData = new FormData();
          formData.append("file", image);
          formData.append(
            "upload_preset",
            `${process.env.REACT_APP_PRESET_NAME}`
          );
          formData.append("cloud_name", `${process.env.REACT_APP_CLOUD_NAME}`);
          formData.append("folder", "products");
          const dataRes = await axios.post(
            `${process.env.REACT_APP_CLOUDINARY_BASE_URL}`,
            formData
          );
          imageUrl = dataRes.data.url;
          console.log(imageUrl);
          if (imageUrl) {
            productPictures.push({
              img: imageUrl,
              public_id: dataRes.data.public_id,
            });
          }
        }

        let finalcategory;

        if (oldChild) finalcategory = oldChild._id;
        else finalcategory = categoryId;

        if (productPictures.length > 0) {
          const submitPorodcut = {
            name: name,
            description: desc,
            price: parseFloat(price),
            categoryId: finalcategory,
            stock: stock,
            productPictures: productPictures,
            visible: visible,
            weight: parseFloat(weight),
            details: details,
            topProduit: parseInt(rating, 10),
          };

          //onsole.log(selectedCommunity);
          if (!product) await axios.post("product/add_product", submitPorodcut);
          else
            await axios.post("product/update_product", {
              submitPorodcut: submitPorodcut,
              productId: product._id,
            });

          setError(null);
          setOpen(true);
          setSuccess(true);
          if (product) navigate("/admin/produits");
          reset();
        } else {
          setSuccess(false);
          setError("Please...upload a picture");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const myfunction = (test) => {
    setFiles(test);
  };

  const arrayofFiles = [...files];
  const onSelectFile = (e) => {
    // let array=[];

    console.log("1");
    for (var i = 0; i < e.target.files.length; i++) {
      arrayofFiles.push(e.target.files[i]);
      console.log("1.1");
    }
    console.log("2");
    let images = [];
    arrayofFiles.map((e) => {
      const ImageUrl = URL.createObjectURL(e);
      images.push(ImageUrl);
      console.log("2.2");
    });

    console.log("3");

    let arr = [...preview];
    if (arr.length == 0 || add == true) {
      setAdd(true);

      setPreview(images);
    } else if (arr.length != 0 && add == false) {
      setEdit(true);
      // if (arr.length == 1 || arr.length == 2)
      arr.push(images[images.length - 1]);
      // else
      //   for (var i = arr.length; i < images.length; i++) {
      //     arr.push(images[i]);
      //   }

      const test = arr.concat(images);
      setPreview(arr);
    }

    myfunction(arrayofFiles);
  };
  const removeImageFromArray = async (e) => {
    e.preventDefault();
    const index = e.target.id;
    let newPreview = [...preview];
    if (product) {
      // we are in update page
      const elemToDelete = product.productPictures.find(
        (elem) => elem.img == newPreview[index]
      );
      if (elemToDelete) {
        await deleteImage(elemToDelete.public_id);
        const arr = [...oldPics];
        arr.splice(index, 1);
        setOldPics(arr);
      } else arrayofFiles.splice(index - preview.length, 1);
    } else arrayofFiles.splice(index, 1);
    newPreview.splice(index, 1);
    setPreview(newPreview);
    myfunction(arrayofFiles);
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
  const handleChangeTailles = (event) => {
    const {
      target: { value },
    } = event;
    setTailles(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  function getStyles(name, tailles, theme) {
    return {
      fontWeight:
        tailles.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const handleSelectedCategory = (e) => {
    setOldParent(null);
    setOldChild(null);
    setCategoryId(JSON.parse(e.target.value)._id);
    setSelectedParent(JSON.parse(e.target.value));
  };

  console.log("categoryId", categoryId);
  console.log("selectedParent", selectedParent);

  const handleSelectedCatFromChild = (e) => {
    setOldParent(null);
    setOldChild(null);
    if (e.target.value != "Aucune") setCategoryId(e.target.value);
    else setCategoryId(selectedParent._id);
  };

  const [notChecked, setNotChecked] = useState(true);
  const [notSizeChecked, setNotSizeChecked] = useState(true);

  const handleColorStatus = (event) => {
    setNotChecked((current) => !current);
    setDetails([]);
  };
  const handleSizeStatus = (event) => {
    setNotSizeChecked((current) => !current);
    setDetails([]);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  useEffect(() => {
    if (error != null) setOpen(true);
  }, [error]);

  const addColor = (e) => {
    e.preventDefault();

    const arr = [...colors];

    const exist = arr.find((elem) => elem == color);

    if (color && !exist) {
      arr.push(color);
      setColors(arr);
      setColor("");
      setDetails([]);
    }
    setColor("");
  };

  const deleteColor = (e, index) => {
    const arr = [...colors];
    arr.splice(index, 1);
    setColors(arr);
    setDetails([]);
  };

  const colorChange = (e, index) => {
    const arr = [...colorList];
    arr[index] = e.target.value;
    setColorList(arr);
  };
  const stockChange = (e, index) => {
    const arr = [...colorList];
    arr[index] = e.target.value;
    setStockList(arr);
  };

  const handleAttribute = (size, color, stock, index) => {
    const arr = [...details];

    const stockInt = parseInt(stock);

    if (size && color) {
      const i = arr.findIndex(
        (elem) => elem.size == size && elem.color == color
      );
      if (arr[i]) {
        arr[i] = { size, color, stock: parseInt(stockInt) };
      } else {
        arr.push({ size, color, stock: parseInt(stockInt) });
      }
    } else if (size) {
      const i = arr.findIndex((elem) => elem.size == size);
      if (arr[i]) {
        arr[i] = { size, stock: parseInt(stockInt) };
      } else {
        arr.push({ size, stock: parseInt(stockInt) });
      }
    } else {
      const i = arr.findIndex((elem) => elem.color == color);
      if (arr[i]) {
        arr[i] = { color, stock: parseInt(stockInt) };
      } else {
        arr.push({ color, stock: parseInt(stockInt) });
      }
    }

    if (arr.length > 0) {
      let stck = 0;
      arr.forEach((elem) => {
        if (elem) {
          if (elem.stock) stck = stck + parseInt(elem.stock);
        }
      });
      setStock(stck);
    }

    setDetails(arr);
  };

  console.log(stock);
  console.log(price);
  console.log(weight);

  console.log("details", details);

  console.log("colorList", colorList);
  console.log("stockList", stockList);
  console.log("isChecked", notChecked);
  console.log("files", files);
  console.log("previews", preview);
  return (
    <div className="add-product-container">
      {/* <div className={success ? "show" : "hidden"}>
        <p>Produit est ajouté avec succès</p>
      </div> */}
      {/* <div className={error ? "show" : "hidden"}>
        <p>{error}</p>
      </div> */}
      <form onSubmit={handleSubmit}>
        <div className="top-stuff">
          <div className="card1">
            <div className="nom-prod">
              <label for="name">Nom du produit *</label>
              <input
                type="text"
                id="name"
                placeholder=""
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="second">
              <div>
                <label for="price">Prix *</label>
                <input
                  type="number"
                  id="price"
                  placeholder=""
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label for="price">Poids *</label>
                <input
                  type="number"
                  id="weight"
                  placeholder=""
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>
            <div className="second">
              <div>
                <span>Category</span>
                <select onChange={handleSelectedCategory}>
                  <option selected disabled>
                    Choisir
                  </option>
                  {oldParent ? (
                    <option selected>{oldParent.name}</option>
                  ) : null}
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
              <div>
                <span>Sous Category</span>
                <select onChange={handleSelectedCatFromChild}>
                  <option selected disabled>
                    Choisir
                  </option>
                  {oldChild ? <option selected>{oldChild.name}</option> : null}
                  {selectedParent ? <option>Aucune</option> : null}
                  {selectedParent
                    ? selectedParent.children.map((subCat) => {
                        return (
                          <option key={subCat._id} value={subCat._id}>
                            {subCat.name}
                          </option>
                        );
                      })
                    : null}
                </select>
              </div>
            </div>
            <div className="description">
              <label for="desc">Description *</label>
              <textarea
                name="desc"
                id="desc"
                placeholder=""
                required
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="card2">
            <div className="stock">
              <label for="stock">Stock *</label>
              <input
                type="number"
                id="stock"
                placeholder=""
                required
                disabled={stock && stock != 0 ? true : false}
                value={stock}
                onChange={(e) => {
                  if (details.length > 0) {
                    let stck = 0;
                    details.forEach((detail) => {
                      stck = stck + parseInt(detail.stock);
                    });
                    setStock(stck);
                  } else setStock(e.target.value);
                }}
              />
            </div>
            <div>
              <FormLabel id="demo-controlled-radio-buttons-group">
                Statut
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={visible}
                onChange={handleChange}
              >
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="désactivé"
                />
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="activé"
                />
              </RadioGroup>
            </div>
            <div className="top-product-rating">
              <label>Top produit</label>
              <Rating
                size="large"
                name="simple-controlled"
                max={1}
                value={rating}
                onChange={(event, newRating) => {
                  setRating(newRating);
                }}
              />
            </div>
            {/* <FormControl sx={{ m: 1, height: 50 }}>
              <label>Tailles</label>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={tailles}
                onChange={handleChangeTailles}
                input={<OutlinedInput label="Tailles" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, tailles, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
          </div>
        </div>

        {/* <label for="catgoryId">Category ID *</label>
        <input
          type="text"
          id="categoryId"
          placeholder=""
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        /> */}
        <div className="images-upload">
          <div>
            <label for="img-upload">Importer </label>
            <input
              id="img-upload"
              type="file"
              //value={image}
              accept="image/*"
              // onChange={(e) => setImages(e.target.files)}
              onChange={onSelectFile}
              hidden
            />
          </div>

          <div className="images-grid">
            {preview.map((img, index) => {
              return (
                <div key={index} className="grid-item">
                  <img src={img} id={index} height="150" width="150" />
                  <button
                    id={index}
                    onClick={(e) => {
                      removeImageFromArray(e);
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="color-taille">
          <table cellspacing="0">
            <thead>
              <tr>
                <th>
                  <label htmlFor="subscribe">
                    <input
                      type="checkbox"
                      value={notSizeChecked}
                      onChange={handleSizeStatus}
                      id="subscribe"
                      name="subscribe"
                    />
                    Taille
                  </label>
                </th>
                <th>
                  <label htmlFor="subscribe2">
                    <input
                      type="checkbox"
                      value={notChecked}
                      onChange={handleColorStatus}
                      id="subscribe2"
                      name="subscribe2"
                    />
                    Couleur
                  </label>
                </th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {notChecked && notSizeChecked
                ? colors.length > 0
                  ? sizeList.map((size, i) => {
                      return colors.map((color, j) => {
                        var1 = details.find(
                          (elem) =>
                            elem && elem.size == size && elem.color == color
                        );
                        return (
                          <tr>
                            <td>
                              <span>{size}</span>
                            </td>
                            <td>
                              <span>{color}</span>
                            </td>
                            <td>
                              <input
                                type="number"
                                defaultValue={var1 ? var1.stock : 0}
                                onChange={(e) =>
                                  handleAttribute(
                                    size,
                                    color,
                                    e.target.value,
                                    colors.length * i + j
                                  )
                                }
                              />
                            </td>
                          </tr>
                        );
                      });
                    })
                  : sizeList.map((size, i) => {
                      var2 = details.find((elem) => elem && elem.size == size);
                      return (
                        <tr>
                          <td>
                            <span>{size}</span>
                          </td>
                          <td></td>
                          <td>
                            <input
                              type="number"
                              defaultValue={0}
                              value={var2 ? var2.stock : 0}
                              onChange={(e) =>
                                handleAttribute(size, null, e.target.value, i)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })
                : notChecked
                ? colors.map((color, i) => {
                    var3 = details.find((elem) => elem && elem.color == color);
                    return (
                      <tr>
                        <td></td>
                        <td>
                          <span>{color}</span>
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue={0}
                            value={var3 ? var3.stock : 0}
                            onChange={(e) =>
                              handleAttribute(null, color, e.target.value, i)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })
                : sizeList.map((size, i) => {
                    var4 = details.find((elem) => elem && elem.size == size);
                    return (
                      <tr>
                        <td>
                          <span>{size}</span>
                        </td>
                        <td></td>
                        <td>
                          <input
                            type="number"
                            defaultValue={0}
                            value={var4 ? var4.stock : 0}
                            onChange={(e) =>
                              handleAttribute(size, null, e.target.value, i)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}

              {/*  
              <tr>
                <td>
                  <span>S</span>
                </td>
                <td>
                  <div>
                    <select disabled={notChecked ? "true" : null} onChange={(e) => colorChange(e, 1)}>
                      <option disabled selected>Choisir</option>
                      {colors.map((item) => {
                        return <option value={item}>{item}</option>
                      })}
                    </select>
                  </div>
                </td>
                <td>
                  <input type="number" defaultValue={0} onChange={(e) => stockChange(e, 1)}/>
                </td>
              </tr>
              <tr>
                <td>
                  <span>M</span>
                </td>
                <td>
                  <div>
                    <select disabled={notChecked ? "true" : null} onChange={(e) => colorChange(e, 2)}>
                      <option disabled selected>Choisir</option>
                      {colors.map((item) => {
                        return <option value={item}>{item}</option>
                      })}
                    </select>
                  </div>
                </td>
                <td>
                  <input type="number" defaultValue={0} onChange={(e) => stockChange(e, 2)}/>
                </td>
              </tr>
              <tr>
                <td>
                  <span>L</span>
                </td>
                <td>
                  <div>
                    <select disabled={notChecked ? "true" : null} onChange={(e) => colorChange(e, 3)}>
                      <option disabled selected>Choisir</option>
                      {colors.map((item) => {
                        return <option value={item}>{item}</option>
                      })}
                    </select>
                  </div>
                </td>
                <td>
                  <input type="number" defaultValue={0} onChange={(e) => stockChange(e, 3)}/>
                </td>
              </tr>
              <tr>
                <td>
                  <span>XL</span>
                </td>
                <td>
                  <div>
                    <select disabled={notChecked ? "true" : null} onChange={(e) => colorChange(e, 4)}>
                      <option disabled selected>Choisir</option>
                      {colors.map((item) => {
                        return <option value={item}>{item}</option>
                      })}
                    </select>
                  </div>
                </td>
                <td>
                  <input type="number" defaultValue={0} onChange={(e) => stockChange(e, 4)}/>
                </td>
              </tr>
              <tr>
                <td>
                  <span>XXL</span>
                </td>
                <td>
                  <div>
                    <select disabled={notChecked ? "true" : null} onChange={(e) => colorChange(e, 5)}>
                      <option disabled selected>Choisir</option>
                      {colors.map((item) => {
                        return <option value={item}>{item}</option>
                      })}
                    </select>
                  </div>
                </td>
                <td>
                  <input type="number" defaultValue={0} onChange={(e) => stockChange(e, 5)}/>
                </td>
              </tr>
              <tr>
                <td>
                  <span>XXXL</span>
                </td>
                <td>
                  <div>
                    <select disabled={notChecked ? "true" : null} onChange={(e) => colorChange(e, 6)}>
                      <option disabled selected>Choisir</option>
                      {colors.map((item) => {
                        return <option value={item}>{item}</option>
                      })}
                    </select>
                  </div>
                </td>
                <td>
                  <input type="number" defaultValue={0} onChange={(e) => stockChange(e, 6)}/>
                </td>
              </tr> */}
            </tbody>
          </table>
          <div className="add-color">
            <div>
              <input
                placeholder="Couleur"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <button onClick={(e) => addColor(e)}> Ajouter couleur</button>
            </div>

            {colors.map((item, index) => {
              return (
                <div>
                  <span>{item}</span>
                  <span>
                    <AiFillDelete onClick={() => deleteColor(index)} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button className="submit-product" type="submit">
          Sumbit
        </button>
      </form>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          sx={{ width: "100%" }}
          severity={error != null ? "error" : "success"}
        >
          {error != null && <span>{error}</span>}
          {success == true && <span>Produit ajouté</span>}
        </Alert>
      </Snackbar>
    </div>
  );
}
export default AddProduct;
