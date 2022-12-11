import { React, Component } from 'react';
import { VideoCard } from './VideoCard';
import './List_videos.css';
const { CosmosClient } = require("@azure/cosmos");
const endpoint = "https://nystreamnosql.documents.azure.com:443/";
const key = "ZfMKS0fXXi6EOimNqoj7YQVn9eYSjnC3qj57rM4Gdz35odlqatOTucSHjBujotBUoCPdCntkZn3jACDbzFtpgw==";
const client = new CosmosClient({ endpoint, key });
//var videos = [];
export class List_videos extends Component {
   

    constructor(props) {
        super(props);
        this.state = { data: [] };
         
    }
    componentDidMount() {
    }

    async load() {

        const { database } = await client.databases.createIfNotExists({ id: "Videosdb" });
        const { container } = await database.containers.createIfNotExists({ id: "Videos" });
        // Query by SQL 
        // find all items
        const querySpec = {
            query: "select * from videos",
            
        };

        // Get items 
        const { resources } = await container.items.query(querySpec).fetchAll();
        const temp = [];
        for (const item of resources) {
            if(item.processed){
            temp.push({
                id: item.id,
                name: item.name
            });
        }
        }
        this.setState({ data: temp });

        //for (const item of this.state.data) {
        //    console.log(item);
        //}


    }




    render() {
        this.load();

        return (

            <ul>
                {this.state.data.map(el =>  (
                    <li key={el.id}>
                        <VideoCard  name={el.name} id={el.id} src={el.streaming_url}> </VideoCard> 
                    </li>
                ))}
            </ul>
        );
    }
}
