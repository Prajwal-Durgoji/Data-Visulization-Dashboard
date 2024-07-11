const initialState={
    loggedIn:false,
    title:"Home",
    token:""
}

const reducer=(state=initialState,action)=>{
    if(action.type==="GET_LOGIN_STATE"){
        return{
            ...state
        }
    }
    if(action.type==="SET_LOGIN_STATE"){
        //console.log(action.login,action.token);
        return{
            ...state,
            loggedIn:action.login,
            token:action.token
        }
       
    }
    if(action.type==="SET_TITLE"){
        //console.log(action.login,action.token);
        return{
            ...state,
            title:action.title
        }
       
    }
    return({...state})
}

export default reducer;