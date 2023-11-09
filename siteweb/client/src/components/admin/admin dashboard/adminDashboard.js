import React, { Component, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../helpers/axios";
import "./admindashboard.css";
import { HiOutlineUserGroup, HiOutlineInboxStack } from "react-icons/hi2";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import Pagination from "@mui/material/Pagination";
import Switch from "@mui/material/Switch";
import credit from "../../../assets/credit-card.png";
import paypal from "../../../assets/paypal-icon.png";
import { getInputAdornmentUtilityClass } from "@mui/material";
function AdminDashboard(props) {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [revenue, setRevenue] = useState(0)
  const [ordersNb, setOrdersNb] = useState(0)
  const [productsNb, setProductsNb] = useState(0)
  const [paypalNb, setPaylaNb] = useState(0)
  const [paypalRevenue, setPaypalRevenue] = useState(0)
  const [cardNb, setCardNb] = useState(0)
  const [cardRevenue, setcardRevenue] = useState(0)
  const [usersNb, setUsersNb] = useState(0)
  const [products, setProducts] = useState([])

  //In case user auth with google he will be redirected here , so just here where we can set the token
  const getUser = async () => {
    try {
      const res = await axios.get("auth/google/login/success", {
        withCredentials: true,
      });

      localStorage.setItem("token", res.data.user._json.token);

      if (res.data.user._json.role == "user") navigate("/home");
      else {
        setIsLoading(false);
        props.funcNav(true);
      }
    } catch (err) {
      navigate("/");
    }
  };

  const getStatistics = async () => {

    const res = await axios.get('dashboard/dashboard_statistics')

    setRevenue(res.data.revenue[0].total_count)
    setOrdersNb(res.data.ordersNb)
    setUsersNb(res.data.usersNb)
    setPaylaNb(res.data.paypalNb)
    setPaypalRevenue(res.data.paypalRevenue)
    setCardNb(res.data.cardNb)
    setcardRevenue(res.data.cardRevenue)
    setProductsNb(res.data.productsNb)
    setProducts(res.data.products)

  }

  useEffect(() => {
    getUser();
    getStatistics()
  }, []);

  const handleVisible = async (visible, index, productId) => {
    const arr = [...products];
    arr[index].visible = visible;
    setProducts(arr);

    await axios.post('/product/update_product_visible', {
      productId,
      visible,
    });
  };

  const getParent = async (parentId, categoryName) => {

    if (parentId) {
      const res = await axios.post('category/get_category_by_id', {parentId})

      return res.data.parentCategory.name

    } else return categoryName

  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.open(`http://localhost:4000/auth/google/logout`, "_self");
  };
  if (isLoading) return <h1>Loading ...</h1>;
  else
    return (
      <div className="admin-dashboard">
        <div className="top-cards">
          <div id="total-commandes">
            <div>
              <div className="card-title">Total commandes</div>
              <div className="number">{ordersNb}</div>
            </div>
            <i>
              <HiOutlineInboxStack />
            </i>
          </div>
          <div id="total-users">
            <div>
              <div className="card-title">Total utilisateur</div>
              <div className="number">{usersNb}</div>
            </div>
            <i>
              <HiOutlineUserGroup />
            </i>
          </div>
          <div id="total-products">
            <div>
              <div className="card-title">Total produits</div>
              <div className="number">{productsNb}</div>
            </div>
            <i>
              <AiOutlineShoppingCart />
            </i>
          </div>
          <div id="total-revenue">
            <div>
              <div className="card-title">Total revenus</div>
              <div className="number">{revenue.toFixed(2)} €</div>
            </div>
            <i>
              <RiMoneyEuroCircleLine />
            </i>
          </div>
        </div>
        <h3>Produits en rupture de stock</h3>
        <div className="bottom-stuff">
          <div className="products-out-stock">
            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Category</th>
                  {/*<th>Sous Category</th>*/}
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ?
                  products.map((product, index) => {
                    return (
                      <tr>
                        <td>{product.name}</td>
                        {/*<td>{() => getParent(product.categoryId.parentId, product.categoryId.name)}</td>*/}
                        <td>{product.categoryId.name}</td>
                        <td>
                          <div>
                          <Switch 
                          size="small"
                          checked={product.visible}
                          onChange={(e) => handleVisible(e.target.checked, index, product._id)}
                          />
                          </div>
                        </td>
                      </tr>
                    )
                  })
                 : <div>
                    <br></br>
                    <p> aucun produit est en rupture de stock...</p>
                  </div>}
              </tbody>
            </table>
            <div className="pagination">
              <div></div>
              <div>
                <Pagination
                  // count={pageNumbers.length}
                  variant="outlined"
                  shape="rounded"
                  siblingCount={0}
                  // page={currentPage}
                  // onChange={handleChange}
                />
                <span> produits</span>
              </div>
            </div>
          </div>
          <div className="paypal-credit-card">
            <div>
              <img src={paypal} />
              <div>
                <div className="card-title">Revenue ({paypalNb})</div>
                <div className="number">{paypalRevenue.toFixed(2)} €</div>
              </div>
            </div>
            <div>
              <img src={credit} />
              <div>
                <div className="card-title">Revenue ({cardNb})</div>
                <div className="number">{cardRevenue.toFixed(2)} €</div>
              </div>
            </div>
          </div>
        </div>

        {/* <button onClick={handleLogout}>LOGOUT</button> */}
      </div>
    );
}
export default AdminDashboard;
