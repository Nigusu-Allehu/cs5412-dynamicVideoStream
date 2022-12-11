import React, { Component, useState } from 'react';
import Player from './Player';
import { withRouter } from "react-router";import { useParams } from "react-router-dom";
const { CosmosClient } = require("@azure/cosmos");
const endpoint = "https://nystreamnosql.documents.azure.com:443/";
const key = "ZfMKS0fXXi6EOimNqoj7YQVn9eYSjnC3qj57rM4Gdz35odlqatOTucSHjBujotBUoCPdCntkZn3jACDbzFtpgw==";
const client = new CosmosClient({ endpoint, key });



function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
  }

 class Watch extends Component{
    
    constructor(props) {
        super(props);
        this.state = { name: "", src: "", id:""};
        
    }
    componentDidMount() {
        let { id } = this.props.params;
        this.setState({name:this.state.name, id:id, src:this.state.src})
        this.load();
      }

    

            async load() {


                const { database } = await client.databases.createIfNotExists({ id: "Videosdb" });
                const { container } = await database.containers.createIfNotExists({ id: "Videos", partitionKey: "/id"});
                // Query by SQL 
                // find all items
                const querySpec = {
                    query: "select * from videos",

                };

                // Get items
                console.log(this.state.id); 
                const { resource } = await container.item(this.state.id, this.state.id).read();
                console.log(resource.streaming_url);
                console.log("done");
                this.setState({name:resource.name, src:resource.streaming_url, id:this.state.id});


            }

        
       
    render (){
        console.log(this.state.src);
        let contents = (this.state.src=="")
            ? <p><em>Loading...</em></p>
            : <Player
                sourceVideo={{
                    "src": this.state.src,
                    "type": "audio/vnd.ms-sstr+xml"
                }}
            />;
        return(
        <div className="App">
                <header className="App-header">
                    <h1 className="App-title">{this.state.name}</h1>
                </header>
                {contents}
         </div>)


            }
            
           
        
    
}
export default withParams(Watch);