import React from 'react'
import { Route } from 'react-router'
import App from './routes/app'
import Home from './routes/login'

export default (
  <Route component={App}>
    <Route path='/' component={Home} />
  </Route>
)
