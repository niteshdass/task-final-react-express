import React from 'react'
import {BrowserRouter,Route,Switch} from 'react-router-dom'

import Back from './user/Back'
import User from './user/User'
import 'dotenv'
 
const Routes = () => {
      return (
            <BrowserRouter>
                  <Switch>
                        <Route path="/" exact component={Back} />
                        <Route path="/user" exact component={User} />
                       
                  </Switch>
            </BrowserRouter>
      )
}

export default Routes
