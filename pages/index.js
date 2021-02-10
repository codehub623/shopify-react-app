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
  const [query, SetQuery] = useState(defaultQuery);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [rate, setRate] = useState(0.1);
  useEffect(()=>{
    search_products(query);
  },[]);
  function search_products(query){
    client.query({
      query: gql`
        ${query}
      `,
    }).then(data=>data.data.search_products)
      .then(data => {
        let { item_count, results } = data;
        console.log(item_count, results);
        setProducts(results);
        setTotal(item_count);
      })
      .catch(error => console.error(error));
  }
  function click(id){
    console.log(id)
  }
  function system(e){
    console.log(e)
  }
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <div className="row">
        <div className="col-2 sidebar-padding-left">
          <Form>
            <Form.Group controlId="platform">
              <Form.Label>Platform</Form.Label>
              <Form.Check type="checkbox" label="Steam" />
              <Form.Check type="checkbox" label="Battle.net" />
              <Form.Check type="checkbox" label="NCSoft" />
              <Form.Check type="checkbox" label="Uplay" />
              <Form.Check type="checkbox" label="Kinguin" />
              <Form.Check type="checkbox" label="Other" />
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
            <Form.Group controlId="system" onChange={(e)=>system(e)}>
              <Form.Label>Operating System</Form.Label>
              <Form.Check type="checkbox" label="Windows" />
              <Form.Check type="checkbox" label="Mac" />
              <Form.Check type="checkbox" label="Linux" />
              <Form.Check type="checkbox" label="Android" />
              <Form.Check type="checkbox" label="iOS" />
            </Form.Group>
          </Form>
        </div>
        <div className="col-10" >
          {
            products.map((p,index)=>{
              return (
                    <div className="container_child" key={index} onClick={()=>click(p.productId)}>
                    <div className="child"><Image src={(p.screenshots && p.screenshots.length)?p.screenshots[0].url_original:'https://cdn.mos.cms.futurecdn.net/MMwRCjVEaoJPP4dBBugWFY-320-80.jpg'} rounded width="150px" height="100px" /></div>
                    <div className="child w-40"><h6>{p.name}</h6></div>
                    <div className="child w-10"><p>{p.platform}</p></div>
                    <div className="child w-15"><p>{p.genres.join(", ")}</p></div>
                    <div className="child w-10"><p>{p.updatedAt.slice(0,10)}</p></div>
                    <div className="child w-10"><p>{p.price+p.price*(rate*1000)/1000}</p></div>
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