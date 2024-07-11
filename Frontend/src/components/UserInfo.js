import React from 'react'

const User = ( Props) => {
    
    
    const res=JSON.parse(Props.user.user);
    //console.log(res);

    if({Props}){

        return (
            <div>
              <center><h1>Contact List</h1></center>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{Props.user? Props.user.user:"QW"}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{res.firstName?res.firstName:"QW"}</h6>
                    <p className="card-text">{Props.user.user.lastName}</p>
                  </div>
                </div>
              
            </div>
          )
    }else{

        return (
            <div>
              <center><h1>Contact List ...</h1></center>
            </div>
              )
    }


      
    };

export default User