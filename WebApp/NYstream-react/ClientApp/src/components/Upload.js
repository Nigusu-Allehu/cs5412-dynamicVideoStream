import React, { Component } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';

import { v4 } from 'uuid';
const { CosmosClient } = require("@azure/cosmos");

const endpoint = "https://nystreamnosql.documents.azure.com:443/";
const key = "ZfMKS0fXXi6EOimNqoj7YQVn9eYSjnC3qj57rM4Gdz35odlqatOTucSHjBujotBUoCPdCntkZn3jACDbzFtpgw==";
const client = new CosmosClient({ endpoint, key });


export class Upload extends Component {

  constructor(props) {
      super(props);
      this.state = { file: null };
      this.onFileChange = this.onFileChange.bind(this);
      this.upload = this.upload.bind(this);
      this.datab_add_video = this.datab_add_video.bind(this);
  }
    async datab_add_video(id) {
        const { database } = await client.databases.createIfNotExists({ id: "Videosdb" });
        const { container } = await database.containers.createIfNotExists({ id: "Videos", partitionKey:"/id"});
        const names = this.state.file.name.split('.');
        const video =
            { id: id, name: names[0], type: names[(names.length) - 1], processed: false, streaming_url: null };
        container.items.create(video);


    }


    async upload() {
        const id = v4().toString().replace("-", "");;
        const names = this.state.file.name.split('.');
        this.datab_add_video(id);
       
        let SAname = "videostreamingv2strg";
        let sasToken = "?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiyx&se=2023-12-03T03:49:42Z&st=2022-12-02T19:49:42Z&sip=0.0.0.0-255.255.255.255&spr=https,http&sig=h%2BHgQwDsxr4Xt%2FqPb%2BVgiBxuHIWsBWQbFEiNXcIovSQ%3D";
        let blobService = new BlobServiceClient('https://' + SAname + '.blob.core.windows.net/' + sasToken);
        const containerClient = blobService.getContainerClient('rawvideos');
        await containerClient.createIfNotExists({ access: 'container', });
        console.log("done creating a container");
        const blobClient = containerClient.getBlockBlobClient(id);
        const options = { blobHTTPHeaders: { blobContentType: names[(names.legnth)-1]} };

        await blobClient.uploadData(this.state.file, options);

    }
    onFileChange(event) {
        this.setState({ file: event.target.files[0] });
    }


   

  render() {
    return (
      <div>
            <p>Click on the "Choose File" button to upload a video:</p>
            <input type="file" id="myFile" name="filename" onChange={this.onFileChange}></input>
            <button type="submit" className="btn btn-upload" onClick={()=>this.upload()}>Upload</button>
      </div>
    );
  }
}
