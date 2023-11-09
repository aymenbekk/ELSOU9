import SwiperImages from "./swiperImages";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import userTest from "../../../assets/user.png";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import "./product.css";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { BsFacebook } from "react-icons/bs";
import { BsPinterest } from "react-icons/bs";
import { AiFillTwitterCircle } from "react-icons/ai";
import { BsWhatsapp } from "react-icons/bs";
import axios from "../../../helpers/axios";
import useFindUser from "../../../hooks/useFindUser";
import CircularProgress from "@mui/material/CircularProgress";
import { CartContext } from "../../../hooks/CartContext";
function Product(props) {
  props.funcNav(true);

  const { user, isLoading } = useFindUser();

  const { cartContext, setCartContext } = useContext(CartContext);

  const [value, setValue] = React.useState("1");
  const [quantity, setquantity] = useState(1);
  const [product, setProduct] = useState();
  const [reviews, setReviews] = useState([]);
  const [parentCat, setParentCat] = useState(null);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);

  const [stars, setStars] = useState(2);
  const [comment, setComment] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [sizeMessage, setSizeMessage] = useState("");

  const [colors, setColors] = useState([]);
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const params = useParams();

  useEffect(() => {
    getProductDetails();
  }, [params.id]);

  const getProductDetails = async () => {
    const res = await axios.post(`product/get_product_details/${params.id}`);
    setProduct(res.data.product);
    setReviews(res.data.product.reviews);
    if (res.data.product.categoryId.parentId) {
      // has a parent

      const ress = await axios.post("category/get_category_by_id", {
        parentId: res.data.product.categoryId.parentId,
      });
      if (ress.status == 200) setParentCat(ress.data.parentCategory);
    }
    if (res.data.product.details.length > 0) {
      if (res.data.product.details[0].color) {
        // check if there is colors in this product

        const arrUniqueValues = [
          ...new Map(
            res.data.product.details.map((item) => [item["color"], item])
          ).values(),
        ];

        const arr = [...colors];

        arrUniqueValues.forEach((item) => {
          arr.push(item.color);
        });

        setColors(arr);
      }
    }
  };

  const addReview = async (e) => {
    e.preventDefault();

    if (comment == "") return setError("Veuillez saisir un commentaire");

    try {
      const res = await axios.post("product/add_review", {
        productId: params.id,
        userId: user._id,
        review: comment,
        stars: parseInt(stars, 10),
      });

      if (res.data.success) {
        let rev = [...reviews];
        rev.push({
          userId: {
            firstName: user.firstName,
            lastName: user.lastName,
            picture: user.picture,
          },
          review: comment,
          stars: stars,
        });
        setReviews(rev);
        setComment("");
        setStars(2);
      }
    } catch (err) {
      setError("Error while adding your review");
    }
  };

  const addItemCart = async (e) => {
    if (!user) {
      return;
    }
    e.preventDefault();

    if (product.details.length > 0 && product.details[0].size && !size) {
      setSizeMessage("Veuillez selectioner une taille");
      setSuccess(false);
      return;
    }

    if (product.details.length > 0 && product.details[0].color && !color) {
      setSizeMessage("Veuillez selectioner une couleur");
      setSuccess(false);
      return;
    }

    const res = await axios.post("cart/add_item_cart", {
      userId: user._id,
      productId: params.id,
      quantity: quantity,
      size: size,
      color: color,
    });

    if (res.status == 201) {
      console.log("Out of stock");
      setSizeMessage("Out of stock");
      setSuccess(false);
    }

    if (res.data.success) {
      console.log("Produit est ajouté au panier");
      setSizeMessage("");
      setSuccess(true);

      const ress = await axios.post("cart/get_cart_items", {
        userId: user._id,
      });

      setCartContext(ress.data.cart);
    }
  };

  console.log("cartContext", cartContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const increment = () => {
    setquantity(quantity + 1);
  };
  const decrement = () => {
    if (quantity > 1) setquantity(quantity - 1);
  };

  if (!product || isLoading)
    return (
      <div className="client-route-loading">
        <CircularProgress color="inherit" size={60} thickness={4} />
      </div>
    );
  else
    return (
      <div className="product-contain">
        <nav>
          <NavLink to="/home">ACCUEIL &nbsp;</NavLink>
          <span>/</span>
          {parentCat ? (
            <NavLink to="">&nbsp; {parentCat.name} &nbsp; /</NavLink>
          ) : null}
          <NavLink to=""> &nbsp; {product.categoryId.name} </NavLink>
        </nav>
        <div className="product-information">
          <div className="swipers-container">
            <SwiperImages images={product.productPictures} />
          </div>
          <div className="ketba">
            <h1>{product.name}</h1>
            <hr class="solid4"></hr>
            <h2>{product.price} €</h2>
            <div className="qty-size">
              <div className="qty-input">
                <span className="minus" onClick={decrement}>
                  -
                </span>
                <span className="num">{quantity}</span>
                <span className="plus" onClick={increment}>
                  +
                </span>
              </div>
              <div>
                {product.details.length > 0 && product.details[0].size ? (
                  <select onChange={(e) => setSize(e.target.value)}>
                    <option selected disabled>
                      Taille{" "}
                    </option>
                    {sizes.map((size) => {
                      return (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <select disabled>
                    <option selected disabled>
                      Taille{" "}
                    </option>
                  </select>
                )}
                {product.details.length > 0 && product.details[0].color ? (
                  <select onChange={(e) => setColor(e.target.value)}>
                    <option selected disabled>
                      Couleur{" "}
                    </option>
                    {colors.map((color) => {
                      return (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <select disabled>
                    <option selected disabled>
                      Couleur{" "}
                    </option>
                  </select>
                )}
              </div>
            </div>

            <button onClick={addItemCart}>Ajouter au panier</button>
            <div className={sizeMessage ? "show" : "hidden"}>
              <p>{sizeMessage}</p>
            </div>
            <div className={success ? "show" : "hidden"}>
              <p>Produit est ajouté au pannier</p>
            </div>
            <hr class="solid4"></hr>
            <div className="aditionals">
              <div>
                <span>CATEGORIES : </span>
                {parentCat ? <span>{parentCat.name} ,</span> : null}
                <span> {product.categoryId.name}</span>
              </div>
              <div className="icons">
                <span>SHARE : &nbsp;</span>
                <span>
                  <BsFacebook />
                  &nbsp;
                </span>
                <span>
                  <AiFillTwitterCircle />
                  &nbsp;
                </span>
                <span>
                  <BsWhatsapp />
                  &nbsp;
                </span>
                <span>
                  <BsPinterest />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="description-avis">
          <TabContext value={value}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                width: "100%",
              }}
            >
              <TabList
                onChange={handleChange}
                centered
                TabIndicatorProps={{ style: { background: "#d3ad32" } }}
                c
              >
                <Tab
                  label={
                    <span
                      style={{
                        color: "#0c1013",
                        fontWeight: "bold",
                        fontFamily: "Poppins",
                      }}
                    >
                      DESCRIPTION
                    </span>
                  }
                  value="1"
                />
                <Tab
                  label={
                    <span
                      style={{
                        color: "#0c1013",
                        fontWeight: "bold",
                        fontFamily: "Poppins",
                      }}
                    >
                      AVIS
                    </span>
                  }
                  value="2"
                />
              </TabList>
            </Box>
            <TabPanel value="1">
              <div className="description-product">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
              </div>
            </TabPanel>
            <TabPanel value="2">
              <div className="avis-container">
                <div className="avis">
                  <span className="avis-title">AVIS</span>
                  {reviews.length > 0 ? (
                    reviews.map((review) => {
                      return (
                        <div className="avi">
                          {review.userId.picture ? (
                            <img src={review.userId.picture} />
                          ) : (
                            <img src={userTest} />
                          )}
                          <div>
                            <Rating
                              name="simple-controlled"
                              value={review.stars}
                              readOnly
                            />
                            <span>{review.review}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <h2>No reviews yet ...</h2>
                  )}
                </div>
                <div className="create-avi">
                  <h3>Ajouter un Avis</h3>
                  <h4>Votre note * </h4>
                  <Rating
                    name="simple-controlled"
                    value={stars}
                    onChange={(e) => setStars(e.target.value)}
                  />
                  <h4>Votre avis *</h4>
                  <textarea
                    value={comment}
                    required
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button onClick={addReview}>SOUMETTRE</button>
                  <div className={error ? "show" : "hidden"}>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabContext>
        </div>
      </div>
    );
}
export default Product;
