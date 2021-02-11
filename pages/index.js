import React, { useState, useEffect } from 'react';
import gql from "graphql-tag"
import { Nav, Navbar, NavDropdown, Form, FormControl, Button, Container, Table, Image } from 'react-bootstrap'
import { client } from './_app'

const defaultQuery = "sortBy=updatedAt&sortType=desc";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [rate, setRate] = useState(0.1);
  const [search_name, setSearchName] = useState("");
  const [platform, setPlatform] = useState([]);
  const [genres, setGenres] = useState([]);
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(0);
  useEffect(() => {
    search_products();
  }, []);
  function search_products() {
    let temp = defaultQuery;
    if (search_name) temp += `&name=${search_name}`;
    if (platform.length) temp += `&platform=${platform.join(',')}`;
    if (genres.length) temp += `&genres=${genres.join(',')}`;
    if (priceFrom > 0) temp += `&priceFrom=${priceFrom}`;
    if (priceTo > priceFrom && priceTo > 0) temp += `&priceTo=${priceTo}`;
    let query = `
                {
                  search_products(str:"${temp}"){
                    results{
                      kinguinId
                      productId
                      name
                      screenshots{
                        url
                        url_original
                      }
                      updatedAt
                      platform
                      genres
                      price
                    }
                  item_count
                  }
                }
              `
    client.query({
      query: gql`
        ${query}
      `,
    }).then(data => data.data.search_products)
      .then(data => {
        console.log(data);
        let { item_count, results } = data;
        console.log(item_count, results);
        setProducts(results);
        setTotal(item_count);
      })
      .catch(error => console.error(error));
  }
  function click(id) {
    console.log(id)
  }
  function searchName() {
    console.log(search_name)
    if (search_name.length < 3 && search_name.length > 0) {
      alert("Search value must be at lest 3 letters");
      return;
    }
    search_products();
  }
  function changePlatform(name, value) {
    console.log(name, value);
    let temp = [...platform];
    console.log('first', temp);
    if (value) {
      temp.push(name);
      setPlatform(temp);
    } else {
      const index = temp.indexOf(name);
      if (index > -1) {
        temp.splice(index, 1);
        setPlatform(temp);
      }
    }
  }
  function changeGenres(name, value) {
    console.log(name, value);
    let temp = [...genres];
    console.log('first', temp);
    if (value) {
      temp.push(name);
      setGenres(temp);
    } else {
      const index = temp.indexOf(name);
      if (index > -1) {
        temp.splice(index, 1);
        setGenres(temp);
      }
    }
  }
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Form inline onSubmit={(e) => e.preventDefault()}>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" value={search_name} onChange={(e) => { setSearchName(e.target.value); e.preventDefault() }} />
            <Button variant="outline-success" onClick={e => searchName()}>Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <div className="row">
        <div className="col-2 sidebar-padding-left">
          <div style={{ padding: "10px" }}>
            <button type="button" className="btn btn-success btn-sm btn-block" onClick={()=>search_products()}>Filter</button>
          </div>
          <Form>
            <Form.Group controlId="platform">
              <Form.Label>Platform</Form.Label>
              <Form.Check type="checkbox" label="Steam" checked={platform.includes("Steam")} onChange={(e) => { changePlatform('Steam', e.target.checked); }} />
              <Form.Check type="checkbox" label="Battle.net" checked={platform.includes("Battle.net")} onChange={(e) => { changePlatform('Battle.net', e.target.checked); }} />
              <Form.Check type="checkbox" label="NCSoft" checked={platform.includes("NCSoft")} onChange={(e) => { changePlatform('NCSoft', e.target.checked); }} />
              <Form.Check type="checkbox" label="Uplay" checked={platform.includes("Uplay")} onChange={(e) => { changePlatform('Uplay', e.target.checked); }} />
              <Form.Check type="checkbox" label="Kinguin" checked={platform.includes("Kinguin")} onChange={(e) => { changePlatform('Kinguin', e.target.checked); }} />
              <Form.Check type="checkbox" label="Other" checked={platform.includes("Other")} onChange={(e) => { changePlatform('Other', e.target.checked); }} />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price Range</Form.Label>
              <p>From <input type='number' min={0} value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} /></p>
              <p>To <input type='number' min={0} value={priceTo} onChange={(e) => setPriceTo(e.target.value)} /></p>
            </Form.Group>
            <Form.Group controlId="genres">
              <Form.Label>Genres</Form.Label>
              <Form.Check type="checkbox" label="Action" checked={genres.includes("Action")} onChange={(e) => { changeGenres('Action', e.target.checked); }} />
              <Form.Check type="checkbox" label="Adventure" checked={genres.includes("Adventure")} onChange={(e) => { changeGenres('Adventure', e.target.checked); }} />
              <Form.Check type="checkbox" label="Anime" checked={genres.includes("Anime")} onChange={(e) => { changeGenres('Anime', e.target.checked); }} />
              <Form.Check type="checkbox" label="Casual" checked={genres.includes("Casual")} onChange={(e) => { changeGenres('Casual', e.target.checked); }} />
              <Form.Check type="checkbox" label="Dating" checked={genres.includes("Dating")} onChange={(e) => { changeGenres('Dating', e.target.checked); }} />
              <Form.Check type="checkbox" label="Fighting" checked={genres.includes("Dating")} onChange={(e) => { changeGenres('Dating', e.target.checked); }} />
            </Form.Group>
          </Form>
        </div>
        <div className="col-10" >
          {
            products.map((p, index) => {
              return (
                <div className="container_child" key={index} onClick={() => click(p.productId)}>
                  <div className="child"><Image src={(p.screenshots && p.screenshots.length) ? p.screenshots[0].url_original : 'https://cdn.mos.cms.futurecdn.net/MMwRCjVEaoJPP4dBBugWFY-320-80.jpg'} rounded width="150px" height="100px" /></div>
                  <div className="child w-40"><h6>{p.name}</h6></div>
                  <div className="child w-10"><p>{p.platform}</p></div>
                  <div className="child w-15"><p>{p.genres.join(", ")}</p></div>
                  <div className="child w-10"><p>{p.updatedAt.slice(0, 10)}</p></div>
                  <div className="child w-10"><p>{Math.round((p.price + p.price * rate) * 1000) / 1000}</p></div>
                  <div className="child w-10"><button type="button" className="btn btn-primary">Buy</button></div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Home;