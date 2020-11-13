import { API } from '../config';

export const back = user => {
    
console.log(user)

    return fetch(`${API}/back`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};

export const user = user => {
    return fetch(`${API}/user`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};


export const getCategory = () =>{
    return fetch(`${API}/back`,{
         method:'GET',
    })
    .then(response =>{
          return response.json();
    }).catch( err => console.log(err))
}

export const remove = (slug) =>{
    
    return fetch(`${API}/remove/${slug}`,{
         method:'DELETE',
         headers:{
               Accept:'application/json',
               'Content-Type':'application/json'
            
         },
        
    })
    .then(response =>{
          return response.json();
    }).catch( err => console.log(err))
}

