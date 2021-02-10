import App from 'next/app';
import Head from 'next/head';
import React from 'react';
// import { AppProvider } from '@shopify/polaris';
// import '@shopify/polaris/dist/styles.css';

// class MyApp extends App {
//   render() {
//     const { Component, pageProps } = this.props;
//     return (
//       <React.Fragment>
//         <Head>
//           <title>Sample App</title>
//           <meta charSet="utf-8" />
//         </Head>
//         <AppProvider>
//           <Component {...pageProps} />
//         </AppProvider>
//       </React.Fragment>
//     );
//   }
// }

// export default MyApp;

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css';

// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }

// export default MyApp

import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks';

export const client = new ApolloClient({
  uri: 'https://shrouded-cove-83340.herokuapp.com/graphql'
})

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <React.Fragment>
        <Head>
          <title>Shopify App</title>
          <meta charSet="utf-8" />
        </Head>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </React.Fragment>
    );
  }
}


export default MyApp