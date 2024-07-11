import React from 'react';
import Cookies from 'universal-cookie';
import BootstrapTable from 'react-bootstrap-table-next'; 
import paginationFactory from 'react-bootstrap-table2-paginator'; 
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import Loader from 'react-loader-spinner';
import {connect} from 'react-redux';
import './DeviceComponent.css';
class DeviceComponent extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      devices:{
        "createdBy": "",
        "creationDate": "",
        "lastModifiedBy": "",
        "lastModifiedDate": "",
        "id": "",
        "uuid": "",
        "deviceNumber": "",
        "senBox": "",
        "senPcb": "",
        "packBox": "",
        "userId": "",
        "email": "",
        "manufacturedDate": null,
        "barCode": "",
        "enrolledDate": "",
        "isEnrolled": false,
        "imei1": null,
        "imei2": null,
        "deleted": false
      },
      columns: [{  
        
        dataField: 'id',  
        text: 'Device ID',
        sort: true,
        headerStyle: {
          backgroundColor: '#0b0b19',
          color:"#ffffff",
          textAlign:"center"
        }
        /*style: {
          color: '#FFFFFF'
        }*/ 
      },  
      {  
        dataField: 'creationDate',  
        text: 'Manfactured Date',
        sort: true,
        headerStyle: {
          backgroundColor: '#0b0b19',
          color:"#ffffff",
          textAlign:"center"
        },
        formatter: rankFormatter        
        
      },
      {  
        dataField: 'enrolledDate',  
        text: 'Enrolled Date',
        sort: true,
        headerStyle: {
          backgroundColor: '#0b0b19',
          color:"#ffffff",
          textAlign:"center"
        },
        formatter: rankFormatter
      },
      {  
        dataField: 'email',  
        text: 'User Email',
        filter: textFilter(),
        sort: true,
        headerStyle: {
          backgroundColor: '#0b0b19',
          color:"#ffffff",
          textAlign:"center"
        }
      },
      {  
        dataField: 'barCode',  
        text: 'Barcode',
        filter: textFilter(),
        sort: true,
        headerStyle: {
          backgroundColor: '#0b0b19',
          color:"#ffffff",
          textAlign:"center"
        }
      },
      {  
        dataField: 'isEnrolled',  
        text: 'Usage Status',
        sort: true,
        headerStyle: {
          backgroundColor: '#0b0b19',
          color:"#ffffff",
          textAlign:"center"
        } 
      },
      {  
        dataField: 'uuid',  
        text: 'Uuid',  
        sort: true,
        headerStyle: {
          backgroundColor: '#0b0b19',
          color:"#ffffff",
          textAlign:"center"
        }
      }],
      done: false,
      loading:true 
    };
    function rankFormatter(cell) {
      var date = new Date(cell);
      var res=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
      return (
        <h6> { res } </h6>
        );
      }
    }
    
    
    
    
    componentDidMount() {
      // POST request using fetch with error handling
      this.props.setTitle("Devices");
      const cookies = new Cookies();
      const token=cookies.get('token');
      const requestOptions = {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-requested-with':'XMLHttpRequest',
          'authorization':'Bearer '+token
        }
      };
      fetch('https://basavahealing.org/api/device', requestOptions)
      .then(async response => {
        const data = await response.json();
        
        //console.log("asdf"); 
        // check for error response
        if (!response.ok) {
          console.log("not ok");
        }else{
          this.setState({ devices:data.data, done: true,loading:false });
          //console.log("res data :"+data)
        }
        
        
      })
      .catch(error => {
        console.log("error caught");
        console.error('There was an error!', error);
      });
    }
    
    
    showModal = () => {
      //this.selectedUser=data;
      //this.setState({ show: true });
      // console.log( data.id +"\t"+ data.creationDate+"\t"+data.enrolledDate +"\t"+data.email + "\t"+data.barCode + "\t"+data.isEnrolled +"\t"
      //    +data.uuid);
      
    };
    
    
    render() {
      const rowStyle2 = () => {
        const style = {};
        style.color='#000000'
        style.backgroundColor= '#f3f3f3'
        style.whiteSpace='nowrap'
        style.overflow='hidden'
        
        style.textOverflow='ellipsis'
        style.fontSize="12px";
        //style.backgroundColor='#bcbcbc';
        // if (rowIndex % 2 === 0) {
        //   style.backgroundColor= '#0b0b19'
        //   style.color='#ffffff'
        // }else{
        //   style.backgroundColor= '#7f7f7f'
        // }
        
        return style;
      };
      if(this.state.loading){
        return(
          <Loader style = {{ position: "fixed", top: "50%", left: "50%", transform: "translate(-40%, -40%)" }}
          type="Grid"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={7000} //7 secs
          
          />
          );
        }
        if(this.state.done){
          
          return (
            
            <div  className="DeviceComponent" >
            
            <div className="DeviceTable">  
            <BootstrapTable 
            hover
            keyField='id'
            data={ this.state.devices }   
            rowStyle={ rowStyle2}
            columns={ this.state.columns }
            //rowEvents={ rowEvents }
            filter={ filterFactory() }
            pagination={ paginationFactory() } >
            </BootstrapTable> 
            </div>
            
            </div>
            
            );
          }else{
            
            return (
              
              <h1>Hi </h1>
              );
            }
          }
        }
        
        const mapDispatchToProps= dispatch =>{
          return{
            setTitle: (title)=>{dispatch({type:"SET_TITLE",title:title})}
          }
        }
        
        export default connect(null,mapDispatchToProps)(DeviceComponent)  