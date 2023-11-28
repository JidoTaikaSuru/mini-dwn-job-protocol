import { Web5 } from "@web5/api";
import DateSort from "dwn"
import protocolDefinition from "./assets/protocol.json";

export async function addJob (web5 : Web5, DID: string, title: string, description: string){
  
    const jobData = {
        "@type": "job",
        "title": title,
        "description": description,
        "author": DID,
    }
    
 const response = await web5.dwn.records.create({
        data: jobData,
        message: {
            protocol: protocolDefinition.protocol,
            protocolPath: "job",
            schema: protocolDefinition.types.job.schema,
            dataFormat: protocolDefinition.types.job.dataFormats[0]
        }
    });

    console.log(response.status);
    
}


export async function getJobs (web5 : Web5) {

    const {records} = await web5.dwn.records.query({
          message: {
              filter: {
                  schema: protocolDefinition.types.job.schema
              },
              dateSort: DateSort.createdAscending
          }
      });

      let rList = [];
//@ts-ignore
      for (let record of records) {
        const data = await record.data.json();
        //@ts-ignore
        rList.push( data);
      }

     return rList;
  } 