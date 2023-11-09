import React, { Component, useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from '../../../helpers/axios'

function Commandes(props) {

  props.funcNav(true);

  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setpostsPerPage] = useState(5);
  const [pageNumbers, setPageNumbers] = useState(1)
  let [Data, setData] = useState([]);

  // const indexOfLastPost = currentPage * postsPerPage;
  // const indexOfFirstPost = indexOfLastPost - postsPerPage;
  
  const getOrders = async () => {
    
    const res = await axios.get('order/get_orders')
    
    if (res.status == 200) {
      setOrders(res.data.orders)

      if (res.data.orders.length < postsPerPage) setData(res.data.orders)
      else {
        setPageNumbers(Math.ceil((res.data.orders.length / postsPerPage)))
        setData(res.data.orders.slice(0, postsPerPage))
      }
    }
    
  }

  useEffect(() => {

    getOrders()

  }, [])

 


  const handleChange = (event, value) => {
    setCurrentPage(value)
    setData(orders.slice((value - 1) * postsPerPage, (value * postsPerPage)))
  };
  const handleInpuChange = (event) => {
    let currPage = currentPage
    if (event.target.value != 0) {
      if (event.target.value > Data.length) {
        currPage = currPage - 1
        setCurrentPage(currentPage - 1)
      }
      setpostsPerPage(event.target.value);
      setPageNumbers(Math.ceil((orders.length / event.target.value)))
      setData(orders.slice((currPage - 1) * event.target.value, (currPage * event.target.value)))

    }
  };
  return (
    <div className="products-container">
      <h1>Commandes</h1>
      <table>
        <thead>
          <tr>
            <th>
              <div>
                <span>ID Commande</span>
                <input
                  type="text"
                  placeholder="Chercher"
                  //   onChange={(event) => handleSearch(event)}
                />
              </div>
            </th>
            <th>
              <div>
                <span>Date</span>
                <div className="inputs">
                  <input type="number" placeholder="Min" />
                  <input type="number" placeholder="Max" />
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
                  <option>Commandé</option>
                  <option>Expédié</option>
                </select>
              </div>
            </th>
            <th>
              <div>
                <span>Total</span>
                <div className="inputs">
                  <input type="number" placeholder="Min" />
                  <input type="number" placeholder="Max" />
                </div>
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
                    <span
                      className="titre id"
                      onClick={() => navigate(`/admin/commande/${item._id}`)}
                    >
                      {orders.length - orders.indexOf(item)}
                    </span>
                  </div>
                </td>
                <td>
                  <div>
                    <span>{(item.orderStatus.date).substring(0, 10)}</span>
                  </div>
                </td>
                <td>
                  <div>
                    <span>{item.orderStatus.type}</span>
                  </div>
                </td>
                <td>
                  <div>
                    <span>{item.totalAmount} €</span>
                  </div>
                </td>
                {/*  
                <td>
                  <div className="delete-icon">
                    <AiFillDelete />
                  </div>
                </td> */}
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
            count={pageNumbers}
            variant="outlined"
            shape="rounded"
            siblingCount={0}
            page={currentPage}
            onChange={handleChange}
          />
          <span>{orders.length} Commande</span>
        </div>
      </div>
    </div>
  );
}
export default Commandes;
