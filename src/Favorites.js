import React, { Component } from 'react'
import request from 'superagent'



// const URL = 'https://mood-park-be.herokuapp.com'
const URL = 'http://localhost:7890'

export default class Favorites extends Component {
    state = {
        favorites: []
    }

    componentDidMount = async () => {
        const token = this.props.token
        const response = await request.get(`${URL}/api/favorites`).set('Authorization', token)
        this.setState({ favorites: response.body })
        
    }


    
    render() {
        return (
            <div className='favorites-page'>
                {this.state.favorites.map(favs => 
                <section key={favs.fullname} className='favorite'> 
                <span>{favs.fullname}</span>
                <span>State: {favs.states}</span>
                <a href={favs.url}> {favs.fullname} Website</a>
                <a href={`/park/${favs.parkcode}`}><button >Details</button></a>
                </section>)}
                {/* {this.state.favorites.map(favs => 
                <div key={favs.fullname}> 
                <h1>{favs.fullname}</h1>
                <p> {favs.description}</p>
                <img src={favs.images} alt={favs.fullname} />
                <br />
                <a href={favs.url}> {favs.fullname} Website</a>
                <br />
                State: {favs.states}
                </div>)} */}
            </div>
        
        )
    }
}
