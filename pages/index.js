import React, { useState, useEffect } from 'react';
import gql from "graphql-tag"
import { Nav, Navbar, NavDropdown, Form, FormControl, Button, Container, Table, Image } from 'react-bootstrap'
import { client } from './_app'

const defaultQuery = `
  {
    search_products(str:"sortBy=updatedAt&sortType=desc"){
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
const Home = ({ props }) => {
  const [query, SetQuery] = useState('sortBy=updatedAt&sortType=desc');
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [rate, setRate] = useState(0.1);
  const [search_name, setSearchName] = useState("");
  const [platform, setPlatform] = useState([]);
  useEffect(() => {
    search_products(makeQuery());
  }, []);
  function search_products(query) {
    console.log(query);
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
  function makeQuery() {
    let temp = query
    if (search_name) temp += `&name=${search_name}`;
    if (platform.length) temp += `&platform=${platform.join(',')}`;
    console.log(temp);
    return `
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
    search_products(makeQuery());
  }
  function changePlatform(name, value) {
    console.log(name, value);
    let temp = [...platform];
    console.log('first',temp);
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
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Form inline onSubmit={(e)=>e.preventDefault()}>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" value={search_name} onChange={(e) => { setSearchName(e.target.value); e.preventDefault() }} />
            <Button variant="outline-success" onClick={e => searchName()}>Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <div className="row">
        <div className="col-2 sidebar-padding-left">
          <Form>
            <Form.Group controlId="platform">
              <Form.Label>Platform</Form.Label>
              <Form.Check type="checkbox" label="Steam"  checked={platform.includes("Steam")} onChange={(e) => { changePlatform('Steam', e.target.checked); }} />
              <Form.Check type="checkbox" label="Battle.net" checked={platform.includes("Battle.net")}  onChange={(e) => { changePlatform('Battle.net', e.target.checked);}} />
              <Form.Check type="checkbox" label="NCSoft" checked={platform.includes("NCSoft")} onChange={(e) => { changePlatform('NCSoft', e.target.checked); }} />
              <Form.Check type="checkbox" label="Uplay" checked={platform.includes("Uplay")} onChange={(e) => { changePlatform('Uplay', e.target.checked);}} />
              <Form.Check type="checkbox" label="Kinguin" checked={platform.includes("Kinguin")} onChange={(e) => { changePlatform('Kinguin', e.target.checked); }} />
              <Form.Check type="checkbox" label="Other" checked={platform.includes("Other")} onChange={(e) => { changePlatform('Other', e.target.checked);}} />
            </Form.Group>
            <Form.Group controlId="region">
              <Form.Label>Region</Form.Label>
              <Form.Check type="checkbox" label="Region free" />
              <Form.Check type="checkbox" label="Europe" />
              <Form.Check type="checkbox" label="North America" />
              <Form.Check type="checkbox" label="Other" />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price Range</Form.Label>
            </Form.Group>
            <Form.Group controlId="genres">
              <Form.Label>Genres</Form.Label>
              <Form.Check type="checkbox" label="Action" />
              <Form.Check type="checkbox" label="Adventure" />
              <Form.Check type="checkbox" label="Anime" />
              <Form.Check type="checkbox" label="Casual" />
              <Form.Check type="checkbox" label="Dating" />
              <Form.Check type="checkbox" label="Fighting" />
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
                  <div className="child w-10"><p>{p.price + p.price * (rate * 1000) / 1000}</p></div>
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